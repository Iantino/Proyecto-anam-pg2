"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { portalInformacionPublica, esTipoInformacionPublica } from "@/lib/data";

type TipoTramite = { id: number; nombre: string; descripcion?: string };

const initialForm = {
  tipo_id: "",
  solicitante_nombre: "",
  solicitante_dpi: "",
  solicitante_correo: "",
  solicitante_telefono: "",
  observaciones: "",
  sitio_web: "", // honeypot anti-spam
};

export default function SolicitudTramiteForm() {
  const [tipos, setTipos] = useState<TipoTramite[]>([]);
  const [form, setForm] = useState(initialForm);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const [codigo, setCodigo] = useState<string | null>(null);

  useEffect(() => {
    apiFetch("/api/tipos-tramite").then((data) => {
      setTipos(data);
      if (data.length > 0) {
        setForm((f) => ({ ...f, tipo_id: String(data[0].id) }));
      }
    });
  }, []);

  function updateForm(field: keyof typeof initialForm, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.tipo_id ||
      !form.solicitante_nombre.trim() ||
      !form.solicitante_dpi.trim() ||
      !form.solicitante_correo.trim() ||
      !form.solicitante_telefono.trim() ||
      !form.observaciones.trim()
    ) {
      setError("Por favor completa nombre, DPI, correo, teléfono y descripción.");
      return;
    }
    if (!/^\d{13}$/.test(form.solicitante_dpi.replace(/[\s-]/g, ""))) {
      setError("El DPI debe tener 13 dígitos.");
      return;
    }

    setEnviando(true);
    setError("");

    try {
      const data = await apiFetch("/api/tramites-publico", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setCodigo(data.codigo);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo enviar la solicitud. Intenta de nuevo más tarde."
      );
    } finally {
      setEnviando(false);
    }
  }

  const tipoSeleccionado = tipos.find((t) => String(t.id) === form.tipo_id);
  const esInfoPublica = tipoSeleccionado ? esTipoInformacionPublica(tipoSeleccionado.nombre) : false;

  if (codigo) {
    return (
      <div className="rounded-2xl border border-[#BFE0CC] bg-[#E8F3EC] p-8 text-center">
        <div className="mb-2.5 font-(family-name:--font-lora) text-xl font-bold text-[#154C34]">
          ¡Solicitud registrada!
        </div>
        <p className="mb-1 text-[14.5px] leading-[1.6] text-[#3E4A44]">
          Tu código de seguimiento es:
        </p>
        <p className="mb-5 font-(family-name:--font-lora) text-2xl font-bold text-[#1F6B4A]">
          {codigo}
        </p>
        <p className="mb-5 text-[13.5px] leading-[1.6] text-[#5B6B63]">
          Guarda este código. La Municipalidad se pondrá en contacto contigo
          al correo o teléfono que proporcionaste.
        </p>
        <button
          onClick={() => {
            setForm(initialForm);
            setCodigo(null);
          }}
          className="rounded-lg bg-[#1F6B4A] px-5 py-2.75 text-sm font-semibold text-white"
        >
          Registrar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-[#DCE4DA] bg-white p-6"
    >
      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
          Tipo de trámite
        </label>
        <select
          value={form.tipo_id}
          onChange={(e) => updateForm("tipo_id", e.target.value)}
          className="w-full rounded-[9px] border border-[#DCE4DA] bg-white px-3.5 py-3 text-[14.5px]"
        >
          {tipos.map((t) => (
            <option key={t.id} value={t.id}>{t.nombre}</option>
          ))}
        </select>
      </div>

      {esInfoPublica ? (
        <div className="rounded-xl border border-[#E3CB86] bg-[#F5E9C8] px-5 py-4.5">
          <div className="mb-1.5 text-[14.5px] font-semibold text-[#6B5A20]">
            Las solicitudes de información pública se hacen en el portal oficial
          </div>
          <p className="mb-4 text-[13.5px] leading-[1.6] text-[#6B5A20]">
            Las atiende la Unidad de Información Pública de la Municipalidad,
            conforme a la Ley de Acceso a la Información Pública (Decreto
            57-2008). Ahí podrás dar seguimiento a tu solicitud.
          </p>
          <a
            href={portalInformacionPublica.solicitudes}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-[9px] bg-[#1F6B4A] px-5 py-3 text-sm font-semibold text-white"
          >
            Ir al portal de Información Pública ↗
          </a>
        </div>
      ) : (
      <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
            Nombre completo
          </label>
          <input
            type="text"
            value={form.solicitante_nombre}
            onChange={(e) => updateForm("solicitante_nombre", e.target.value)}
            placeholder="Tu nombre completo"
            className="w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-3 text-[14.5px]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
            DPI
          </label>
          <input
            type="text"
            value={form.solicitante_dpi}
            onChange={(e) => updateForm("solicitante_dpi", e.target.value)}
            placeholder="Número de DPI (13 dígitos)"
            className="w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-3 text-[14.5px]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
            Correo electrónico
          </label>
          <input
            type="email"
            value={form.solicitante_correo}
            onChange={(e) => updateForm("solicitante_correo", e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            className="w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-3 text-[14.5px]"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
            Teléfono
          </label>
          <input
            type="tel"
            value={form.solicitante_telefono}
            onChange={(e) => updateForm("solicitante_telefono", e.target.value)}
            placeholder="Número para contactarte"
            className="w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-3 text-[14.5px]"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
          Describe tu solicitud
        </label>
        <textarea
          value={form.observaciones}
          onChange={(e) => updateForm("observaciones", e.target.value)}
          placeholder="Sé lo más específico posible: qué necesitas, para qué inmueble/persona, fechas, etc."
          rows={4}
          className="w-full resize-y rounded-[9px] border border-[#DCE4DA] px-3.5 py-3 text-[14.5px]"
        />
      </div>

      {/* Honeypot anti-spam: invisible para personas, los bots sí lo llenan. */}
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
        {enviando ? "Enviando..." : "Enviar solicitud"}
      </button>

      <p className="text-[12.5px] leading-[1.6] text-[#9DAFA4]">
        Tus datos se usan únicamente para dar seguimiento a esta solicitud,
        conforme a la Ley de Acceso a la Información Pública.
      </p>
      </>
      )}
    </form>
  );
}
