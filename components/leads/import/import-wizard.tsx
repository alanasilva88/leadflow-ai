"use client";
import { useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
  Upload,
  X,
} from "lucide-react";
import {
  analyzeDatabaseDuplicates,
  importLeads,
} from "@/lib/actions/import-leads-action";
import { detectFileDuplicates } from "@/lib/import/detect-file-duplicates";
import { suggestMapping } from "@/lib/import/detect-columns";
import {
  extractTable,
  parseSpreadsheet,
  type ParsedSheet,
} from "@/lib/import/parse-spreadsheet";
import { normalizeImportRow } from "@/lib/import/normalize-import-row";
import type {
  ColumnMapping,
  ImportField,
  ImportResult,
} from "@/types/lead-import";

const labels: Record<ImportField, string> = {
  businessName: "Nome do negócio",
  phone: "Telefone",
  instagram: "Instagram",
  website: "Site",
  rating: "Nota de avaliação",
  reviewCount: "Número de avaliações",
  segment: "Segmento",
  city: "Cidade",
  salesPotential: "Potencial de venda",
  status: "Status",
  ignore: "Ignorar coluna",
};
type Table = ReturnType<typeof extractTable>;
export function ImportWizard() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File>();
  const [sheets, setSheets] = useState<ParsedSheet[]>([]);
  const [sheetIndex, setSheetIndex] = useState(0);
  const [table, setTable] = useState<Table>();
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [databaseRows, setDatabaseRows] = useState<number[]>([]);
  const [result, setResult] = useState<ImportResult>();
  const [pending, startTransition] = useTransition();
  const normalized = useMemo(
    () =>
      table?.rows.map(({ raw, rowNumber }) =>
        normalizeImportRow(raw, mapping, rowNumber),
      ) ?? [],
    [table, mapping],
  );
  const valid = normalized.flatMap((item) => (item.lead ? [item.lead] : []));
  const invalid = normalized.length - valid.length;
  const fileDuplicates = detectFileDuplicates(valid);
  const reset = () => {
    setFile(undefined);
    setSheets([]);
    setTable(undefined);
    setMapping({});
    setStep(1);
    setError("");
    setResult(undefined);
    setDatabaseRows([]);
    if (inputRef.current) inputRef.current.value = "";
  };
  const selectFile = async (selected?: File) => {
    if (!selected) return;
    setError("");
    try {
      const parsed = await parseSpreadsheet(selected);
      setFile(selected);
      setSheets(parsed);
      const first = Math.max(
        0,
        parsed.findIndex((s) => s.rows.length > 1),
      );
      setSheetIndex(first);
      setStep(
        selected.name.toLowerCase().endsWith(".csv") || parsed.length === 1
          ? 3
          : 2,
      );
      if (selected.name.toLowerCase().endsWith(".csv") || parsed.length === 1)
        prepare(parsed[first]);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Não foi possível ler o arquivo.",
      );
    }
  };
  const prepare = (sheet: ParsedSheet) => {
    try {
      const next = extractTable(sheet.rows);
      setTable(next);
      setMapping(suggestMapping(next.headers));
      setStep(3);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível ler a aba.");
    }
  };
  const goValidation = () => {
    if (!Object.values(mapping).includes("businessName"))
      return setError("Mapeie a coluna Nome do negócio antes de continuar.");
    setError("");
    setStep(5);
    startTransition(async () =>
      setDatabaseRows(
        await analyzeDatabaseDuplicates({
          rows: valid.filter((v) => !fileDuplicates.has(v.rowNumber)),
        }),
      ),
    );
  };
  const estimated = valid.filter(
    (v) =>
      !fileDuplicates.has(v.rowNumber) && !databaseRows.includes(v.rowNumber),
  );
  const confirm = () =>
    startTransition(async () => {
      const response = await importLeads({ rows: valid });
      setResult({
        ...response,
        invalid,
        issues: [
          ...normalized.flatMap((item) => item.issues),
          ...response.issues,
        ],
      });
      setStep(7);
    });
  const phase = step === 1 ? 1 : step === 7 ? 4 : step === 6 ? 3 : 2;
  const phases = ["Upload", "Validação", "Preview", "Concluído"];
  return (
    <div className="space-y-5">
      <ol
        className="relative flex items-start justify-between pb-3"
        aria-label="Etapas da importação"
      >
        <span className="absolute left-0 right-0 top-3 h-0.5 bg-[#c7c4d8]"/><span className="absolute left-0 top-3 h-0.5 bg-[#4f46e5] transition-[width]" style={{width:`${((phase-1)/3)*100}%`}}/>
        {phases.map((label,index)=>{const number=index+1;const done=number<phase,active=number===phase;return <li key={label} className="relative flex flex-col items-center gap-2"><span className={`grid size-6 place-items-center rounded-full text-xs font-bold ring-4 ring-[#f8f9fa] ${done?"bg-[#4f46e5] text-white":active?"border-2 border-[#3525cd] bg-[#f8f9fa] text-[#3525cd]":"border border-[#c7c4d8] bg-[#edeeef] text-[#464555]"}`}>{number}</span><span className={`text-[11px] font-semibold tracking-wide ${number<=phase?"text-[#3525cd]":"text-[#464555]"}`}>{label}</span></li>})}
      </ol>
      {error && (
        <div
          role="alert"
        className="flex gap-3 rounded-lg border border-red-300 bg-[#ffdad6] p-4 text-sm font-medium text-[#93000a] shadow-sm"
        >
          <AlertCircle size={18} />
          {error}
        </div>
      )}
      {step === 1 && (
        <section className="overflow-hidden rounded-xl border border-[#c7c4d8] bg-gradient-to-b from-white to-[#f3f4f5] p-8 shadow-sm">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              void selectFile(e.dataTransfer.files[0]);
            }}
            className="grid min-h-[242px] place-items-center p-2 text-center"
          >
            <div>
              <span className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-[#e2dfff] text-[#3525cd]"><Upload size={29}/></span>
              <h2 className="text-2xl font-medium tracking-[-0.02em]">Importe seus leads</h2>
              <p className="mx-auto mt-3 max-w-[280px] text-sm leading-5 text-[#464555]">
                Arraste seu arquivo ou clique para selecionar. Formatos suportados: CSV, XLSX (máx. 5 MB).
              </p>
              <button
                className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#4f46e5] px-6 text-xs font-medium tracking-wide text-white shadow-sm"
                onClick={() => inputRef.current?.click()}
              >
                Selecionar arquivo
              </button>
              <input
                ref={inputRef}
                className="sr-only"
                type="file"
                accept=".xlsx,.csv"
                onChange={(e) => void selectFile(e.target.files?.[0])}
              />
            </div>
          </div>
        </section>
      )}
      {file && step > 1 && step < 7 && (
        <div className="card flex items-center gap-3 p-4">
          <FileSpreadsheet className="text-blue-600" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{file.name}</p>
            <p className="text-xs text-slate-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            aria-label="Remover arquivo"
            onClick={reset}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>
      )}
      {step === 2 && (
        <section className="card p-6">
          <h2 className="text-lg font-semibold">Escolha uma aba</h2>
          <div className="mt-4 grid gap-2">
            {sheets.map((s, i) => (
              <label
                key={s.name}
                className="flex cursor-pointer gap-3 rounded-xl border p-4"
              >
                <input
                  type="radio"
                  checked={sheetIndex === i}
                  onChange={() => setSheetIndex(i)}
                />
                <span>
                  <b>{s.name}</b>
                  <small className="block text-slate-500">
                    Aproximadamente {s.approximateRows} linha(s)
                  </small>
                </span>
              </label>
            ))}
          </div>
          <Nav
            onBack={() => setStep(1)}
            onNext={() => prepare(sheets[sheetIndex])}
          />
        </section>
      )}
      {step === 3 && table && (
        <section className="card p-6">
          <h2 className="text-lg font-semibold">Prévia dos dados</h2>
          <p className="text-sm text-slate-500">
            {table.rows.length} registro(s) e {table.headers.length} coluna(s).
          </p>
          {table.warnings.map((w) => (
            <p key={w} className="mt-2 text-sm text-amber-700">
              {w}
            </p>
          ))}
          <Preview table={table} />
          <Nav
            onBack={() => setStep(sheets.length > 1 ? 2 : 1)}
            onNext={() => setStep(4)}
          />
        </section>
      )}
      {step === 4 && table && (
        <section className="card p-6">
          <h2 className="text-lg font-semibold">Mapeie as colunas</h2>
          <p className="text-sm text-slate-500">
            Revise as sugestões. Cada campo só pode ser usado uma vez.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {table.headers.map((h) => (
              <label key={h} className="text-sm font-medium">
                {h}
                <select
                  className="input mt-1"
                  value={mapping[h]}
                  onChange={(e) =>
                    setMapping({
                      ...mapping,
                      [h]: e.target.value as ImportField,
                    })
                  }
                >
                  {Object.entries(labels).map(([value, label]) => (
                    <option
                      key={value}
                      value={value}
                      disabled={
                        value !== "ignore" &&
                        value !== mapping[h] &&
                        Object.values(mapping).includes(value as ImportField)
                      }
                    >
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
          <Nav onBack={() => setStep(3)} onNext={goValidation} />
        </section>
      )}
      {step === 5 && (
        <Summary
          total={normalized.length}
          valid={valid.length}
          invalid={invalid}
          fileDuplicates={fileDuplicates.size}
          databaseDuplicates={databaseRows.length}
          pending={pending}
        >
          <Nav
            onBack={() => setStep(4)}
            onNext={() => setStep(6)}
            disabled={pending || estimated.length === 0}
          />
        </Summary>
      )}
      {step === 6 && (
        <Summary
          total={normalized.length}
          valid={valid.length}
          invalid={invalid}
          fileDuplicates={fileDuplicates.size}
          databaseDuplicates={databaseRows.length}
        >
          <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm">
            Serão criados <b>{estimated.length}</b> novos leads. Duplicados e
            linhas inválidas serão ignorados.
          </div>
          <Nav
            onBack={() => setStep(5)}
            onNext={confirm}
            nextLabel={pending ? "Importando..." : "Confirmar importação"}
            disabled={pending}
          />
        </Summary>
      )}
      {step === 7 && result && (
        <section className="card p-6">
          <CheckCircle2 className="text-emerald-600" />
          <h2 className="mt-3 text-xl font-semibold">Importação concluída</h2>
          <p className="text-sm text-slate-500">
            {result.importedAt
              ? new Date(result.importedAt).toLocaleString("pt-BR")
              : ""}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <Metric label="Importados" value={result.imported} />
            <Metric label="Inválidos" value={result.invalid} />
            <Metric
              label="Duplicados no arquivo"
              value={result.duplicateFile}
            />
            <Metric
              label="Duplicados no banco"
              value={result.duplicateDatabase}
            />
          </div>
          {result.issues.length > 0 && (
            <details className="mt-5 rounded-xl border p-4">
              <summary className="cursor-pointer font-medium">
                Ver avisos e linhas ignoradas ({result.issues.length})
              </summary>
              <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto text-sm text-slate-600">
                {result.issues.map((issue, index) => (
                  <li key={`${issue.rowNumber}-${index}`}>
                    Linha {issue.rowNumber}
                    {issue.businessName ? ` — ${issue.businessName}` : ""}:{" "}
                    {issue.message}
                  </li>
                ))}
              </ul>
            </details>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link className="btn-primary" href="/leads">
              Ver leads importados
            </Link>
            <button className="btn-secondary" onClick={reset}>
              Importar outro arquivo
            </button>
          </div>
        </section>
      )}
      {step > 1 && step < 7 && (
        <button className="text-sm text-slate-500 underline" onClick={reset}>
          Cancelar importação
        </button>
      )}
    </div>
  );
}
function Nav({
  onBack,
  onNext,
  nextLabel = "Continuar",
  disabled = false,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  disabled?: boolean;
}) {
  return (
    <div className="mt-6 flex justify-between">
      <button className="btn-secondary" onClick={onBack}>
        Voltar
      </button>
      <button className="btn-primary" onClick={onNext} disabled={disabled}>
        {nextLabel}
      </button>
    </div>
  );
}
function Preview({ table }: { table: Table }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            {table.headers.map((h) => (
              <th className="p-3" key={h}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.slice(0, 10).map((r) => (
            <tr className="border-t" key={r.rowNumber}>
              {table.headers.map((h) => (
                <td className="max-w-56 truncate p-3" key={h}>
                  {String(r.raw[h] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <b className="text-2xl">{value}</b>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
function Summary({
  total,
  valid,
  invalid,
  fileDuplicates,
  databaseDuplicates,
  pending = false,
  children,
}: {
  total: number;
  valid: number;
  invalid: number;
  fileDuplicates: number;
  databaseDuplicates: number;
  pending?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-6">
      <h2 className="text-lg font-semibold">
        {pending ? "Verificando o banco..." : "Resumo da validação"}
      </h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-5">
        <Metric label="Linhas lidas" value={total} />
        <Metric label="Válidas" value={valid} />
        <Metric label="Inválidas" value={invalid} />
        <Metric label="Duplicados no arquivo" value={fileDuplicates} />
        <Metric label="Possíveis no banco" value={databaseDuplicates} />
      </div>
      {children}
    </section>
  );
}
