"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Flame, Heart, MessageCircle } from "lucide-react";
import UploadModal from "@/components/upload/UploadModal";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";

interface Hype {
  _id: string;
  title: string;
  mediaUrl: string;
  mediaType: string;
  likes: number;
  comments: any[];
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [hypes, setHypes] = useState<Hype[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHypes = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/hypes?creatorId=${user.id}`);
      const data = await res.json();
      setHypes(data);
    } catch (error) {
      console.error("Failed to fetch hypes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHypes();
  }, [user?.id]);

  return (
    <main className="min-h-screen bg-white text-black font-sans">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-8">
          <div className="bg-black/5 border border-black/10 rounded-xl p-4 text-right">
            <div className="font-bold text-xl mb-1">
              ★ Credits: {user?.credits || 0} XP
            </div>
            <div className="text-xs text-gray-600">
              Earn credits by uploading
              <br />
              Hypes & helping others
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-center mb-8 tracking-tight">
          Profile
        </h1>

        <div className="flex justify-center gap-4 mb-12">
          <Button className="bg-black text-white hover:bg-gray-800 px-8 font-bold rounded-full">
            Hypes
          </Button>
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-black hover:bg-black/5 px-8 rounded-full"
            onClick={() => setShowUploadModal(true)}
          >
            Upload
          </Button>
          <Link href="/analytics">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-black hover:bg-black/5 px-8 rounded-full"
            >
              Analytics
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {hypes.map((hype) => (
            <div key={hype._id} className="flex flex-col gap-2">
              <Link href={`/hypes/${hype._id}`}>
                <div className="bg-black/5 border border-black/10 aspect-9/16 rounded-xl flex items-center justify-center relative group cursor-pointer hover:bg-black/10 transition-colors overflow-hidden">
                  {hype.mediaType === "video" ? (
                    <video
                      src={hype.mediaUrl}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={hype.mediaUrl}
                      alt={hype.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {hype.mediaType !== "video" && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <Play className="w-12 h-12 text-white fill-white" />
                    </div>
                  )}
                </div>
              </Link>
              <div className="flex justify-between px-2 font-bold text-lg text-gray-700">
                <span className="truncate max-w-[150px]">{hype.title}</span>
                <div className="flex gap-4 text-sm items-center">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" /> {hype.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" /> {hype.comments.length}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Upload Button Card */}
          <div className="flex items-end">
            <Button
              className="w-full h-[calc(100%-2rem)] aspect-9/16 md:aspect-auto md:h-auto py-8 bg-transparent border-2 border-dashed border-black/20 text-gray-600 hover:text-black hover:border-black hover:bg-black/5 rounded-xl text-xl font-bold transition-all"
              onClick={() => setShowUploadModal(true)}
            >
              + Upload Hype
            </Button>
          </div>
        </div>

        <div className="text-center flex items-center justify-center gap-2 text-gray-600 font-bold">
          <Flame className="w-5 h-5 text-black fill-black" />
          Creators earn extra XP for daily uploads
        </div>
      </div>

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploadSuccess={() => {
          fetchHypes(); // Refresh list
        }}
      />
    </main>
  );
}
