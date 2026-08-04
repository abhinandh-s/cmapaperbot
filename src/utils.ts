import { SYLLABUS_2022 } from "./db/mod.ts";

export function getPaperDetails(paperId: string) {
  const allPapers = [
    ...SYLLABUS_2022.ACADEMIC_DATA.foundation,
    ...SYLLABUS_2022.ACADEMIC_DATA.intermediate,
    ...SYLLABUS_2022.ACADEMIC_DATA.final
  ];
  return allPapers.find((p) => p.id === paperId);
}

// Extracts paper_id, term, and paper_type from a formatted key string.
// Example input: "p20A-24j-pyq"
export function parseKey(key: string) {
  const [paper_id, term, paper_type] = key.split("-");

  return {
    paper_id, // e.g., "p5", "p20A"
    term, // e.g., "24j"
    paper_type // e.g., "pyq"
  };
}

export function formatTerm(code: string): string {
  if (!code || code.length < 3) return code;

  const yy = code.slice(0, 2);
  const m = code.slice(2).toLowerCase();

  const year = `20${yy}`;
  const month = m === "d" ? "Dec" : m === "j" ? "June" : m;

  return `${year} ${month}`;
}
