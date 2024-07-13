import Image from "next/image";
import Navbar from "@/components/navbar";
import { supabaseServer } from "@/lib/supabase/server";
import InitUser from "@/lib/store/InitUser";
import ChatInput from "@/components/chatInput";
import ChatMessages from "@/components/chatMessages";

export default async function Home() {
  const supabase = supabaseServer();

  const { data, error } = await supabase.auth.getSession();
  return (
    <>
      <div className="flex flex-col h-screen mx-5 my-2 relative">
        <Navbar user={data.session?.user} />
        <ChatMessages />
        <ChatInput />
      </div>
      <InitUser user={data.session?.user} />
    </>
  );
}
