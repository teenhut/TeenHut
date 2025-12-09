import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Play } from "lucide-react";

interface VideoCardProps {
  video: {
    _id: string;
    title: string;
    thumbnailUrl?: string;
    views: number;
    createdAt: string;
    duration?: string;
    uploader?: {
      username: string;
      profilePicture?: string;
    };
  };
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/videos/${video._id}`} className="group block">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-3">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
            <Play className="w-12 h-12 opacity-50" />
          </div>
        )}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
            {video.duration}
          </div>
        )}
      </div>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-gray-200 overflow-hidden">
            {video.uploader?.profilePicture ? (
              <img
                src={video.uploader.profilePicture}
                alt={video.uploader.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                {video.uploader?.username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          <div className="text-sm text-gray-600 mt-1">
            {video.uploader?.username || "Unknown"}
          </div>
          <div className="text-sm text-gray-600 flex items-center gap-1">
            <span>{video.views} views</span>
            <span>•</span>
            <span>
              {formatDistanceToNow(new Date(video.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
