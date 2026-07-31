"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter()
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }
  return (
    <div className="">
      <h1>ceritanya dashboard kung</h1>
      <button onClick={handleLogout} className="border bg-red-500 border-red-500 font-inter text-white">Logout</button>
      <Link href="/onboarding" className="border bg-primary">Onboarding</Link>
    </div>
  )
}