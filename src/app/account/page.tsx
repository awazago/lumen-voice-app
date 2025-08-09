// src/app/account/page.tsx
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

type User = {
  email: string;
  credits: number;
  plan: string;
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  // Estados para o formulário de senha
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Falha na autenticação');
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

  const handlePasswordChange = async (_e: React.FormEvent) => {
    _e.preventDefault();
    setFeedback({ message: '', type: '' });
    const token = localStorage.getItem('accessToken');

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || 'Falha ao atualizar a senha.');
        
        setFeedback({ message: 'Senha atualizada com sucesso!', type: 'success' });
        setCurrentPassword('');
        setNewPassword('');

    } catch (err) {
        if (err instanceof Error) {
            setFeedback({ message: err.message, type: 'error' }); //setError(err.message); 
        } else {
            setError('Ocorreu um erro inesperado.');
        }
    }
  };

  const handleManageSubscription = async () => {
    const token = localStorage.getItem('accessToken');
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/create-portal-session`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Não foi possível aceder ao portal de gestão.');
        const data = await response.json();
        window.location.href = data.url; // Redireciona para o portal do Stripe
    } catch (err: any) {
        if (err instanceof Error) {
            setError(err.message); // ou setFeedback({ message: err.message, type: 'error' });
        } else {
            setError('Ocorreu um erro inesperado.');
        }
    }
  };

  if (isLoading || !user) {
    return <div className="flex items-center justify-center min-h-screen bg-gray-deep text-white">A carregar dados da sua conta...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-deep text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-display font-bold mb-8">Minha Conta</h1>

        {/* Secção do Plano e Créditos */}
        <div className="bg-gray-mid p-6 rounded-2xl mb-8">
          <h2 className="text-2xl font-display font-bold text-primary-blue">Seu Plano</h2>
          <div className="mt-4 flex justify-between items-center">
            <div>
              <p className="text-lg capitalize">Plano {user.plan}</p>
              <p className="text-3xl font-bold mt-1">{user.credits} <span className="text-lg text-gray-light">Créditos restantes</span></p>
            </div>
            <div>
              {user.plan === 'free' ? (
                <Link href="/pricing" className="px-4 py-2 font-bold text-white bg-gradient-to-r from-primary-blue to-accent-purple rounded-lg hover:opacity-90">
                  Fazer Upgrade
                </Link>
              ) : (
                <button onClick={handleManageSubscription} className="px-4 py-2 font-semibold text-white bg-gray-light/20 rounded-lg hover:bg-gray-light/30">
                  Gerir Assinatura
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Secção de Alterar Senha */}
        <div className="bg-gray-mid p-6 rounded-2xl">
          <h2 className="text-2xl font-display font-bold">Alterar Senha</h2>
          <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Senha Atual"
              required
              className="w-full px-4 py-3 text-white bg-gray-deep border-2 border-gray-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-purple"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nova Senha"
              required
              minLength={6}
              className="w-full px-4 py-3 text-white bg-gray-deep border-2 border-gray-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-purple"
            />
            <button type="submit" className="px-6 py-2 font-bold text-white bg-primary-blue rounded-lg hover:opacity-90">
              Salvar Nova Senha
            </button>
            {feedback.message && (
              <p className={`mt-2 text-sm ${feedback.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {feedback.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}