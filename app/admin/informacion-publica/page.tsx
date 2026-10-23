"use client";

import { useEffect, useRef, useState } from "react";
import { apiFetch, apiUpload, apiBlob } from "@/lib/api";
import { useSesion, esAdministrador } from "@/lib/sesion";

type Foto = { id: number; nombre_original: string };

type Contenido = {
  id: number;
  titulo: string;
  contenido: string;
  categoria: string | null;
  estado: "borrador" | "publicado";
  autor: string;
  fecha_actualizacion: string;
  fotos: Foto[];
};

type FotoPendiente = { clave: string; archivo: File; url: string };

const CATEGORIAS = [
  "Actas del Concejo",
  "Presupuesto",
  "Obras y proyectos",
  "Reglamentos",
  "Otro",
];

// Deben coincidir con el backend (middleware/uploadImagen.js y el controlador).
const FORMATOS = ["image/jpeg", "image/png", "image/webp"];
const TAMANO_MAXIMO_MB = 5;
const MAX_FOTOS = 20;
const FOTOS_POR_ENVIO = 10;

const formVacio = {
  id: null as number | null,
  titulo: "",
  contenido: "",
  categoria: CATEGORIAS[0],
  estado: "borrador" as "borrador" | "publicado",
};

// Miniatura de una foto ya guardada. Se pide con fetch + cookie (apiBlob)
// porque la API está en otro dominio y, si la publicación es borrador,
// solo se la entrega al personal con sesión.
function MiniaturaGuardada({ foto, onQuitar }: { foto: Foto; onQuitar: () => void }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let objeto: string | null = null;
    let activo = true;
    apiBlob(`/api/informacion-publica/fotos/${foto.id}`)
      .then(({ blob }) => {
        objeto = URL.createObjectURL(blob);
        if (activo) setUrl(objeto);
      })
      .catch(() => {});
    return () => {
      activo = false;
      if (objeto) URL.revokeObjectURL(objeto);
    };
  }, [foto.id]);

  return (
    <Miniatura url={url} titulo={foto.nombre_original} onQuitar={onQuitar} />
  );
}

function Miniatura({
  url,
  titulo,
  onQuitar,
  etiqueta,
}: {
  url: string | null;
  titulo: string;
  onQuitar: () => void;
  etiqueta?: string;
}) {
  return (
    <div className="relative aspect-4/3 overflow-hidden rounded-lg border border-[#DCE4DA] bg-[#F0F5EE]">
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={titulo} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-[#9DAFA4]">
          Cargando...
        </div>
      )}
      {etiqueta && (
        <span className="absolute bottom-1.5 left-1.5 rounded bg-[#C69A2A] px-1.5 py-0.5 text-[10.5px] font-semibold text-[#1B2420]">
          {etiqueta}
        </span>
      )}
      <button
        type="button"
        onClick={onQuitar}
        title="Quitar foto"
        aria-label={`Quitar ${titulo}`}
        className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-sm font-bold text-[#B3261E] shadow"
      >
        ✕
      </button>
    </div>
  );
}

