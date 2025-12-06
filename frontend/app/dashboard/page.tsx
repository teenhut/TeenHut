import StatCard from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Users, MessageSquare, Video, Star } from "lucide-react";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-teal-900 text-white font-sans">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold hidden md:block">Dashboard</h1>{" "}
          {/* Hidden on mobile to match design? Or just header */}
          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
            <div className="bg-teal-800/80 px-4 py-2 rounded-lg text-sm font-bold">
              Certified Mentor
            </div>
            <div className="bg-teal-800/80 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
              Mentor XP: 2340{" "}
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <Button
            variant="secondary"
            className="bg-teal-800 hover:bg-teal-700 text-white border-0 gap-2"
          >
            <Users className="w-4 h-4" /> My Learners
          </Button>
          <Button
            variant="secondary"
            className="bg-teal-800 hover:bg-teal-700 text-white border-0 gap-2"
          >
            <MessageSquare className="w-4 h-4" /> Chat Rooms
          </Button>
          <Button
            variant="secondary"
            className="bg-teal-800 hover:bg-teal-700 text-white border-0 gap-2"
          >
            <Video className="w-4 h-4" /> Host Session
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Coding" xp={130} progress={70} />
          <StatCard title="Communication" xp={85} progress={45} />

          <div className="bg-teal-800/50 rounded-lg p-6 flex flex-col justify-between">
            <h3 className="font-bold text-lg mb-4">Top Mentors of the Week</h3>
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-teal-600 border-2 border-teal-400"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="bg-teal-950/50 p-6 rounded-xl text-center">
          <h2 className="text-xl font-bold">
            Mentorship is the shortcut to mastery 🔥
          </h2>
        </div>
      </div>
    </main>
  );
}
