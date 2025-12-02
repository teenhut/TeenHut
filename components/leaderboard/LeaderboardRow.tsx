import { Star } from "lucide-react";

interface LeaderboardRowProps {
  rank: number;
  name: string;
  xp: number;
  avatarColor?: string; // Tailwind class for bg color
}

export default function LeaderboardRow({
  rank,
  name,
  xp,
  avatarColor = "bg-gray-200",
}: LeaderboardRowProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between mb-4 hover:bg-gray-50 transition-colors shadow-sm">
      <div className="flex items-center gap-6">
        <span className="text-3xl font-bold text-black w-8 text-center">
          {rank}
        </span>

        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-full ${avatarColor} border-2 border-gray-100 flex items-center justify-center overflow-hidden`}
          >
            {/* Placeholder Avatar */}
            <div className="w-full h-full bg-gray-200" />
          </div>
          <span className="text-xl font-bold text-black">{name}</span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-bold">XP</span>
          <span className="text-xl font-bold text-black">
            {xp.toLocaleString()}
          </span>
        </div>
        <Star
          className={`w-6 h-6 ${
            rank === 1
              ? "text-yellow-400 fill-yellow-400"
              : rank === 2
              ? "text-slate-400 fill-slate-400"
              : rank === 3
              ? "text-orange-400 fill-orange-400"
              : "text-gray-300"
          }`}
        />
      </div>
    </div>
  );
}
