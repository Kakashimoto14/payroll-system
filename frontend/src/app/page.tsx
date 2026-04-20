"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.role === "HR_ADMIN") router.replace("/admin");
        else if (parsed.role === "SHIFT_MANAGER") router.replace("/manager");
        else router.replace("/crew");
      } catch {
        router.replace("/login");
      }
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09090b]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="text-5xl">🍟</div>
        <p className="text-golden font-display text-lg">Loading...</p>
      </div>
    </div>
  );
}
