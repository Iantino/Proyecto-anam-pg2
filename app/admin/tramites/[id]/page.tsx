"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { apiFetch, apiUpload, apiDownload } from "@/lib/api";
import { useSesion, esAdministrador } from "@/lib/sesion";

type Documento = {
  id: number;
  nombre_original: string;
  tipo_mime: string;
  tamano: number;
  fecha_carga: string;
  usuario_id: number;
  subido_por: string | null;
};

function formatearTamano(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type HistorialItem = {
  id: number;
  estado_anterior: string | null;
  estado_nuevo: string;
  usuario: string;
  comentario: string | null;
  fecha: string;
};

type Expediente = {
  id: number;
  codigo: string;
  tipo_nombre: string;
  estado_nombre: string;
  estado_id: number;
  creador_nombre: string;
  responsable_nombre: string | null;
  observaciones: string | null;
  fecha_recepcion: string;
  documentos: Documento[];
  historial: HistorialItem[];
};

type Catalogo = { id: number; nombre: string };
type UsuarioLista = { id: number; nombre: string; usuario: string; rol: string; estado: string };

export default function ExpedientePage() {
  const { id } = useParams<{ id: string }>();
  const sesion = useSesion();
  const admin = esAdministrador(sesion);

  // Eliminación de documentos (con confirmación en línea)
  const [confirmandoId, setConfirmandoId] = useState<number | null>(null);
  const [motivo, setMotivo] = useState("");
  const [eliminando, setEliminando] = useState(false);
  const [descargandoId, setDescargandoId] = useState<number | null>(null);

  const [expediente, setExpediente] = useState<Expediente | null>(null);
  const [estados, setEstados] = useState<Catalogo[]>([]);
  const [usuarios, setUsuarios] = useState<UsuarioLista[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  const [nuevoEstadoId, setNuevoEstadoId] = useState("");
  const [comentario, setComentario] = useState("");
  const [guardandoEstado, setGuardandoEstado] = useState(false);

  const [responsableId, setResponsableId] = useState("");
  const [guardandoResponsable, setGuardandoResponsable] = useState(false);

  const [archivo, setArchivo] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);

  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  const cargar = useCallback(async () => {
    try {
      const [exp, listaEstados] = await Promise.all([
        apiFetch(`/api/tramites/${id}`),
        apiFetch("/api/estados-tramite"),
      ]);
      setExpediente(exp);
      setEstados(listaEstados);
      setNuevoEstadoId(String(exp.estado_id));

      // Asignar responsable es exclusivo del Administrador (el backend
      // también lo bloquea), así que al Operativo ni se le pide la lista.
      if (admin) {
        try {
          const listaUsuarios = await apiFetch("/api/usuarios");
          setUsuarios(listaUsuarios.filter((u: UsuarioLista) => u.estado === "activo"));
        } catch {
          setUsuarios([]);
        }
      }
    } catch (err) {
      // Ej. un Operativo abriendo el enlace de un trámite que no es suyo.
      setErrorCarga(err instanceof Error ? err.message : "No se pudo cargar el trámite.");
    } finally {
      setCargando(false);
    }
  }, [id, admin]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  async function handleCambiarEstado(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAviso("");
    setGuardandoEstado(true);
    try {
      await apiFetch(`/api/tramites/${id}/estado`, {
        method: "PUT",
        body: JSON.stringify({ estado_id: Number(nuevoEstadoId), comentario }),
      });
      setComentario("");
      setAviso("Estado actualizado.");
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cambiar el estado.");
    } finally {
      setGuardandoEstado(false);
    }
  }

  async function handleAsignar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAviso("");
    if (!responsableId) return;
    setGuardandoResponsable(true);
    try {
      await apiFetch(`/api/tramites/${id}/responsable`, {
        method: "PUT",
        body: JSON.stringify({ responsable_id: Number(responsableId) }),
      });
      setAviso("Responsable asignado.");
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo asignar el responsable.");
    } finally {
      setGuardandoResponsable(false);
    }
  }

  async function handleSubirDocumento(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setAviso("");
    if (!archivo) {
      setError("Selecciona un archivo primero.");
      return;
    }
    setSubiendo(true);
    try {
      const formData = new FormData();
      formData.append("archivo", archivo);
      await apiUpload(`/api/tramites/${id}/documentos`, formData);
      setArchivo(null);
      setAviso("Documento subido correctamente.");
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir el documento.");
    } finally {
      setSubiendo(false);
    }
  }

  async function handleDescargar(doc: Documento) {
    setError("");
    setDescargandoId(doc.id);
    try {
      await apiDownload(`/api/tramites/documentos/${doc.id}/descargar`, doc.nombre_original);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo descargar el documento.");
    } finally {
      setDescargandoId(null);
    }
  }

  async function handleEliminarDocumento(doc: Documento) {
    setError("");
    setAviso("");
    setEliminando(true);
    try {
      await apiFetch(`/api/tramites/documentos/${doc.id}`, {
        method: "DELETE",
        body: JSON.stringify({ motivo }),
      });
      setConfirmandoId(null);
      setMotivo("");
      setAviso(`Documento "${doc.nombre_original}" eliminado.`);
      await cargar();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el documento.");
    } finally {
      setEliminando(false);
    }
  }

  // El Administrador elimina cualquiera; el Operativo solo los que él subió
  // (el backend aplica la misma regla).
  const puedeEliminar = (doc: Documento) => admin || doc.usuario_id === sesion?.id;

  if (cargando) return <p className="text-sm text-[#5B6B63]">Cargando...</p>;

  if (errorCarga) {
    return (
      <div className="rounded-2xl border border-[#DCE4DA] bg-white p-7 text-[14.5px] text-[#3E4A44]">
        <div className="mb-1.5 font-semibold text-[#1B2420]">{errorCarga}</div>
        <Link href="/admin/tramites" className="font-semibold text-[#1F6B4A]">
          ← Volver a {admin ? "Trámites" : "mis trámites"}
        </Link>
      </div>
    );
  }

  if (!expediente) return null;

  return (
    <div>
      <Link href="/admin/tramites" className="mb-4 inline-block text-sm font-semibold text-[#1F6B4A]">
        ← Volver a {admin ? "Trámites" : "mis trámites"}
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-(family-name:--font-lora) text-xl font-bold text-[#1B2420]">
            {expediente.codigo}
          </h2>
          <p className="text-sm text-[#5B6B63]">{expediente.tipo_nombre}</p>
        </div>
        <span className="rounded-full bg-[#E8F3EC] px-3 py-1 text-sm font-semibold text-[#1F6B4A]">
          {expediente.estado_nombre}
        </span>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-[#DCE4DA] bg-white p-5 text-[14px] text-[#3E4A44] sm:grid-cols-2">
        <div><span className="text-[#5B6B63]">Creado por:</span> {expediente.creador_nombre}</div>
        <div><span className="text-[#5B6B63]">Responsable:</span> {expediente.responsable_nombre || "Sin asignar"}</div>
        <div><span className="text-[#5B6B63]">Fecha de recepción:</span> {expediente.fecha_recepcion}</div>
        <div className="sm:col-span-2">
          <span className="text-[#5B6B63]">Observaciones:</span>{" "}
          {expediente.observaciones || "—"}
        </div>
      </div>

      {error && <div className="mb-4 text-[13.5px] text-[#B3261E]">{error}</div>}
      {aviso && <div className="mb-4 text-[13.5px] text-[#1F6B4A]">{aviso}</div>}

      <div className={`mb-6 grid grid-cols-1 gap-5 ${admin ? "md:grid-cols-2" : ""}`}>
        <form onSubmit={handleCambiarEstado} className="rounded-2xl border border-[#DCE4DA] bg-white p-5">
          <h3 className="mb-3 font-semibold text-[#1B2420]">Cambiar estado</h3>
          <select
            value={nuevoEstadoId}
            onChange={(e) => setNuevoEstadoId(e.target.value)}
            className="mb-3 w-full rounded-[9px] border border-[#DCE4DA] bg-white px-3.5 py-2.5 text-[14.5px]"
          >
            {estados.map((e) => (
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Comentario (opcional)"
            rows={2}
            className="mb-3 w-full resize-y rounded-[9px] border border-[#DCE4DA] px-3.5 py-2.5 text-[14.5px]"
          />
          <button
            type="submit"
            disabled={guardandoEstado}
            className="rounded-lg bg-[#1F6B4A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {guardandoEstado ? "Guardando..." : "Guardar estado"}
          </button>
        </form>

        {admin && (
        <form onSubmit={handleAsignar} className="rounded-2xl border border-[#DCE4DA] bg-white p-5">
          <h3 className="mb-3 font-semibold text-[#1B2420]">
            {expediente.responsable_nombre ? "Reasignar responsable" : "Asignar responsable"}
          </h3>
          {usuarios.length === 0 ? (
            <p className="text-[13.5px] text-[#5B6B63]">
              No hay usuarios activos para asignar.
            </p>
          ) : (
            <>
              <select
                value={responsableId}
                onChange={(e) => setResponsableId(e.target.value)}
                className="mb-3 w-full rounded-[9px] border border-[#DCE4DA] bg-white px-3.5 py-2.5 text-[14.5px]"
              >
                <option value="">Selecciona un usuario</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>{u.nombre} ({u.rol})</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={guardandoResponsable}
                className="rounded-lg bg-[#1F6B4A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {guardandoResponsable ? "Guardando..." : "Asignar"}
              </button>
            </>
          )}
        </form>
        )}
      </div>

      <div className="mb-6 rounded-2xl border border-[#DCE4DA] bg-white p-5">
        <h3 className="mb-3 font-semibold text-[#1B2420]">
          Documentos ({expediente.documentos.length})
        </h3>

        <form onSubmit={handleSubirDocumento} className="mb-4 flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
            onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            className="text-[13.5px] text-[#3E4A44]"
          />
          <button
            type="submit"
            disabled={subiendo || !archivo}
            className="rounded-lg bg-[#1F6B4A] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {subiendo ? "Subiendo..." : "Subir documento"}
          </button>
        </form>
        <p className="mb-4 text-[12px] text-[#9DAFA4]">
          PDF, Word, Excel o imágenes. Máximo 10 MB.
        </p>

        {expediente.documentos.length === 0 ? (
          <p className="text-[13.5px] text-[#5B6B63]">Sin documentos adjuntos.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-[#EEF2EC]">
            {expediente.documentos.map((d) => (
              <li key={d.id} className="py-2.5 text-[14px]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="break-all text-[#3E4A44]">{d.nombre_original}</div>
                    <div className="text-[12px] text-[#9DAFA4]">
                      Subido por {d.subido_por || "usuario eliminado"} · {d.fecha_carga} · {formatearTamano(d.tamano)}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleDescargar(d)}
                      disabled={descargandoId === d.id}
                      className="text-[13px] font-semibold text-[#1F6B4A] disabled:opacity-60"
                    >
                      {descargandoId === d.id ? "Descargando..." : "Descargar"}
                    </button>
                    {puedeEliminar(d) && confirmandoId !== d.id && (
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmandoId(d.id);
                          setMotivo("");
                          setError("");
                          setAviso("");
                        }}
                        className="text-[13px] font-semibold text-[#B3261E]"
                      >
                        Eliminar
                      </button>
                    )}
                  </div>
                </div>

                {confirmandoId === d.id && (
                  <div className="mt-2.5 rounded-xl border border-[#F2C9C5] bg-[#FDF1F0] p-3.5">
                    <div className="mb-2 text-[13.5px] font-semibold text-[#B3261E]">
                      ¿Eliminar “{d.nombre_original}”? Esta acción no se puede deshacer.
                    </div>
                    <input
                      type="text"
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                      maxLength={500}
                      placeholder="Motivo (opcional), p. ej. archivo equivocado"
                      className="mb-2.5 w-full rounded-lg border border-[#E7B9B4] bg-white px-3 py-2 text-[13.5px]"
                    />
                    {error && <div className="mb-2.5 text-[13px] text-[#B3261E]">{error}</div>}
                    <div className="flex gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleEliminarDocumento(d)}
                        disabled={eliminando}
                        className="rounded-lg bg-[#B3261E] px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60"
                      >
                        {eliminando ? "Eliminando..." : "Sí, eliminar"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmandoId(null)}
                        disabled={eliminando}
                        className="rounded-lg border border-[#DCE4DA] bg-white px-4 py-2 text-[13px] font-semibold text-[#3E4A44]"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-2xl border border-[#DCE4DA] bg-white p-5">
        <h3 className="mb-3 font-semibold text-[#1B2420]">Historial</h3>
        <div className="flex flex-col gap-3">
          {expediente.historial.map((h) => (
            <div key={h.id} className="border-l-2 border-[#DCE4DA] pl-4 text-[13.5px]">
              <div className="font-semibold text-[#1B2420]">
                {h.estado_anterior && h.estado_anterior !== h.estado_nuevo
                  ? `${h.estado_anterior} → ${h.estado_nuevo}`
                  : h.estado_nuevo}
                {h.estado_anterior === h.estado_nuevo && (
                  <span className="ml-1.5 font-normal text-[#9DAFA4]">· sin cambio de estado</span>
                )}
              </div>
              <div className="text-[#5B6B63]">
                {h.usuario} · {h.fecha}
              </div>
              {h.comentario && <div className="mt-1 text-[#3E4A44]">{h.comentario}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
