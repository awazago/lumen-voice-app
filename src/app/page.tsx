"use client";

import { useEffect, useState } from 'react';

type User = {
  email: string;
  credits: number;
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Estados para o nosso formulário ---
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState(''); // <-- NOVO ESTADO
  const [model, setModel] = useState('core');
  const [aspectRatio, setAspectRatio] = useState('1:1'); // <-- NOVO ESTADO
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        // Simulação - no futuro, faremos um fetch a /users/me
        setUser({ email: decodedToken.sub, credits: 10 }); 
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
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError('');
    setGeneratedImageUrl('');

    const token = localStorage.getItem('accessToken');

    try {
      // ▼▼▼ ATUALIZAR O CORPO DO PEDIDO ▼▼▼
      const body = {
        prompt,
        negative_prompt: negativePrompt,
        model,
        aspect_ratio: aspectRatio,
      };

      const response = await fetch('http://127.0.0.1:8000/images/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body), // Envia todos os novos dados
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha ao gerar a imagem.');
      }
      
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setGeneratedImageUrl(imageUrl);

      const cost = model === 'core' ? 1 : 5;
      setUser(currentUser => currentUser ? { ...currentUser, credits: currentUser.credits - cost } : null);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">A carregar...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-400">Lumen Voice</h1>
        {user && (
          <div className="flex items-center">
            <span>{user.email}</span>
            <span className="ml-4 bg-blue-500 px-3 py-1 rounded-full text-sm">Créditos: {user.credits}</span>
            <button onClick={handleLogout} className="ml-6 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Logout
            </button>
          </div>
        )}
      </header>

      <main className="p-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-lg font-medium text-gray-300">
                O que você quer criar?
              </label>
              <textarea
                id="prompt"
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                required
                className="w-full px-3 py-2 mt-2 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Um gato astronauta a flutuar no espaço, arte digital"
              />
            </div>

            {/* ▼▼▼ NOVO CAMPO: PROMPT NEGATIVO ▼▼▼ */}
            <div>
              <label htmlFor="negative_prompt" className="block text-sm font-medium text-gray-300">
                O que você não quer ver? (Prompt Negativo)
              </label>
              <input
                id="negative_prompt"
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: texto, má qualidade, desfocado"
              />
            </div>
            
            {/* ▼▼▼ NOVOS CAMPOS: MODELO E PROPORÇÃO LADO A LADO ▼▼▼ */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="model" className="block text-sm font-medium text-gray-300">Modelo</label>
                <select 
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="core">Core (1 crédito)</option>
                  <option value="ultra">Ultra (5 créditos)</option>
                </select>
              </div>
              <div>
                <label htmlFor="aspect_ratio" className="block text-sm font-medium text-gray-300">Proporção</label>
                <select 
                  id="aspect_ratio"
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-500"
            >
              {isGenerating ? 'A gerar...' : 'Gerar Imagem'}
            </button>
          </form>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          {generatedImageUrl && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold">A sua criação:</h3>
              <img src={generatedImageUrl} alt="Imagem gerada" className="mt-4 rounded-lg w-full" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}