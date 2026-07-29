"use client";

import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { CiMail, CiLock } from "react-icons/ci";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { toast } from "@/components/ui/toast";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  function isStrongPassword(password: string) {
    const hasLowercase = /[a-z]/.test(password) //huruf kecil
    const hasUppercase = /[A-Z]/.test(password) // huruf kapital
    const hasNumber = /[0-9]/.test(password) // angka
    const hasSpecial = /[^A-Za-z0-9]/.test(password) //simbol
    const hasMinLength = password.length >= 8

    return (
      hasLowercase &&
      hasUppercase &&
      hasNumber &&
      hasSpecial &&
      hasMinLength
    );
  }

  async function handleRegister(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!isStrongPassword(password)) {
      setPasswordError("Password minimal 8 karakter dan harus mengandung huruf besar, huruf kecil, angka, serta simbol")
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      if (error.message === "User already registered") {
        toast.add({
          title : "Email ini udah ada yang pakai"
        })
        return;
      }
      toast.add({
        title: "Terjadi kesalahan, coba lagi nanti ya"
      })
      // console.log(error.message)
      return;
    }

    toast.add({
      title: "Cek email kamu buat konfirmasi akun, terus balik lagi ke sini ya",
    })
  }

  async function handleGoogleRegister(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/sign-in`
      }
    })

    if (error) {
      toast.add({
        title: "Terjadi kesalahan, coba lagi nanti ya"
      })
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="flex mb-5">
          <h2 className="text-primary font-inter uppercase tracking-widest">| Bikin akun baru</h2>
        </div>
        <div className="text-start">
          <h1 className="font-inter text-4xl xl:text-5xl font-bold text-foreground tracking-wider">
            Mulai atur <span className="text-primary">keuangan</span> kamu
          </h1>
          <p className="mt-2 text-sm text-gray-500 font-inter">
            Bikin akun & gunakan layanan gratis untuk membantu mengatur keuangan kamu.
          </p>
        </div>

        <button
          onClick={handleGoogleRegister}
          type="button"
          className="font-inter flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-gray-50 cursor-pointer"
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
          Daftar pakai Google
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

        {/* Register Form */}
        <form className="space-y-6" onSubmit={handleRegister}>
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
                onChange={(e) => { setPassword(e.target.value); setPasswordError("") }}
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Minimal 8 karakter. Mix huruf, angka, dan simbol."
                className={`block w-full rounded-lg border border-gray-300 bg-background pl-10 pr-11 py-2.5 font-inter text-sm text-foreground placeholder-gray-400 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary ${passwordError ? "border-red-500" : "border-gray-300"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="font-inter text-xs text-red-500 mt-1">{passwordError}</p>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="font-inter w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover cursor-pointer"
          >
            Daftar
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center font-inter text-sm text-gray-500">
          Sudah punya akun?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary transition-colors hover:text-primary-hover"
          >
            Masuk sekarang
          </Link>
        </p>
      </div>
    </main>
  );
}