"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Falha ao criar a conta.");
      }

      alert(
        "Cadastro realizado com sucesso! Você será redirecionado para a página de login."
      );
      window.location.href = "/login";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-deep text-white">
      <div className="w-full max-w-md rounded-2xl bg-gray-mid p-8 shadow-2xl">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold">Lumen Voice</h1>
          <p className="mt-2 text-gray-light">Crie a sua conta para começar</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="relative">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-light/20 bg-gray-deep px-4 py-3 text-white outline-none transition-all focus:ring-2 focus:ring-accent-purple"
              placeholder="seu@email.com"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Senha
            </label>
            <input
              id="password"
              type="password"
              minLength={6}
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-light/20 bg-gray-deep px-4 py-3 text-white outline-none transition-all focus:ring-2 focus:ring-accent-purple"
              placeholder="Crie uma senha"
            />
          </div>

          {error && (
            <p className="text-center text-sm font-semibold text-red-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-gradient-to-r from-primary-blue to-accent-purple px-4 py-3 font-bold text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-mid disabled:opacity-50"
          >
            {isLoading ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-light">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary-blue underline-offset-4 hover:underline"
          >
            Faça login
          </Link>
        </p>
      </div>
    </main>
  );
}
