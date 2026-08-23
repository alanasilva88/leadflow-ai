"use client";

import { Clipboard, ExternalLink, LoaderCircle, MessageCircle, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import {
  registerContactAction, registerFollowUpAction, registerResponseAction,
  saveProspectingMessageAction, setFollowUpAction,
} from "@/lib/actions/prospecting-actions";
import { buildWhatsAppUrl, dateAfterDays, followUpState, normalizeInstagramProfile } from "@/lib/utils/prospecting";

const responseLabels = {
  NO_RESPONSE: "Não respondeu", POSITIVE: "Resposta positiva", NEGATIVE: "Resposta negativa",
  MORE_INFORMATION: "Pediu mais informações", CONTACT_LATER: "Entrar em contato depois",
  MEETING_SCHEDULED: "Reunião agendada", PROPOSAL_SENT: "Proposta enviada", DEAL_CLOSED: "Negócio fechado",
} as const;
type Mode = "contact" | "response" | "followup" | null;

export function ProspectingActions(props: {
  leadId: string; phone: string | null; instagram: string | null;
  initialMessage: string; initialOrigin: string; followUpMessage: string; followUpOrigin: string;
  statusLabel: string; contactedAt: string | null; followUpDate: string | null; responseLabel: string;
}) {
  const router = useRouter();
  const [kind, setKind] = useState<"initial" | "followup">("initial");
  const [initial, setInitial] = useState(props.initialMessage);
  const [followup, setFollowup] = useState(props.followUpMessage);
  const [mode, setMode] = useState<Mode>(null);
  const [channel, setChannel] = useState("WHATSAPP");
  const [date, setDate] = useState(props.followUpDate?.slice(0, 10) ?? "");
  const [response, setResponse] = useState<keyof typeof responseLabels>("NO_RESPONSE");
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();
  const message = kind === "initial" ? initial : followup;
  const origin = kind === "initial" ? props.initialOrigin : props.followUpOrigin;
  const waUrl = useMemo(() => props.phone ? buildWhatsAppUrl(props.phone, message) : null, [props.phone, message]);
  const igUrl = useMemo(() => normalizeInstagramProfile(props.instagram), [props.instagram]);
  const state = followUpState(props.followUpDate);
  const stateLabel = state === "TODAY" ? "Hoje" : state === "OVERDUE" ? "Atrasado" : state === "UPCOMING" ? "Futuro" : "Não definido";

  const done = (result: { success: boolean; message: string }) => {
    if (result.success) setFeedback(result.message);
    else setError(result.message);
    if (result.success) { setMode(null); router.refresh(); }
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(message); setFeedback("Mensagem copiada."); }
    catch { setError("Não foi possível copiar a mensagem."); }
  };
  const open = (url: string | null) => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return <section className="card p-5 sm:p-6" aria-labelledby="prospecting-title">
    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
      <div><h2 id="prospecting-title" className="font-semibold">Prospecção</h2>
        <p className="mt-1 text-sm text-slate-500">Revise, abra o canal e envie manualmente. Nenhuma mensagem é enviada pela aplicação.</p></div>
      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{props.statusLabel}</span>
    </div>
    {feedback && <p role="status" className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800">{feedback}</p>}
    {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
      <Info label="Último contato" value={props.contactedAt ? new Date(props.contactedAt).toLocaleString("pt-BR") : "Não registrado"} />
      <Info label="Próximo follow-up" value={`${props.followUpDate ? new Date(props.followUpDate).toLocaleDateString("pt-BR") : "Não definido"} • ${stateLabel}`} />
      <Info label="Resposta" value={props.responseLabel} />
    </div>
    <div className="mt-5 flex gap-2" role="group" aria-label="Selecionar mensagem">
      <button className={kind === "initial" ? "btn-primary" : "btn-secondary"} onClick={() => setKind("initial")}>Mensagem inicial</button>
      <button className={kind === "followup" ? "btn-primary" : "btn-secondary"} onClick={() => setKind("followup")}>Follow-up</button>
    </div>
    <label className="mt-4 block text-sm font-medium">Mensagem <span className="font-normal text-slate-500">• {origin}</span>
      <textarea className="input mt-1 min-h-32" maxLength={kind === "initial" ? 550 : 400} value={message}
        onChange={(e) => kind === "initial" ? setInitial(e.target.value) : setFollowup(e.target.value)} />
    </label>
    <div className="mt-4 flex flex-wrap gap-2">
      <button className="btn-secondary" onClick={copy}><Clipboard size={16}/>Copiar mensagem</button>
      <button className="btn-primary" disabled={!waUrl} onClick={() => open(waUrl)}><MessageCircle size={16}/>Abrir WhatsApp</button>
      <button className="btn-secondary" disabled={!igUrl} onClick={() => open(igUrl)}><ExternalLink size={16}/>Abrir Instagram</button>
      {kind === "initial" && <button className="btn-secondary" disabled={pending} onClick={() => startTransition(async () => done(await saveProspectingMessageAction({ leadId: props.leadId, message: initial })))}><Save size={16}/>Salvar mensagem no lead</button>}
    </div>
    {!waUrl && <p className="mt-2 text-xs text-amber-700">Informe um telefone com DDD para abrir o WhatsApp.</p>}
    {!igUrl && <p className="mt-1 text-xs text-amber-700">Informe um perfil válido para abrir o Instagram.</p>}
    <div className="mt-5 flex flex-wrap gap-2 border-t pt-5">
      <button className="btn-primary" onClick={() => setMode("contact")}>Registrar contato</button>
      {props.followUpDate && <button className="btn-secondary" onClick={() => setMode("followup")}>Registrar follow-up realizado</button>}
      <button className="btn-secondary" onClick={() => setMode("response")}>Registrar resposta</button>
      <label className="flex items-center gap-2 text-sm">Follow-up:
        <input className="input w-auto" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button className="btn-secondary" disabled={pending} onClick={() => startTransition(async () => done(await setFollowUpAction({ leadId: props.leadId, followUpDate: date || null })))}>Salvar</button>
      </label>
    </div>
    {mode && <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setMode(null); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="dialog-title" className="card w-full max-w-lg p-6">
        <h3 id="dialog-title" className="text-lg font-semibold">{mode === "contact" ? "Registrar contato" : mode === "followup" ? "Registrar follow-up realizado" : "Registrar resposta"}</h3>
        <div className="mt-4 space-y-4">
          {mode === "contact" && <><label className="block text-sm font-medium">Canal<select className="input mt-1" value={channel} onChange={(e) => setChannel(e.target.value)}><option value="WHATSAPP">WhatsApp</option><option value="INSTAGRAM">Instagram</option><option value="OTHER">Outro</option></select></label>
            <label className="block text-sm font-medium">Observação opcional<textarea className="input mt-1" maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)}/></label></>}
          {mode === "response" && <label className="block text-sm font-medium">Resposta<select className="input mt-1" value={response} onChange={(e) => setResponse(e.target.value as keyof typeof responseLabels)}>{Object.entries(responseLabels).map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></label>}
          <label className="block text-sm font-medium">Próximo follow-up
            <select className="input mt-1" value={date} onChange={(e) => setDate(e.target.value)}>
              <option value="">Sem follow-up</option>{[1,2,3,5,7].map((days) => <option key={days} value={dateAfterDays(days)}>{days === 1 ? "Amanhã" : `Em ${days} dias`}</option>)}
            </select>
          </label>
          {(mode !== "response" || response === "CONTACT_LATER") && <input aria-label="Escolher data de follow-up" className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)}/>}
        </div>
        <div className="mt-6 flex justify-end gap-2"><button className="btn-secondary" disabled={pending} onClick={() => setMode(null)}>Cancelar</button>
          <button className="btn-primary" disabled={pending || (mode === "response" && response === "CONTACT_LATER" && !date)} onClick={() => {
            if (mode === "response" && response === "NEGATIVE" && !window.confirm("Confirmar resposta negativa e marcar o lead como perdido?")) return;
            startTransition(async () => done(mode === "contact"
              ? await registerContactAction({ leadId: props.leadId, channel, followUpDate: date || null, notes })
              : mode === "followup" ? await registerFollowUpAction({ leadId: props.leadId, followUpDate: date || null })
              : await registerResponseAction({ leadId: props.leadId, response, followUpDate: date || null })));
          }}>{pending && <LoaderCircle className="animate-spin" size={16}/>}Confirmar</button>
        </div>
      </div>
    </div>}
  </section>;
}
function Info({label,value}:{label:string;value:string}) { return <div className="rounded-xl bg-slate-50 p-3"><span className="text-xs font-semibold uppercase text-slate-500">{label}</span><p className="mt-1">{value}</p></div>; }
