export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black font-sans flex flex-col items-center justify-center relative overflow-hidden">
      {/* Abstract Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-black rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="z-10 text-center space-y-8 max-w-4xl px-4">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter animate-in fade-in slide-in-from-bottom-10 duration-1000">
          Teen Hut
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
          A minimalist space for the next generation.
          <br />
          Connect. Create. Inspire.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
          <a
            href="/hypes"
            className="group relative px-8 py-3 bg-black text-white font-bold rounded-full overflow-hidden transition-transform hover:scale-105"
          >
            <span className="relative z-10">Start Exploring</span>
            <div className="absolute inset-0 bg-gray-800 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </a>

          <a
            href="/creator-dashboard"
            className="text-gray-600 hover:text-black transition-colors underline-offset-4 hover:underline"
          >
            For Creators
          </a>
        </div>
      </div>

      {/* Footer Minimal */}
      <div className="absolute bottom-8 text-gray-400 text-sm">
        © 2024 Teen Hut. Minimalist.
      </div>
    </main>
  );
}
