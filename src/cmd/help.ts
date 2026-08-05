import { Composer } from "grammy";
import { privacy_policy } from "../../lib/cmapaperbot.js";

export const helpCmd = new Composer();

const ADMIN_ID = Number(Deno.env.get("ADMIN_ID"));

helpCmd.command("donate", async (ctx) => {
  await ctx.reply(
    "Hey everyone! I'm keeping this bot free for everyone, but it does cost me to keep the servers running. If you'd like to help out with a small donation, I'd really appreciate it ❤️\n\nUPI ID: <code>abhinandh.s@superyes</code>\n\nFor now, UPI is the easiest option. But if you prefer another method, just hit me up on DM @abhinandhsuby.",
    {
      parse_mode: "HTML"
    }
  );
});

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

/*
helpCmd.command("privacy", async (ctx) => {
  await ctx.reply(
    `<b>Privacy policy</b>

I gain absolutely <b>zero</b> monetary benefit from this. This is a passion project and I <b>do not</b> collect any user data.

<b>Important!</b>

<i>Pikachu is an independent study tool and is not officially affiliated with the Institute of Cost Accountants of India (ICMAI). All rights to the PDFs and study materials are reserved by ICMAI.</i>

<i>© 2026 icmai.in. All Rights Reserved.</i>
`,
    {
      parse_mode: "HTML"
    }
  );
});
*/

helpCmd.command('privacy', async (ctx) => {
  const richPayload: InputRichMessage = {
    markdown: privacy_policy(),
  }
  await ctx.replyWithRichMessage(richPayload)
})
