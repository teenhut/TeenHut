"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Smile, Paperclip, Send } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { encryptMessage, decryptMessage } from "@/utils/encryption";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api-config";

interface Message {
  id: string;
  text: string;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "file";
  sender: "me" | "other";
  senderName?: string;
  timestamp: Date;
  isEdited?: boolean;
  replyTo?: {
    id: string;
    text: string;
    senderName: string;
  };
  reactions?: {
    userId: string;
    emoji: string;
  }[];
}

import EmojiPicker from "emoji-picker-react";
import {
  MoreVertical,
  Edit2,
  Trash2,
  Reply,
  SmilePlus,
  Share2,
  X,
} from "lucide-react";

export default function ChatWindow({ chatId }: { chatId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Message | null>(null);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null); // For showing actions menu
  const [reactingToMessageId, setReactingToMessageId] = useState<string | null>(
    null
  );
  const { socket } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!socket || !user) return;

    // Send object with room and userId for validation
    socket.emit("join-room", { room: chatId, userId: user.id });

    const handleHistory = (historyMessages: any[]) => {
      const formattedMessages = historyMessages.map((msg) => ({
        id: msg._id,
        text: decryptMessage(msg.text),
        mediaUrl: msg.mediaUrl,
        mediaType: msg.mediaType,
        sender: (msg.senderId === user?.id ? "me" : "other") as "me" | "other",
        senderName: msg.senderName,
        timestamp: new Date(msg.timestamp),
        isEdited: msg.isEdited,
        replyTo: msg.replyTo,
        reactions: msg.reactions || [],
      }));
      setMessages(formattedMessages);
    };

    const handleMessage = (msg: any) => {
      // Don't duplicate if we already have it (e.g. from optimistic update)
      // Actually, we should probably rely on server echo for ID consistency or just append
      // For now, simple append if not from "me" or if we want to confirm receipt

      // If we use optimistic updates, we might see double.
      // Let's assume server broadcast includes sender.
      // If sender is me, we might have already added it.
      // But we need the real ID from DB.

      // Simple approach: Replace optimistic message or just ignore if from me?
      // Better: Just append everything from server and remove optimistic one?
      // Or: Only append if sender !== me.

      if (msg.senderId === user?.id) return; // Skip my own echo if I added it optimistically

      const decryptedText = decryptMessage(msg.text);
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id || Date.now().toString(),
          text: decryptedText,
          mediaUrl: msg.mediaUrl,
          mediaType: msg.mediaType,
          sender: "other",
          senderName: msg.senderName,
          timestamp: new Date(msg.timestamp),
          replyTo: msg.replyTo,
          reactions: msg.reactions || [],
        },
      ]);
    };

    const handleMessageUpdated = (data: any) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.id ? { ...msg, text: data.text, isEdited: true } : msg
        )
      );
    };

    const handleMessageDeleted = (data: any) => {
      setMessages((prev) => prev.filter((msg) => msg.id !== data.messageId));
    };

    const handleMessageReacted = (data: any) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId
            ? { ...msg, reactions: data.reactions }
            : msg
        )
      );
    };

    socket.on("history", handleHistory);
    socket.on("message", handleMessage);
    socket.on("message-updated", handleMessageUpdated);
    socket.on("message-deleted", handleMessageDeleted);
    socket.on("message-reacted", handleMessageReacted);

    return () => {
      socket.off("history", handleHistory);
      socket.off("message", handleMessage);
      socket.off("message-updated", handleMessageUpdated);
      socket.off("message-deleted", handleMessageDeleted);
      socket.off("message-reacted", handleMessageReacted);
    };
  }, [socket, chatId, user]);

  const sendMessage = async (mediaUrl?: string, mediaType?: string) => {
    if ((!inputText.trim() && !mediaUrl) || !user) return;

    if (editingMessage) {
      // Handle Edit
      if (socket) {
        socket.emit("edit-message", {
          room: chatId,
          messageId: editingMessage.id,
          newText: inputText,
          userId: user.id,
        });
      }
      // Optimistic update
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === editingMessage.id
            ? { ...msg, text: inputText, isEdited: true }
            : msg
        )
      );
      setEditingMessage(null);
      setInputText("");
      return;
    }

    const encryptedText = encryptMessage(inputText);

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText, // Show plain text locally
      mediaUrl,
      mediaType: mediaType as any,
      sender: "me",
      senderName: user.username,
      timestamp: new Date(),
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            text: replyingTo.text,
            senderName: replyingTo.senderName || "User",
          }
        : undefined,
      reactions: [],
    };

    // Optimistic append
    // Note: Ideally we wait for server ID to avoid dupes/issues, but for responsiveness we append.
    // Real ID update is tricky without full sync.
    setMessages((prev) => [...prev, newMessage]);

    if (socket) {
      socket.emit("send-message", {
        room: chatId,
        text: encryptedText,
        mediaUrl,
        mediaType,
        userId: user.id,
        username: user.username,
        replyTo: replyingTo
          ? {
              id: replyingTo.id,
              text: replyingTo.text,
              senderName: replyingTo.senderName,
            }
          : undefined,
      });
    }

    setInputText("");
    setReplyingTo(null);
    setShowEmojiPicker(false);
  };

  const deleteMessage = (messageId: string) => {
    if (!user || !socket) return;
    socket.emit("delete-message", {
      room: chatId,
      messageId,
      userId: user.id,
    });
    // Optimistic delete
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const reactToMessage = (messageId: string, emoji: string) => {
    if (!user || !socket) return;
    socket.emit("react-message", {
      room: chatId,
      messageId,
      userId: user.id,
      emoji,
    });
  };

  const handleShare = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Message copied to clipboard!");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/chat/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        await sendMessage(data.url, data.type);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const onEmojiClick = (emojiObject: any) => {
    setInputText((prev) => prev + emojiObject.emoji);
  };

  return (
    <div className="flex-grow flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-primary">TeenHut Chats</h1>
      </div>

      {/* Messages */}
      <div className="flex-grow p-6 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            } mb-4 group relative`}
          >
            <div
              className={`flex items-center gap-2 max-w-[80%] ${
                msg.sender === "me" ? "flex-row" : "flex-row"
              }`}
            >
              {/* Dots Menu for "Me" (Left side) */}
              {msg.sender === "me" && (
                <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() =>
                      setActiveMessageId(
                        activeMessageId === msg.id ? null : msg.id
                      )
                    }
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {activeMessageId === msg.id && (
                    <div className="absolute top-0 right-full mr-2 bg-white shadow-lg rounded-xl border border-gray-100 p-2 flex flex-col gap-1 z-20 w-32">
                      <button
                        onClick={() => setReplyingTo(msg)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700"
                      >
                        <Reply className="w-4 h-4" /> Reply
                      </button>
                      <button
                        onClick={() => {
                          setReactingToMessageId(
                            reactingToMessageId === msg.id ? null : msg.id
                          );
                          setActiveMessageId(null); // Close menu
                        }}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700"
                      >
                        <SmilePlus className="w-4 h-4" /> React
                      </button>
                      <button
                        onClick={() => handleShare(msg.text)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700"
                      >
                        <Share2 className="w-4 h-4" /> Copy
                      </button>
                      <button
                        onClick={() => {
                          setEditingMessage(msg);
                          setInputText(msg.text);
                          fileInputRef.current?.focus();
                          setActiveMessageId(null);
                        }}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 rounded-lg text-sm text-red-500"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Reaction Picker */}
              {reactingToMessageId === msg.id && (
                <div className="absolute top-10 z-50 shadow-xl rounded-xl">
                  <div className="relative">
                    <button
                      onClick={() => setReactingToMessageId(null)}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md z-10 hover:bg-gray-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        reactToMessage(msg.id, emojiData.emoji);
                        setReactingToMessageId(null);
                      }}
                      width={300}
                      height={400}
                    />
                  </div>
                </div>
              )}

              <div className="flex flex-col">
                {msg.sender === "other" && (
                  <span className="text-xs text-gray-500 mb-1 ml-1">
                    {msg.senderName}
                  </span>
                )}
                <div
                  className={`px-6 py-3 rounded-2xl text-lg relative ${
                    msg.sender === "me"
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-gray-100 text-black rounded-tl-none"
                  }`}
                >
                  {/* Reply Context */}
                  {msg.replyTo && (
                    <div
                      className={`mb-2 p-2 rounded text-sm border-l-4 ${
                        msg.sender === "me"
                          ? "bg-gray-800 border-gray-500 text-gray-300"
                          : "bg-white border-gray-400 text-gray-500"
                      }`}
                    >
                      <div className="font-bold text-xs">
                        {msg.replyTo.senderName}
                      </div>
                      <div className="truncate">{msg.replyTo.text}</div>
                    </div>
                  )}

                  {msg.mediaUrl && (
                    <div className="mb-2">
                      {msg.mediaType === "image" ? (
                        <img
                          src={msg.mediaUrl}
                          alt="Shared image"
                          className="rounded-lg max-w-full max-h-60 object-cover"
                        />
                      ) : msg.mediaType === "video" ? (
                        <video
                          src={msg.mediaUrl}
                          controls
                          className="rounded-lg max-w-full max-h-60"
                        />
                      ) : (
                        <a
                          href={msg.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          Download File
                        </a>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap items-end gap-x-2">
                    <span className="break-words max-w-full">{msg.text}</span>
                    {msg.isEdited && (
                      <span className="text-[10px] opacity-60 mb-0.5">
                        (edited)
                      </span>
                    )}
                    <span
                      className={`text-[10px] ml-auto mb-0.5 ${
                        msg.sender === "me" ? "text-gray-300" : "text-gray-400"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Reactions */}
                  {msg.reactions && msg.reactions.length > 0 && (
                    <div className="absolute -bottom-3 right-2 bg-white shadow-sm rounded-full px-1.5 py-0.5 flex items-center gap-0.5 border border-gray-100">
                      {msg.reactions.map((r, i) => (
                        <span key={i} className="text-xs">
                          {r.emoji}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dots Menu for "Other" (Right side) */}
              {msg.sender === "other" && (
                <div className="relative opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() =>
                      setActiveMessageId(
                        activeMessageId === msg.id ? null : msg.id
                      )
                    }
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {activeMessageId === msg.id && (
                    <div className="absolute top-0 left-full ml-2 bg-white shadow-lg rounded-xl border border-gray-100 p-2 flex flex-col gap-1 z-20 w-32">
                      <button
                        onClick={() => setReplyingTo(msg)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700"
                      >
                        <Reply className="w-4 h-4" /> Reply
                      </button>
                      <button
                        onClick={() => reactToMessage(msg.id, "❤️")}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700"
                      >
                        <SmilePlus className="w-4 h-4" /> React
                      </button>
                      <button
                        onClick={() => handleShare(msg.text)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700"
                      >
                        <Share2 className="w-4 h-4" /> Copy
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-200">
        {/* Reply/Edit Preview */}
        {replyingTo && (
          <div className="flex items-center justify-between bg-gray-50 p-2 rounded-t-lg border-b border-gray-200">
            <div className="text-sm text-gray-600">
              Replying to{" "}
              <span className="font-bold">{replyingTo.senderName}</span>
            </div>
            <button onClick={() => setReplyingTo(null)}>
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}
        {editingMessage && (
          <div className="flex items-center justify-between bg-yellow-50 p-2 rounded-t-lg border-b border-yellow-200">
            <div className="text-sm text-yellow-800">Editing message</div>
            <button
              onClick={() => {
                setEditingMessage(null);
                setInputText("");
              }}
            >
              <X className="w-4 h-4 text-yellow-600" />
            </button>
          </div>
        )}
        <div className="bg-gray-100 rounded-2xl p-2 flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-grow bg-transparent border-0 focus:ring-0 text-primary placeholder:text-gray-400 px-4 py-2"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <div className="flex items-center gap-2 pr-2 relative">
            {showEmojiPicker && (
              <div className="absolute bottom-12 right-0 z-50">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
            <button
              className="p-2 text-gray-400 hover:text-primary"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Smile className="w-6 h-6" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,video/*"
            />
            <button
              className="p-2 text-gray-400 hover:text-primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              <Paperclip
                className={`w-6 h-6 ${isUploading ? "animate-pulse" : ""}`}
              />
            </button>
            <Button
              onClick={() => sendMessage()}
              className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6"
              disabled={isUploading}
            >
              {isUploading ? "..." : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
