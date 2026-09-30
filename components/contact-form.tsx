"use client";

import { useState } from "react";
import { asuntoOptions } from "@/lib/data";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const initialForm = {
  nombre: "",
  correo: "",
  asunto: asuntoOptions[0],
  mensaje: "",
  sitio_web: "", // honeypot anti-spam: campo oculto, invisible para personas
};

export default function ContactForm() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  function updateForm(field: keyof typeof initialForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.nombre.trim() || !form.correo.trim() || !form.mensaje.trim()) {
      setError("Por favor completa nombre, correo y mensaje.");
      return;
    }

    setEnviando(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/contacto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo enviar el mensaje.");
      }

      setSubmitted(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo conectar con el servidor. Intenta de nuevo más tarde."
      );
    } finally {
      setEnviando(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[#BFE0CC] bg-[#E8F3EC] p-8 text-center">
        <div className="mb-2.5 font-(family-name:--font-lora) text-xl font-bold text-[#154C34]">
          ¡Mensaje enviado!
        </div>
        <p className="mb-5 text-[14.5px] leading-[1.6] text-[#3E4A44]">
          Gracias por escribirnos. Nuestra Oficina Municipal de Atención y
          Comunicación Ciudadana te responderá lo antes posible.
        </p>
        <button
          onClick={() => {
            setForm(initialForm);
            setSubmitted(false);
          }}
          className="rounded-lg bg-[#1F6B4A] px-5 py-2.75 text-sm font-semibold text-white"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
          Nombre completo
        </label>
        <input
          type="text"
          value={form.nombre}
          onChange={(e) => updateForm("nombre", e.target.value)}
          placeholder="Tu nombre"
          className="w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-3 text-[14.5px]"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
          Correo electrónico
        </label>
        <input
          type="email"
          value={form.correo}
          onChange={(e) => updateForm("correo", e.target.value)}
          placeholder="tucorreo@ejemplo.com"
          className="w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-3 text-[14.5px]"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
          Asunto
        </label>
        <select
          value={form.asunto}
          onChange={(e) => updateForm("asunto", e.target.value)}
          className="w-full rounded-[9px] border border-[#DCE4DA] bg-white px-3.5 py-3 text-[14.5px]"
        >
          {asuntoOptions.map((op) => (
            <option key={op} value={op}>
              {op}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
          Mensaje
        </label>
        <textarea
          value={form.mensaje}
          onChange={(e) => updateForm("mensaje", e.target.value)}
          placeholder="Cuéntanos en qué podemos ayudarte"
          rows={4}
          className="w-full resize-y rounded-[9px] border border-[#DCE4DA] px-3.5 py-3 text-[14.5px]"
        />
      </div>

      {/* Honeypot: oculto con CSS, invisible y sin tabIndex para personas;
          los bots que rellenan todos los campos automáticamente sí lo llenan. */}
      <input
        type="text"
        value={form.sitio_web}
        onChange={(e) => updateForm("sitio_web", e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {error && <div className="text-[13.5px] text-[#B3261E]">{error}</div>}

      <button
        type="submit"
        disabled={enviando}
        className="self-start rounded-[9px] bg-[#1F6B4A] px-5.5 py-3.5 text-[15px] font-semibold text-white disabled:opacity-60"
      >
        {enviando ? "Enviando..." : "Enviar mensaje"}
      </button>
    </form>
  );
}