// src/app/payment/cancel/page.tsx
"use client";

import Link from 'next/link';

export default function PaymentCancelPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-deep text-white">
      <div className="text-center p-8 bg-gray-mid rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-display font-bold text-red-500">Pagamento Cancelado</h1>
        <p className="mt-4 text-lg text-gray-light">A sua compra foi cancelada. Pode sempre voltar à página de preços se mudar de ideias.</p>
        <Link href="/pricing" className="inline-block mt-8 px-6 py-3 font-bold text-white bg-gray-light/50 rounded-lg hover:opacity-90">
          Voltar aos Planos
        </Link>
      </div>
    </main>
  );
}