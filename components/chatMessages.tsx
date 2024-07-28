import { Suspense } from "react";
import ListMessgages from "./listMessages";
import { supabaseServer } from "@/lib/supabase/server";
import InitMessages from "@/lib/store/InitMessages";

export default async function ChatMessages() {
  const supabase = supabaseServer();
  let user_id: string;
  {
    const { data, error } = await supabase.auth.getSession();
    user_id = data.session?.user?.id!;
  }

  const { data } = await supabase
    .from("messages")
    .select("*, profiles(*)")
    .or(`reci_id.eq.${user_id}, send_id.eq.${user_id}`)
    .order("created_at", { ascending: false })
    .limit(10);
  if (data) {
    data.reverse();
  }
  return (
    <Suspense fallback={"loading..."}>
      <ListMessgages />
      <InitMessages messages={data || []} />
    </Suspense>
  );
}
