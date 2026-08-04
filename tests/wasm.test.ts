import { assertEquals } from "@std/assert";
import { level_of, renderSet } from "../lib/cmapaperbot.js";

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

Deno.test("renderSet - maps set identifiers", () => {
  assertEquals(renderSet("s1"), "set: 1");
  assertEquals(renderSet("s2"), "set: 2");
  assertEquals(renderSet("s1a"), "set: 1 solution");
  assertEquals(renderSet("s2a"), "set: 2 solution");
});

Deno.test("renderSet - maps type identifiers", () => {
  assertEquals(renderSet("q"), "type: Question Paper");
  assertEquals(renderSet("a"), "type: Answer Key");
  assertEquals(renderSet("sa"), "type: Suggested Answer");
});

Deno.test("renderSet - fallback string", () => {
  assertEquals(renderSet("unknown_id"), "unknown_id");
  assertEquals(renderSet(""), "");
});
