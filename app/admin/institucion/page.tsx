"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Institucion = {
  nombre: string;
  departamento: string;
  municipio: string;
  direccion: string | null;
  telefono: string | null;
  correo: string | null;
  horario: string | null;
  logo_url: string | null;
};

const vacio: Institucion = {
  nombre: "", departamento: "", municipio: "",
  direccion: "", telefono: "", correo: "", horario: "", logo_url: "",
};

export default function AdminInstitucionPage() {
  const [datos, setDatos] = useState<Institucion>(vacio);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    apiFetch("/api/institucion")
      .then((data) => setDatos({ ...vacio, ...data }))
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  function actualizar(campo: keyof Institucion, valor: string) {
    setDatos((d) => ({ ...d, [campo]: valor }));
    setAviso("");
  }

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAviso("");
    setGuardando(true);
    try {
      await apiFetch("/api/institucion", {
        method: "PUT",
        body: JSON.stringify(datos),
      });
      setAviso("Datos institucionales actualizados correctamente.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  }

  if (cargando) return <p className="text-sm text-[#5B6B63]">Cargando...</p>;

  return (
    <div>
      <h2 className="mb-1.5 font-(family-name:--font-lora) text-lg font-bold text-[#1B2420]">
        Datos institucionales
      </h2>
      <p className="mb-6 text-[13.5px] text-[#5B6B63]">
        Esta información aparece en el sitio público (Inicio, Municipalidad y Contacto).
      </p>

      <form
        onSubmit={handleGuardar}
        className="flex flex-col gap-4 rounded-2xl border border-[#DCE4DA] bg-white p-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
              Nombre de la municipalidad
            </label>
            <input
              type="text"
              value={datos.nombre}
              onChange={(e) => actualizar("nombre", e.target.value)}
              className="w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-2.5 text-[14.5px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
              Departamento
            </label>
            <input
              type="text"
              value={datos.departamento}
              onChange={(e) => actualizar("departamento", e.target.value)}
              className="w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-2.5 text-[14.5px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
              Municipio
            </label>
            <input
              type="text"
              value={datos.municipio}
              onChange={(e) => actualizar("municipio", e.target.value)}
              className="w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-2.5 text-[14.5px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
              Dirección
            </label>
            <input
              type="text"
              value={datos.direccion ?? ""}
              onChange={(e) => actualizar("direccion", e.target.value)}
              className="w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-2.5 text-[14.5px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
              Teléfono
            </label>
            <input
              type="text"
              value={datos.telefono ?? ""}
              onChange={(e) => actualizar("telefono", e.target.value)}
              className="w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-2.5 text-[14.5px]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
              Correo electrónico
            </label>
            <input
              type="email"
              value={datos.correo ?? ""}
              onChange={(e) => actualizar("correo", e.target.value)}
              className="w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-2.5 text-[14.5px]"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
              Horario de atención
            </label>
            <input
              type="text"
              value={datos.horario ?? ""}
              onChange={(e) => actualizar("horario", e.target.value)}
              className="w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-2.5 text-[14.5px]"
            />
          </div>
        </div>

        {error && <div className="text-[13.5px] text-[#B3261E]">{error}</div>}
        {aviso && <div className="text-[13.5px] text-[#1F6B4A]">{aviso}</div>}

        <button
          type="submit"
          disabled={guardando}
          className="self-start rounded-lg bg-[#1F6B4A] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}
