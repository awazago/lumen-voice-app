"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthCard({ title, children, footer }: Props) {
  return (
    <div className="w-full max-w-xl rounded-[24px] bg-gray-mid/70 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] ring-1 ring-white/10 backdrop-blur">
      <div className="mb-8 flex items-center justify-center">
        <h1 className="font-display text-3xl font-semibold md:text-4xl">{title}</h1>
      </div>
      {children}
      {footer && <div className="mt-6 text-center text-sm text-gray-light">{footer}</div>}
    </div>
  );
}
