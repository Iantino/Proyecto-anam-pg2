"use client";

import { useState } from "react";
import type { Tramite } from "@/lib/data";

export default function TramitesAccordion({
  tramites,
}: {
  tramites: Tramite[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="mb-10 flex flex-col gap-3.5">
      {tramites.map((tram) => {
        const isOpen = openId === tram.id;
        return (
          <div
            key={tram.id}
            className="overflow-hidden rounded-2xl border border-[#DCE4DA] bg-white"
          >
            <button
              onClick={() => setOpenId(isOpen ? null : tram.id)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5.5 text-left"
            >
              <div>
                <div className="font-(family-name:--font-lora) text-lg font-semibold text-[#1B2420]">
                  {tram.title}
                </div>
                <div className="mt-1 text-[13.5px] text-[#5B6B63]">
                  {tram.summary}
                </div>
              </div>
              <div
                className="text-[#5B6B63] transition-transform duration-150"
                style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                ▾
              </div>
            </button>
            {isOpen && (
              <div className="px-6 pb-6">
                <div className="mb-4.5 h-px bg-[#EDF1EB]" />
                <ul className="m-0 list-disc pl-5 text-[14.5px] leading-[1.9] text-[#3E4A44]">
                  {tram.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                {tram.note && (
                  <div className="mt-3.5 rounded-[10px] border border-[#E3CB86] bg-[#F5E9C8] px-4 py-3 text-[13px] leading-[1.6] text-[#6B5A20]">
                    {tram.note}
                  </div>
                )}
                {tram.enlace && (
                  <a
                    href={tram.enlace.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block rounded-[9px] bg-[#1F6B4A] px-5 py-3 text-sm font-semibold text-white"
                  >
                    {tram.enlace.label} ↗
                  </a>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
