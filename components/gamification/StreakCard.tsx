import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StreakCardProps {
  days: number;
  onClaim: () => void;
}

export default function StreakCard({ days, onClaim }: StreakCardProps) {
  return (
    <div className="bg-primary rounded-2xl p-8 flex items-center justify-between shadow-xl">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Flame className="w-8 h-8 text-white fill-white" />
        </div>
        <h2 className="text-2xl font-bold text-white">{days} Day Streak</h2>
        <Button
          onClick={onClaim}
          className="bg-white hover:bg-gray-200 text-primary mt-2 font-bold"
        >
          Claim Reward
        </Button>
      </div>

      <div className="flex gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-orange-200 border-4 border-orange-300 flex items-center justify-center">
            <div className="w-8 h-8 bg-orange-400 rounded-full opacity-50" />
          </div>
          <span className="text-white font-bold">Bronze</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-slate-300 border-4 border-slate-400 flex items-center justify-center">
            <div className="w-8 h-8 bg-slate-500 rounded-full opacity-50" />
          </div>
          <span className="text-white font-bold">Silver</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-full bg-cyan-400 border-4 border-cyan-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.5)]">
            <div className="w-8 h-8 bg-cyan-100 rounded-full opacity-50 rotate-45" />
          </div>
          <span className="text-white font-bold">Diamond</span>
        </div>
      </div>
    </div>
  );
}
