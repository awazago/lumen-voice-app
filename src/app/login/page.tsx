"use client";

import { useState } from "react";
import Link from "next/link";
import AuthCard from "@/components/AuthCard";
import FormField from "@/components/FormField";
import AuthBackground from "@/components/AuthBackground";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch("http://127.0.0.1:8000/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Falha no login");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.access_token);
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-gray-deep px-4 text-white">
      <AuthBackground />

      <AuthCard
        title="Lumen Voice"
        footer={
          <>
            Não tem uma conta?{" "}
            <Link href="/signup" className="font-semibold text-primary-400 underline-offset-4 hover:underline">
              Sign Up
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormField
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-center text-sm font-semibold text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-full bg-gradient-to-r from-primary-blue to-accent-purple px-6 py-3 font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Entrando..." : "Sign In"}
          </button>
        </form>
      </AuthCard>
    </main>
  );
}
