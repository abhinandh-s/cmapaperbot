import { Composer } from "grammy";
import { help, privacy_policy, status, support } from "../../lib/cmapaperbot.js";

export const helpCmd = new Composer();

const ADMIN_ID = Number(Deno.env.get("ADMIN_ID"));

helpCmd.command("admin", async (ctx) => {
  if (ctx.from?.id !== ADMIN_ID) {
    return;
  }
  await ctx.reply("You are an admin!");
});

helpCmd.command("start", async (ctx) => {
  await ctx.reply(
    "Available Commands:\n\n/pyq - access Previous Year Questions\n/mqp - access Model Question Papers\n/ptp - access Practice Test Papers",
    {
      parse_mode: "HTML"
    }
  );
});

// Register handler
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
