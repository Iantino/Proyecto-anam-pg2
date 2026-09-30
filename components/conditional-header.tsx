"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "./site-header";

export default function ConditionalHeader() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <SiteHeader />;
}