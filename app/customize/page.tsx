import ThemeOption from "@/components/theme/ThemeSwitcher";
import { Button } from "@/components/ui/button";
import { Palette, Heart } from "lucide-react";

export default function CustomizePage() {
  const themes = [
    {
      name: "Teal Classic",
      description: "Calm, clean, and balanced",
      colorClass: "bg-teal-900",
    },
    {
      name: "Sunset Mode",
      description: "Orange + pink gradient for creative users",
      colorClass: "bg-gradient-to-br from-orange-400 to-pink-500",
      isActive: true,
    },
    {
      name: "Midnight Mode",
      description: "Dark navy with soft teal text",
      colorClass: "bg-slate-900",
    },
    {
      name: "Neon Mode",
      description: "Electric blue and bright accents",
      colorClass: "bg-blue-900",
    },
  ];

  return (
    <main className="min-h-screen bg-teal-900 text-white font-sans">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Palette className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl font-bold">Customize Your TeenHut Look</h1>
          </div>
          <p className="text-xl text-teal-200">
            Switch themes instantly — make your vibe match your tribe!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {themes.map((theme, index) => (
            <ThemeOption
              key={index}
              name={theme.name}
              description={theme.description}
              colorClass={theme.colorClass}
              isActive={theme.isActive}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button className="bg-teal-700 hover:bg-teal-600 text-white px-8 py-6 text-lg rounded-xl font-bold shadow-lg">
            ✨ Save Theme
          </Button>
          <button className="text-teal-300 text-sm hover:underline">
            Reset to Default
          </button>
        </div>

        <div className="text-center mt-16 text-teal-200/60 text-sm flex items-center justify-center gap-1">
          @teenhut.home | Built by Teens, for Teens{" "}
          <Heart className="w-3 h-3 text-green-400 fill-green-400" />
        </div>
      </div>
    </main>
  );
}
