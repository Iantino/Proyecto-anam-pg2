// Fondo decorativo para lugares de patrimonio que todavía no tienen
// fotografía. Usa el patrón de hojas del sitio para que se vea como un
// elemento de diseño intencional y no como un espacio "pendiente".
export default function LugarSinFoto({ nombre }: { nombre: string }) {
  return (
    <div
      role="img"
      aria-label={nombre}
      className="relative flex h-full w-full items-center justify-center overflow-hidden bg-[#1F6B4A]"
    >
      <div
        className="absolute inset-0 opacity-25"
        style={{ backgroundImage: "url('/patterns/leaf-pattern.svg')", backgroundSize: "180px" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(198,154,42,0.35),transparent_60%)]" />
      <svg
        viewBox="0 0 24 24"
        className="relative h-10 w-10 text-[#F3DFA0]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11z" />
        <circle cx="12" cy="10" r="2.4" />
      </svg>
    </div>
  );
}
