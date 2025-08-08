"use client";

import { InputHTMLAttributes } from "react";

type Props = {
  id: string;
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export default function FormField({ id, label, className = "", ...props }: Props) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-gray-light">
        {label}
      </label>
      <div className="rounded-xl border border-white/5 bg-gray-deep p-0.5">
        <input
          id={id}
          className={`w-full rounded-[10px] bg-transparent px-4 py-3 text-white placeholder-gray-light outline-none ${className}`}
          {...props}
        />
        <div className="h-[2px] w-full rounded-full bg-gradient-to-r from-primary-blue to-accent-purple" />
      </div>
    </div>
  );
}
