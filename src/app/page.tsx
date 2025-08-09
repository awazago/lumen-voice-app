"use client";

import { JSX, useEffect, useState } from "react";
import Image from 'next/image';
import Link from "next/link";

type User = { email: string; credits: number; plan: string; };

const examplePrompts = [
  {
    image: "/examples/pato.png", // Garanta que esta imagem está em public/examples/
    prompt: "Um pato usando óculos escuros e andando de bicicleta",
    negative_prompt: "",
  },
  {
    image: "/examples/policial.png", // Garanta que esta imagem está em public/examples/
    prompt: "A realistic scene of a police officer wearing a black tactical uniform, holding a shotgun in a ready position, standing in front of a modern black-and-white police car with flashing red and blue lights. The officer has a serious expression, wearing a bulletproof vest, duty belt, and black cap. The background shows an urban street at night, illuminated by streetlights and the glow from the police car's lights. Highly detailed, ultra-realistic style.",
    negative_prompt: "low resolution, blurry, cartoonish, distorted proportions, missing limbs, incorrect weapon design, unrealistic lighting, extra fingers, text, watermark",
  },
  {
    image: "/examples/tecladista.png", // Garanta que esta imagem está em public/examples/
    prompt: "A man playing keyboard on Moon with Earth planet as background",
    negative_prompt: "",
  },
];

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
          ? "bg-gradient-to-r from-primary-blue/20 to-accent-purple/20 ring-2 ring-primary-blue/40"
          : "hover:bg-white/5",
      ].join(" ")}
    >
      <span className="opacity-90">{icon}</span>
      <span className={active ? "text-white" : "text-gray-light"}>{label}</span>
    </div>
  );
}

