"use client";

import { useState } from "react";

import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatWindow from "@/components/chat/ChatWindow";
import { User } from "lucide-react";

export default function ChatPage() {
  const [activeChat, setActiveChat] = useState("tech");

  return (
    <main className="h-screen flex flex-col bg-white text-black font-sans overflow-hidden">
      <div className="flex-grow flex overflow-hidden">
        <ChatSidebar activeChat={activeChat} onSelectChat={setActiveChat} />

        <ChatWindow chatId={activeChat} />

        {/* Right Sidebar (Active Users) - Hidden on mobile, visible on lg */}
      </div>
    </main>
  );
}
