// src/app/pricing/page.tsx

"use client";

import { useState } from 'react';

// IDs dos Preços do Stripe (do seu ficheiro .env do backend)
// É melhor obtê-los de uma API no futuro, mas para o MVP, podemos colocá-los aqui.
const PRICE_IDS = {
  hobby: 'price_1RtrBy90VgolxkM6v2UE2y9i', // <-- SUBSTITUA PELO SEU PRICE ID REAL DO STRIPE
  pro: 'price_1RtrCg90VgolxkM6yLsdB2F6',   // <-- SUBSTITUA PELO SEU PRICE ID REAL DO STRIPE
};

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null); // Guarda qual botão está a carregar
  const [error, setError] = useState('');

  const handleSubscribe = async (priceId: string) => {
    setIsLoading(priceId);
    setError('');

    const token = localStorage.getItem('accessToken');
    if (!token) {
      window.location.href = '/login'; // Se não estiver logado, vai para o login
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ price_id: priceId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha ao iniciar o checkout.');
      }

      const session = await response.json();
      
      // Redireciona o utilizador para a página de pagamento do Stripe
      window.location.href = session.url;

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro inesperado.');
      }
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-deep p-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-display font-bold text-white">Nossos Planos</h1>
        <p className="mt-4 text-xl text-gray-light">Escolha o plano ideal para a sua criatividade.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Cartão do Plano Hobby */}
        <div className="bg-gray-mid p-8 rounded-2xl shadow-2xl border-2 border-gray-light/10 flex flex-col">
          <h2 className="text-3xl font-display font-bold text-white">Hobby</h2>
          <p className="mt-2 text-gray-light">Para entusiastas e projetos pessoais.</p>
          <div className="my-8">
            <span className="text-5xl font-bold text-white">R$29,90</span>
            <span className="text-gray-light">/mês</span>
          </div>
          <ul className="space-y-4 text-gray-light flex-grow">
            <li className="flex items-center"><span className="text-primary-blue mr-2">✔</span> 200 Créditos / Mês</li>
            <li className="flex items-center"><span className="text-primary-blue mr-2">✔</span> Acesso ao modelo &apos;Core&apos;</li>
            <li className="flex items-center"><span className="text-primary-blue mr-2">✔</span> Acesso ao modelo &apos;Ultra&apos;</li>
          </ul>
          <button
            onClick={() => handleSubscribe(PRICE_IDS.hobby)}
            disabled={isLoading === PRICE_IDS.hobby}
            className="w-full mt-8 px-4 py-3 font-bold text-white bg-primary-blue rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isLoading === PRICE_IDS.hobby ? 'A processar...' : 'Assinar Hobby'}
          </button>
        </div>

        {/* Cartão do Plano Pro */}
        <div className="bg-gray-mid p-8 rounded-2xl shadow-2xl border-2 border-primary-blue/50 flex flex-col ring-2 ring-primary-blue">
          <h2 className="text-3xl font-display font-bold text-primary-blue">Pro</h2>
          <p className="mt-2 text-gray-light">Para criadores e uso profissional.</p>
          <div className="my-8">
            <span className="text-5xl font-bold text-white">R$79,90</span>
            <span className="text-gray-light">/mês</span>
          </div>
          <ul className="space-y-4 text-gray-light flex-grow">
            <li className="flex items-center"><span className="text-primary-blue mr-2">✔</span> 600 Créditos / Mês</li>
            <li className="flex items-center"><span className="text-primary-blue mr-2">✔</span> Acesso ao modelo &apos;Core&apos;</li>
            <li className="flex items-center"><span className="text-primary-blue mr-2">✔</span> Acesso ao modelo &apos;Ultra&apos;</li>
            <li className="flex items-center"><span className="text-primary-blue mr-2">✔</span> Suporte prioritário (em breve)</li>
          </ul>
          <button
            onClick={() => handleSubscribe(PRICE_IDS.pro)}
            disabled={isLoading === PRICE_IDS.pro}
            className="w-full mt-8 px-4 py-3 font-bold text-white bg-gradient-to-r from-primary-blue to-accent-purple rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isLoading === PRICE_IDS.pro ? 'A processar...' : 'Assinar Pro'}
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 text-center mt-8">{error}</p>}
    </div>
  );
}