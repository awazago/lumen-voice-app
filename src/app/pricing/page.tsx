// src/app/pricing/page.tsx
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

// Definimos os nossos tipos para clareza
type User = { plan: string };
type Plan = {
  id: string;
  name: string;
  price: string;
  priceId: string | null;
  credits: string;
  features: string[];
};

// IDs dos Preços do Stripe (do seu .env do backend)
const PRICE_IDS = {
  hobby: 'price_1RtrBy90VgolxkM6v2UE2y9i', // SUBSTITUA PELO SEU PRICE ID REAL DO STRIPE
  pro: 'rice_1RtrCg90VgolxkM6yLsdB2F6_...',   // SUBSTITUA PELO SEU PRICE ID REAL DO STRIPE
};

// Dados dos nossos planos
const plans: Plan[] = [
  { id: 'free', name: 'Free', price: 'R$0', priceId: null, credits: '10 Créditos', features: ['Acesso ao modelo "Core"'] },
  { id: 'hobby', name: 'Hobby', price: 'R$29,90', priceId: PRICE_IDS.hobby, credits: '200 Créditos / Mês', features: ['Tudo do Free', 'Acesso ao modelo "Ultra"'] },
  { id: 'pro', name: 'Pro', price: 'R$79,90', priceId: PRICE_IDS.pro, credits: '600 Créditos / Mês', features: ['Tudo do Hobby', 'Suporte prioritário (em breve)'] },
];


export default function PricingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Busca os dados do utilizador para saber o plano atual
    const fetchUserData = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (response.ok) setUser(await response.json());
        } catch (e) { console.error("Failed to fetch user data") }
      }
    };
    fetchUserData();
  }, []);

  const handleSubscription = async (priceId: string | null) => {
    if (!priceId) return; // Não faz nada para o plano free
    
    setIsLoading(priceId);
    setError('');
    const token = localStorage.getItem('accessToken');
    if (!token) {
        window.location.href = '/login';
        return;
    }

    // Lógica para criar a sessão de checkout (igual à anterior)
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/create-checkout-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ price_id: priceId }),
        });
        if (!response.ok) throw new Error('Falha ao iniciar o checkout.');
        const session = await response.json();
        window.location.href = session.url;
    } catch (err: any) {
        setError(err.message);
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {plans.map((plan) => {
          const isCurrentUserPlan = user?.plan === plan.id;
          return (
            <div key={plan.id} className={`bg-gray-mid p-8 rounded-2xl shadow-2xl flex flex-col ${isCurrentUserPlan ? 'border-2 border-primary-blue' : 'border-2 border-gray-light/10'}`}>
              <h2 className="text-3xl font-display font-bold text-white">{plan.name}</h2>
              <div className="my-8">
                <span className="text-5xl font-bold text-white">{plan.price}</span>
                {plan.id !== 'free' && <span className="text-gray-light">/mês</span>}
              </div>
              <p className="text-lg font-semibold">{plan.credits}</p>
              <ul className="space-y-4 text-gray-light flex-grow mt-4">
                {plan.features.map(feature => <li key={feature} className="flex items-center"><span className="text-primary-blue mr-2">✔</span>{feature}</li>)}
              </ul>
              <button
                onClick={() => handleSubscription(plan.priceId)}
                disabled={isLoading === plan.priceId || isCurrentUserPlan}
                className={`w-full mt-8 px-4 py-3 font-bold rounded-lg transition-all ${isCurrentUserPlan ? 'bg-gray-light/20 text-white cursor-default' : 'text-white bg-gradient-to-r from-primary-blue to-accent-purple hover:opacity-90 disabled:opacity-50'}`}
              >
                {isCurrentUserPlan ? 'Seu Plano Atual' : (isLoading === plan.priceId ? 'A processar...' : 'Assinar ' + plan.name)}
              </button>
            </div>
          );
        })}
      </div>
       {error && <p className="text-red-500 text-center mt-8">{error}</p>}
    </div>
  );
}