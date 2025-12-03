"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import VideoPlayer from "@/components/video/VideoPlayer";
import VideoCard from "@/components/video/VideoCard";
import { Loader2, ThumbsUp, MessageSquare, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/context/AuthContext";

interface Video {
  _id: string;
  title: string;
  author: string;
  mediaUrl: string;
  views: number;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  mediaType: string;
  comments: any[];
}

export default function VideoDetailPage() {
  const params = useParams();
  const { user } = useAuth();
  const [video, setVideo] = useState<Video | null>(null);
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchVideoData();
      fetchRelatedVideos();
    }
  }, [params.id, user]);

  const fetchVideoData = async () => {
    try {
      // We'll use the existing hypes API but filter client-side for now since we don't have a single item endpoint yet
      // Ideally we should have /api/hypes/:id
      // Wait, looking at server.js, there isn't a specific GET /api/hypes/:id, but we can fetch all and find it.
      // Or we can implement a new endpoint. For now, let's fetch all and find.
      // Actually, let's try to see if we can add a specific endpoint or just fetch all.
      // Fetching all is inefficient but works for MVP.

      const res = await fetch(`/api/hypes?userId=${user?.id || ""}`);
      if (res.ok) {
        const data = await res.json();
        const foundVideo = data.find((v: Video) => v._id === params.id);
        if (foundVideo) {
          setVideo(foundVideo);
          // Increment view count
          fetch(`/api/hypes/${params.id}/view`, { method: "POST" });
        }
      }
    } catch (error) {
      console.error("Failed to fetch video", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedVideos = async () => {
    try {
      const res = await fetch("/api/hypes");
      if (res.ok) {
        const data = await res.json();
        // Filter for other videos
        const others = data
          .filter((v: Video) => v.mediaType === "video" && v._id !== params.id)
          .slice(0, 5);
        setRelatedVideos(others);
      }
    } catch (error) {
      console.error("Failed to fetch related videos", error);
    }
  };

  const handleLike = async () => {
    if (!user || !video) return;

    // Optimistic update
    const newIsLiked = !video.isLiked;
    const newLikes = newIsLiked ? video.likes + 1 : video.likes - 1;

    setVideo({ ...video, isLiked: newIsLiked, likes: newLikes });

    try {
      await fetch(`/api/hypes/${video._id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });
    } catch (error) {
      // Revert on error
      setVideo({ ...video, isLiked: !newIsLiked, likes: video.likes });
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !video || !commentText.trim()) return;

    try {
      const res = await fetch(`/api/hypes/${video._id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: commentText,
          author: user.username,
          userId: user.id,
        }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setVideo({
          ...video,
          comments: [newComment, ...video.comments],
        });
        setCommentText("");
      }
    } catch (error) {
      console.error("Failed to post comment", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Video not found</h1>
        <Button variant="link" onClick={() => window.history.back()}>
          Go back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-6 flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <VideoPlayer src={video.mediaUrl} autoPlay />

        <div className="mt-4">
          <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-3 gap-4 border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500 uppercase">
                {video.author[0]}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{video.author}</h3>
                <p className="text-xs text-gray-500">
                  {video.views} views •{" "}
                  {formatDistanceToNow(new Date(video.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={video.isLiked ? "default" : "secondary"}
                className={`rounded-full gap-2 ${
                  video.isLiked
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={handleLike}
              >
                <ThumbsUp
                  className={`w-4 h-4 ${video.isLiked ? "fill-current" : ""}`}
                />
                {video.likes}
              </Button>
              <Button
                variant="secondary"
                className="rounded-full gap-2 bg-gray-100 text-gray-700"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              {video.comments.length} Comments
            </h3>

            {user && (
              <form onSubmit={handleComment} className="flex gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-primary uppercase">
                  {user.username?.[0]}
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <div className="flex justify-end mt-2">
                    <Button
                      type="submit"
                      disabled={!commentText.trim()}
                      size="sm"
                    >
                      Comment
                    </Button>
                  </div>
                </div>
              </form>
            )}

            <div className="space-y-6">
              {video.comments.map((comment, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-bold text-gray-500 uppercase">
                    {comment.author[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">
                        {comment.author}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1 text-sm">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Recommendations */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <h3 className="font-bold text-lg mb-4">Watch Next</h3>
        <div className="flex flex-col gap-4">
          {relatedVideos.map((video) => (
            <VideoCard
              key={video._id}
              id={video._id}
              title={video.title}
              author={video.author}
              mediaUrl={video.mediaUrl}
              views={video.views}
              createdAt={video.createdAt}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
