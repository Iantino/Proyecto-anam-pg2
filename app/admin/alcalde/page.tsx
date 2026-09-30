"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch, apiUpload, API_URL } from "@/lib/api";

type Biografia = {
  nombre_completo: string;
  cargo: string;
  periodo: string;
  partido_politico: string;
  fecha_nacimiento: string;
  lugar_nacimiento: string;
  familia: string;
  resumen: string;
  formacion_academica: string;
  trayectoria_profesional: string;
  trayectoria_politica: string;
  logros: string;
  ejes_trabajo: string;
  mensaje: string;
  publicado: boolean;
};

type CampoTexto = Exclude<keyof Biografia, "publicado">;

const vacio: Biografia = {
  nombre_completo: "", cargo: "Alcalde Municipal", periodo: "", partido_politico: "",
  fecha_nacimiento: "", lugar_nacimiento: "", familia: "", resumen: "",
  formacion_academica: "", trayectoria_profesional: "", trayectoria_politica: "",
  logros: "", ejes_trabajo: "", mensaje: "", publicado: false,
};

const inputClase =
  "w-full rounded-[9px] border border-[#DCE4DA] px-3.5 py-2.5 text-[14.5px]";

// La API devuelve null en campos vacíos; el formulario necesita strings.
function normalizar(data: Record<string, unknown>): Biografia {
  const resultado = { ...vacio };
  for (const clave of Object.keys(vacio) as (keyof Biografia)[]) {
    const valor = data[clave];
    if (clave === "publicado") resultado.publicado = Boolean(valor);
    else if (typeof valor === "string") resultado[clave] = valor;
  }
  return resultado;
}