export default function AdminInformacionPublicaPage() {
  const admin = esAdministrador(useSesion());
  const [items, setItems] = useState<Contenido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(formVacio);
  const [fotosGuardadas, setFotosGuardadas] = useState<Foto[]>([]);
  const [pendientes, setPendientes] = useState<FotoPendiente[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const inputFotos = useRef<HTMLInputElement>(null);

  async function cargar() {
    try {
      const data = await apiFetch("/api/informacion-publica/admin");
      setItems(data);
      return data as Contenido[];
    } catch {
      // sesión expirada: el layout redirige
      return [];
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function limpiarPendientes() {
    setPendientes((actuales) => {
      actuales.forEach((p) => URL.revokeObjectURL(p.url));
      return [];
    });
  }

  function cerrarForm() {
    limpiarPendientes();
    setError("");
    setMostrarForm(false);
  }

  function nuevo() {
    limpiarPendientes();
    setForm(formVacio);
    setFotosGuardadas([]);
    setError("");
    setMostrarForm(true);
  }

  function editar(item: Contenido) {
    limpiarPendientes();
    setForm({
      id: item.id,
      titulo: item.titulo,
      contenido: item.contenido,
      categoria: item.categoria || CATEGORIAS[0],
      estado: item.estado,
    });
    setFotosGuardadas(item.fotos || []);
    setError("");
    setMostrarForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function agregarFotos(e: React.ChangeEvent<HTMLInputElement>) {
    const archivos = Array.from(e.target.files || []);
    e.target.value = ""; // permite volver a elegir el mismo archivo
    if (archivos.length === 0) return;

    const rechazados: string[] = [];
    const validos: FotoPendiente[] = [];
    let espacio = MAX_FOTOS - fotosGuardadas.length - pendientes.length;

    for (const archivo of archivos) {
      if (!FORMATOS.includes(archivo.type)) {
        rechazados.push(`${archivo.name} (formato no permitido)`);
      } else if (archivo.size > TAMANO_MAXIMO_MB * 1024 * 1024) {
        rechazados.push(`${archivo.name} (pesa más de ${TAMANO_MAXIMO_MB} MB)`);
      } else if (espacio <= 0) {
        rechazados.push(`${archivo.name} (límite de ${MAX_FOTOS} fotos)`);
      } else {
        validos.push({
          clave: `${archivo.name}-${archivo.size}-${archivo.lastModified}-${Math.random()}`,
          archivo,
          url: URL.createObjectURL(archivo),
        });
        espacio--;
      }
    }

    setPendientes((p) => [...p, ...validos]);
    setError(rechazados.length ? `No se agregaron: ${rechazados.join(", ")}.` : "");
  }

  function quitarPendiente(clave: string) {
    setPendientes((p) => {
      const quitada = p.find((x) => x.clave === clave);
      if (quitada) URL.revokeObjectURL(quitada.url);
      return p.filter((x) => x.clave !== clave);
    });
  }

  async function quitarGuardada(foto: Foto) {
    if (!window.confirm("¿Eliminar esta foto? Se borra de inmediato.")) return;
    try {
      await apiFetch(`/api/informacion-publica/fotos/${foto.id}`, { method: "DELETE" });
      setFotosGuardadas((f) => f.filter((x) => x.id !== foto.id));
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar la foto.");
    }
  }

  async function subirPendientes(id: number) {
    for (let i = 0; i < pendientes.length; i += FOTOS_POR_ENVIO) {
      const lote = pendientes.slice(i, i + FOTOS_POR_ENVIO);
      const formData = new FormData();
      lote.forEach((p) => formData.append("fotos", p.archivo));
      const data = await apiUpload(`/api/informacion-publica/${id}/fotos`, formData);
      setFotosGuardadas(data.fotos);
      // Las que ya subieron se quitan de pendientes, por si falla un lote posterior.
      const subidas = new Set(lote.map((p) => p.clave));
      lote.forEach((p) => URL.revokeObjectURL(p.url));
      setPendientes((p) => p.filter((x) => !subidas.has(x.clave)));
    }
  }

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.titulo.trim() || !form.contenido.trim()) {
      setError("Título y contenido son obligatorios.");
      return;
    }
    setGuardando(true);
    let id = form.id;
    try {
      if (id) {
        await apiFetch(`/api/informacion-publica/${id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        const creado = await apiFetch("/api/informacion-publica", {
          method: "POST",
          body: JSON.stringify(form),
        });
        id = creado.id as number;
        // Si luego falla la subida de fotos, al reintentar se edita esta
        // misma publicación en vez de crear una duplicada.
        setForm((f) => ({ ...f, id }));
      }

      if (pendientes.length > 0) {
        try {
          await subirPendientes(id!);
        } catch (err) {
          await cargar();
          setError(
            `El contenido se guardó, pero algunas fotos no se subieron: ${
              err instanceof Error ? err.message : "error desconocido"
            }. Revisa y vuelve a darle Guardar.`
          );
          return;
        }
      }

      cerrarForm();
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setGuardando(false);
    }
  }

  async function handleEliminar(item: Contenido) {
    const fotos = item.fotos?.length
      ? ` y sus ${item.fotos.length} ${item.fotos.length === 1 ? "foto" : "fotos"}`
      : "";
    if (!window.confirm(`¿Eliminar "${item.titulo}"${fotos}? Esta acción no se puede deshacer.`)) {
      return;
    }
    try {
      await apiFetch(`/api/informacion-publica/${item.id}`, { method: "DELETE" });
      if (form.id === item.id) cerrarForm();
      await cargar();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "No se pudo eliminar.");
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

  const totalFotos = fotosGuardadas.length + pendientes.length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-(family-name:--font-lora) text-lg font-bold text-[#1B2420]">
            Información pública ({items.length})
          </h2>
          <p className="text-[13px] text-[#5B6B63]">
            Contenido visible en la página pública &quot;Transparencia&quot; del sitio.
          </p>
        </div>
        <button
          onClick={mostrarForm ? cerrarForm : nuevo}
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

          <div>
            <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-2">
              <label className="block text-[13px] font-semibold text-[#3E4A44]">
                Fotos ({totalFotos}/{MAX_FOTOS})
              </label>
              <span className="text-[12px] text-[#5B6B63]">
                JPG, PNG o WEBP · máximo {TAMANO_MAXIMO_MB} MB cada una
              </span>
            </div>

            {totalFotos > 0 && (
              <div className="mb-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                {fotosGuardadas.map((foto) => (
                  <MiniaturaGuardada
                    key={foto.id}
                    foto={foto}
                    onQuitar={() => quitarGuardada(foto)}
                  />
                ))}
                {pendientes.map((p) => (
                  <Miniatura
                    key={p.clave}
                    url={p.url}
                    titulo={p.archivo.name}
                    etiqueta="Sin guardar"
                    onQuitar={() => quitarPendiente(p.clave)}
                  />
                ))}
              </div>
            )}

            <input
              ref={inputFotos}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={agregarFotos}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => inputFotos.current?.click()}
              disabled={totalFotos >= MAX_FOTOS}
              className="w-full rounded-[9px] border-[1.5px] border-dashed border-[#9DAFA4] bg-[#F7FAF6] px-4 py-4 text-[13.5px] font-semibold text-[#1F6B4A] disabled:opacity-50"
            >
              + Agregar fotos
            </button>
            {pendientes.length > 0 && (
              <p className="mt-1.5 text-[12px] text-[#8A6A12]">
                Las fotos marcadas &quot;Sin guardar&quot; se suben al darle Guardar.
              </p>
            )}
          </div>

          {error && <div className="text-[13.5px] text-[#B3261E]">{error}</div>}

          <button
            type="submit"
            disabled={guardando}
            className="self-start rounded-lg bg-[#1F6B4A] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {guardando ? (pendientes.length ? "Subiendo fotos..." : "Guardando...") : "Guardar"}
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
              {item.fotos?.length > 0 &&
                ` · ${item.fotos.length} ${item.fotos.length === 1 ? "foto" : "fotos"}`}
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
              {admin && (
                <button
                  onClick={() => handleEliminar(item)}
                  className="ml-auto text-[13px] font-semibold text-[#B3261E]"
                >
                  Eliminar
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
