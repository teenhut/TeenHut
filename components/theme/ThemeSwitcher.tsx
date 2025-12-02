import { Button } from '@/components/ui/button';

interface ThemeOptionProps {
  name: string;
  description: string;
  colorClass: string; // e.g., "bg-teal-900" or gradient
  isActive?: boolean;
}

export default function ThemeOption({ name, description, colorClass, isActive }: ThemeOptionProps) {
  return (
    <div className={`rounded-xl overflow-hidden ${isActive ? 'ring-4 ring-teal-400' : ''}`}>
      <div className={`${colorClass} h-32 flex items-center justify-center p-4 text-center`}>
        <div className="text-white">
          <h3 className="font-bold text-lg mb-1">{name}</h3>
          <p className="text-xs opacity-80">{description}</p>
        </div>
      </div>
      <div className="bg-teal-950 p-4 text-center">
        <Button variant="secondary" className="bg-teal-800/50 hover:bg-teal-800 text-white w-full">
          Preview
        </Button>
      </div>
    </div>
  );
}
