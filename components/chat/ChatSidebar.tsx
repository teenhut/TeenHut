import { Button } from "@/components/ui/button";
import { Monitor, Users, GraduationCap, Globe, Plus } from "lucide-react";

interface ChatSidebarProps {
  activeChat: string;
  onSelectChat: (chat: string) => void;
}

export default function ChatSidebar({
  activeChat,
  onSelectChat,
}: ChatSidebarProps) {
  const chats = [
    { id: "tech", name: "Tech Chat", icon: Monitor },
    { id: "creators", name: "Creators' Hub", icon: Users },
    { id: "mentors", name: "Mentors' Corner", icon: GraduationCap },
    { id: "world", name: "World Chat", icon: Globe },
  ];

  return (
    <div className="w-full md:w-64 bg-gray-50 flex-shrink-0 p-4 border-r border-gray-200 h-full">
      <h2 className="text-gray-500 text-xs font-bold uppercase mb-4 tracking-wider">
        Group Chat
      </h2>

      <div className="space-y-2 mb-8">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeChat === chat.id
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-200 hover:text-black"
            }`}
          >
            <chat.icon className="w-5 h-5" />
            <span className="font-medium">{chat.name}</span>
          </button>
        ))}
      </div>

      <Button className="w-full bg-black hover:bg-gray-800 text-white gap-2">
        <Plus className="w-4 h-4" /> New Chat
      </Button>
    </div>
  );
}
