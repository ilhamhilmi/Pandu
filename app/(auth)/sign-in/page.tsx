"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { CiMail, CiLock } from "react-icons/ci";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  async function handleLogin(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      if (error.message === "missing email or phone") {
        toast.add({
          title: "Kolom email dan password harus diisi"
        })
        return;
      } else if (error.message === "Invalid login credentials") {
        toast.add({
          title: "Periksa kembali email atau password kamu"
        })
        return;
      } else {
        toast.add({
          title: "Terjadi kesalahan, coba lagi nanti ya"
        })
      }
    } else {
      toast.add({
        title: "Selamat datang kembali"
      })
      router.push("/")
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="flex mb-5">
          <h2 className="text-primary font-inter uppercase tracking-widest">| Masuk ke akun</h2>
        </div>
        <div className="text-start">
          <h1 className="font-inter text-4xl xl:text-5xl font-bold text-foreground">
            Selamat datang <span className="font-inter text-primary">kembali!</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-inter">
            Masuk untuk lanjut atur keuangan kamu
          </p>
        </div>

        <button
          type="button"
          className="font-inter flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-gray-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Masuk pakai Google
        </button>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-gray-500 font-inter">Atau pakai email</span>
          </div>
        </div>

        {/* Login Form */}
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="font-inter block text-sm font-medium text-foreground"
            >
              Email
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <CiMail className="h-5 w-5" />
              </span>
              <input
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                placeholder="EmailKamu@email.com"
                className="block w-full rounded-lg border border-gray-300 bg-background pl-10 pr-4 py-2.5 font-inter text-sm text-foreground placeholder-gray-400 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="font-inter block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <div className="relative mt-1">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <CiLock className="h-5 w-5" />
              </span>
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter"
                className="block w-full rounded-lg border border-gray-300 bg-background pl-10 pr-11 py-2.5 font-inter text-sm text-foreground placeholder-gray-400 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <button
              type="button"
              className="font-inter text-sm text-primary transition-colors hover:text-primary-hover"
            >
              Lupa password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="font-inter w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Masuk
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center font-inter text-sm text-gray-500">
          Kamu pengguna baru?{" "}
          <Link
            href="/sign-up"
            className="font-medium text-primary transition-colors hover:text-primary-hover"
          >
            Bikin akun gratis
          </Link>
        </p>
      </div>
    </main>
  );
}