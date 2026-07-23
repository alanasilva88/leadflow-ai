"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavigationLinks } from "./app-sidebar";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const closeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) closeButton.current?.focus();
  }, [open]);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu size={22} />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Fechar menu"
            className="absolute inset-0 bg-slate-950/50"
            onClick={() => setOpen(false)}
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegação"
            className="relative h-full w-72 bg-slate-950 p-5 shadow-2xl"
          >
            <div className="mb-8 flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">LeadFlow AI</p>
                <p className="text-xs text-slate-400">
                  Assistente de prospecção
                </p>
              </div>
              <button
                ref={closeButton}
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-slate-300 hover:bg-slate-800"
                aria-label="Fechar menu"
              >
                <X />
              </button>
            </div>
            <NavigationLinks onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
