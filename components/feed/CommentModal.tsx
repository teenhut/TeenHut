"use client";

import { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Comment {
  text: string;
  author: string;
  createdAt: string;
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  hypeId: string;
  initialComments?: Comment[];
}

export default function CommentModal({
  isOpen,
  onClose,
  hypeId,
  initialComments = [],
}: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
      // Focus input when opened
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, hypeId]);

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/hypes/${hypeId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Failed to fetch comments");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      // TODO: Get real user from auth context
      const author = "You";

      console.log("Posting comment to:", `/api/hypes/${hypeId}/comment`);
      const res = await fetch(`/api/hypes/${hypeId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: newComment, author }),
      });

      if (res.ok) {
        const savedComment = await res.json();
        setComments((prev) => [savedComment, ...prev]);
        setNewComment("");
      } else {
        console.error("Failed to post comment, status:", res.status);
        alert("Failed to post comment. Please try again.");
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
      alert("An error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl h-[70vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-center p-4 border-b border-gray-100 relative">
          <div className="w-12 h-1 bg-gray-300 rounded-full absolute top-2" />
          <h3 className="font-bold text-primary mt-2">Comments</h3>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 text-gray-500 hover:text-primary"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
              <p>No comments yet.</p>
              <p>Start the conversation!</p>
            </div>
          ) : (
            comments.map((comment, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 p-[2px] shrink-0">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-bold text-xs text-primary">
                    {comment.author[0]}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-sm text-primary">
                      {comment.author}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800">{comment.text}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-100 bg-white pb-6 sm:pb-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-xs text-gray-500 shrink-0">
              Y
            </div>
            <input
              ref={inputRef}
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-primary outline-none focus:ring-1 focus:ring-primary/20"
            />
            <Button
              type="submit"
              disabled={!newComment.trim() || isLoading}
              className="text-blue-500 font-bold hover:text-blue-600 disabled:opacity-50 p-2 h-auto"
              variant="ghost"
            >
              Post
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
