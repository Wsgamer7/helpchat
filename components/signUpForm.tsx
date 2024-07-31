"use client";

import { supabaseBrowser } from "@/lib/supabase/browser";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const supabase = supabaseBrowser();
  const router = useRouter();

  const vaildEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };
  const vaildPassword = (password: string) => {
    return password.length >= 6;
  };
  const vaildRePassword = (rePassword: string, password: string) => {
    return rePassword === password;
  };
  const SignUpWithEmail = async (e: any) => {
    e.preventDefault();
    if (!(vaildEmail(email) && vaildPassword(password))) {
      console.log("email/password err");
      return;
    }
    if (!vaildRePassword(rePassword, password)) {
      toast.error("两次密码不一致");
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/login",
      },
    });
    if (error) {
      console.log(error);
      toast.error("注册失败");
    } else {
      toast.success("注册成功, 请查看邮箱验证");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  };

  return (
    <form
      onSubmit={SignUpWithEmail}
      className="flex flex-col items-center gap-4 space-y-3"
    >
      <div className="w-full flex-1 rounded-lg border bg-white px-6 pb-4 pt-8 shadow-md  md:w-96 dark:bg-zinc-950">
        <h1 className="mb-3 text-2xl font-bold">注册</h1>
        <div className="w-full">
          <div>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  // e.preventDefault();
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
                value={password}
                onChange={(e) => {
                  // e.preventDefault();
                  setPassword(e.target.value);
                }}
                placeholder="输入密码"
                required
                minLength={6}
              />
            </div>

            <div className="mt-4">
              <div className="relative">
                <input
                  className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] text-sm outline-none placeholder:text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950"
                  id="repassword"
                  type="password"
                  name="repassword"
                  value={rePassword}
                  onChange={(e) => {
                    // e.preventDefault();
                    setRePassword(e.target.value);
                  }}
                  placeholder="再次输入密码"
                  required
                  minLength={6}
                />
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="my-4 flex h-10 w-full flex-row items-center justify-center rounded-md bg-zinc-900 p-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          注册
        </button>
      </div>

      <Link
        href="/login"
        className="flex flex-row gap-1 md:text-sm text-xl text-zinc-400"
      >
        已有账号? <div className="font-semibold underline">登录</div>
      </Link>
    </form>
  );
}
