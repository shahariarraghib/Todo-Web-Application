"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Home() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth?.user && auth?.token) {
      // If user is logged in, redirect to dashboard
      router.push("/dashboard");
    } else {
      // If user is not logged in, redirect to login
      router.push("/signup");
    }
  }, [auth, router]);

  // Show loading state while checking authentication
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="text-center">
        <p className="text-lg">Loading...</p>
      </div>
    </div>
  );
}
