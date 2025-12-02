"use client";

import { useState, useEffect, useRef } from "react";
import ReelCard from "@/components/feed/ReelCard";
import UploadModal from "@/components/upload/UploadModal";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface Hype {
  _id: string;
  title: string;
  author: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  xp: number;
  likes: number;
  isLiked: boolean;
  comments: any[];
  creatorId: string; // Added creatorId
}

interface HypeFeedProps {
  initialHypeId?: string;
}

export default function HypeFeed({ initialHypeId }: HypeFeedProps) {
  const [hypes, setHypes] = useState<Hype[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeHypeId, setActiveHypeId] = useState<string | null>(
    initialHypeId || null
  );
  const [isGlobalMuted, setIsGlobalMuted] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const [hasScrolledToInitial, setHasScrolledToInitial] = useState(false);

  useEffect(() => {
    fetchHypes();
  }, [user]);

  const fetchHypes = async () => {
    try {
      const res = await fetch(`/api/hypes?userId=${user?.id || ""}`);
      if (res.ok) {
        const data = await res.json();
        setHypes(data);
        if (data.length > 0 && !activeHypeId) {
          setActiveHypeId(data[0]._id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch hypes", error);
    }
  };

  // Scroll to initial hype
  useEffect(() => {
    if (
      initialHypeId &&
      hypes.length > 0 &&
      !hasScrolledToInitial &&
      containerRef.current
    ) {
      const element = containerRef.current.querySelector(
        `[data-id="${initialHypeId}"]`
      );
      if (element) {
        element.scrollIntoView({ behavior: "auto" });
        setHasScrolledToInitial(true);
        setActiveHypeId(initialHypeId);
      }
    }
  }, [initialHypeId, hypes, hasScrolledToInitial]);

  // Scroll Observer
  useEffect(() => {
    if (hypes.length === 0) return;

    const options = {
      root: containerRef.current, // Use the container as root
      rootMargin: "0px",
      threshold: 0.6, // 60% visibility required
    };

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("data-id");
          if (id && id !== activeHypeId) {
            setActiveHypeId(id);
            // Update URL without reloading
            window.history.replaceState(null, "", `/hypes/${id}`);
          }
        }
      });
    }, options);

    // Observe all hype cards
    const cards = containerRef.current?.querySelectorAll(".hype-card");
    cards?.forEach((card) => {
      observer.current?.observe(card);
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hypes, activeHypeId]); // Added activeHypeId dependency to ensure state updates correctly

  const toggleGlobalMute = () => {
    setIsGlobalMuted((prev) => !prev);
  };

  return (
    <div className="h-screen bg-white text-black font-sans overflow-hidden flex flex-col items-center relative">
      {/* Top Bar (Floating) */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-white/80 to-transparent">
        <h1 className="text-xl font-bold">Hypes</h1>
        <Button
          onClick={() => setShowUploadModal(true)}
          size="icon"
          className="bg-black/10 hover:bg-black/20 text-black backdrop-blur-md rounded-full w-10 h-10"
        >
          <Upload className="w-5 h-5" />
        </Button>
      </div>

      {/* Feed Container (Snap Scroll) */}
      <div
        ref={containerRef}
        className="w-full max-w-md h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide pt-16"
      >
        {hypes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
            <div className="w-20 h-20 bg-black/10 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold mb-2">No Hypes Yet</h2>
            <p className="mb-6">Be the first to upload a hype!</p>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-black text-white hover:bg-gray-800 font-bold rounded-full px-8"
            >
              Create Hype
            </Button>
          </div>
        ) : (
          hypes.map((item) => (
            <div
              key={item._id}
              className="hype-card snap-center"
              data-id={item._id}
            >
              <ReelCard
                id={item._id}
                title={item.title}
                author={item.author}
                xp={item.xp}
                mediaUrl={item.mediaUrl}
                mediaType={item.mediaType}
                initialLikes={item.likes}
                initialIsLiked={item.isLiked}
                initialComments={item.comments}
                isActive={item._id === activeHypeId}
                isGlobalMuted={isGlobalMuted}
                onToggleGlobalMute={toggleGlobalMute}
                creatorId={item.creatorId} // Pass creatorId
              />
            </div>
          ))
        )}
      </div>

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={fetchHypes}
      />
    </div>
  );
}
