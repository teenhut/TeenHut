import Link from "next/link";
import { Play, Clock, Eye } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface VideoCardProps {
  id: string;
  title: string;
  author: string;
  mediaUrl: string;
  views?: number;
  createdAt?: string | Date;
  duration?: string; // Optional duration if we had it
}

export default function VideoCard({
  id,
  title,
  author,
  mediaUrl,
  views = 0,
  createdAt,
  duration = "0:00",
}: VideoCardProps) {
  return (
    <Link href={`/videos/${id}`} className="group block">
      <div className="flex flex-col gap-3">
        {/* Thumbnail Container */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
          {mediaUrl ? (
            <video
              src={mediaUrl}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              muted
              loop
              playsInline
              onMouseOver={(e) => e.currentTarget.play()}
              onMouseOut={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <Play className="w-12 h-12 text-gray-400" />
            </div>
          )}

          {/* Duration Badge */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-1.5 py-0.5 rounded">
            {duration}
          </div>
        </div>

        {/* Info */}
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-sm font-bold text-gray-500 uppercase">
            {author[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {title}
            </h3>
            <div className="text-sm text-gray-600 mt-1">
              <p className="hover:text-gray-900">{author}</p>
              <div className="flex items-center gap-1 text-xs mt-0.5">
                <span>{views} views</span>
                <span>•</span>
                <span>
                  {createdAt
                    ? formatDistanceToNow(new Date(createdAt), {
                        addSuffix: true,
                      })
                    : "Recently"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
