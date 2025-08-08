"use client";

import { JSX, useEffect, useState } from "react";

type User = { email: string; credits: number };

function SidebarLink({
  label,
  active = false,
  icon,
}: {
  label: string;
  active?: boolean;
  icon: JSX.Element;
}) {
  return (
    <div
      className={[
        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition",
        active
          ? "bg-gradient-to-r from-primary-blue/20 to-accent-purple/20 ring-2 ring-primary-500/40"
          : "hover:bg-white/5",
      ].join(" ")}
    >
      <span className="opacity-90">{icon}</span>
      <span className={active ? "text-white" : "text-gray-light"}>{label}</span>
    </div>
  );
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // form
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
      <div className="mx-auto flex max-w-[1400px] gap-4 p-4">
        {/* SIDEBAR */}
        <aside className="hidden w-64 flex-col justify-between rounded-2xl bg-gray-mid/60 p-4 ring-1 ring-white/5 backdrop-blur md:flex">
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-1">
              <img
                src="/logo.png"
                alt="Lumen Voice Logo"
                className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14"
              />
              <span className="font-display text-lg font-semibold text-white md:text-xl lg:text-2xl">
                Lumen Voice
              </span>
            </div>


            <nav className="space-y-2">
              <SidebarLink
                label="Texto (em breve)"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 7h16M4 12h10M4 17h7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                }
              />
              <SidebarLink
                label="Imagem"
                active
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 15l-4-4-6 6-3-3-5 5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle cx="8" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                }
              />
              <SidebarLink
                label="Voz (em breve)"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 3v10a4 4 0 0 1-8 0M20 10a8 8 0 0 1-16 0"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                }
              />
              <SidebarLink
                label="Vídeo (em breve)"
                icon={
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 10l6-4v12l-6-4M3 6h12v12H3z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              />
            </nav>
          </div>

          <div className="mt-10 space-y-3 rounded-xl bg-gray-deep/60 p-3 ring-1 ring-white/5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-light">#121A12</span>
              <div className="h-4 w-4 rounded bg-gray-deep ring-1 ring-white/10" />
            </div>
            <div className="text-[11px] text-gray-light/80">
              Paleta escura com destaque em azul/roxo.
            </div>
          </div>
        </aside>

        {/* MAIN PANEL */}
        <main className="flex-1">
          <section className="rounded-2xl bg-gray-mid p-6 ring-1 ring-white/5 shadow-2xl">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="font-display text-2xl">Text-to-Image</h2>
                <p className="mt-1 text-sm text-gray-light">
                  Gere imagens a partir de descrições.
                </p>
              </div>

              {user && (
                <div className="text-right">
                  <div className="text-sm text-gray-light">{user.email}</div>
                  <div className="mt-1 inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs text-gray-light ring-1 ring-white/10">
                    Créditos:&nbsp;
                    <span className="font-semibold text-white">{user.credits}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-3 inline-flex rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold transition hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* FORM */}
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label
                  htmlFor="prompt"
                  className="mb-2 block text-sm font-medium text-gray-light"
                >
                  Prompt
                </label>
                <input
                  id="prompt"
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  required
                  className="w-full rounded-xl border border-white/10 bg-gray-deep px-4 py-3 text-white outline-none transition focus:ring-2 focus:ring-primary-500"
                  placeholder="Um astronauta gato flutuando no espaço, arte digital"
                />
              </div>

              <div>
                <label
                  htmlFor="negative_prompt"
                  className="mb-2 block text-sm font-medium text-gray-light"
                >
                  Negative Prompt
                </label>
                <input
                  id="negative_prompt"
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-gray-deep px-4 py-3 text-white outline-none transition focus:ring-2 focus:ring-accent-purple"
                  placeholder="texto, baixa qualidade, borrado"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="model"
                    className="mb-2 block text-sm font-medium text-gray-light"
                  >
                    Model
                  </label>
                  <select
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-gray-deep px-4 py-3 text-white outline-none transition focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="core">Core (1 crédito)</option>
                    <option value="ultra">Ultra (5 créditos)</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="aspect_ratio"
                    className="mb-2 block text-sm font-medium text-gray-light"
                  >
                    Aspect Ratio
                  </label>
                  <select
                    id="aspect_ratio"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-gray-deep px-4 py-3 text-white outline-none transition focus:ring-2 focus:ring-accent-purple"
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
                className="w-full rounded-xl bg-gradient-to-r from-primary-blue to-accent-purple px-5 py-3 font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-50"
              >
                {isGenerating ? "Gerando..." : "Generate"}
              </button>

              {error && (
                <p className="text-center text-red-500">{error}</p>
              )}
            </form>

            {generatedImageUrl && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-white">Resultado</h3>
                <img
                  src={generatedImageUrl}
                  alt="Imagem gerada"
                  className="mt-3 w-full rounded-xl ring-1 ring-white/10"
                />
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
