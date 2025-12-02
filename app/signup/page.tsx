import Link from "next/link";
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-white font-sans relative overflow-hidden flex flex-col">
      {/* Abstract Background Animation */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-black rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2 text-black">
          <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border-2 border-black" />
          </div>
          <span className="text-xl font-bold">Teen Hut</span>
        </div>
        <div className="flex gap-4 text-black font-bold">
          <Link href="/login" className="hover:text-gray-600 transition-colors">
            Login
          </Link>
          <Link
            href="/login"
            className="bg-black text-white px-4 py-1 rounded-full hover:bg-gray-800 transition-colors"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-grow flex items-center justify-center px-4 py-12">
        <SignUpForm />
      </div>
    </main>
  );
}
