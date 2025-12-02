"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button"; // Will be created by shadcn
import { Flame, Wifi } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";

export default function Navbar() {
  const { isConnected } = useSocket();

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-teal-900 text-white">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full border-2 border-teal-400 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full border-2 border-teal-400" />
        </div>
        <span className="text-xl font-bold">Teen Hut</span>
        {isConnected && (
          <div
            className="w-2 h-2 rounded-full bg-green-500"
            title="Connected"
          />
        )}
      </div>

      <div className="hidden md:flex items-center gap-6 text-sm font-medium">
        <Link
          href="/discover"
          className="hover:text-teal-200 transition-colors"
        >
          Discover
        </Link>
        <Link href="/profile" className="hover:text-teal-200 transition-colors">
          Profile
        </Link>
        <Link href="/chat" className="hover:text-teal-200 transition-colors">
          Chat
        </Link>
        <Link
          href="/leaderboard"
          className="hover:text-teal-200 transition-colors"
        >
          Leaderboard
        </Link>
        <Link
          href="/challenges"
          className="hover:text-teal-200 transition-colors"
        >
          Challenges
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-teal-800 px-3 py-1.5 rounded-full">
          <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
          <span className="font-bold">120</span>
        </div>
        {/* Placeholder for user avatar or login button */}
        <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-xs font-bold">
          U
        </div>
        <Button
          variant="ghost"
          className="text-teal-200 hover:text-white hover:bg-teal-800/50"
          onClick={() => {
            localStorage.removeItem("isLoggedIn");
            window.location.href = "/login";
          }}
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
