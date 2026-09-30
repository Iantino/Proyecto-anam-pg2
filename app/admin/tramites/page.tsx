"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useSesion, esAdministrador } from "@/lib/sesion";

type Tramite = {
  id: number;
  codigo: string;
  tipo: string;
  estado: string;
  creador: string;
  responsable: string | null;
  fecha_recepcion: string;
};

type Catalogo = { id: number; nombre: string; descripcion?: string };

export default function AdminTramitesPage() {
  const admin = esAdministrador(useSesion());
  const [tramites, setTramites] = useState<Tramite[]>([]);
  const [tipos, setTipos] = useState<Catalogo[]>([]);
  const [estados, setEstados] = useState<Catalogo[]>([]);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [soloSinAsignar, setSoloSinAsignar] = useState(false);
  const [cargando, setCargando] = useState(true);

  const [mostrarForm, setMostrarForm] = useState(false);
  const [tipoId, setTipoId] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [creando, setCreando] = useState(false);
  const [error, setError] = useState("");

  async function cargarTramites(estadoId: string, sinAsignar: boolean) {
    try {
      const params = new URLSearchParams();
      if (estadoId) params.set("estado_id", estadoId);
      if (sinAsignar) params.set("sin_asignar", "1");
      const query = params.toString() ? `?${params}` : "";
      const data = await apiFetch(`/api/tramites${query}`);
      setTramites(data);
    } catch {
      // Sesión expirada: el layout de /admin redirige a /admin/login.
    }
  }

  useEffect(() => {
    async function cargarTodo() {
      try {
        const [listaTramites, listaTipos, listaEstados] = await Promise.all([
          apiFetch("/api/tramites"),
          apiFetch("/api/tipos-tramite"),
          apiFetch("/api/estados-tramite"),
        ]);
        setTramites(listaTramites);
        setTipos(listaTipos);
        setEstados(listaEstados);
        if (listaTipos.length > 0) setTipoId(String(listaTipos[0].id));
      } catch {
        // Si la sesión expiró, el layout de /admin ya redirige a /admin/login.
      } finally {
        setCargando(false);
      }
    }
    cargarTodo();
  }, []);

  async function handleFiltroChange(estadoId: string) {
    setFiltroEstado(estadoId);
    await cargarTramites(estadoId, soloSinAsignar);
  }

  async function handleSinAsignarChange(valor: boolean) {
    setSoloSinAsignar(valor);
    await cargarTramites(filtroEstado, valor);
  }

  async function handleCrear(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!tipoId) {
      setError("Selecciona un tipo de trámite.");
      return;
    }
    setCreando(true);
    try {
      await apiFetch("/api/tramites", {
        method: "POST",
        body: JSON.stringify({ tipo_id: Number(tipoId), observaciones }),
      });
      setObservaciones("");
      setMostrarForm(false);
      await cargarTramites(filtroEstado, soloSinAsignar);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear el trámite.");
    } finally {
      setCreando(false);
    }
  }

  if (cargando) {
    return <p className="text-sm text-[#5B6B63]">Cargando...</p>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-(family-name:--font-lora) text-lg font-bold text-[#1B2420]">
            {admin ? "Trámites" : "Mis trámites asignados"} ({tramites.length})
          </h2>
          {!admin && (
            <p className="text-[13px] text-[#5B6B63]">
              Solo ves los trámites que el Administrador te asignó o que registraste tú.
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {admin && (
            <label className="flex cursor-pointer items-center gap-2 rounded-[9px] border border-[#DCE4DA] bg-white px-3 py-2 text-sm text-[#3E4A44]">
              <input
                type="checkbox"
                checked={soloSinAsignar}
                onChange={(e) => handleSinAsignarChange(e.target.checked)}
                className="accent-[#1F6B4A]"
              />
              Sin asignar
            </label>
          )}
          <select
            value={filtroEstado}
            onChange={(e) => handleFiltroChange(e.target.value)}
            className="rounded-[9px] border border-[#DCE4DA] bg-white px-3 py-2 text-sm"
          >
            <option value="">Todos los estados</option>
            {estados.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>

          <button
            onClick={() => setMostrarForm((v) => !v)}
            className="rounded-lg bg-[#1F6B4A] px-4 py-2 text-sm font-semibold text-white"
          >
            {mostrarForm ? "Cancelar" : "+ Nuevo trámite"}
          </button>
        </div>
      </div>

      {mostrarForm && (
        <form
          onSubmit={handleCrear}
          className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#DCE4DA] bg-white p-5"
        >
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
              Tipo de trámite
            </label>
            <select
              value={tipoId}
              onChange={(e) => setTipoId(e.target.value)}
              className="w-full rounded-[9px] border border-[#DCE4DA] bg-white px-3.5 py-2.5 text-[14.5px]"
            >
              {tipos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
              Observaciones
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
              className="w-full resize-y rounded-[9px] border border-[#DCE4DA] px-3.5 py-2.5 text-[14.5px]"
              placeholder="Detalle de la solicitud del ciudadano"
            />
          </div>
          {!admin && (
            <p className="text-[12.5px] text-[#5B6B63]">
              El trámite quedará asignado a ti automáticamente.
            </p>
          )}
          {error && <div className="text-[13.5px] text-[#B3261E]">{error}</div>}
          <button
            type="submit"
            disabled={creando}
            className="self-start rounded-lg bg-[#1F6B4A] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {creando ? "Guardando..." : "Registrar trámite"}
          </button>
        </form>
      )}

      {tramites.length === 0 ? (
        <p className="text-sm text-[#5B6B63]">
          {soloSinAsignar
            ? "No hay trámites pendientes de asignar."
            : admin
              ? "No hay trámites registrados."
              : "No tienes trámites asignados por ahora."}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {tramites.map((t) => (
            <Link
              key={t.id}
              href={`/admin/tramites/${t.id}`}
              className="block rounded-2xl border border-[#DCE4DA] bg-white p-5"
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="font-semibold text-[#1B2420]">{t.codigo}</span>
                <span className="rounded-full bg-[#E8F3EC] px-2.5 py-0.5 text-xs font-semibold text-[#1F6B4A]">
                  {t.estado}
                </span>
              </div>
              <div className="mb-1 text-[14px] text-[#3E4A44]">{t.tipo}</div>
              <div className="flex flex-wrap gap-x-4 text-[12.5px] text-[#5B6B63]">
                <span>Creado por: {t.creador}</span>
                <span className={t.responsable ? "" : "font-semibold text-[#B7791F]"}>
                  Responsable: {t.responsable || "Sin asignar"}
                </span>
                <span>{t.fecha_recepcion}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
