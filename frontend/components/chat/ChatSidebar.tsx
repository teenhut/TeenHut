import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  Users,
  GraduationCap,
  Globe,
  Plus,
  MessageSquare,
} from "lucide-react";
import NewChatModal from "./NewChatModal";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api-config";

interface ChatSidebarProps {
  activeChat: string;
  onSelectChat: (chat: string) => void;
}

export default function ChatSidebar({
  activeChat,
  onSelectChat,
}: ChatSidebarProps) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // Default rooms
  const defaultChats = [
    { id: "tech", name: "Tech Chat", icon: Monitor },
    { id: "creators", name: "Creators' Hub", icon: Users },
    { id: "mentors", name: "Mentors' Corner", icon: GraduationCap },
    { id: "world", name: "World Chat", icon: Globe },
  ];

  const fetchConversations = async () => {
    if (!user) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/conversations?userId=${user.id}`
      );
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Failed to fetch conversations", error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  const handleChatCreated = (newConv: any) => {
    setConversations([newConv, ...conversations]);
    onSelectChat(newConv._id);
  };

  const getConversationName = (conv: any) => {
    if (conv.isGroup) return conv.name || "Group Chat";
    // For 1-on-1, find the other participant
    const other = conv.participants.find((p: any) => p._id !== user?.id);
    return other?.username || "Unknown User";
  };

  const getConversationImage = (conv: any) => {
    if (conv.isGroup) return null;
    const other = conv.participants.find((p: any) => p._id !== user?.id);
    return other?.profilePicture;
  };

  return (
    <div className="w-full md:w-64 bg-gray-50 flex-shrink-0 p-4 border-r border-gray-200 h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-6">
        {/* Public Rooms */}
        <div>
          <h2 className="text-gray-500 text-xs font-bold uppercase mb-2 tracking-wider">
            Public Rooms
          </h2>
          <div className="space-y-1">
            {defaultChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                  activeChat === chat.id
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-200 hover:text-primary"
                }`}
              >
                <chat.icon className="w-4 h-4" />
                <span className="font-medium">{chat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Direct Messages */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-gray-500 text-xs font-bold uppercase tracking-wider">
              Direct Messages
            </h2>
          </div>
          <div className="space-y-1">
            {conversations.map((conv) => {
              const image = getConversationImage(conv);
              return (
                <button
                  key={conv._id}
                  onClick={() => onSelectChat(conv._id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                    activeChat === conv._id
                      ? "bg-primary text-white"
                      : "text-gray-600 hover:bg-gray-200 hover:text-primary"
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {image ? (
                      <img
                        src={image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 font-bold text-xs">
                        {getConversationName(conv)[0]?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 text-left truncate">
                    <div className="font-medium truncate">
                      {getConversationName(conv)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <Button
          onClick={() => setShowNewChatModal(true)}
          className="w-full bg-primary hover:bg-primary/90 text-white gap-2"
        >
          <Plus className="w-4 h-4" /> New Chat
        </Button>
      </div>

      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onChatCreated={handleChatCreated}
      />
    </div>
  );
}
