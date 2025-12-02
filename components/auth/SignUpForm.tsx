"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const [role, setRole] = useState("creator");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // Added password field
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password, role }),
      });

      if (res.ok) {
        alert("Sign up successful! Please login.");
        router.push("/login");
      } else {
        const data = await res.json();
        alert(data.error || "Sign up failed");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black/5 p-8 rounded-2xl border border-black/10 w-full max-w-md backdrop-blur-md shadow-2xl">
      <h2 className="text-3xl font-bold text-black text-center mb-8">
        Sign up
      </h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700">
            Basic Info
          </Label>
          <Input
            id="email"
            placeholder="Your email"
            className="bg-white/50 border-black/20 text-black placeholder:text-gray-500 focus:border-black transition-colors"
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
            placeholder="Create Password"
            className="bg-white/50 border-black/20 text-black placeholder:text-gray-500 focus:border-black transition-colors"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-700">Choose Role</Label>
          <div className="grid grid-cols-3 gap-2">
            {["Creator", "Mentor", "Explorer"].map((r) => (
              <button
                key={r}
                onClick={() => setRole(r.toLowerCase())}
                className={`py-2 rounded-lg text-sm font-bold transition-all ${
                  role === r.toLowerCase()
                    ? "bg-black text-white shadow-lg scale-105"
                    : "bg-black/10 text-gray-600 hover:bg-black/20 hover:text-black"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username" className="text-gray-700">
            Create Username
          </Label>
          <Input
            id="username"
            placeholder="Create Username"
            className="bg-white/50 border-black/20 text-black placeholder:text-gray-500 focus:border-black transition-colors"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <Button
          onClick={handleSignUp}
          className="w-full bg-black hover:bg-gray-800 text-white font-bold py-6 text-lg rounded-xl mt-4 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </Button>
      </div>
    </div>
  );
}
