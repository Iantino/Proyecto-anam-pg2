"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Contenido = {
  id: number;
  titulo: string;
  contenido: string;
  categoria: string | null;
  estado: "borrador" | "publicado";
  autor: string;
  fecha_actualizacion: string;
};

const CATEGORIAS = [
  "Actas del Concejo",
  "Presupuesto",
  "Obras y proyectos",
  "Reglamentos",
  "Otro",
];

const formVacio = {
  id: null as number | null,
  titulo: "",
  contenido: "",
  categoria: CATEGORIAS[0],
  estado: "borrador" as "borrador" | "publicado",
};

export default function AdminInformacionPublicaPage() {
  const [items, setItems] = useState<Contenido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(formVacio);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  async function cargar() {
    try {
      const data = await apiFetch("/api/informacion-publica/admin");
      setItems(data);
    } catch {
      // sesión expirada: el layout redirige
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function nuevo() {
    setForm(formVacio);
    setMostrarForm(true);
  }

  function editar(item: Contenido) {
    setForm({
      id: item.id,
      titulo: item.titulo,
      contenido: item.contenido,
      categoria: item.categoria || CATEGORIAS[0],
      estado: item.estado,
    });
    setMostrarForm(true);
  }

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.titulo.trim() || !form.contenido.trim()) {
      setError("Título y contenido son obligatorios.");
      return;
    }
    setGuardando(true);
    try {
      if (form.id) {
        await apiFetch(`/api/informacion-publica/${form.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch("/api/informacion-publica", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      setMostrarForm(false);
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  }

  async function handleTogglePublicado(item: Contenido) {
    const nuevoEstado = item.estado === "publicado" ? "borrador" : "publicado";
    try {
      await apiFetch(`/api/informacion-publica/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...item, estado: nuevoEstado }),
      });
      await cargar();
    } catch {
      // ignorar
    }
  }

  if (cargando) return <p className="text-sm text-[#5B6B63]">Cargando...</p>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-(family-name:--font-lora) text-lg font-bold text-[#1B2420]">
            Información pública ({items.length})
          </h2>
          <p className="text-[13px] text-[#5B6B63]">
            Contenido visible en la página pública "Transparencia" del sitio.
          </p>
        </div>
        <button
          onClick={mostrarForm ? () => setMostrarForm(false) : nuevo}
          className="rounded-lg bg-[#1F6B4A] px-4 py-2 text-sm font-semibold text-white"
        >
          {mostrarForm ? "Cancelar" : "+ Nuevo contenido"}
        </button>
      </div>

      {mostrarForm && (
        <form
          onSubmit={handleGuardar}
          className="mb-6 flex flex-col gap-3 rounded-2xl border border-[#DCE4DA] bg-white p-5"
        >
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
              Título
            </label>
            <input
              type="text"
              value={form.titulo}
              onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
              className="w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-2.5 text-[14.5px]"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
                Categoría
              </label>
              <select
                value={form.categoria}
                onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
                className="w-full rounded-[9px] border border-[#DCE4DA] bg-white px-3.5 py-2.5 text-[14.5px]"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
                Estado
              </label>
              <select
                value={form.estado}
                onChange={(e) =>
                  setForm((f) => ({ ...f, estado: e.target.value as "borrador" | "publicado" }))
                }
                className="w-full rounded-[9px] border border-[#DCE4DA] bg-white px-3.5 py-2.5 text-[14.5px]"
              >
                <option value="borrador">Borrador (no visible al público)</option>
                <option value="publicado">Publicado (visible en el sitio)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
              Contenido
            </label>
            <textarea
              value={form.contenido}
              onChange={(e) => setForm((f) => ({ ...f, contenido: e.target.value }))}
              rows={6}
              className="w-full resize-y rounded-[9px] border border-[#DCE4DA] px-3.5 py-2.5 text-[14.5px]"
            />
          </div>

          {error && <div className="text-[13.5px] text-[#B3261E]">{error}</div>}

          <button
            type="submit"
            disabled={guardando}
            className="self-start rounded-lg bg-[#1F6B4A] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </form>
      )}

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-2xl border border-[#DCE4DA] bg-white p-5">
            <div className="mb-1 flex items-center justify-between">
              <span className="font-semibold text-[#1B2420]">{item.titulo}</span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  item.estado === "publicado"
                    ? "bg-[#E8F3EC] text-[#1F6B4A]"
                    : "bg-[#F0F0EA] text-[#8A8577]"
                }`}
              >
                {item.estado}
              </span>
            </div>
            <div className="mb-2 text-[12.5px] text-[#5B6B63]">
              {item.categoria} · {item.autor} · {item.fecha_actualizacion}
            </div>
            <p className="mb-3 line-clamp-2 text-[14px] text-[#3E4A44]">{item.contenido}</p>
            <div className="flex gap-3">
              <button
                onClick={() => editar(item)}
                className="text-[13px] font-semibold text-[#1F6B4A]"
              >
                Editar
              </button>
              <button
                onClick={() => handleTogglePublicado(item)}
                className="text-[13px] font-semibold text-[#5B6B63]"
              >
                {item.estado === "publicado" ? "Pasar a borrador" : "Publicar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
