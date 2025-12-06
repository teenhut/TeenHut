"use client";

import Link from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Home,
  Compass,
  LayoutDashboard,
  MessageSquare,
  Trophy,
  Gift,
  LogOut,
  User,
  Play,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/hooks/useSocket";

export default function Sidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { isConnected } = useSocket();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/hypes", label: "Hypes", icon: Flame },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/chat", label: "Chat", icon: MessageSquare },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/challenges", label: "Challenges", icon: Gift },
    { href: "/videos", label: "Videos", icon: Play },
  ];

  return (
    <aside className="w-64 bg-white text-primary flex flex-col h-screen sticky top-0 border-r border-gray-200">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 relative bg-gray-100 rounded-full overflow-hidden">
          <NextImage
            src="/logo.png"
            alt="Teen Hut Logo"
            fill
            className="object-cover"
          />
          {isConnected && (
            <div
              className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white"
              title="Connected"
            />
          )}
        </div>
        <span className="text-xl text-primary font-debata">Teen Hut</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-primary text-white font-bold"
                  : "text-gray-600 hover:bg-gray-100 hover:text-primary"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between gap-3 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-primary uppercase">
              {user?.username?.[0] || "U"}
            </div>
            <div className="font-bold truncate text-primary">
              {user?.username || "User"}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-primary hover:bg-gray-100"
            onClick={logout}
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
