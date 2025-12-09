"use client";

import {
  Heart,
  MessageCircle,
  Share2,
  MoreVertical,
  Music2,
  Volume2,
  VolumeX,
  Play,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import CommentModal from "./CommentModal";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api-config";

interface ReelCardProps {
  id: string;
  title: string;
  author: string;
  xp: number;
  mediaUrl: string;
  mediaType: "image" | "video";
  initialLikes?: number;
  initialIsLiked?: boolean;
  initialComments?: any[];
  isActive?: boolean;
  isGlobalMuted?: boolean;
  onToggleGlobalMute?: () => void;
  authorProfilePicture?: string;
}

export default function ReelCard({
  id,
  title,
  author,
  xp,
  mediaUrl,
  mediaType,
  initialLikes = 0,
  initialIsLiked = false,
  initialComments = [],
  isActive = true,
  isGlobalMuted = true,
  onToggleGlobalMute,
  creatorId,
  authorProfilePicture,
}: ReelCardProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [commentsCount, setCommentsCount] = useState(initialComments.length);
  const [shares, setShares] = useState(0);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [showComments, setShowComments] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false); // New state
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user } = useAuth();
  const viewTrackedRef = useRef(false); // To prevent double counting views per session

  // Track View
  useEffect(() => {
    if (isActive && !viewTrackedRef.current && id) {
      fetch(`${API_BASE_URL}/api/hypes/${id}/view`, { method: "POST" }).catch(
        console.error
      );
      viewTrackedRef.current = true;
    }
  }, [isActive, id]);

  // Effect to handle play/pause based on isActive and manualPause
  useEffect(() => {
    if (videoRef.current) {
      if (isActive && !manualPause) {
        // Attempt to play
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Autoplay prevented:", error);
          });
        }
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, manualPause]);

  const handleLike = async () => {
    if (!user) {
      alert("Please login to like");
      return;
    }

    // Optimistic update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikes((prev) => (newIsLiked ? prev + 1 : prev - 1));

    try {
      await fetch(`${API_BASE_URL}/api/hypes/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
    } catch (error) {
      // Revert on error
      setIsLiked(!newIsLiked);
      setLikes((prev) => (newIsLiked ? prev - 1 : prev + 1));
    }
  };

  const handleComment = () => {
    setShowComments(true);
  };

  const handleShare = async () => {
    setShares((prev) => prev + 1);
    const url = `${window.location.origin}/hypes/${id}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      alert("Please login to subscribe");
      return;
    }
    if (!creatorId) {
      console.error("Follow failed: No creatorId found for this hype");
      alert("Cannot follow: Creator information is missing for this Hype.");
      return;
    }

    // Optimistic update
    setIsFollowing((prev) => !prev);

    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${creatorId}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId: user.id }),
      });
      const data = await res.json();
      if (data.isFollowing !== undefined) {
        setIsFollowing(data.isFollowing);
      }
    } catch (error) {
      console.error("Follow error:", error);
      setIsFollowing((prev) => !prev); // Revert
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleGlobalMute) {
      onToggleGlobalMute();
    } else {
      // Fallback for single page view where global mute might not be passed
      if (videoRef.current) {
        videoRef.current.muted = !videoRef.current.muted;
      }
    }
  };

  const togglePlay = () => {
    setManualPause((prev) => !prev);
  };

  return (
    <>
      <div className="relative h-[90vh] aspect-[9/16] snap-center shrink-0 rounded-2xl overflow-hidden bg-primary mb-8 mx-auto">
        {/* Blurred Background Layer */}
        <div className="absolute inset-0 z-0">
          {mediaType === "video" ? (
            <video
              src={mediaUrl}
              className="w-full h-full object-cover blur-xl opacity-50 scale-110"
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={mediaUrl}
              alt={title}
              className="w-full h-full object-cover blur-xl opacity-50 scale-110"
            />
          )}
          <div className="absolute inset-0 bg-primary/40" />
        </div>

        {/* Media Content */}
        <div
          className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
          onClick={togglePlay}
        >
          {mediaType === "video" ? (
            <>
              <video
                ref={videoRef}
                src={mediaUrl}
                className="w-full h-full object-contain"
                loop
                muted={isGlobalMuted}
                playsInline
              />
              {/* Play/Pause Overlay */}
              {(!isActive || manualPause) && (
                <div className="absolute inset-0 flex items-center justify-center bg-primary/20 z-20">
                  <Play className="w-16 h-16 text-white opacity-50" />
                </div>
              )}

              {/* Persistent Mute Icon (Bottom Right) - Clickable */}
              <div
                className="absolute bottom-4 right-4 p-2 bg-primary/50 rounded-full text-white z-30 cursor-pointer hover:bg-primary/70 transition-colors"
                onClick={toggleMute}
              >
                {isGlobalMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </div>
            </>
          ) : (
            <img
              src={mediaUrl}
              alt={title}
              className="w-full h-full object-contain"
            />
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-primary/80 pointer-events-none" />
        </div>

        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6 z-30">
          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleLike}
              className="w-12 h-12 rounded-full bg-primary/40 hover:bg-white/20 text-white backdrop-blur-sm"
            >
              <Heart
                className={`w-6 h-6 ${
                  isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
            <span className="text-xs font-bold text-white">{likes}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleComment}
              className="w-12 h-12 rounded-full bg-primary/40 hover:bg-white/20 text-white backdrop-blur-sm"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
            <span className="text-xs font-bold text-white">
              {commentsCount}
            </span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={handleShare}
              className="w-12 h-12 rounded-full bg-primary/40 hover:bg-white/20 text-white backdrop-blur-sm"
            >
              <Share2 className="w-6 h-6" />
            </Button>
            <span className="text-xs font-bold text-white">{shares}</span>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full bg-primary/40 hover:bg-white/20 text-white backdrop-blur-sm"
          >
            <MoreVertical className="w-6 h-6" />
          </Button>
        </div>

        {/* Bottom Info */}
        <div className="absolute left-0 bottom-0 right-16 p-6 z-30 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-primary flex items-center justify-center font-bold text-sm overflow-hidden">
                {authorProfilePicture ? (
                  <img
                    src={authorProfilePicture}
                    alt={author}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  author[0]
                )}
              </div>
            </div>
            <Link
              href={creatorId ? `/users/${creatorId}` : "#"}
              className="hover:underline"
            >
              <span className="font-bold text-lg">{author}</span>
            </Link>
            <Button
              variant={isFollowing ? "secondary" : "outline"}
              size="sm"
              className={`h-7 ml-2 rounded-full px-4 ${
                isFollowing
                  ? "bg-white text-primary"
                  : "border-white/30 bg-white/10 hover:bg-white/20 text-white"
              }`}
              onClick={handleFollow}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          </div>

          <h2 className="text-lg font-medium line-clamp-2 mb-2">{title}</h2>

          <div className="flex items-center gap-2 text-sm opacity-90">
            <Music2 className="w-4 h-4" />
            <div className="overflow-hidden w-40">
              <div className="animate-marquee whitespace-nowrap">
                Original Sound - {author} • Trending Hype Track
              </div>
            </div>
          </div>
        </div>
      </div>

      <CommentModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        hypeId={id}
        initialComments={initialComments}
      />
    </>
  );
}
