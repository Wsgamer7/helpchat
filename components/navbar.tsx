"use client";
import React from "react";
import dynamic from "next/dynamic";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const AvatarDropDown = dynamic(() => import("./AvatarDropDown"), {
  ssr: false,
});

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
        <AvatarDropDown user={user} handleLogout={handleLogout} />
      ) : (
        <Button onClick={handleLoginWithGithub}>登录</Button>
      )}
    </div>
  );
}
