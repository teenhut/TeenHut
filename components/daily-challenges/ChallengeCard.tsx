"use client";

interface ChallengeCardProps {
  title: string;
  description: string;
  points: number;
}

export default function ChallengeCard({
  title,
  description,
  points,
}: ChallengeCardProps) {
  return (
    <div
      className="bg-teal-800/50 p-4 rounded-lg flex items-center justify-between hover:bg-teal-800/70 transition-colors cursor-pointer group"
      onClick={() => alert(`Started challenge: ${title}`)}
    >
      <div>
        <h3 className="text-lg font-bold text-white group-hover:text-teal-200 transition-colors">
          {title}
        </h3>
        <p className="text-teal-200/80 text-sm">{description}</p>
      </div>
      <div className="text-right">
        <span className="block text-xl font-bold text-white">{points}</span>
        <span className="text-xs text-teal-200/80">points</span>
      </div>
    </div>
  );
}
