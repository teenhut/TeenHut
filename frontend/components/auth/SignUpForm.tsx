"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function SignUpForm() {
  const [role, setRole] = useState("creator");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSignUp = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.requires2FA) {
          setRequires2FA(true);
        } else {
          // Should not happen with new flow
          alert("Sign up successful! Please login.");
          router.push("/login");
        }
      } else {
        alert(data.error || "Sign up failed");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: twoFactorCode }),
      });

      const data = await res.json();

      if (res.ok) {
        // Auto-login after successful verification
        login(data);
      } else {
        alert(data.error || "Verification failed");
      }
    } catch (error) {
      alert("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (requires2FA) {
    return (
      <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 w-full max-w-md backdrop-blur-md shadow-2xl">
        <h2 className="text-3xl font-bold text-primary text-center mb-8">
          Verify Email
        </h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="code" className="text-gray-700">
              Enter Verification Code
            </Label>
            <p className="text-sm text-gray-500">We sent a code to {email}</p>
            <Input
              id="code"
              type="text"
              placeholder="123456"
              className="bg-white/50 border-primary/20 text-primary placeholder:text-gray-500 focus:border-primary transition-colors text-center text-2xl tracking-widest"
              required
              maxLength={6}
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
            />
          </div>
          <Button
            onClick={handleVerify2FA}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg rounded-xl mt-4 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Code"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10 w-full max-w-md backdrop-blur-md shadow-2xl">
      <h2 className="text-3xl font-bold text-primary text-center mb-8">
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
            className="bg-white/50 border-primary/20 text-primary placeholder:text-gray-500 focus:border-primary transition-colors"
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
            className="bg-white/50 border-primary/20 text-primary placeholder:text-gray-500 focus:border-primary transition-colors"
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
                    ? "bg-primary text-white shadow-lg scale-105"
                    : "bg-primary/10 text-gray-600 hover:bg-primary/20 hover:text-primary"
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
            className="bg-white/50 border-primary/20 text-primary placeholder:text-gray-500 focus:border-primary transition-colors"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="flex items-start gap-2 pt-2">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <Label
            htmlFor="terms"
            className="text-sm text-gray-600 leading-tight cursor-pointer"
          >
            By clicking this option you are agreeing to the{" "}
            <Link
              href="/terms"
              className="text-primary hover:underline font-semibold"
              target="_blank"
            >
              Terms and Conditions
            </Link>
          </Label>
        </div>

        <Button
          onClick={handleSignUp}
          className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-6 text-lg rounded-xl mt-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !termsAccepted}
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </Button>
      </div>
    </div>
  );
}
