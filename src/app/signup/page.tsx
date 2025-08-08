"use client";

import { useState } from 'react';
import Link from 'next/link'; // 1. Importe o componente de Link

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // A lógica de fetch para o cadastro continua a mesma
      const response = await fetch('http://127.0.0.1:8000/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Falha ao criar a conta.');
      }

      alert('Cadastro realizado com sucesso! Você será redirecionado para a página de login.');
      window.location.href = '/login';

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-deep">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-mid rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-display font-bold text-white">Lumen Voice</h1>
          <p className="mt-2 text-gray-light">Crie a sua conta para começar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-white bg-gray-deep border-2 border-gray-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-purple transition-all"
              placeholder="seu@email.com"
            />
          </div>
          
          <div className="relative">
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-white bg-gray-deep border-2 border-gray-light/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-purple transition-all"
              placeholder="Crie uma senha"
            />
          </div>
          
          {error && <p className="text-red-500 text-sm text-center font-semibold">{error}</p>}
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 font-bold text-white bg-gradient-to-r from-primary-blue to-accent-purple rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-mid focus:ring-white transition-all disabled:opacity-50"
            >
              {isLoading ? 'A criar conta...' : 'Criar Conta'}
            </button>
          </div>
        </form>

        {/* 2. Adicione um link para a página de login */}
        <p className="text-center text-sm text-gray-light">
          Já tem uma conta?{' '}
          <Link href="/login" className="font-semibold text-primary-blue hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </main>
  );
}