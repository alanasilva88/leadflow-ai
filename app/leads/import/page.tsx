import { ImportWizard } from "@/components/leads/import/import-wizard";
export const metadata = {
  title: "Importar leads | LeadFlow AI",
  description: "Importe leads de arquivos XLSX e CSV.",
};
export default function ImportLeadsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Importar leads</h1>
        <p className="mt-1 text-sm text-slate-500">
          Revise, normalize e valide sua planilha antes de salvar.
        </p>
      </div>
      <ImportWizard />
    </div>
  );
}
