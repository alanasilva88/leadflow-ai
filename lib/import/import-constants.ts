export const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_ROWS = 500;
export const MAX_COLUMNS = 50;
export const MAX_CELL_LENGTH = 1000;
export const ACCEPTED_EXTENSIONS = [".xlsx", ".csv"] as const;
export const ACCEPTED_MIME_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "application/csv",
  "application/vnd.ms-excel",
  "",
];
