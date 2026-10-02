"use client";

import { useEffect, useState } from "react";
import { apiFetch, apiDownload } from "@/lib/api";

type ConteoItem = { estado?: string; tipo?: string; total: number };
type Reporte = {
  total: number;
  porEstado: ConteoItem[];
  porTipo: ConteoItem[];
};

function BarraLista({ items, etiquetaKey }: { items: ConteoItem[]; etiquetaKey: "estado" | "tipo" }) {
  const max = Math.max(1, ...items.map((i) => i.total));

  if (items.length === 0) {
    return <p className="text-[13.5px] text-[#5B6B63]">Sin datos para este rango.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item[etiquetaKey]}>
          <div className="mb-1 flex items-center justify-between text-[13.5px]">
            <span className="font-semibold text-[#1B2420]">{item[etiquetaKey]}</span>
            <span className="text-[#5B6B63]">{item.total}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#EFEDE6]">
            <div
              className="h-full rounded-full bg-[#1F6B4A]"
              style={{ width: `${(item.total / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminReportesPage() {
  const [reporte, setReporte] = useState<Reporte | null>(null);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [cargando, setCargando] = useState(true);
  const [exportando, setExportando] = useState<"" | "csv" | "excel">("");
  const [errorExportar, setErrorExportar] = useState("");

  async function cargar(desdeVal?: string, hastaVal?: string) {
    setCargando(true);
    try {
      const params = new URLSearchParams();
      if (desdeVal) params.set("desde", desdeVal);
      if (hastaVal) params.set("hasta", hastaVal);
      const query = params.toString() ? `?${params.toString()}` : "";
      const data = await apiFetch(`/api/reportes/tramites${query}`);
      setReporte(data);
    } catch {
      // Sesión expirada: el layout de /admin redirige a /admin/login.
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  function handleFiltrar(e: React.FormEvent) {
    e.preventDefault();
    cargar(desde || undefined, hasta || undefined);
  }

  function handleLimpiar() {
    setDesde("");
    setHasta("");
    cargar();
  }

  async function exportar(formato: "csv" | "excel") {
    const params = new URLSearchParams();
    if (desde) params.set("desde", desde);
    if (hasta) params.set("hasta", hasta);
    const query = params.toString() ? `?${params.toString()}` : "";
    const ruta = formato === "csv" ? "exportar" : "exportar-excel";
    const hoy = new Date().toLocaleDateString("en-CA"); // AAAA-MM-DD en hora local
    const nombre = `reporte_tramites_${hoy}.${formato === "csv" ? "csv" : "xlsx"}`;

    setErrorExportar("");
    setExportando(formato);
    try {
      await apiDownload(`/api/reportes/tramites/${ruta}${query}`, nombre);
    } catch (err) {
      setErrorExportar(err instanceof Error ? err.message : "No se pudo exportar el reporte.");
    } finally {
      setExportando("");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-(family-name:--font-lora) text-lg font-bold text-[#1B2420]">
          Reportes de trámites
        </h2>

        <form onSubmit={handleFiltrar} className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-[#3E4A44]">Desde</label>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="rounded-[9px] border border-[#DCE4DA] bg-white px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-[#3E4A44]">Hasta</label>
            <input
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
              className="rounded-[9px] border border-[#DCE4DA] bg-white px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-[#1F6B4A] px-4 py-2 text-sm font-semibold text-white"
          >
            Filtrar
          </button>
          {(desde || hasta) && (
            <button
              type="button"
              onClick={handleLimpiar}
              className="rounded-lg border border-[#DCE4DA] px-4 py-2 text-sm font-semibold text-[#3E4A44]"
            >
              Limpiar
            </button>
          )}
          <button
            type="button"
            onClick={() => exportar("csv")}
            disabled={exportando !== ""}
            className="rounded-lg border border-[#DCE4DA] bg-white px-4 py-2 text-sm font-semibold text-[#3E4A44] disabled:opacity-60"
          >
            {exportando === "csv" ? "Exportando..." : "⬇ Exportar CSV"}
          </button>
          <button
            type="button"
            onClick={() => exportar("excel")}
            disabled={exportando !== ""}
            className="rounded-lg border border-[#DCE4DA] bg-white px-4 py-2 text-sm font-semibold text-[#3E4A44] disabled:opacity-60"
          >
            {exportando === "excel" ? "Exportando..." : "⬇ Exportar Excel"}
          </button>
        </form>
      </div>
      {errorExportar && <div className="mb-4 text-[13.5px] text-[#B3261E]">{errorExportar}</div>}

      {cargando || !reporte ? (
        <p className="text-sm text-[#5B6B63]">Cargando...</p>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-[#DCE4DA] bg-white p-6">
            <div className="text-[13px] font-semibold tracking-wide text-[#5B6B63] uppercase">
              Total de trámites
            </div>
            <div className="font-(family-name:--font-lora) text-4xl font-bold text-[#1B2420]">
              {reporte.total}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-[#DCE4DA] bg-white p-6">
              <h3 className="mb-4 font-semibold text-[#1B2420]">Por estado</h3>
              <BarraLista items={reporte.porEstado} etiquetaKey="estado" />
            </div>
            <div className="rounded-2xl border border-[#DCE4DA] bg-white p-6">
              <h3 className="mb-4 font-semibold text-[#1B2420]">Por tipo de trámite</h3>
              <BarraLista items={reporte.porTipo} etiquetaKey="tipo" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
