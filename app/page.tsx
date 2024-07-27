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
      <Navbar user={data.session?.user} />
      <div className="mx-auto">
        <div className="md:max-w-[65%] flex flex-col fullScreen mx-5 my-2 relative ">
          <ChatMessages />
          <ChatInput />
        </div>
      </div>
      <InitUser user={data.session?.user} />
    </>
  );
}
