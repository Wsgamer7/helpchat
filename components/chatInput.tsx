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
import { timestampForFile } from "@/lib/utils";
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
        img_url: null,
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
        toast.error("图片消息错误" + error.message);
      }
    } else {
      toast.error("消息不能为空");
    }
  };
  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const filenameWithTime = timestampForFile() + file?.name;
    console.log(filenameWithTime);
    toast("上传中...这需要一点时间");
    if (file) {
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`${user?.id!}/${filenameWithTime}`, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (error) {
        toast.error("上传错误:" + error.message);
      } else {
        /*上传成功，获取临时url */
        const { data, error } = await supabase.storage
          .from("images")
          .createSignedUrl(`${user?.id!}/${filenameWithTime}`, 60);
        if (error) {
          toast.error("geturl错误:" + error.message);
          console.log(error.message);
        } else {
          /*获取临时url成功，创建新Imessage*/
          console.log(data?.signedUrl);
          const newMessage: Imessage = {
            id: uuidv4(),
            text: null,
            send_id: user?.id!,
            reci_id: "1",
            img_url: data?.signedUrl,
            created_at: new Date().toISOString(),
            profiles: {
              id: user?.id!,
              full_name: user?.user_metadata.fullname,
              avatar_url: user?.user_metadata.avatar_url,
              email: null,
            },
          };
          addMessage(newMessage);
          const { error } = await supabase
            .from("messages")
            .insert({ img_url: data?.signedUrl });
          if (error) {
            toast.error("图片消息错误:" + error.message);
          }
        }
      }
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
