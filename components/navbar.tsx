"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Navbar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const handleLoginWithGithub = async () => {
    const supabase = supabaseBrowser();
    toast("登录中...");
    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin + "/auth/callback",
      },
    });
  };
  const handleLogout = async () => {
    const supabase = supabaseBrowser();
    toast("正在退出登录...");
    await supabase.auth.signOut();
    router.refresh();
  };
  return (
    <div className="flex justify-between">
      <div></div>
      {user ? (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src={user.user_metadata.avatar_url} alt="avatar" />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {/* <DropdownMenuLabel>ws18022@outlook.com</DropdownMenuLabel> */}
              <DropdownMenuCheckboxItem onClick={handleLogout}>
                退出登录
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Button onClick={handleLoginWithGithub}>登录</Button>
      )}
    </div>
  );
}
