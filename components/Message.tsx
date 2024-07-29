"use client";
import { Imessage } from "@/lib/store/messages";
import Image from "next/image";
import FormatDate from "./FormatDate";
import { useUser } from "@/lib/store/user";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { toast } from "sonner";
import Markdown from "markdown-to-jsx";
import React from "react";

function Message({ message }: { message: Imessage }) {
  const user = useUser((state) => state.user);
  /*get img local url if need */
  const [imageData, setImageData] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      // 在组件卸载时释放 Blob URL
      if (imageData) {
        URL.revokeObjectURL(imageData);
      }
    };
  }, [imageData]);

  useEffect(() => {
    if (message.img_path) {
      if (!message.text) {
        const supabase = supabaseBrowser();
        const downloadImage = async () => {
          const { data, error } = await supabase.storage
            .from("images")
            .download(message.img_path!);
          console.log("downloading sucesss:" + message.img_path!);
          if (error) {
            toast.error("下载图片失败:" + error.message);
          }
          const blobUrl = URL.createObjectURL(data!);
          setImageData(blobUrl);
        };
        downloadImage();
      } else {
        /*对于用户刚上传的图片，图片bloburl在message.text中*/
        console.log("a message added in messages list local");
        setImageData(message.text);
      }
    }
  }, [message]);

  if (user?.id === message.profiles?.id) {
    //right side message
    return (
      <div className="flex-shrink-0 my-3 max-w-[800px] w-full mx-auto  ">
        <div className="flex-1 overflow-x-hidden flex flex-col items-end mr-5">
          <h1 className="text-sm text-gray-400 ml-auto">
            <FormatDate dateString={message.created_at} />
          </h1>
          <div>
            {message.img_path ? (
              <img
                src={imageData!}
                alt="image"
                style={{
                  maxWidth: "300px",
                  maxHeight: "300px",
                  marginTop: "10px",
                }}
              />
            ) : (
              <p className="bg-primary text-white max-w-[60vw] md:max-w-[40vw] rounded-md p-3 break-words">
                {message.text!}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
  //left side message
  return (
    <div className="flex-shrink-0 my-3 max-w-[800px] w-full mx-auto  ">
      <div className="flex gap-2">
        <Image
          src={message.profiles?.avatar_url!}
          alt="avatar"
          width={40}
          height={40}
          className="h-8 w-8 rounded-full flex-shrink-0"
        />
        <div className="flex-1 overflow-x-hidden">
          <h1 className="text-sm text-gray-400">
            <FormatDate dateString={message.created_at} />
          </h1>
          {message.img_path ? (
            <img
              src={imageData!}
              alt="image"
              style={{
                maxWidth: "300px",
                maxHeight: "300px",
                marginTop: "10px",
              }}
            />
          ) : (
            <div className="bg-secondary max-w-full w-fit rounded-md p-4 break-words mr-5">
              <Markdown>{message.text!}</Markdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(Message);
