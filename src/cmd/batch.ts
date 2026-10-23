import { Composer, InputFile } from "grammy";
import { env } from "cloudflare:workers";
// @ts-ignore: bundled as binary via the "rules" entry in wrangler.jsonc
import thumbnailData from "../assets/thumbnail_320x320.jpeg";

export const batchCmd = new Composer();

// Read lazily, not at module load
const getAdminId = (): number => Number(process.env.ADMIN_ID);
// deno-lint-ignore no-explicit-any
const kv = (): KVNamespace => (env as any).KV;

const modeKey = (id: number) => `batch_mode:${id}`;
const filesPrefix = (id: number) => `batch_files:${id}:`;

// ---------------------------------------------------------
// BATCH COMMAND LOGIC
// ---------------------------------------------------------
batchCmd.command("batch", async (ctx) => {
  const ADMIN_ID = getAdminId();
  if (ctx.from?.id !== ADMIN_ID) return;

  const action = ctx.match.trim().toLowerCase();

  if (action === "start") {
    await kv().put(modeKey(ADMIN_ID), "1");
    await ctx.reply(
      "🟢 <b>Batch mode started.</b>\n\nUpload your documents now. They will be processed with thumbnails automatically. Send <code>/batch stop</code> when you are done.",
      { parse_mode: "HTML" }
    );
  } else if (action === "stop" || action === "done") {
    const batchMode = await kv().get(modeKey(ADMIN_ID));
    if (!batchMode) {
      return ctx.reply("Batch mode is not active. Use /batch start first.");
    }

    const prefix = filesPrefix(ADMIN_ID);
    let count = 0;

    const jsonData = {
      ptp: {} as Record<string, string>,
      mqp: {} as Record<string, string>,
      pyq: {} as Record<string, string>,
      unrecognized: [] as string[]
    };

    let cursor: string | undefined;
    do {
      const page = await kv().list({ prefix, cursor });

      for (const k of page.keys) {
        const newFileId = k.name.slice(prefix.length);
        const fileName = await kv().get(k.name);
        if (!fileName) continue;
        count++;

        await kv().delete(k.name);

        const baseName = fileName.replace(/\.pdf$/i, "");
        const parts = baseName.split("-");

        if (parts.length < 3) {
          jsonData.unrecognized.push(`Unrecognized format: ${fileName} -> ${newFileId}`);
          continue;
        }

        const docType = parts[2].toLowerCase();

        if (docType === "pyq") {
          jsonData.pyq[baseName] = newFileId;
        } else if (docType === "mqp") {
          jsonData.mqp[baseName] = newFileId;
        } else if (docType === "ptp") {
          jsonData.ptp[baseName] = newFileId;
        } else {
          jsonData.unrecognized.push(`Unknown docType in: ${fileName} -> ${newFileId}`);
        }
      }

      cursor = page.list_complete ? undefined : page.cursor;
    } while (cursor);

    await kv().delete(modeKey(ADMIN_ID));

    if (count === 0) {
      return ctx.reply("No files were logged during this batch.");
    }

    const sortObject = (obj: Record<string, string>) => {
      return Object.keys(obj).sort().reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
      }, {} as Record<string, string>);
    };

    jsonData.mqp = sortObject(jsonData.mqp);
    jsonData.ptp = sortObject(jsonData.ptp);
    jsonData.pyq = sortObject(jsonData.pyq);

    const jsonString = JSON.stringify(jsonData, null, 2);
    const uint8 = new TextEncoder().encode(jsonString);
    const inputFile = new InputFile(uint8, "generated_db.json");

    await ctx.replyWithDocument(inputFile, {
      caption: `🔴 <b>Batch mode stopped.</b>\nProcessed ${count} files.\nYour structured JSON database is ready!`,
      parse_mode: "HTML"
    });
  } else {
    await ctx.reply("<b>Usage:</b>\n<code>/batch start</code> OR <code>/batch stop</code>", { parse_mode: "HTML" });
  }
});

