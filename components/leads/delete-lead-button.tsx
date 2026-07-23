"use client";

import { Trash2, X } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { deleteLead } from "@/lib/actions/lead-actions";

export function DeleteLeadButton({
  id,
  name,
  compact = false,
}: {
  id: string;
  name: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const dialog = useRef<HTMLDialogElement>(null);
  const show = () => {
    setOpen(true);
    setTimeout(() => dialog.current?.showModal(), 0);
  };
  const close = () => {
    dialog.current?.close();
    setOpen(false);
  };
  return (
    <>
      <button
        type="button"
        onClick={show}
        className={compact ? "text-red-600 hover:text-red-800" : "btn-danger"}
        aria-label={`Excluir ${name}`}
      >
        <Trash2 size={16} />
        {!compact && "Excluir lead"}
      </button>
      {open && (
        <dialog
          ref={dialog}
          onClose={() => setOpen(false)}
          className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl p-0 shadow-2xl backdrop:bg-slate-950/55"
        >
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Excluir lead?</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Você está excluindo <strong>{name}</strong>. Esta ação não
                  poderá ser desfeita.
                </p>
              </div>
              <button
                onClick={close}
                aria-label="Fechar diálogo"
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
              >
                <X />
              </button>
            </div>
            {error && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                {error}
              </p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button className="btn-secondary" onClick={close}>
                Cancelar
              </button>
              <button
                disabled={pending}
                className="btn-danger"
                onClick={() =>
                  startTransition(async () => {
                    const result = await deleteLead(id);
                    if (!result.success)
                      setError(result.message ?? "Erro ao excluir.");
                  })
                }
              >
                {pending ? "Excluindo..." : "Sim, excluir"}
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
