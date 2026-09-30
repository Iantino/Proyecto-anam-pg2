"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setCargando(true);

    try {
      await apiFetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ usuario, password }),
      });
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F231A] px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 h-14 w-14 overflow-hidden rounded-full border-2 border-[#C69A2A] bg-white">
            <Image
              src="/images/logo-shield.png"
              alt="Escudo de la Municipalidad de San Pablo Jocopilas"
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="font-(family-name:--font-lora) text-xl font-bold text-[#1B2420]">
            Panel administrativo
          </h1>
          <p className="text-sm text-[#5B6B63]">
            Municipalidad de San Pablo Jocopilas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
              Usuario
            </label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              autoFocus
              className="w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-3 text-[14.5px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-3 text-[14.5px]"
            />
          </div>

          {error && (
            <div className="text-[13.5px] text-[#B3261E]">{error}</div>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="mt-1 rounded-[9px] bg-[#1F6B4A] px-5 py-3.5 text-[15px] font-semibold text-white disabled:opacity-60"
          >
            {cargando ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
