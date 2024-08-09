"use client";
import React, { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/lib/store/user";
import { Imessage, useMessage } from "@/lib/store/messages";
import {
  getFileExtension,
  timestampForFile,
  callAiApi,
  compressImage,
} from "@/lib/utils";
import { ArrowUp, ImageUp } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const user = useUser((state) => state.user);
  const addMessage = useMessage((state) => state.addMessage);
  const addStr2LastMessage = useMessage((state) => state.addStr2LastMessage);
  const getLastContent = useMessage((state) => state.getLastConent);
  const supabase = supabaseBrowser();
  const sendMessage = async (message: string) => {
    const messageTrim = message.trim();
    if (messageTrim !== "") {
      supabase
        .from("messages")
        .insert({ text: messageTrim })
        .then(({ error }) => {
          if (error) {
            console.error("上传文字消息错误" + error.message);
          }
        });
      const newMessage: Imessage = {
        id: uuidv4(),
        text: messageTrim,
        send_id: user?.id!,
        reci_id: "1",
        img_path: null,
        created_at: new Date().toISOString(),
        profiles: {
          id: user?.id!,
          full_name: user?.user_metadata.fullname,
          avatar_url: user?.user_metadata.avatar_url,
          email: null,
        },
      };
      addMessage(newMessage);
      setMessage("");
      const prompt = messageTrim;
      const botId = "4d9e91ca-f832-4bb4-b1fc-feee388d6a4e";
      const botAvatarUrl =
        "https://zsiyhbzzkskdywvuzasy.supabase.co/storage/v1/object/public/public_img/chengge.webp";
      const messageFromApi: Imessage = {
        id: uuidv4(),
        text: "",
        send_id: botId,
        reci_id: user?.id!,
        img_path: null,
        created_at: new Date().toISOString(),
        profiles: {
          id: botId,
          full_name: user?.user_metadata.fullname,
          avatar_url: botAvatarUrl,
          email: null,
        },
      };
      addMessage(messageFromApi);
      const eventSource = new EventSource(
        `/api/text?prompt=${encodeURIComponent(prompt)}`
      );
      const uploadApiMsg2db = async () => {
        const botId = "4d9e91ca-f832-4bb4-b1fc-feee388d6a4e";
        const { error } = await supabase.from("messages").insert({
          text: getLastContent(),
          send_id: botId,
          reci_id: user?.id!,
        });
        if (error) {
          console.log("数据库存储机器人回复失败");
        }
      };
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.done) {
          console.log("Stream ended");
          eventSource.close();
          uploadApiMsg2db();
        } else if (data.error) {
          console.error("Error:", data.error);
          eventSource.close();
          uploadApiMsg2db();
        } else {
          addStr2LastMessage(data.content);
        }
      };

      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource.close();
      };
    } else {
      toast.error("消息不能为空");
    }
  };
  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    let file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const fileExtension = getFileExtension(file);
    if (!fileExtension) {
      toast.error("文件格式错误");
      return;
    }
    const filenameWithTime = timestampForFile() + "." + fileExtension;
    // toast("图片询问可能花费3秒钟以上，请耐心等待");
    if (file) {
      supabase
        .from("messages")
        .insert({ img_path: `${user?.id!}/${filenameWithTime}` })
        .then(({ error }) => {
          if (error) {
            toast.error("上传图片记录错误" + error.message);
          }
        });
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const newMessage: Imessage = {
          id: uuidv4(),
          text: reader.result as string,
          send_id: user?.id!,
          reci_id: "1",
          img_path: filenameWithTime,
          created_at: new Date().toISOString(),
          profiles: {
            id: user?.id!,
            full_name: user?.user_metadata.fullname,
            avatar_url: user?.user_metadata.avatar_url,
            email: null,
          },
        };
        addMessage(newMessage);
      };

      if (file.size > 1 * 1024 * 1024) {
        file = await compressImage(file);
      }
      const upImgPromise = supabase.storage
        .from("images")
        .upload(`${user?.id!}/${filenameWithTime}`, file, {
          cacheControl: "3600",
          upsert: false,
        });

      {
        const { data, error: upImgErr } = await upImgPromise;
        if (upImgErr) {
          toast.error("上传错误:" + upImgErr.message);
        }
        const { data: imgData } = await supabase.storage
          .from("images")
          .createSignedUrl(data!.path, 3600);
        console.log(imgData);
        const messageFromApi = await callAiApi("", imgData!.signedUrl);
        addMessage(messageFromApi!);

        {
          const botId = "4d9e91ca-f832-4bb4-b1fc-feee388d6a4e";
          const { error } = await supabase.from("messages").insert({
            text: messageFromApi!.text,
            send_id: botId,
            reci_id: user?.id!,
          });
          if (error) {
            console.log("数据库存储机器人回复失败");
          }
        }
      }
    } else {
      toast.error("消息不能为空");
    }
  };

  return (
    <div className="flex flex-col items-center mb-5">
      <Slider
        className="my-3 max-w-[800px] mb-5 "
        defaultValue={[33]}
        max={100}
        step={1}
      />
      <div className="flex w-full max-w-[800px] items-center space-x-2 p-3 rounded-xl bg-secondary">
        <form id="uploadForm" className="self-end mb-1">
          <label className="cursor-pointer " htmlFor="fileInput">
            <ImageUp />
          </label>
          <input
            type="file"
            id="fileInput"
            name="file"
            accept="image/*"
            className="hidden"
            onChange={uploadFile}
          />
        </form>
        <TextareaAutosize
          placeholder="发一条信息"
          className="flex-1 max-h-[200px] w-full resize-none bg-transparent focus-within:outline-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (e.shiftKey) {
                setMessage(message + "\n");
              } else {
                sendMessage(message);
              }
            }
          }}
        />
        <Button
          type="submit"
          onClick={() => {
            sendMessage(message);
          }}
          className="self-end"
          size="icon"
        >
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
}
