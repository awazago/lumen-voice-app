"use client";

export default function AuthBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* fallback de textura sutil */}
      <div className="absolute inset-0 bg-[#0e0f12]" />

      {/* blobs com glow azul/roxo */}
      <div
        className="absolute -top-40 -left-40 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(closest-side, rgba(0,123,255,0.75), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 -right-40 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(closest-side, rgba(138,43,226,0.75), transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px] opacity-35"
        style={{ background: "radial-gradient(circle, rgba(0,123,255,0.55) 0%, rgba(138,43,226,0.45) 60%, transparent 70%)" }}
      />

      {/* gradiente suave diagonal pra dar profundidade */}
      <div
        className="absolute inset-0 opacity-30"
        style={{ background: "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)" }}
      />
    </div>
  );
}
