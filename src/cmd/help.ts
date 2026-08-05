import { Composer } from "grammy";
import { start, help, privacy_policy, status, support } from "../../lib/cmapaperbot.js";

export const helpCmd = new Composer();

const ADMIN_ID = Number(Deno.env.get("ADMIN_ID"));

helpCmd.command("admin", async (ctx) => {
  if (ctx.from?.id !== ADMIN_ID) {
    return;
  }
  await ctx.reply("You are an admin!");
});

helpCmd.command("start", async (ctx) => {
  await ctx.reply(start());
});


helpCmd.command("help", async (ctx) => {
  const richPayload: InputRichMessage = {
    markdown: help()
  };
  await ctx.replyWithRichMessage(richPayload);
});

helpCmd.command("status", async (ctx) => {
  const richPayload: InputRichMessage = {
    markdown: status()
  };
  await ctx.replyWithRichMessage(richPayload);
});

helpCmd.command("privacy", async (ctx) => {
  const richPayload: InputRichMessage = {
    markdown: privacy_policy()
  };
  await ctx.replyWithRichMessage(richPayload);
});

helpCmd.command("donate", async (ctx) => {
  const richPayload: InputRichMessage = {
    markdown: support()
  };
  await ctx.replyWithRichMessage(richPayload);
});