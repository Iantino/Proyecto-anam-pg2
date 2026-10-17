"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

// Bandeja de mensajes enviados por los ciudadanos desde la página de
// Contacto del sitio público.

type Mensaje = {
  id: number;
  nombre: string;
  correo: string;
  asunto: string;
  mensaje: string;
  estado: "nuevo" | "atendido";
  fecha_creacion: string;
};

const FILTROS = [
  { valor: "nuevo", etiqueta: "Pendientes" },
  { valor: "atendido", etiqueta: "Atendidos" },
  { valor: "", etiqueta: "Todos" },
] as const;

export default function AdminMensajesPage() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [filtro, setFiltro] = useState<string>("nuevo");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [marcandoId, setMarcandoId] = useState<number | null>(null);

  const cargar = useCallback(async (estado: string) => {
    try {
      const query = estado ? `?estado=${estado}` : "";
      setMensajes(await apiFetch(`/api/contacto${query}`));
      setError("");
    } catch (err) {
      // Si la sesión expiró, el layout de /admin redirige a /admin/login.
      setError(err instanceof Error ? err.message : "No se pudieron cargar los mensajes.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar(filtro);
  }, [cargar, filtro]);

  async function marcarAtendido(id: number) {
    setMarcandoId(id);
    try {
      await apiFetch(`/api/contacto/${id}/atendido`, { method: "PUT" });
      await cargar(filtro);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar el mensaje.");
    } finally {
      setMarcandoId(null);
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-(family-name:--font-lora) text-lg font-bold text-[#1B2420]">
            Mensajes de contacto ({mensajes.length})
          </h2>
          <p className="text-[13px] text-[#5B6B63]">
            Consultas enviadas por los ciudadanos desde la página de Contacto.
          </p>
        </div>
        <div className="flex gap-1.5 rounded-[10px] border border-[#DCE4DA] bg-white p-1">
          {FILTROS.map((f) => (
            <button
              key={f.valor}
              type="button"
              onClick={() => {
                setCargando(true);
                setFiltro(f.valor);
              }}
              className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold ${
                filtro === f.valor ? "bg-[#1F6B4A] text-white" : "text-[#5B6B63]"
              }`}
            >
              {f.etiqueta}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="mb-4 text-[13.5px] text-[#B3261E]">{error}</div>}

      {cargando ? (
        <p className="text-sm text-[#5B6B63]">Cargando...</p>
      ) : mensajes.length === 0 ? (
        <p className="text-sm text-[#5B6B63]">
          {filtro === "nuevo" ? "No hay mensajes pendientes." : "No hay mensajes."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {mensajes.map((m) => (
            <article key={m.id} className="rounded-2xl border border-[#DCE4DA] bg-white p-5">
              <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-semibold text-[#1B2420]">{m.nombre}</div>
                  <a href={`mailto:${m.correo}`} className="text-[13px] text-[#1F6B4A]">
                    {m.correo}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#F5E9C8] px-2.5 py-0.5 text-xs font-semibold text-[#6B5A20]">
                    {m.asunto}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      m.estado === "nuevo"
                        ? "bg-[#FDF1F0] text-[#B3261E]"
                        : "bg-[#E8F3EC] text-[#1F6B4A]"
                    }`}
                  >
                    {m.estado === "nuevo" ? "Pendiente" : "Atendido"}
                  </span>
                </div>
              </div>
              <p className="mb-3 text-[14.5px] leading-[1.65] whitespace-pre-line text-[#3E4A44]">
                {m.mensaje}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-[12.5px] text-[#9DAFA4]">Recibido: {m.fecha_creacion}</span>
                {m.estado === "nuevo" && (
                  <button
                    type="button"
                    onClick={() => marcarAtendido(m.id)}
                    disabled={marcandoId === m.id}
                    className="rounded-lg bg-[#1F6B4A] px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60"
                  >
                    {marcandoId === m.id ? "Guardando..." : "Marcar como atendido"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
