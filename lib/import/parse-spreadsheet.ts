import * as XLSX from "xlsx";
import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_MIME_TYPES,
  MAX_CELL_LENGTH,
  MAX_COLUMNS,
  MAX_FILE_SIZE,
  MAX_ROWS,
} from "./import-constants";
import { normalizeText } from "@/lib/utils/normalize-text";

export type ParsedSheet = {
  name: string;
  rows: unknown[][];
  approximateRows: number;
};
export function validateSpreadsheetFile(file: File) {
  const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
  if (
    !ACCEPTED_EXTENSIONS.includes(extension as ".xlsx" | ".csv") ||
    !ACCEPTED_MIME_TYPES.includes(file.type)
  )
    throw new Error("Selecione um arquivo XLSX ou CSV válido.");
  if (file.size > MAX_FILE_SIZE)
    throw new Error("O arquivo excede 5 MB. Divida-o antes de importar.");
}
function cleanCell(value: unknown) {
  const text = normalizeText(value);
  if (!text) return "";
  return text.slice(0, MAX_CELL_LENGTH);
}
export async function parseSpreadsheet(file: File): Promise<ParsedSheet[]> {
  validateSpreadsheetFile(file);
  const workbook = XLSX.read(await file.arrayBuffer(), {
    type: "array",
    cellFormula: false,
    cellHTML: false,
    cellText: true,
  });
  const sheets = workbook.SheetNames.map((name) => {
    const rows = XLSX.utils
      .sheet_to_json<
        unknown[]
      >(workbook.Sheets[name], { header: 1, raw: false, defval: "", blankrows: false })
      .map((row) => row.slice(0, MAX_COLUMNS).map(cleanCell));
    return { name, rows, approximateRows: Math.max(0, rows.length - 1) };
  });
  if (!sheets.some((sheet) => sheet.rows.length))
    throw new Error("O arquivo não contém dados.");
  return sheets;
}
export function extractTable(rows: unknown[][]) {
  const headerIndex = rows.findIndex((row) =>
    row.some((cell) => normalizeText(cell)),
  );
  if (headerIndex < 0)
    throw new Error("Não foi encontrada uma linha de cabeçalho válida.");
  const original = rows[headerIndex].map((cell) => normalizeText(cell) ?? "");
  const nonEmpty = original.filter(Boolean);
  if (!nonEmpty.length)
    throw new Error("Não foi encontrada uma linha de cabeçalho válida.");
  const counts = new Map<string, number>();
  const headers = original.map((header, index) => {
    const base = header || `Coluna vazia ${index + 1}`;
    const count = (counts.get(base) ?? 0) + 1;
    counts.set(base, count);
    return count > 1 ? `${base} (${count})` : base;
  });
  const warnings = [];
  if (original.some((h) => !h))
    warnings.push("Há colunas sem cabeçalho; elas serão ignoradas por padrão.");
  if (new Set(nonEmpty).size !== nonEmpty.length)
    warnings.push(
      "Há cabeçalhos duplicados; eles foram identificados com numeração.",
    );
  const data = rows
    .slice(headerIndex + 1)
    .filter((row) => row.some((cell) => normalizeText(cell)));
  if (data.length > MAX_ROWS)
    throw new Error(
      `Foram encontrados ${data.length} registros. O limite é ${MAX_ROWS}; divida o arquivo.`,
    );
  return {
    headers,
    warnings,
    rows: data.map((row, index) => ({
      rowNumber: headerIndex + index + 2,
      raw: Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ""])),
    })),
  };
}
