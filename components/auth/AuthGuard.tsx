"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const PUBLIC_PATHS = ["/login", "/signup"];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn && !PUBLIC_PATHS.includes(pathname)) {
        router.push("/login");
      } else if (isLoggedIn && PUBLIC_PATHS.includes(pathname)) {
        router.push("/");
      }
    }
  }, [isLoggedIn, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black">
        Loading...
      </div>
    );
  }

  // If not logged in and trying to access private route, don't render children (prevent flash)
  if (!isLoggedIn && !PUBLIC_PATHS.includes(pathname)) {
    return null;
  }

  return <>{children}</>;
}
