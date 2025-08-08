// src/components/UI.tsx
export function Button({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="px-4 py-2 font-bold text-white rounded-lg bg-primary-blue hover:bg-accent-purple transition-colors"
    >
      {children}
    </button>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-lg shadow-xl bg-gray-mid text-gray-light">
      {children}
    </div>
  );
}
