"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response data:", data);

      if (res.ok) {
        login(data);
      } else {
        alert(data.error || "Login failed");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white font-sans relative overflow-hidden flex flex-col">
      {/* Abstract Background Animation */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2 text-primary">
          <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
            <div className="w-4 h-4 rounded-full border-2 border-primary" />
          </div>
          <span className="text-xl font-bold">Teen Hut</span>
        </div>
        <div className="flex gap-4 text-primary font-bold">
          <Link
            href="/signup"
            className="hover:text-gray-600 transition-colors"
          >
            Sign Up
          </Link>
          <Link
            href="/signup"
            className="bg-primary text-white px-4 py-1 rounded-full hover:bg-primary/90 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="relative z-10 flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 w-full max-w-md backdrop-blur-md shadow-2xl">
          <h2 className="text-3xl font-bold text-primary text-center mb-8">
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email"
                className="bg-white/50 border-primary/20 text-primary placeholder:text-gray-500 focus:border-primary transition-colors"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                className="bg-white/50 border-primary/20 text-primary placeholder:text-gray-500 focus:border-primary transition-colors"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg rounded-xl mt-4 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
