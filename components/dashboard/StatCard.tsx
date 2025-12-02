import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  xp: number;
  progress: number; // 0 to 100
  icon?: React.ReactNode; // Placeholder for avatar
}

export default function StatCard({ title, xp, progress, icon }: StatCardProps) {
  return (
    <Card className="bg-teal-800/50 border-0 text-white">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center overflow-hidden">
            {icon || <div className="w-full h-full bg-teal-400" />}
          </div>
          <h3 className="font-bold text-xl">{title}</h3>
        </div>
        
        <div className="w-full bg-teal-900/50 rounded-full h-2.5 mb-2">
          <div 
            className="bg-teal-400 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-sm text-teal-200 font-bold">XP {xp}</p>
      </CardContent>
    </Card>
  );
}
