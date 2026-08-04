import { DocType } from "./types.ts";
import { formatTerm, getPaperDetails } from "./utils.ts";
import { level_in_blockquotes, renderSet } from "../lib/cmapaperbot.js";

// | CMA INTERMEDIATE ”
// #PYQ
// paper: Financial Accounting
// paper no: 6
// term: 2025 June
// type: Question Paper
export function renderCaption(
  id: string,
  docType: DocType,
  term: string,
  syllabus?: string,
  kind?: string
): string {
  const paper = getPaperDetails(id);
  let caption = "";
  caption += `${level_in_blockquotes(id)}\n`;
  caption += `#${docType.toUpperCase()}\n`;
  caption += `📄 paper: ${paper.name}\n`;
  caption += `🗂️ paper no: ${id.replace("p", "")}\n`;
  caption += `📆 term: ${formatTerm(term)}`;
  if (syllabus) {
    caption += `\n📚 syllabus: ${syllabus}`;
  }
  if (kind) {
    caption += `\n🗄️ ${renderSet(kind)}`;
  }
  return caption;
}

// key: p20C-26j-mqp
// FileRecord: -s2-syl22
export function renderCaptionFileRecord(
  id: string,
  docType: DocType,
  term: string,
  file: FileRecord
): string {
  return renderCaption(
    id,
    docType,
    term,
    file.syllabus,
    file.name
  );
}