function HelpTooltip({ text }: { text: string }) {
  return (
    <div className="group relative flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-light/50 cursor-pointer"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
      <div className="absolute bottom-full mb-2 w-64 rounded-lg bg-gray-deep p-3 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 z-10 ring-1 ring-white/10">
        {text}
      </div>
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
    const fetchUserData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Falha na autenticação');
        }
        const userData: User = await response.json();
        setUser(userData);
      } catch (e) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsGenerating(true);
    setError("");
    setGeneratedImageUrl("");
    const token = localStorage.getItem("accessToken");
    const cost = model === "core" ? 1 : 5;
    if (user.credits < cost) {
      setError(`Créditos insuficientes. Este modelo custa ${cost} créditos.`);
      setIsGenerating(false);
      return;
    }
    try {
      const body = {
        prompt,
        negative_prompt: negativePrompt,
        model,
        aspect_ratio: aspectRatio,
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images/generate`, {
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
      
      // Busca os dados do utilizador novamente para obter o saldo de créditos atualizado
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if(userResponse.ok) {
        const updatedUser = await userResponse.json();
        setUser(updatedUser);
      }

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseExample = (example: typeof examplePrompts[0]) => {
    setPrompt(example.prompt);
    setNegativePrompt(example.negative_prompt);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading || !user) {
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
              <Image
                width={60}
                height={60}
                src="/logo.png"
                alt="Lumen Voice Logo"
                className="h-10 w-10 md:h-12 md:w-12 lg:h-14 lg:w-14"
              />
              <span className="font-display text-lg font-semibold text-white md:text-xl lg:text-2xl">
                Lumen Voice
              </span>
            </div>
            <nav className="space-y-2">
              <SidebarLink label="Texto (em breve)" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 7h16M4 12h10M4 17h7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>} />
              <SidebarLink label="Imagem" active icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 15l-4-4-6 6-3-3-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><circle cx="8" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" /></svg>} />
              <SidebarLink label="Voz (em breve)" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3v10a4 4 0 0 1-8 0M20 10a8 8 0 0 1-16 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>} />
              <SidebarLink label="Vídeo (em breve)" icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 10l6-4v12l-6-4M3 6h12v12H3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
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

              {/* ▼▼▼ ÁREA ATUALIZADA ▼▼▼ */}
              <div className="flex items-center space-x-4 text-sm">
                <Link href="/pricing" className="font-semibold text-primary-blue hover:text-white transition-colors">
                  Planos & Upgrade
                </Link>
                <div className="flex items-center space-x-2 rounded-full bg-white/5 px-3 py-1.5 ring-1 ring-white/10">
                  <Link href="/account" className="text-gray-light hover:text-white transition-colors">
                    {user.email}
                  </Link>
                  <span className="text-primary-blue font-semibold">({user.credits})</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-red-600 px-3 py-1.5 font-semibold transition hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
              {/* ▲▲▲ FIM DA ÁREA ATUALIZADA ▲▲▲ */}

            </div>
            {user && user.credits < 10 && user.plan === 'free' && (
              <div className="bg-yellow-900/50 border border-yellow-400 text-yellow-300 px-4 py-3 rounded-lg text-center mb-6">
                <p><strong>Atenção:</strong> Você tem poucos créditos restantes. <Link href="/pricing" className="font-bold underline hover:text-white">Faça um upgrade</Link> para continuar a criar sem limites.</p>
              </div>
            )}
            
            {/* FORM */}
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-light">
                    Prompt <span className="text-xs opacity-70">(preferencialmente em inglês)</span>
                  </label>
                  <HelpTooltip text="Descreva em detalhe a imagem que você quer criar. Quanto mais específico, melhor o resultado. Ex: 'Um cão feliz a usar óculos de sol numa praia, arte digital'." />
                </div>
                <input
                  id="prompt" type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} required
                  className="w-full rounded-xl border border-white/10 bg-gray-deep px-4 py-3 text-white outline-none transition focus:ring-2 focus:ring-primary-blue"
                  placeholder="Um astronauta gato flutuando no espaço, arte digital"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label htmlFor="negative_prompt" className="block text-sm font-medium text-gray-light">
                    Negative Prompt <span className="text-xs opacity-70">(preferencialmente em inglês)</span>
                  </label>
                  <HelpTooltip text="Descreva aqui os elementos que você NÃO quer que apareçam na sua imagem. Útil para remover objetos, estilos ou características indesejadas." />
                </div>
                <input
                  id="negative_prompt" type="text" value={negativePrompt} onChange={(e) => setNegativePrompt(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-gray-deep px-4 py-3 text-white outline-none transition focus:ring-2 focus:ring-accent-purple"
                  placeholder="texto, baixa qualidade, borrado"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="model" className="mb-2 block text-sm font-medium text-gray-light">
                    Model
                  </label>
                  <select
                    id="model" value={model} onChange={(e) => setModel(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-gray-deep px-4 py-3 text-white outline-none transition focus:ring-2 focus:ring-primary-blue"
                  >
                    <option value="core">Core (1 crédito)</option>
                    <option value="ultra">Ultra (5 créditos)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="aspect_ratio" className="mb-2 block text-sm font-medium text-gray-light">
                    Aspect Ratio
                  </label>
                  <select
                    id="aspect_ratio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}
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
                type="submit" disabled={isGenerating}
                className="w-full rounded-xl bg-gradient-to-r from-primary-blue to-accent-purple px-5 py-3 font-semibold text-white shadow-lg transition hover:opacity-90 disabled:opacity-50"
              >
                {isGenerating ? "Gerando..." : "Gerar Imagem"}
              </button>
              {error && (
                <p className="text-center text-red-500">{error}</p>
              )}
            </form>

            <div className="mt-8">
              {generatedImageUrl && (
                <>
                  <h3 className="text-lg font-semibold text-white">Resultado</h3>
                  <div className="relative mt-3 w-full aspect-square rounded-xl ring-1 ring-white/10 overflow-hidden">
                    <Image
                      src={generatedImageUrl}
                      alt="Imagem gerada"
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* ▼▼▼ 3. GALERIA DE EXEMPLOS ▼▼▼ */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <h3 className="text-xl font-semibold text-center text-gray-light">Não sabe por onde começar? Inspire-se!</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                {examplePrompts.map((example, index) => (
                  <div 
                    key={index} 
                    className="group relative cursor-pointer rounded-lg overflow-hidden ring-1 ring-white/10"
                    onClick={() => handleUseExample(example)}
                  >
                    <Image
                      src={example.image}
                      alt={`Exemplo de imagem: ${example.prompt.substring(0, 30)}...`}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-center text-sm font-semibold text-white">Usar este exemplo</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}