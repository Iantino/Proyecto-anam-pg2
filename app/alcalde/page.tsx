import type { Metadata } from "next";
import Link from "next/link";
import ImagePlaceholder from "@/components/image-placeholder";

export const metadata: Metadata = {
  title: "Alcalde Municipal | San Pablo Jocopilas",
  description:
    "Biografía del Alcalde Municipal de San Pablo Jocopilas: datos personales, formación, trayectoria, logros y ejes de trabajo.",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

type Biografia = {
  nombre_completo: string;
  cargo: string;
  periodo: string | null;
  partido_politico: string | null;
  fecha_nacimiento: string | null;
  lugar_nacimiento: string | null;
  familia: string | null;
  resumen: string | null;
  formacion_academica: string | null;
  trayectoria_profesional: string | null;
  trayectoria_politica: string | null;
  logros: string | null;
  ejes_trabajo: string | null;
  mensaje: string | null;
  tiene_foto: boolean;
  fecha_actualizacion: string;
};

async function obtenerBiografia(): Promise<Biografia | null> {
  try {
    const res = await fetch(`${API_URL}/api/alcalde`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Los campos de lista se escriben en el panel "un elemento por línea".
function lineas(texto: string | null): string[] {
  if (!texto) return [];
  return texto
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*[-•*]\s*/, "").trim())
    .filter(Boolean);
}

function formatearFecha(iso: string) {
  const [anio, mes, dia] = iso.split("-").map(Number);
  return new Date(anio, mes - 1, dia).toLocaleDateString("es-GT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function calcularEdad(iso: string) {
  const [anio, mes, dia] = iso.split("-").map(Number);
  const hoy = new Date();
  let edad = hoy.getFullYear() - anio;
  if (hoy.getMonth() + 1 < mes || (hoy.getMonth() + 1 === mes && hoy.getDate() < dia)) {
    edad--;
  }
  return edad;
}

function TituloSeccion({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-5 font-(family-name:--font-lora) text-2xl font-bold">
      {children}
    </h2>
  );
}

// Lista con estilo de línea de tiempo (formación y trayectorias).
function LineaTiempo({ items }: { items: string[] }) {
  return (
    <ol className="relative ml-2 border-l-2 border-[#DCE4DA]">
      {items.map((item, i) => (
        <li key={i} className="relative pb-5 pl-6 last:pb-0">
          <span className="absolute top-1.5 -left-[7px] h-3 w-3 rounded-full border-2 border-[#C69A2A] bg-white" />
          <p className="text-[15px] leading-[1.6] text-[#3E4A44]">{item}</p>
        </li>
      ))}
    </ol>
  );
}

function Parrafos({ texto }: { texto: string }) {
  return (
    <div className="flex flex-col gap-4">
      {texto
        .split(/\r?\n\s*\r?\n/)
        .filter((p) => p.trim())
        .map((p, i) => (
          <p key={i} className="text-base leading-[1.75] whitespace-pre-line text-[#3E4A44]">
            {p.trim()}
          </p>
        ))}
    </div>
  );
}

export default async function AlcaldePage() {
  const bio = await obtenerBiografia();

  if (!bio) {
    return (
      <section className="mx-auto max-w-4xl px-6 pt-15 pb-22.5">
        <div className="mb-2.5 text-xs font-semibold tracking-[.08em] text-[#C69A2A] uppercase">
          Gobierno municipal
        </div>
        <h1 className="mb-6 font-(family-name:--font-lora) text-[38px] font-bold">
          Alcalde Municipal
        </h1>
        <div className="rounded-2xl border border-[#DCE4DA] bg-[#F0F5EE] p-7 text-[14.5px] text-[#3E4A44]">
          La biografía del alcalde estará disponible próximamente.
        </div>
      </section>
    );
  }

  const formacion = lineas(bio.formacion_academica);
  const profesional = lineas(bio.trayectoria_profesional);
  const politica = lineas(bio.trayectoria_politica);
  const logros = lineas(bio.logros);
  const ejes = lineas(bio.ejes_trabajo);

  const datosPersonales = [
    bio.fecha_nacimiento && {
      label: "Fecha de nacimiento",
      value: `${formatearFecha(bio.fecha_nacimiento)} (${calcularEdad(bio.fecha_nacimiento)} años)`,
    },
    bio.lugar_nacimiento && { label: "Lugar de nacimiento", value: bio.lugar_nacimiento },
    bio.periodo && { label: "Periodo de gobierno", value: bio.periodo },
    bio.partido_politico && { label: "Partido político", value: bio.partido_politico },
  ].filter(Boolean) as { label: string; value: string }[];

  // El parámetro ?v= evita que el navegador muestre una foto vieja en caché.
  const fotoUrl = `${API_URL}/api/alcalde/foto?v=${encodeURIComponent(bio.fecha_actualizacion)}`;

  return (
    <section className="mx-auto max-w-6xl px-6 pt-15 pb-22.5">
      {/* Encabezado: foto + nombre + reseña */}
      <div className="mb-14 grid grid-cols-1 items-start gap-10 md:grid-cols-[300px_1fr] md:gap-14">
        <div className="mx-auto w-full max-w-75 overflow-hidden rounded-2xl border-4 border-white shadow-[0_12px_30px_rgba(22,58,43,0.15)] ring-2 ring-[#C69A2A] md:mx-0">
          <div className="aspect-4/5">
            {bio.tiene_foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={fotoUrl}
                alt={`Fotografía de ${bio.nombre_completo}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImagePlaceholder label="Fotografía oficial del alcalde" />
            )}
          </div>
        </div>

        <div>
          <div className="mb-2.5 text-xs font-semibold tracking-[.08em] text-[#C69A2A] uppercase">
            Gobierno municipal
          </div>
          <h1 className="mb-3 font-(family-name:--font-lora) text-[clamp(30px,4.5vw,42px)] leading-[1.12] font-bold">
            {bio.nombre_completo}
          </h1>
          <div className="mb-6 flex flex-wrap items-center gap-2.5">
            <span className="rounded-full bg-[#1F6B4A] px-3.5 py-1.5 text-[13px] font-semibold text-white">
              {bio.cargo}
            </span>
            {bio.periodo && (
              <span className="rounded-full border border-[#C69A2A] bg-[#F5E9C8] px-3.5 py-1.5 text-[13px] font-semibold text-[#6B5A20]">
                Periodo {bio.periodo}
              </span>
            )}
          </div>
          {bio.resumen && <Parrafos texto={bio.resumen} />}
        </div>
      </div>

      {/* Datos personales */}
      {datosPersonales.length > 0 && (
        <div className="mb-14 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-px overflow-hidden rounded-2xl border border-[#DCE4DA] bg-[#DCE4DA]">
          {datosPersonales.map((d) => (
            <div key={d.label} className="bg-white px-5.5 py-6">
              <div className="mb-1.5 text-[13px] text-[#5B6B63]">{d.label}</div>
              <div className="text-base leading-[1.4] font-semibold text-[#1B2420]">{d.value}</div>
            </div>
          ))}
        </div>
      )}

      {bio.familia && (
        <div className="mb-14">
          <TituloSeccion>Familia y vida personal</TituloSeccion>
          <div className="max-w-195">
            <Parrafos texto={bio.familia} />
          </div>
        </div>
      )}

      {/* Formación + trayectoria profesional, lado a lado en pantallas grandes */}
      {(formacion.length > 0 || profesional.length > 0) && (
        <div className="mb-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {formacion.length > 0 && (
            <div className="rounded-2xl border border-[#DCE4DA] bg-white p-7">
              <TituloSeccion>Formación académica</TituloSeccion>
              <LineaTiempo items={formacion} />
            </div>
          )}
          {profesional.length > 0 && (
            <div className="rounded-2xl border border-[#DCE4DA] bg-white p-7">
              <TituloSeccion>Trayectoria profesional</TituloSeccion>
              <LineaTiempo items={profesional} />
            </div>
          )}
        </div>
      )}

      {politica.length > 0 && (
        <div className="mb-14">
          <TituloSeccion>Trayectoria en el servicio público</TituloSeccion>
          <div className="rounded-2xl border border-[#DCE4DA] bg-[#F0F5EE] p-7">
            <LineaTiempo items={politica} />
          </div>
        </div>
      )}

      {logros.length > 0 && (
        <div className="mb-14">
          <TituloSeccion>Logros y reconocimientos</TituloSeccion>
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {logros.map((logro, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-xl border border-[#DCE4DA] bg-white px-5 py-4 text-[15px] leading-[1.55] text-[#3E4A44]"
              >
                <span className="mt-0.5 font-bold text-[#C69A2A]">★</span>
                <span>{logro}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {ejes.length > 0 && (
        <div className="mb-14">
          <TituloSeccion>Ejes de trabajo de su gestión</TituloSeccion>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-5">
            {ejes.map((eje, i) => (
              <div key={i} className="rounded-2xl border border-[#DCE4DA] bg-white p-5.5">
                <div className="mb-2 font-(family-name:--font-lora) text-2xl font-bold text-[#C69A2A]">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="text-[15px] leading-normal font-medium text-[#1B2420]">{eje}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {bio.mensaje && (
        <div className="mb-10">
          <TituloSeccion>Mensaje a la población</TituloSeccion>
          <blockquote className="rounded-2xl border-l-4 border-[#C69A2A] bg-white px-7 py-6 shadow-[0_8px_24px_rgba(22,58,43,0.06)]">
            <p className="mb-4 font-(family-name:--font-lora) text-lg leading-[1.7] whitespace-pre-line text-[#1B2420] italic">
              “{bio.mensaje}”
            </p>
            <footer className="text-sm font-semibold text-[#1F6B4A]">
              — {bio.nombre_completo}, {bio.cargo}
            </footer>
          </blockquote>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#DCE4DA] pt-6 text-[13px] text-[#5B6B63]">
        <span>Última actualización: {bio.fecha_actualizacion.slice(0, 10)}</span>
        <Link href="/contacto" className="font-semibold text-[#1F6B4A]">
          ¿Quieres comunicarte con la Municipalidad? Escríbenos →
        </Link>
      </div>
    </section>
  );
}