function Tarjeta({ titulo, descripcion, children }: {
  titulo: string;
  descripcion?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[#DCE4DA] bg-white p-6">
      <h3 className="mb-1 font-(family-name:--font-lora) text-base font-bold text-[#1B2420]">
        {titulo}
      </h3>
      {descripcion && <p className="mb-4 text-[13px] text-[#5B6B63]">{descripcion}</p>}
      <div className={descripcion ? "" : "mt-4"}>{children}</div>
    </div>
  );
}

export default function AdminAlcaldePage() {
  const [datos, setDatos] = useState<Biografia>(vacio);
  const [tieneFoto, setTieneFoto] = useState(false);
  const [versionFoto, setVersionFoto] = useState("");
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  const [archivo, setArchivo] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [avisoFoto, setAvisoFoto] = useState("");
  const [errorFoto, setErrorFoto] = useState("");

  useEffect(() => {
    apiFetch("/api/alcalde/admin")
      .then((data) => {
        setDatos(normalizar(data));
        setTieneFoto(Boolean(data.tiene_foto));
        setVersionFoto(data.fecha_actualizacion ?? "");
      })
      .catch((err) =>
        setErrorCarga(err instanceof Error ? err.message : "No se pudo cargar la biografía.")
      )
      .finally(() => setCargando(false));
  }, []);

  function actualizar(campo: CampoTexto, valor: string) {
    setDatos((d) => ({ ...d, [campo]: valor }));
    setAviso("");
  }

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAviso("");
    setGuardando(true);
    try {
      const data = await apiFetch("/api/alcalde", {
        method: "PUT",
        body: JSON.stringify(datos),
      });
      setDatos(normalizar(data));
      setAviso(
        data.publicado
          ? "Biografía guardada y visible en el sitio público."
          : "Biografía guardada. Aún no es visible en el sitio público."
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  }

  async function handleSubirFoto() {
    if (!archivo) return;
    setErrorFoto("");
    setAvisoFoto("");
    setSubiendo(true);
    try {
      const formData = new FormData();
      formData.append("foto", archivo);
      const data = await apiUpload("/api/alcalde/foto", formData);
      setTieneFoto(true);
      setVersionFoto(data.fecha_actualizacion ?? String(Date.now()));
      setArchivo(null);
      setAvisoFoto("Fotografía actualizada.");
    } catch (err) {
      setErrorFoto(err instanceof Error ? err.message : "No se pudo subir la foto.");
    } finally {
      setSubiendo(false);
    }
  }

  // Se llama como función (no como <AreaTexto />) para que el textarea no se
  // vuelva a montar en cada tecla y no pierda el foco mientras se escribe.
  function AreaTexto({ campo, etiqueta, ayuda, filas = 4 }: {
    campo: CampoTexto;
    etiqueta: string;
    ayuda?: string;
    filas?: number;
  }) {
    return (
      <div>
        <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">{etiqueta}</label>
        {ayuda && <p className="mb-1.5 text-[12.5px] text-[#9DAFA4]">{ayuda}</p>}
        <textarea
          rows={filas}
          value={datos[campo]}
          onChange={(e) => actualizar(campo, e.target.value)}
          className={`${inputClase} leading-[1.6]`}
        />
      </div>
    );
  }

  if (cargando) return <p className="text-sm text-[#5B6B63]">Cargando...</p>;

  if (errorCarga) {
    return (
      <div className="rounded-2xl border border-[#F2C9C5] bg-[#FDF1F0] p-6 text-[14px] text-[#B3261E]">
        {errorCarga}
      </div>
    );
  }

  const UNA_POR_LINEA = "Escribe un elemento por línea; en el sitio se muestran como lista.";

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="mb-1.5 font-(family-name:--font-lora) text-lg font-bold text-[#1B2420]">
            Biografía del alcalde
          </h2>
          <p className="text-[13.5px] text-[#5B6B63]">
            Se muestra en la sección “Alcalde” del sitio público. Los apartados vacíos no aparecen.
          </p>
        </div>
        <Link
          href="/alcalde"
          target="_blank"
          className="rounded-lg border border-[#DCE4DA] bg-white px-4 py-2 text-sm font-semibold text-[#1F6B4A]"
        >
          Ver página pública ↗
        </Link>
      </div>

      <div className="flex flex-col gap-5">
        {/* Foto: se sube por separado del formulario */}
        <Tarjeta titulo="Fotografía oficial" descripcion="JPG, PNG o WEBP de máximo 5 MB. Se recomienda una foto vertical.">
          <div className="flex flex-wrap items-center gap-5">
            <div className="h-40 w-32 shrink-0 overflow-hidden rounded-xl border border-[#DCE4DA] bg-[#F0F5EE]">
              {tieneFoto ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={`${API_URL}/api/alcalde/foto?v=${encodeURIComponent(versionFoto)}`}
                  alt="Foto actual del alcalde"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-3 text-center text-[12px] text-[#5B6B63]">
                  Sin fotografía
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2.5">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) => {
                  setArchivo(e.target.files?.[0] ?? null);
                  setAvisoFoto("");
                  setErrorFoto("");
                }}
                className="text-[13.5px]"
              />
              <button
                type="button"
                onClick={handleSubirFoto}
                disabled={!archivo || subiendo}
                className="self-start rounded-lg bg-[#1F6B4A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {subiendo ? "Subiendo..." : tieneFoto ? "Reemplazar foto" : "Subir foto"}
              </button>
              {errorFoto && <div className="text-[13px] text-[#B3261E]">{errorFoto}</div>}
              {avisoFoto && <div className="text-[13px] text-[#1F6B4A]">{avisoFoto}</div>}
            </div>
          </div>
        </Tarjeta>

        <form onSubmit={handleGuardar} className="flex flex-col gap-5">
          <Tarjeta titulo="Datos generales">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  maxLength={150}
                  value={datos.nombre_completo}
                  onChange={(e) => actualizar("nombre_completo", e.target.value)}
                  className={inputClase}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">Cargo</label>
                <input
                  type="text"
                  maxLength={100}
                  value={datos.cargo}
                  onChange={(e) => actualizar("cargo", e.target.value)}
                  className={inputClase}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
                  Periodo de gobierno
                </label>
                <input
                  type="text"
                  maxLength={50}
                  placeholder="Ej. 2024 - 2028"
                  value={datos.periodo}
                  onChange={(e) => actualizar("periodo", e.target.value)}
                  className={inputClase}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  value={datos.fecha_nacimiento}
                  onChange={(e) => actualizar("fecha_nacimiento", e.target.value)}
                  className={inputClase}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
                  Lugar de nacimiento
                </label>
                <input
                  type="text"
                  maxLength={150}
                  placeholder="Ej. San Pablo Jocopilas, Suchitepéquez"
                  value={datos.lugar_nacimiento}
                  onChange={(e) => actualizar("lugar_nacimiento", e.target.value)}
                  className={inputClase}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[13px] font-semibold text-[#3E4A44]">
                  Partido político <span className="font-normal text-[#9DAFA4]">(opcional)</span>
                </label>
                <input
                  type="text"
                  maxLength={150}
                  value={datos.partido_politico}
                  onChange={(e) => actualizar("partido_politico", e.target.value)}
                  className={inputClase}
                />
              </div>
            </div>
          </Tarjeta>

          <Tarjeta titulo="Reseña y vida personal">
            <div className="flex flex-col gap-4">
              {AreaTexto({
                campo: "resumen",
                etiqueta: "Reseña biográfica *",
                ayuda: "Texto de presentación que aparece junto a la foto. Deja una línea en blanco para separar párrafos.",
                filas: 6,
              })}
              {AreaTexto({
                campo: "familia",
                etiqueta: "Familia y vida personal",
                ayuda: "Ej. estado civil, esposa/esposo, hijos, pasatiempos, arraigo en la comunidad.",
              })}
            </div>
          </Tarjeta>

          <Tarjeta titulo="Formación y trayectoria">
            <div className="flex flex-col gap-4">
              {AreaTexto({ campo: "formacion_academica", etiqueta: "Formación académica", ayuda: UNA_POR_LINEA })}
              {AreaTexto({ campo: "trayectoria_profesional", etiqueta: "Trayectoria profesional", ayuda: UNA_POR_LINEA })}
              {AreaTexto({
                campo: "trayectoria_politica",
                etiqueta: "Trayectoria en el servicio público",
                ayuda: `${UNA_POR_LINEA} Ej. "2016 - 2020 · Concejal I".`,
              })}
            </div>
          </Tarjeta>

          <Tarjeta titulo="Gestión">
            <div className="flex flex-col gap-4">
              {AreaTexto({ campo: "logros", etiqueta: "Logros y reconocimientos", ayuda: UNA_POR_LINEA })}
              {AreaTexto({ campo: "ejes_trabajo", etiqueta: "Ejes de trabajo de su gestión", ayuda: UNA_POR_LINEA })}
              {AreaTexto({ campo: "mensaje", etiqueta: "Mensaje a la población", filas: 3 })}
            </div>
          </Tarjeta>

          <div className="rounded-2xl border border-[#DCE4DA] bg-white p-6">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={datos.publicado}
                onChange={(e) => {
                  setDatos((d) => ({ ...d, publicado: e.target.checked }));
                  setAviso("");
                }}
                className="mt-1 h-4 w-4 accent-[#1F6B4A]"
              />
              <span>
                <span className="block text-[14px] font-semibold text-[#1B2420]">
                  Mostrar en el sitio público
                </span>
                <span className="text-[13px] text-[#5B6B63]">
                  Si está desmarcado, los visitantes verán “disponible próximamente”.
                </span>
              </span>
            </label>
          </div>

          {error && <div className="text-[13.5px] text-[#B3261E]">{error}</div>}
          {aviso && <div className="text-[13.5px] text-[#1F6B4A]">{aviso}</div>}

          <button
            type="submit"
            disabled={guardando}
            className="self-start rounded-lg bg-[#1F6B4A] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {guardando ? "Guardando..." : "Guardar biografía"}
          </button>
        </form>
      </div>
    </div>
  );
}
