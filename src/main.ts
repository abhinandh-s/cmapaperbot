import "./shim.ts"; // must stay first
import { Bot, Context, InlineKeyboard, webhookCallback } from "grammy";
import { DocType, FileRecord, getAllFiles, getFiles, Level } from "./db/mod.ts";
import { helpCmd } from "./cmd/help.ts";
import { adminCmds } from "./cmd/admin.ts";
import { batchCmd } from "./cmd/batch.ts";
import { inlineQueryHandler } from "./inline.ts";
import { formatTerm } from "./utils.ts";
import { renderCaption } from "./render.ts";
import { ACADEMIC_DATA, FLATTENED_FILE_IDS } from "./db/mod.ts";
import { renderSyllabusShort } from "../lib/cmapaperbot.js";

const ITEMS_PER_PAGE = 10;

async function startHandler(ctx: Context, docType: DocType) {
  const keyboard = new InlineKeyboard()
    .text("Foundation", `level:${docType}:foundation`)
    .row()
    .text("Intermediate", `level:${docType}:intermediate`)
    .row()
    .text("Final", `level:${docType}:final`);

  await ctx.reply(`Select level for <b>${docType.toUpperCase()}</b>:`, {
    parse_mode: "HTML",
    reply_markup: keyboard
  });
}

function buildSearchKeyboard(query: string, page: number) {
  const matches = Object.keys(FLATTENED_FILE_IDS).filter((key) => key.toLowerCase().includes(query));

  const keyboard = new InlineKeyboard();
  const totalPages = Math.ceil(matches.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const pageItems = matches.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  pageItems.forEach((key) => {
    const [paperId, term, docType, fileName, syl] = key.split("-");
    const btnText = `${paperId.toUpperCase()} - ${formatTerm(term)} | ${docType.toUpperCase()} ${fileName.toUpperCase()} | SYLLABUS ${
      renderSyllabusShort(syl)
    }`;
    keyboard.text(btnText, `dl:${key}`).row();
  });

  if (totalPages > 1) {
    if (page > 0) keyboard.text("‹ Prev", `nav:${page - 1}:${query}`);
    keyboard.text(`[ ${page + 1} / ${totalPages} ]`, "ignore");
    if (page < totalPages - 1) keyboard.text("Next ›", `nav:${page + 1}:${query}`);
  }

  return { keyboard, totalMatches: matches.length };
}

function createBot(token: string): Bot {
  const bot = new Bot(token);

  bot.use(adminCmds);
  bot.use(helpCmd);
  bot.use(batchCmd);
  bot.use(inlineQueryHandler);

  bot.command("search", async (ctx) => {
    const keyboard = new InlineKeyboard().switchInlineCurrent("🔍 Search Papers", "p");
    await ctx.reply("Click the button below to search:", { reply_markup: keyboard });
  });

  bot.command("to_friend", async (ctx) => {
    const keyboard = new InlineKeyboard().switchInline("🔍 Search Papers", "p");
    await ctx.reply("Click the button below to search:", { reply_markup: keyboard });
  });

  // ---------- LEVEL ----------
  bot.callbackQuery(/^level:/, async (ctx) => {
    const [, docType, level] = ctx.callbackQuery.data.split(":");
    const keyboard = new InlineKeyboard();

    for (const sub of ACADEMIC_DATA[level as Level]) {
      keyboard.text(sub.code, `subject:${docType}:${sub.id}`).row();
    }

    await ctx.editMessageText("Select subject:", { reply_markup: keyboard });
    await ctx.answerCallbackQuery();
  });

  // ---------- SUBJECT ----------
  bot.callbackQuery(/^subject:/, async (ctx) => {
    const [, docType, paperId] = ctx.callbackQuery.data.split(":");
    const all = getAllFiles(docType as DocType, paperId);

    if (all.length === 0) {
      await ctx.answerCallbackQuery({ text: "No files available", show_alert: true });
      return;
    }

    const keyboard = new InlineKeyboard();
    for (const item of all) {
      const term = item.key.split("-")[1];
      keyboard.text(formatTerm(term), `file:${docType}:${paperId}:${term}`).row();
    }

    await ctx.editMessageText("Select term:", { reply_markup: keyboard });
    await ctx.answerCallbackQuery();
  });

  // ---------- FILE DELIVERY ----------
  bot.callbackQuery(/^file:/, async (ctx) => {
    const [, docType, paperId, term] = ctx.callbackQuery.data.split(":");

    const key = `${paperId}-${term}-${docType}`;
    const files = getFiles(docType as DocType, key);

    if (!files) {
      await ctx.answerCallbackQuery({ text: "File not available", show_alert: true });
      return;
    }

    await ctx.answerCallbackQuery();

    for (const file of files as FileRecord) {
      await ctx.replyWithDocument(file.id, {
        caption: renderCaption(paperId, docType, term, file.syllabus || "", file.name),
        parse_mode: "HTML"
      });
    }
  });

  // ---------- COMMANDS ----------
  bot.command("pyq", (ctx) => startHandler(ctx, "pyq"));
  bot.command("mqp", (ctx) => startHandler(ctx, "mqp"));
  bot.command("ptp", (ctx) => startHandler(ctx, "ptp"));

  // ---------- SEARCH PAGINATION ----------
  bot.callbackQuery(/^nav:(\d+):(.+)$/, async (ctx) => {
    const page = parseInt(ctx.match[1], 10);
    const query = ctx.match[2];

    const { keyboard, totalMatches } = buildSearchKeyboard(query, page);

    if (totalMatches === 0) {
      return ctx.answerCallbackQuery("No results found.");
    }

    await ctx.editMessageReplyMarkup({ reply_markup: keyboard });
    await ctx.answerCallbackQuery();
  });

  bot.callbackQuery("ignore", (ctx) => ctx.answerCallbackQuery());

  bot.callbackQuery(/^dl:/, async (ctx) => {
    const key = ctx.callbackQuery.data.replace("dl:", "");
    const fileId = FLATTENED_FILE_IDS[key];

    if (!fileId) {
      return ctx.answerCallbackQuery("File not found.");
    }

    const [paperId, term, docType, fileName, syl] = key.split("-");

    await ctx.replyWithDocument(fileId, {
      caption: renderCaption(paperId, docType, term, syl, fileName),
      parse_mode: "HTML"
    });

    await ctx.deleteMessage().catch(() => {});
  });

  // ---------- INITIAL SEARCH ----------
  bot.on("message:text", async (ctx) => {
    const query = ctx.message.text.trim().toLowerCase().replace(/\s+/g, "-");

    if (!query) {
      const sentMsg = await ctx.reply("Got your message!");
      // setTimeout is unreliable on Workers once the response returns, so delete best-effort
      ctx.api.deleteMessage(ctx.chat.id, sentMsg.message_id).catch(() => {});
      return;
    }

    const { keyboard, totalMatches } = buildSearchKeyboard(query, 0);

    if (totalMatches === 0) {
      return ctx.reply("No files found matching your query.");
    }

    await ctx.reply(`Select File (${totalMatches} found):`, {
      parse_mode: "HTML",
      reply_markup: keyboard
    });
  });

  bot.catch((err) => {
    console.error(`Error while handling update ${err.ctx.update.update_id}:`, err.error);
  });

  return bot;
}

// ---------- WORKER ENTRY ----------
let handler: ((req: Request) => Promise<Response>) | undefined;

export default {
  async fetch(req: Request): Promise<Response> {
    if (req.method !== "POST") {
      return new Response("Telegram Bot is running!");
    }

    try {
      if (!handler) {
        const token = process.env.TELEGRAM_TOKEN;
        if (!token) return new Response("TELEGRAM_TOKEN not set", { status: 500 });
        handler = webhookCallback(createBot(token), "cloudflare-mod");
      }
      return await handler(req);
    } catch (err) {
      console.error(err);
      return new Response("Error processing update", { status: 500 });
    }
  }
};
