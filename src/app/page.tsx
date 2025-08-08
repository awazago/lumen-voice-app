"use client";

import { useEffect, useState } from "react";

type User = {
  email: string;
  credits: number;
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [prompt, setPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [model, setModel] = useState("core");
  const [aspectRatio, setAspectRatio] = useState("1:1");

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUser({ email: decodedToken.sub, credits: 10 });
    } catch {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError("");
    setGeneratedImageUrl("");

    const token = localStorage.getItem("accessToken");

    try {
      const body = {
        prompt,
        negative_prompt: negativePrompt,
        model,
        aspect_ratio: aspectRatio,
      };

      const response = await fetch("http://127.0.0.1:8000/images/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Falha ao gerar a imagem.");
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setGeneratedImageUrl(imageUrl);

      const cost = model === "core" ? 1 : 5;
      setUser((u) => (u ? { ...u, credits: u.credits - cost } : u));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-deep text-white">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-deep text-white">
      <header className="flex items-center justify-between bg-gray-mid px-6 py-4">
        <h1 className="font-display text-2xl font-bold">Lumen Voice</h1>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-gray-light">{user.email}</span>
            <span className="rounded-full bg-primary-500 px-3 py-1 text-sm">
              Créditos: {user.credits}
            </span>
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-4 py-2 font-bold text-white transition-colors hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-2xl p-6">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label
              htmlFor="prompt"
              className="block text-lg font-medium text-gray-light"
            >
              O que você quer criar?
            </label>
            <textarea
              id="prompt"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              className="mt-2 w-full rounded-md border border-gray-light/20 bg-gray-mid px-3 py-2 text-white outline-none transition-all focus:ring-2 focus:ring-primary-500"
              placeholder="Ex: Um gato astronauta a flutuar no espaço, arte digital"
            />
          </div>

          <div>
            <label
              htmlFor="negative_prompt"
              className="block text-sm font-medium text-gray-light"
            >
              O que você não quer ver? (Prompt Negativo)
            </label>
            <input
              id="negative_prompt"
              type="text"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-light/20 bg-gray-mid px-3 py-2 text-white outline-none transition-all focus:ring-2 focus:ring-accent-purple"
              placeholder="Ex: texto, má qualidade, desfocado"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="model"
                className="block text-sm font-medium text-gray-light"
              >
                Modelo
              </label>
              <select
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-light/20 bg-gray-mid px-3 py-2 text-white outline-none transition-all focus:ring-2 focus:ring-primary-500"
              >
                <option value="core">Core (1 crédito)</option>
                <option value="ultra">Ultra (5 créditos)</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="aspect_ratio"
                className="block text-sm font-medium text-gray-light"
              >
                Proporção
              </label>
              <select
                id="aspect_ratio"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-light/20 bg-gray-mid px-3 py-2 text-white outline-none transition-all focus:ring-2 focus:ring-primary-500"
              >
                <option value="1:1">Quadrado (1:1)</option>
                <option value="16:9">Paisagem (16:9)</option>
                <option value="9:16">Retrato (9:16)</option>
                <option value="4:5">Retrato Social (4:5)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full rounded-md bg-primary-500 px-4 py-3 font-bold text-white transition-colors hover:bg-primary-600 disabled:bg-gray-600"
          >
            {isGenerating ? "Gerando..." : "Gerar Imagem"}
          </button>
        </form>

        {error && <p className="mt-4 text-center text-red-500">{error}</p>}

        {generatedImageUrl && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold">A sua criação:</h3>
            <img
              src={generatedImageUrl}
              alt="Imagem gerada"
              className="mt-4 w-full rounded-lg"
            />
          </div>
        )}
      </main>
    </div>
  );
}
