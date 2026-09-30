import type { Metadata } from "next";
import { portalInformacionPublica } from "@/lib/data";

export const metadata: Metadata = {
  title: "Transparencia | Municipalidad de San Pablo Jocopilas",
  description:
    "Información pública de oficio de la Municipalidad de San Pablo Jocopilas: actas, presupuesto, obras y reglamentos.",
};

type Contenido = {
  id: number;
  titulo: string;
  contenido: string;
  categoria: string | null;
  fecha_actualizacion: string;
};

async function obtenerContenido(): Promise<Contenido[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  try {
    const res = await fetch(`${API_URL}/api/informacion-publica`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function TransparenciaPage() {
  const items = await obtenerContenido();

  return (
    <section className="mx-auto max-w-4xl px-6 pt-15 pb-22.5">
      <div className="mb-2.5 text-xs font-semibold tracking-[.08em] text-[#C69A2A] uppercase">
        Acceso a la información
      </div>
      <h1 className="mb-4.5 font-(family-name:--font-lora) text-[38px] font-bold">
        Transparencia
      </h1>
      <p className="mb-10 text-[15.5px] leading-[1.7] text-[#3E4A44]">
        Información pública de oficio, conforme a la Ley de Acceso a la
        Información Pública de Guatemala. Si buscas algo que no está aquí,
        puedes{" "}
        <a
          href={portalInformacionPublica.solicitudes}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#1F6B4A]"
        >
          solicitarlo en el portal oficial
        </a>
        .
      </p>

      <div className="mb-10 flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-[#163A2B] p-7">
        <div className="max-w-md">
          <div className="mb-1.5 font-(family-name:--font-lora) text-lg font-bold text-white">
            Portal de Información Pública
          </div>
          <p className="text-[14px] leading-[1.6] text-[#CBD8CF]">
            Las solicitudes de información las atiende la Unidad de
            Información Pública de la Municipalidad a través de su portal
            oficial, donde también se publica la información de oficio.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={portalInformacionPublica.solicitudes}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-[#C69A2A] px-5 py-3 text-sm font-semibold text-[#1B2420]"
          >
            Solicitar información ↗
          </a>
          <a
            href={portalInformacionPublica.informacionDeOficio}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border-[1.5px] border-white/60 px-5 py-3 text-sm font-semibold text-white"
          >
            Ver información de oficio ↗
          </a>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-[#DCE4DA] bg-[#F0F5EE] p-7 text-[14.5px] text-[#3E4A44]">
          Todavía no hay contenido publicado en esta sección.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-[#DCE4DA] bg-white p-6.5"
            >
              {item.categoria && (
                <div className="mb-2 text-xs font-semibold tracking-wide text-[#C69A2A] uppercase">
                  {item.categoria}
                </div>
              )}
              <h2 className="mb-2.5 font-(family-name:--font-lora) text-xl font-bold text-[#1B2420]">
                {item.titulo}
              </h2>
              <p className="mb-3 text-[14.5px] leading-[1.7] whitespace-pre-line text-[#3E4A44]">
                {item.contenido}
              </p>
              <div className="text-[12.5px] text-[#9DAFA4]">
                Actualizado: {item.fecha_actualizacion}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
