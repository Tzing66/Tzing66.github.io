// Build-time JSON written by scripts/fetch-*.ts. Globbed rather than imported so a
// missing file (never fetched, or deleted) yields undefined instead of a build error.
const files = import.meta.glob<unknown>("../data/*.json", { eager: true, import: "default" });

export function loadData<T>(name: string): T | undefined {
  return files[`../data/${name}.json`] as T | undefined;
}
