"use client";
import React from "react";
import dynamic from "next/dynamic";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useMessage } from "@/lib/store/messages";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AvatarDropDown = dynamic(() => import("./AvatarDropDown"), {
  ssr: false,
});

export default function Navbar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const rmMessages = useMessage((state) => state.rmMessages);
  const handleLogout = async () => {
    const supabase = supabaseBrowser();
    toast("正在退出登录...");
    await supabase.auth.signOut();
    rmMessages();
    router.refresh();
  };
  return (
    <div className="flex justify-between px-3">
      <div className="text-gray-500">
        <Select>
          <SelectTrigger className="">
            <SelectValue placeholder="诚哥" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chengge">诚哥</SelectItem>
            <SelectItem value="light">演唱会女主</SelectItem>
            <SelectItem value="dark">童锦程</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {user ? (
        <AvatarDropDown user={user} handleLogout={handleLogout} />
      ) : (
        <Button
          onClick={() => {
            router.push("/login");
          }}
        >
          登录
        </Button>
      )}
    </div>
  );
}
