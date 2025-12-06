"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Search, Check, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface User {
  _id: string;
  username: string;
  email: string;
}

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChatCreated: (conversation: any) => void;
}

export default function NewChatModal({
  isOpen,
  onClose,
  onChatCreated,
}: NewChatModalProps) {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      // Filter out current user
      setUsers(data.filter((u: User) => u._id !== currentUser?.id));
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUser = (user: User) => {
    if (selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) return;

    setIsLoading(true);
    try {
      const isGroup = selectedUsers.length > 1;
      const participantIds = [
        currentUser?.id,
        ...selectedUsers.map((u) => u._id),
      ];

      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantIds,
          name: isGroup ? groupName : undefined,
          isGroup,
          adminId: currentUser?.id,
        }),
      });

      if (res.ok) {
        const conversation = await res.json();
        onChatCreated(conversation);
        onClose();
        // Reset state
        setSelectedUsers([]);
        setGroupName("");
        setSearchQuery("");
      }
    } catch (error) {
      console.error("Failed to create chat", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white text-primary rounded-xl w-full max-w-md h-[80vh] flex flex-col shadow-2xl overflow-hidden relative border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold">New Message</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-primary hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search people..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Group Name (if multiple selected) */}
        {selectedUsers.length > 1 && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
              Group Name
            </label>
            <input
              type="text"
              placeholder="Name your group..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        )}

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredUsers.map((user) => {
            const isSelected = selectedUsers.some((u) => u._id === user._id);
            return (
              <div
                key={user._id}
                onClick={() => toggleUser(user)}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  isSelected ? "bg-primary/5" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                    {user.username[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{user.username}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={handleCreateChat}
            disabled={selectedUsers.length === 0 || isLoading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6"
          >
            {isLoading ? "Creating..." : "Chat"}
          </Button>
        </div>
      </div>
    </div>
  );
}
