import { Imessage } from "@/lib/store/messages";
import Image from "next/image";
import FormatDate from "./FormatDate";
import Link from "next/link";
import { useUser } from "@/lib/store/user";

export default function Message({ message }: { message: Imessage }) {
  const user = useUser((state) => state.user);
  if (user?.id === message.profiles?.id) {
    //right side message
    return (
      <div className="flex-shrink-0 my-3 max-w-3xl w-full mx-auto  ">
        <div className="flex-1 overflow-x-hidden flex flex-col items-end mr-5">
          <h1 className="text-sm text-gray-400 ml-auto">
            <FormatDate dateString={message.created_at} />
          </h1>
          <div>
            {message.img_url ? (
              <Link href={message.img_url}>
                <Image
                  src={message.img_url}
                  alt="图片"
                  width={100}
                  height={200}
                />
              </Link>
            ) : (
              <p className="bg-primary text-white max-w-[50vw] md:max-w-[35vw] rounded-md p-2 break-words">
                {message.text}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
  //left side message
  return (
    <div className="flex-shrink-0 my-3 max-w-2xl w-full mx-auto  ">
      <div className="flex gap-2">
        <Image
          src={message.profiles?.avatar_url!}
          alt={message.profiles?.full_name!}
          width={40}
          height={40}
          className="h-8 w-8 rounded-full flex-shrink-0"
        />
        <div className="flex-1 overflow-x-hidden">
          <h1 className="text-sm text-gray-400">
            <FormatDate dateString={message.created_at} />
          </h1>
          {message.img_url ? (
            <Link href={message.img_url}>
              <Image
                src={message.img_url}
                alt="图片"
                width={100}
                height={200}
              />
            </Link>
          ) : (
            <p className="bg-secondary max-w-full w-fit rounded-md p-2 break-words mr-5">
              {message.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
