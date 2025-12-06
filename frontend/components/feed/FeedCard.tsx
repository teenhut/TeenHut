"use client";

import { Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeedCardProps {
  title: string;
  author: string;
  xp: number;
  image?: string; // Placeholder for image URL
  className?: string;
}

export default function FeedCard({
  title,
  author,
  xp,
  image,
  className,
}: FeedCardProps) {
  return (
    <Card
      className={`overflow-hidden border-0 bg-teal-800/30 text-white hover:bg-teal-800/50 transition-colors cursor-pointer ${className}`}
      onClick={() => alert(`Viewing post: ${title}`)}
    >
      <div className="aspect-video bg-teal-900 relative">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-teal-700">
            Image Placeholder
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{title}</h3>
        <div className="flex items-center justify-between text-sm text-teal-200">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-teal-600" />
            <span>{author}</span>
          </div>
          <div className="flex items-center gap-1 text-orange-400">
            <Flame className="w-3 h-3 fill-orange-400" />
            <span>{xp} XP</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
