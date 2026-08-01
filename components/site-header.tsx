"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navItems } from "@/lib/data";

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#DCE4DA] bg-[#FBF9F3]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div className="h-13 w-13 shrink-0 overflow-hidden rounded-full border-2 border-[#C69A2A] bg-white">
            <Image
              src="/images/logo-shield.png"
              alt="Escudo de la Municipalidad de San Pablo Jocopilas"
              width={52}
              height={52}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div>
            <div className="font-(family-name:--font-lora) text-[17px] leading-[1.15] font-bold">
              Municipalidad de
              <br />
              San Pablo Jocopilas
            </div>
            <div className="text-[11px] tracking-[.06em] text-[#5B6B63] uppercase">
              Suchitepéquez, Guatemala
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7.5 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b-2 pb-1.5 text-[14.5px] ${
                  active
                    ? "border-[#C69A2A] font-bold text-[#1F6B4A]"
                    : "border-transparent font-medium text-[#3E4A44]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/tramites"
            className="hidden rounded-[9px] bg-[#1F6B4A] px-5 py-2.5 text-sm font-semibold text-white md:inline-block"
          >
            Trámites en línea
          </Link>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menú"
            className="flex h-9.5 w-9.5 flex-col items-center justify-center gap-1 rounded-lg border border-[#DCE4DA] bg-[#F0F5EE] md:hidden"
          >
            <span className="block h-0.5 w-4.5 bg-[#1B2420]" />
            <span className="block h-0.5 w-4.5 bg-[#1B2420]" />
            <span className="block h-0.5 w-4.5 bg-[#1B2420]" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="flex flex-col gap-1 border-t border-[#DCE4DA] bg-[#FBF9F3] px-6 pt-2 pb-4.5 md:hidden">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-lg px-3.5 py-3 text-[15px] text-left ${
                  active
                    ? "bg-[#E8F3EC] font-bold text-[#1F6B4A]"
                    : "font-medium text-[#3E4A44]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
