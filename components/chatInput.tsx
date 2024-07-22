"use client";
import React, { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@/lib/store/user";
import { Imessage, useMessage } from "@/lib/store/messages";
import { getFileExtension, timestampForFile } from "@/lib/utils";
import { callAiApi } from "@/lib/utils";
import { ImageUp } from "lucide-react";

export default function ChatInput() {
  const [message, setMessage] = useState("");
  const user = useUser((state) => state.user);
  const addMessage = useMessage((state) => state.addMessage);
  const supabase = supabaseBrowser();
  const sendMessage = async () => {
    if (message.trim() !== "") {
      const newMessage: Imessage = {
        id: uuidv4(),
        text: message,
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
      const msg_copy = message;
      setMessage("");
      const messageFromApi = await callAiApi(msg_copy, "");
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

      const { error } = await supabase
        .from("messages")
        .insert({ text: msg_copy });
      if (error) {
        toast.error("上传文字消息错误" + error.message);
      }
    } else {
      toast.error("消息不能为空");
    }
  };
  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const fileExtension = getFileExtension(file);
    if (!fileExtension) {
      toast.error("文件格式错误");
      return;
    }
    const filenameWithTime = timestampForFile() + "." + fileExtension;
    console.log(filenameWithTime);
    // toast("图片询问可能花费3秒钟以上，请耐心等待");
    if (file) {
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

      const upImgPromise = supabase.storage
        .from("images")
        .upload(`${user?.id!}/${filenameWithTime}`, file, {
          cacheControl: "3600",
          upsert: false,
        });
      const upMessagePromise = supabase
        .from("messages")
        .insert({ img_path: `${user?.id!}/${filenameWithTime}` });

      {
        const { data, error: upImgErr } = await upImgPromise;
        if (upImgErr) {
          toast.error("上传错误:" + upImgErr.message);
        }
        const { data: imgData } = await supabase.storage
          .from("images")
          .createSignedUrl(data!.path, 3600);

        const messageFromApi = await callAiApi("", imgData!.signedUrl);
        console.log(imgData!.signedUrl);
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
      {
        const { error: upMsgErr } = await upMessagePromise;
        if (upMsgErr) {
          toast.error("上传图片记录错误" + upMsgErr.message);
        }
      }
    } else {
      toast.error("消息不能为空");
    }
  };

  return (
    <div className="flex flex-col items-center md:mb-10 mb-5">
      <Slider
        className="my-3 max-w-[710px] mb-5 "
        defaultValue={[33]}
        max={100}
        step={1}
      />
      <div className="flex w-full max-w-[710px] items-center space-x-2">
        <form id="uploadForm">
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
        <Input
          type="text"
          placeholder="发消息"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />
        <Button type="submit" onClick={sendMessage}>
          发送
        </Button>
      </div>
    </div>
  );
}
