"use client";

import {
  BrainCircuit,
  Check,
  CheckCircle2,
  Clipboard,
  Lightbulb,
  LoaderCircle,
  Rocket,
  RefreshCw,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  analyzeLeadAction,
  cancelLeadAnalysisAction,
  saveLeadAnalysisAction,
} from "@/lib/actions/lead-analysis-actions";
import type { AnalysisPreview } from "@/lib/openai/lead-analysis-schema";
import {
  analysisPotentialLabels,
  confidenceLabels,
  serviceLabels,
} from "@/lib/utils/analysis-labels";
import { buildAnalysisSummary } from "@/lib/utils/build-analysis-summary";

type SavedAnalysis = {
  id: string;
  preview: AnalysisPreview;
  analyzedAt: string;
  status: string;
  saved: boolean;
};

export function LeadAnalysisPanel({
  leadId,
  businessName,
  latest,
  historyCount,
  lastFailure,
}: {
  leadId: string;
  businessName: string;
  latest: SavedAnalysis | null;
  historyCount: number;
  lastFailure: string | null;
}) {
  const router = useRouter();
  const [preview, setPreview] = useState<AnalysisPreview | null>(
    latest?.preview ?? null,
  );
  const [analysisId, setAnalysisId] = useState(latest?.id ?? "");
  const [saved, setSaved] = useState(latest?.saved ?? false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(lastFailure ?? "");
  const [pending, startTransition] = useTransition();
  const [apply, setApply] = useState({
    salesPotential: false,
    websiteScore: false,
    mainProblem: false,
    suggestedSolution: false,
    personalizedMessage: false,
  });

  function analyze(force = false) {
    if (
      force &&
      !window.confirm(
        "Uma nova chamada à API será realizada e pode gerar consumo. A análise anterior continuará salva. Deseja continuar?",
      )
    )
      return;
    setError("");
    setMessage("");
    startTransition(async () => {
      const result = await analyzeLeadAction({ leadId, force });
      if (!result.success) return setError(result.message);
      setPreview(result.preview);
      setAnalysisId(result.analysisId);
      setSaved(result.reused);
      setMessage(
        result.reused
          ? "Análise salva reutilizada, sem nova chamada à API."
          : "Prévia gerada. Revise antes de salvar.",
      );
    });
  }

  function save() {
    if (!preview) return;
    setError("");
    setMessage("");
    startTransition(async () => {
      const result = await saveLeadAnalysisAction({
        leadId,
        analysisId,
        preview,
        apply,
      });
      if (!result.success) return setError(result.message);
      setSaved(true);
      setMessage(result.message);
      router.refresh();
    });
  }

  function cancel() {
    const currentId = analysisId;
    setPreview(null);
    setAnalysisId("");
    setMessage("");
    if (currentId)
      startTransition(async () => {
        await cancelLeadAnalysisAction({ leadId, analysisId: currentId });
        router.refresh();
      });
  }

  async function copy(text: string, label: string) {
    try {
      await navigator.clipboard.writeText(text);
      setMessage(`${label} copiado.`);
    } catch {
      setError("Não foi possível copiar. Verifique a permissão do navegador.");
    }
  }

  const update = <K extends keyof AnalysisPreview>(
    key: K,
    value: AnalysisPreview[K],
  ) =>
    setPreview((current) => (current ? { ...current, [key]: value } : current));

  return (
    <section className="card p-5 sm:p-6" aria-labelledby="ai-analysis-title">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2
            id="ai-analysis-title"
            className="flex items-center gap-2 font-semibold"
          >
            <Sparkles size={18} /> Análise com IA
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Sugestão revisável. Nada é aplicado ao lead sem sua confirmação.
          </p>
          {historyCount > 0 && (
            <p className="mt-1 text-xs text-slate-500">
              {historyCount} análise(s) concluída(s) no histórico.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {!preview && (
            <button
              className="btn-primary"
              disabled={pending}
              onClick={() => analyze()}
            >
              {pending ? (
                <LoaderCircle className="animate-spin" size={16} />
              ) : (
                <Sparkles size={16} />
              )}
              {pending ? "Analisando..." : "Analisar com IA"}
            </button>
          )}
          {preview && saved && (
            <button
              className="btn-secondary"
              disabled={pending}
              onClick={() => analyze(true)}
            >
              <RefreshCw size={16} />
              Analisar novamente
            </button>
          )}
        </div>
      </div>
      {!preview && (
        <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          A análise ocorre apenas ao clicar. A leitura pública do site pode
          falhar ou ser bloqueada, mas o processo continuará com os demais
          dados.
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800"
        >
          {error}
        </div>
      )}
      {message && (
        <div
          role="status"
          className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800"
        >
          {message}
        </div>
      )}
      {pending && (
        <p aria-live="polite" className="mt-4 text-sm text-slate-600">
          Coletando sinais públicos e gerando a análise. O site pode não
          permitir leitura automática.
        </p>
      )}
      {preview && (
        <div className="mt-6 space-y-5">
          <AnalysisResultOverview preview={preview} />
          <details className="rounded-xl border border-[#c7c4d8] bg-[#f8f9fa] p-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-[#3525cd]">
              Revisar e editar análise
            </summary>
            <div className="mt-5 space-y-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Potencial sugerido">
              <select
                className="input"
                value={preview.salesPotential}
                onChange={(e) =>
                  update(
                    "salesPotential",
                    e.target.value as AnalysisPreview["salesPotential"],
                  )
                }
              >
                {Object.entries(analysisPotentialLabels).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Nota do site">
              <input
                className="input"
                type="number"
                min={0}
                max={10}
                value={preview.websiteScore ?? ""}
                onChange={(e) =>
                  update(
                    "websiteScore",
                    e.target.value === "" ? null : Number(e.target.value),
                  )
                }
              />
            </Field>
            <Field label="Confiança">
              <select
                className="input"
                value={preview.confidence}
                onChange={(e) =>
                  update(
                    "confidence",
                    e.target.value as AnalysisPreview["confidence"],
                  )
                }
              >
                {Object.entries(confidenceLabels).map(([v, l]) => (
                  <option key={v} value={v}>
                    {l}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Oportunidade principal">
            <textarea
              className="input min-h-20"
              maxLength={300}
              value={preview.mainOpportunity}
              onChange={(e) => update("mainOpportunity", e.target.value)}
            />
          </Field>
          <Field label="Solução sugerida">
            <textarea
              className="input min-h-24"
              maxLength={450}
              value={preview.suggestedSolution}
              onChange={(e) => update("suggestedSolution", e.target.value)}
            />
          </Field>
          <Field label="Serviço recomendado">
            <select
              className="input"
              value={preview.recommendedService}
              onChange={(e) =>
                update(
                  "recommendedService",
                  e.target.value as AnalysisPreview["recommendedService"],
                )
              }
            >
              {Object.entries(serviceLabels).map(([v, l]) => (
                <option key={v} value={v}>
                  {l}
                </option>
              ))}
            </select>
          </Field>
          <div>
            <h3 className="text-sm font-semibold">Evidências</h3>
            <div className="mt-2 space-y-2">
              {preview.evidence.map((item, index) => (
                <div key={index} className="rounded-xl bg-slate-50 p-3 text-sm">
                  <span className="text-xs font-semibold text-slate-500">
                    {item.source.replaceAll("_", " ")}
                  </span>
                  <textarea
                    aria-label={`Evidência ${index + 1}`}
                    className="input mt-1 min-h-16"
                    maxLength={240}
                    value={item.description}
                    onChange={(e) =>
                      update(
                        "evidence",
                        preview.evidence.map((x, i) =>
                          i === index
                            ? { ...x, description: e.target.value }
                            : x,
                        ),
                      )
                    }
                  />
                </div>
              ))}
            </div>
          </div>
          <MessageField
            label="Mensagem inicial"
            value={preview.approachMessage}
            max={550}
            onChange={(v) => update("approachMessage", v)}
            onCopy={() => copy(preview.approachMessage, "Mensagem inicial")}
          />
          <MessageField
            label="Follow-up"
            value={preview.followUpMessage}
            max={400}
            onChange={(v) => update("followUpMessage", v)}
            onCopy={() => copy(preview.followUpMessage, "Follow-up")}
          />
          {preview.websiteWarnings.length > 0 && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              <b>Avisos do site:</b>
              <ul className="mt-1 list-inside list-disc">
                {preview.websiteWarnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="text-xs text-slate-500">
            Modelo: {preview.model}
            {preview.websiteCheckedAt
              ? ` • site verificado em ${new Date(preview.websiteCheckedAt).toLocaleString("pt-BR")}`
              : ""}
          </div>
          {!saved && (
            <fieldset className="rounded-xl border p-4">
              <legend className="px-1 text-sm font-semibold">
                Aplicar ao lead (opcional)
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {Object.entries({
                  salesPotential: "Atualizar potencial de venda",
                  websiteScore: "Atualizar nota do site",
                  mainProblem: "Atualizar problema principal",
                  suggestedSolution: "Atualizar solução sugerida",
                  personalizedMessage: "Salvar mensagem personalizada",
                }).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={apply[key as keyof typeof apply]}
                      onChange={(e) =>
                        setApply({ ...apply, [key]: e.target.checked })
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </fieldset>
          )}
          <div className="flex flex-wrap gap-2">
            <button
              className="btn-secondary"
              onClick={() =>
                copy(buildAnalysisSummary(businessName, preview), "Diagnóstico")
              }
            >
              <Clipboard size={16} />
              Copiar diagnóstico
            </button>
            {!saved && (
              <>
                <button
                  className="btn-secondary"
                  disabled={pending}
                  onClick={cancel}
                >
                  <X size={16} />
                  Cancelar
                </button>
                <button
                  className="btn-primary"
                  disabled={pending}
                  onClick={save}
                >
                  <Check size={16} />
                  {pending ? "Salvando..." : "Salvar análise"}
                </button>
              </>
            )}
          </div>
            </div>
          </details>
        </div>
      )}
    </section>
  );
}

function AnalysisResultOverview({ preview }: { preview: AnalysisPreview }) {
  const base = preview.salesPotential === "HIGH" ? 90 : preview.salesPotential === "MEDIUM" ? 68 : 42;
  const confidence = preview.confidence === "HIGH" ? 4 : preview.confidence === "LOW" ? -5 : 0;
  const site = preview.websiteScore === null ? 0 : Math.round((preview.websiteScore - 5) * 1.2);
  const score = Math.max(0, Math.min(100, base + confidence + site));
  const drivers = preview.evidence.slice(0, 3);

  return (
    <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
      <article className="relative flex min-h-60 flex-col items-center justify-center overflow-hidden rounded-xl border border-[#c7c4d8] bg-[#f8f9fa] p-8 shadow-sm">
        <div className="absolute -right-10 -top-10 size-32 rounded-full bg-[#4f46e5]/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 size-32 rounded-full bg-[#4f46e5]/20 blur-3xl" />
        <p className="mb-2 flex items-center gap-1 text-xs font-medium tracking-[.1em] text-[#464555]"><Sparkles size={15} className="text-[#3525cd]"/>AI CONVERSION SCORE</p>
        <div className="grid size-40 place-items-center rounded-full bg-[conic-gradient(#392bdc_var(--score),#deddf0_0)] p-3" style={{ "--score": `${score}%` } as React.CSSProperties}>
          <div className="grid size-full place-items-center rounded-full bg-[#f8f9fa] text-center"><div><strong className="block text-5xl font-semibold tracking-[-.04em] text-[#392bdc]">{score}</strong><span className="text-xs text-[#464555]">/ 100</span></div></div>
        </div>
      </article>
      <div className="grid gap-4">
        <article className="rounded-xl border border-[#c7c4d8] bg-[#f8f9fa] p-4 shadow-sm">
          <h2 className="flex items-center gap-2 border-b border-[#c7c4d8] pb-2 text-2xl font-medium tracking-[-.02em] text-[#191c1d]"><BrainCircuit className="text-[#392bdc]" size={22}/>AI Summary</h2>
          <p className="mt-3 border-l-2 border-[#4f46e5] pl-4 leading-relaxed text-[#191c1d]">“{preview.mainOpportunity}”</p>
        </article>
        <article className="rounded-xl border border-[#c7c4d8] bg-[#f8f9fa] p-4 shadow-sm">
          <h2 className="flex items-center gap-2 border-b border-[#c7c4d8] pb-2 text-2xl font-medium tracking-[-.02em] text-[#191c1d]"><TrendingUp className="text-[#392bdc]" size={22}/>Key Drivers</h2>
          <div className="mt-3 space-y-3">
            {drivers.length ? drivers.map((item, index) => (
              <div key={`${item.source}-${index}`} className="flex gap-3"><span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#dddafe] text-[#392bdc]"><CheckCircle2 size={14}/></span><div><p className="text-xs font-medium text-[#191c1d]">{item.source === "WEBSITE" ? "Presença digital" : item.source === "LEAD_DATA" ? "Dados do lead" : item.source === "MANUAL_DIAGNOSIS" ? "Diagnóstico comercial" : "Sinais disponíveis"}</p><p className="text-sm text-[#464555]">{item.description}</p></div></div>
            )) : <div className="flex gap-3"><Lightbulb className="text-[#392bdc]" size={20}/><p className="text-sm text-[#464555]">Recomendação baseada nos dados disponíveis do lead.</p></div>}
          </div>
        </article>
      </div>
      <article className="flex items-start gap-2 rounded-xl border border-[#3525cd]/20 bg-[#f3f4f5] p-4 shadow-sm lg:col-span-2 lg:items-center lg:justify-center">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#4f46e5] text-white"><Rocket size={21}/></span>
        <div><p className="text-xs font-medium tracking-[.05em] text-[#3525cd]">RECOMMENDED APPROACH</p><p className="text-base text-[#191c1d]">“{preview.suggestedSolution}”</p></div>
      </article>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <div className="mt-1">{children}</div>
    </label>
  );
}
function MessageField({
  label,
  value,
  max,
  onChange,
  onCopy,
}: {
  label: string;
  value: string;
  max: number;
  onChange: (v: string) => void;
  onCopy: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">{label}</label>
        <button
          className="text-sm font-medium text-blue-700 hover:underline"
          onClick={onCopy}
        >
          <Clipboard className="inline" size={14} /> Copiar
        </button>
      </div>
      <textarea
        aria-label={label}
        className="input mt-1 min-h-28"
        maxLength={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-right text-xs text-slate-500">
        {value.length}/{max}
      </p>
    </div>
  );
}
