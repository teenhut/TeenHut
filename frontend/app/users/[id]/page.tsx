"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Play, Heart, MessageCircle, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/lib/api-config";

interface Hype {
  _id: string;
  title: string;
  mediaUrl: string;
  mediaType: string;
  likes: number;
  comments: any[];
}

interface UserProfile {
  id: string;
  username: string;
  credits: number;
  streak: number;
  stats: {
    likesGiven: number;
    hypesUploaded: number;
  };
  followersCount: number;
  followingCount: number;
  profilePicture?: string;
}

export default function PublicProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hypes, setHypes] = useState<Hype[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProfile();
      fetchHypes();
    }
  }, [id]);

  useEffect(() => {
    if (currentUser && profile) {
      // Check if current user is following this profile
      // This requires fetching current user's following list or checking via API
      // For simplicity, we'll assume the follow button state is managed locally for now
      // or we could fetch the follow status.
      // Ideally, GET /api/users/:id should return 'isFollowing' relative to the requester.
      // But for now, let's just fetch the current user to see if they follow.
      // Since we don't have that easily, we'll skip initial state check or add it later.
    }
  }, [currentUser, profile]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const fetchHypes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/hypes?creatorId=${id}`);
      const data = await res.json();
      setHypes(data);
    } catch (error) {
      console.error("Failed to fetch hypes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!currentUser) {
      alert("Please login to follow");
      return;
    }

    // Optimistic toggle
    setIsFollowing((prev) => !prev);

    try {
      await fetch(`${API_BASE_URL}/api/users/${id}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentUserId: currentUser.id }),
      });
      fetchProfile(); // Refresh stats
    } catch (error) {
      console.error("Follow error", error);
      setIsFollowing((prev) => !prev);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center">
        User not found
      </div>
    );

  return (
    <main className="min-h-screen bg-white text-primary font-sans">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal-400 to-blue-500 p-[3px] mb-4">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-primary uppercase">
                  {profile.username[0]}
                </span>
              )}
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-2">{profile.username}</h1>

          <div className="flex gap-6 text-sm mb-6">
            <div className="text-center">
              <div className="font-bold text-lg">{profile.followersCount}</div>
              <div className="text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{profile.followingCount}</div>
              <div className="text-gray-500">Following</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">
                {profile.stats.likesGiven}
              </div>
              <div className="text-gray-500">Likes</div>
            </div>
          </div>

          {currentUser?.id !== profile.id && (
            <Button
              onClick={handleFollow}
              className={`rounded-full px-8 ${
                isFollowing
                  ? "bg-gray-200 text-primary hover:bg-gray-300"
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>

        <div className="border-t border-gray-200 mb-8" />

        {/* Hypes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          {hypes.map((hype) => (
            <div key={hype._id} className="flex flex-col gap-2">
              <Link href={`/hypes/${hype._id}`}>
                <div className="bg-primary/5 border border-primary/10 aspect-9/16 rounded-xl flex items-center justify-center relative group cursor-pointer hover:bg-primary/10 transition-colors overflow-hidden">
                  {hype.mediaType === "video" ? (
                    <video
                      src={hype.mediaUrl}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={hype.mediaUrl}
                      alt={hype.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-primary/20">
                    <Play className="w-12 h-12 text-white fill-white" />
                  </div>
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
          {hypes.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">
              No Hypes uploaded yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
