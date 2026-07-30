import { assertEquals } from "@std/assert";
import { level_of } from "../lib/cmapaperbot.js";

Deno.test("level from paper id test", () => {
  const l1 = level_of("3");
  const l2 = level_of("11");
  const l3 = level_of("20A");
  const invalid = level_of("20G");

  assertEquals(l1, "foundation");
  assertEquals(l2, "intermediate");
  assertEquals(l3, "final");
  assertEquals(invalid, "unknown");
});
