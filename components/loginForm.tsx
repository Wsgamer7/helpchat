"use client";

import { supabaseBrowser } from "@/lib/supabase/browser";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import BrandWithLogo from "./brandWithLogo";
import { GithubIcon, GoogleIcon } from "./icon";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const supabase = supabaseBrowser();
  const router = useRouter();

  const vaildEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  const vaildPassword = (password: string) => {
    return password.length >= 6;
  };
  const logInWithEmail = async () => {
    if (!vaildEmail(email)) {
      return;
    }
    if (!vaildPassword(password)) {
      return;
    }
    toast("登录中...");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log(error);
    if (error) {
      toast.error("账号或密码错误");
    } else {
      router.push("/");
    }
  };
  const handleLoginWithGithub = async () => {
    toast("登录中...");
    supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: window.location.origin + "/auth/callback",
      },
    });
  };
  return (
    <form className="flex flex-col items-center gap-4 space-y-3">
      <div className="w-full flex-1 rounded-lg border bg-white px-6 pb-4 pt-8 shadow-md  md:w-96 dark:bg-zinc-950">
        <h1 className="mb-3 text-2xl font-bold">登录</h1>
        <div className="flex justify-between my-4">
          <div className="w-[46%]" onClick={handleLoginWithGithub}>
            <BrandWithLogo name="Github" child={<GithubIcon />} />
          </div>
          <div className="w-[46%]">
            <BrandWithLogo name="Google" child={<GoogleIcon />} />
          </div>
        </div>
        <p className="w-full text-center text-xl text-zinc-400 mb-3">或</p>

        <div className="w-full">
          <div>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                id="email"
                type="email"
                name="email"
                onChange={(e) => {
                  e.preventDefault();
                  setEmail(e.target.value);
                }}
                placeholder="输入邮箱地址"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="relative">
              <input
                className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                id="password"
                type="password"
                name="password"
                onChange={(e) => {
                  e.preventDefault();
                  setPassword(e.target.value);
                }}
                placeholder="输入密码"
                required
                minLength={6}
              />
            </div>
          </div>
        </div>
        <button
          onClick={logInWithEmail}
          className="my-4 flex h-10 w-full flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          登录
        </button>
      </div>

      <Link
        href="/signup"
        className="flex flex-row gap-1 md:text-sm text-xl text-zinc-400"
      >
        没有账号? <div className="font-semibold underline">注册</div>
      </Link>
    </form>
  );
}
