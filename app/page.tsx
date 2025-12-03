"use client";

import ParticleBackground from "@/components/ui/ParticleBackground";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import VideoCard from "@/components/video/VideoCard";
import LongVideoCard from "@/components/VideoCard";

interface Video {
  _id: string;
  title: string;
  author: string;
  mediaUrl: string;
  views: number;
  createdAt: string;
  mediaType: string;
}

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [longVideos, setLongVideos] = useState([]);

  useEffect(() => {
    const fetchHypes = async () => {
      try {
        const res = await fetch("/api/hypes");
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          const videoContent = data
            .filter((item: Video) => item.mediaType === "video")
            .slice(0, 4);
          setVideos(videoContent);
        } else {
          console.warn("API returned non-JSON response for hypes");
        }
      } catch (error) {
        console.error("Failed to fetch hypes", error);
      }
    };

    const fetchLongVideos = async () => {
      try {
        const res = await fetch("/api/videos");
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          setLongVideos(data.slice(0, 5));
        } else {
          console.warn("API returned non-JSON response for videos");
        }
      } catch (error) {
        console.error("Failed to fetch long videos", error);
      }
    };

    fetchHypes();
    fetchLongVideos();
  }, []);

  return (
    <main className="min-h-screen bg-white text-primary font-sans flex flex-col items-center relative overflow-x-hidden">
      <ParticleBackground />

      {/* Hero Section */}
      <div className="w-full min-h-screen flex flex-col items-center justify-center z-10 px-4 relative">
        <div className="text-center space-y-8 max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-bold tracking-tighter"
          >
            Teen Hut
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            A minimalist space for the next generation.
            <br />
            Connect. Create. Inspire.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
          >
            <Link
              href="/hypes"
              className="group relative px-8 py-3 bg-primary text-white font-bold rounded-full overflow-hidden inline-block transition-transform hover:scale-105"
            >
              <span className="relative z-10">Start Exploring</span>
              <div className="absolute inset-0 bg-primary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </Link>

            <Link
              href="/creator-dashboard"
              className="text-gray-600 hover:text-primary transition-colors underline-offset-4 hover:underline inline-block px-4 py-2"
            >
              For Creators
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Trending Videos Section */}
      {videos.length > 0 && (
        <div className="w-full max-w-7xl px-4 mt-20 mb-20 z-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Trending Videos
            </h2>
            <Link
              href="/videos"
              className="text-primary font-semibold hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video) => (
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
      )}

      {/* Long Videos Section */}
      <div className="w-full max-w-7xl mx-auto px-6 py-12 z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Long Videos</h2>
          <Link href="/videos" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
          {longVideos.length > 0 ? (
            longVideos.map((video: any) => (
              <div key={video._id} className="min-w-[300px]">
                <LongVideoCard video={video} />
              </div>
            ))
          ) : (
            <div className="min-w-[300px] bg-gray-100 rounded-xl aspect-video flex items-center justify-center text-gray-500">
              No videos yet
            </div>
          )}
        </div>
      </div>

      {/* Footer Minimal */}
      <div className="text-gray-400 text-sm pb-8 flex items-center gap-4">
        <span>© 2024 Teen Hut. Minimalist.</span>
        <Link href="/terms" className="hover:text-primary hover:underline">
          Terms and Conditions
        </Link>
      </div>
    </main>
  );
}
