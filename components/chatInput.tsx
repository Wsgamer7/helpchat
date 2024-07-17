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
      const { error } = await supabase
        .from("messages")
        .insert({ text: msg_copy });
      if (error) {
        toast.error("上传文字消息错误" + error.message);
      }
      fetch("/api/text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: msg_copy }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          console.log(data);
          const botId = "4d9e91ca-f832-4bb4-b1fc-feee388d6a4e";
          const botAvatarUrl =
            "https://zsiyhbzzkskdywvuzasy.supabase.co/storage/v1/object/sign/avatars/public/chengge.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL3B1YmxpYy9jaGVuZ2dlLndlYnAiLCJpYXQiOjE3MjA5MjAxMzgsImV4cCI6MTc1MjQ1NjEzOH0.LtC8fy9bTGWMeI_JPt_Efh7T0zbZw6VFGhRxqqNv3QY&t=2024-07-14T01%3A22%3A18.358Z";
          const newMessage: Imessage = {
            id: uuidv4(),
            text: data.text,
            send_id: botId,
            reci_id: "1",
            img_path: null,
            created_at: new Date().toISOString(),
            profiles: {
              id: "1",
              full_name: "bot",
              avatar_url: botAvatarUrl,
              email: null,
            },
          };
          addMessage(newMessage);
          const { error } = await supabase
            .from("messages")
            .insert({ text: data.text, send_id: botId, reci_id: user?.id! });
          if (error) {
            console.log("数据库存储机器人回复失败");
          }
        })
        .catch((error) => console.error("Error:", error));
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
    // toast("上传中...这需要一点时间");
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

      const [{ data, error: upImgErr }, { error: upMsgErr }] =
        await Promise.all([upImgPromise, upMessagePromise]);
      if (upImgErr) {
        toast.error("上传错误:" + upImgErr.message);
      }

      if (upMsgErr) {
        toast.error("上传文字消息错误" + upMsgErr.message);
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
