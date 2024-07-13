import { Suspense } from "react";
import ListMessgages from "./listMessages";
import { supabaseServer } from "@/lib/supabase/server";
import InitMessages from "@/lib/store/InitMessages";

export default async function ChatMessages() {
  const supabase = supabaseServer();
  const { data } = await supabase.from("messages").select("*, profiles(*)");
  console.log(data);
  return (
    <Suspense fallback={"loading..."}>
      <ListMessgages />
      <InitMessages messages={data || []} />
    </Suspense>
  );
}