// ---------------------------------------------------------
// DOCUMENT LISTENER
// ---------------------------------------------------------
batchCmd.chatType("private").on("message:document", async (ctx) => {
  const ADMIN_ID = getAdminId();
  if (ctx.from?.id !== ADMIN_ID) {
    return ctx.reply("File uploads are restricted to admins only.");
  }

  const document = ctx.message.document;
  const originalFileId = document.file_id;
  const originalFileName = document.file_name || "downloaded_document.pdf";

  const fileName = standardizeFileName(originalFileName);

  const batchMode = await kv().get(modeKey(ADMIN_ID));

  if (!batchMode) {
    return ctx.reply(
      `<b>File Name</b>: ${fileName}\n<b>Original File ID</b>: <code>${originalFileId}</code>\n\n<i>Batch mode is off. This file was not processed.</i>`,
      { parse_mode: "HTML" }
    );
  }

  const statusMsg = await ctx.reply(`Processing <code>${fileName}</code>...`, { parse_mode: "HTML" });

  try {
    const fileInfo = await ctx.api.getFile(originalFileId);
    const fileUrl = `https://api.telegram.org/file/bot${ctx.api.token}/${fileInfo.file_path}`;

    const response = await fetch(fileUrl);
    if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);

    const fileBuffer = new Uint8Array(await response.arrayBuffer());
    const thumbnailBuffer = new Uint8Array(thumbnailData as ArrayBuffer);

    const hasUnknown = fileName.includes("unknown");
    const captionText = hasUnknown ? `Original File: ${originalFileName}` : undefined;

    const sentMessage = await ctx.replyWithDocument(
      new InputFile(fileBuffer, fileName),
      {
        thumbnail: new InputFile(thumbnailBuffer, "thumbnail.jpeg"),
        caption: captionText
      }
    );

    const newFileId = sentMessage.document.file_id;

    await kv().put(`${filesPrefix(ADMIN_ID)}${newFileId}`, fileName);

    await ctx.api.deleteMessage(ctx.chat.id, statusMsg.message_id);
  } catch (error) {
    console.error(`Error processing ${fileName}:`, error);
  }
});

function standardizeFileName(originalName: string): string {
  const baseName = originalName.toLowerCase().replace(/\.pdf$/, "");

  const paperMatch = baseName.match(/p(0?[1-9]|1[0-9]|20[a-c]?)\b/i);
  let paper = paperMatch ? paperMatch[0] : "unknown-paperId";
  if (paper.startsWith("p20")) paper = paper.replace("p", "p").toUpperCase().replace("P", "p");

  const termMatch = baseName.match(/(2[0-9][dj]|[dj]2[0-9])/i);
  let term = "unknown-term";
  if (termMatch) {
    const t = termMatch[0];
    term = /^[dj]/i.test(t) ? t.slice(1) + t[0] : t;
  }

  const mqpSetMatch = baseName.match(/\b(s[1-2]a?)\b/i);
  const qaMatch = baseName.match(/\b(q|sa|a)\b/i);

  const typeMatch = baseName.match(/\b(pyq|mqp|ptp)\b/i);
  let docType = "unknown-paperType";

  if (typeMatch) {
    docType = typeMatch[0];
  } else if (mqpSetMatch) {
    docType = "mqp";
  } else if (qaMatch) {
    docType = "pyq";
  }

  let suffix = "";
  if (docType === "mqp" && mqpSetMatch) {
    suffix = mqpSetMatch[0];
  } else if ((docType === "pyq" || docType === "ptp") && qaMatch) {
    suffix = qaMatch[0];
  }

  const sylMatch = baseName.match(/\b(syl\d+)\b/i);
  const syl = sylMatch ? sylMatch[1].toLowerCase() : "syl22";

  let newName = `${paper}-${term}-${docType}`;
  if (suffix) newName += `-${suffix}`;
  newName += `-${syl}.pdf`;

  return newName;
}