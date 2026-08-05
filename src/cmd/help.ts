import { Composer } from "grammy";
import { privacy_policy, support } from "../../lib/cmapaperbot.js";

export const helpCmd = new Composer();

const ADMIN_ID = Number(Deno.env.get("ADMIN_ID"));

helpCmd.command("admin", async (ctx) => {
  if (ctx.from?.id !== ADMIN_ID) {
    return;
  }

  await ctx.reply(
    "You are an admin!",
    {
      parse_mode: "HTML"
    }
  );
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
    markdown: `# Syllabus 2022

## Foundation


|       |  **PYQ**  |  **MQP**  |
| :---: | :-------: | :-------: |
|  23D  |    [ ]    |    [ ]    |
|  24J  |    [ ]    |    [x]    |
|  24D  |    [ ]    |    [x]    |
|  25J  |    [ ]    |    [x]    |
|  25D  |    [ ]    |    [x]    |
|  26J  |    [x]    |    [x]    |

## Intermediate


|       |  **PYQ**  |  **MQP**  |
| :---: | :-------: | :-------: |
|  23D  |    [x]    |    [x]    |
|  24J  |    [x]    |    [x]    |  
|  24D  |    [x]    |    [x]    |
|  25J  |    [x]    |    [x]    |
|  25D  |    [x]    |    [x]    |
|  26J  |    [x]    |    [x]    |
 
## Final


|       |  **PYQ**  |  **MQP**  |
| :---: | :-------: | :-------: |
|  23D  |    [x]    |    [x]    |
|  24J  |    [x]    |    [x]    |
|  24D  |    [x]    |    [x]    |
|  25J  |    [x]    |    [x]    |
|  25D  |    [x]    |    [x]    |
|  26J  |    [x]    |    [x]    |

---

\`[ ]\` - Not published by the Institute

\`[~]\` - Not fully published/In progress

\`[x]\` - Published and available

---
   `
  };

  await ctx.replyWithRichMessage(richPayload);
});

helpCmd.command("status", async (ctx) => {
  const richPayload: InputRichMessage = {
    markdown: `# Syllabus 2022

## Foundation


|       |  **PYQ**  |  **MQP**  |
| :---: | :-------: | :-------: |
|  23D  |    [ ]    |    [ ]    |
|  24J  |    [ ]    |    [x]    |
|  24D  |    [ ]    |    [x]    |
|  25J  |    [ ]    |    [x]    |
|  25D  |    [ ]    |    [x]    |
|  26J  |    [x]    |    [x]    |

## Intermediate


|       |  **PYQ**  |  **MQP**  |
| :---: | :-------: | :-------: |
|  23D  |    [x]    |    [x]    |
|  24J  |    [x]    |    [x]    |  
|  24D  |    [x]    |    [x]    |
|  25J  |    [x]    |    [x]    |
|  25D  |    [x]    |    [x]    |
|  26J  |    [x]    |    [x]    |
 
## Final


|       |  **PYQ**  |  **MQP**  |
| :---: | :-------: | :-------: |
|  23D  |    [x]    |    [x]    |
|  24J  |    [x]    |    [x]    |
|  24D  |    [x]    |    [x]    |
|  25J  |    [x]    |    [x]    |
|  25D  |    [x]    |    [x]    |
|  26J  |    [x]    |    [x]    |

---

\`[ ]\` - Not published by the Institute

\`[~]\` - Not fully published/In progress

\`[x]\` - Published and available

---
   `
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
