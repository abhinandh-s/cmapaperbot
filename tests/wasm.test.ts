import { assertEquals } from "@std/assert";
import { level_of, renderSet, level_in_blockquotes } from "../lib/cmapaperbot.js";

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

Deno.test("level_in_blockquotes - Foundation level papers", () => {
  assertEquals(
    level_in_blockquotes("P1"),
    "<blockquote>CMA FOUNDATION</blockquote>",
  );
  assertEquals(
    level_in_blockquotes("p4"),
    "<blockquote>CMA FOUNDATION</blockquote>",
  );
  assertEquals(
    level_in_blockquotes("2"),
    "<blockquote>CMA FOUNDATION</blockquote>",
  );
});

Deno.test("level_in_blockquotes - Intermediate level papers", () => {
  assertEquals(
    level_in_blockquotes("P5"),
    "<blockquote>CMA INTERMEDIATE</blockquote>",
  );
  assertEquals(
    level_in_blockquotes("p12"),
    "<blockquote>CMA INTERMEDIATE</blockquote>",
  );
  assertEquals(
    level_in_blockquotes("8"),
    "<blockquote>CMA INTERMEDIATE</blockquote>",
  );
});

Deno.test("level_in_blockquotes - Final level papers", () => {
  assertEquals(
    level_in_blockquotes("P13"),
    "<blockquote>CMA FINAL</blockquote>",
  );
  assertEquals(
    level_in_blockquotes("p20A"),
    "<blockquote>CMA FINAL</blockquote>",
  );
  assertEquals(
    level_in_blockquotes("20B"),
    "<blockquote>CMA FINAL</blockquote>",
  );
});

Deno.test("level_in_blockquotes - Unknown paper fallback", () => {
  assertEquals(
    level_in_blockquotes("P99"),
    "<blockquote>CMA UNKNOWN</blockquote>",
  );
  assertEquals(
    level_in_blockquotes("invalid"),
    "<blockquote>CMA UNKNOWN</blockquote>",
  );
  assertEquals(
    level_in_blockquotes(""),
    "<blockquote>CMA UNKNOWN</blockquote>",
  );
});