// src/app/payment/success/page.tsx
"use client";

import Link from 'next/link';
import { useEffect } from 'react';

export default function PaymentSuccessPage() {
  
  // No futuro, poderíamos usar o 'session_id' da URL para confirmar o estado do pagamento.
  // Por agora, o webhook do backend já tratou de adicionar os créditos.

  useEffect(() => {
    // Poderíamos adicionar um efeito de confetti aqui para celebrar!
  }, []);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-deep text-white">
      <div className="text-center p-8 bg-gray-mid rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-display font-bold text-primary-blue">Pagamento Bem-Sucedido!</h1>
        <p className="mt-4 text-lg text-gray-light">A sua assinatura foi ativada e os seus créditos foram adicionados à sua conta.</p>
        <Link href="/" className="inline-block mt-8 px-6 py-3 font-bold text-white bg-gradient-to-r from-primary-blue to-accent-purple rounded-lg hover:opacity-90">
          Começar a Criar
        </Link>
      </div>
    </main>
  );
}