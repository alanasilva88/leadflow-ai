import * as XLSX from "xlsx";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const csv = readFileSync(
    new URL("../examples/leads-example.csv", import.meta.url),
    "utf8",
);
const main = XLSX.read(csv, { type: "string" }).Sheets.Sheet1;
const extra = XLSX.utils.aoa_to_sheet([
    ["Nome do negócio", "Cidade"],
    ["Clínica Vet Horizonte", "Goiânia"],
]);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, main, "Leads");
XLSX.utils.book_append_sheet(workbook, extra, "Outra aba");
XLSX.writeFile(
    workbook,
    fileURLToPath(new URL("../examples/leads-example.xlsx", import.meta.url)),
);
console.log("examples/leads-example.xlsx gerado.");
