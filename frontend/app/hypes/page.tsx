"use client";

import { useState, useEffect, useRef } from "react";
import ReelCard from "@/components/feed/ReelCard";
import UploadModal from "@/components/upload/UploadModal";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api-config";

interface Hype {
  _id: string;
  title: string;
  author: string;
  creatorId:
    | string
    | { _id: string; username: string; profilePicture?: string }; // Added creatorId
  mediaUrl: string;
  mediaType: "image" | "video";
  xp: number;
  likes: number;
  isLiked: boolean;
  comments: any[];
}

export default function HypesPage() {
  const [hypes, setHypes] = useState<Hype[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeHypeId, setActiveHypeId] = useState<string | null>(null);
  const [isGlobalMuted, setIsGlobalMuted] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchHypes();
  }, [user]);

  const fetchHypes = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/hypes?userId=${user?.id || ""}`
      );
      if (res.ok) {
        const data = await res.json();
        setHypes(data);
        if (data.length > 0) {
          setActiveHypeId(data[0]._id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch hypes", error);
    }
  };

  // Scroll Observer
  useEffect(() => {
    if (hypes.length === 0) return;

    const options = {
      root: null,
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
    document.querySelectorAll(".hype-card").forEach((card) => {
      observer.current?.observe(card);
    });

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hypes]);

  const toggleGlobalMute = () => {
    setIsGlobalMuted((prev) => !prev);
  };

  return (
    <main className="h-screen bg-white text-primary font-sans overflow-hidden flex flex-col items-center relative">
      {/* Top Bar (Floating) */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-center bg-gradient-to-b from-white/80 to-transparent">
        <h1 className="text-xl font-bold">Hypes</h1>
        <Button
          onClick={() => setShowUploadModal(true)}
          className="bg-primary/10 hover:bg-primary/20 text-primary backdrop-blur-md rounded-full px-6"
        >
          <Upload className="w-4 h-4 mr-2" /> Upload
        </Button>
      </div>

      {/* Feed Container (Snap Scroll) */}
      <div className="w-full max-w-md h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide pt-16">
        {hypes.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-60">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold mb-2">No Hypes Yet</h2>
            <p className="mb-6">Be the first to upload a hype!</p>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-primary text-white hover:bg-primary/90 font-bold rounded-full px-8"
            >
              Create Hype
            </Button>
          </div>
        ) : (
          hypes.map((item) => {
            const creator =
              typeof item.creatorId === "object" ? item.creatorId : null;
            const creatorIdString = creator
              ? creator._id
              : (item.creatorId as string);
            const profilePicture = creator?.profilePicture;

            return (
              <div
                key={item._id}
                className="hype-card snap-center"
                data-id={item._id}
              >
                <ReelCard
                  id={item._id}
                  title={item.title}
                  author={item.author}
                  creatorId={creatorIdString}
                  authorProfilePicture={profilePicture}
                  xp={item.xp}
                  mediaUrl={item.mediaUrl}
                  mediaType={item.mediaType}
                  initialLikes={item.likes}
                  initialIsLiked={item.isLiked}
                  initialComments={item.comments}
                  isActive={item._id === activeHypeId}
                  isGlobalMuted={isGlobalMuted}
                  onToggleGlobalMute={toggleGlobalMute}
                />
              </div>
            );
          })
        )}
      </div>

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={fetchHypes}
      />
    </main>
  );
}
