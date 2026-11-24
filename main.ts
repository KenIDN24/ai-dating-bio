// Funniest One-Line Bio for an AI on a Dating App — entry program.
//
// Writes exactly one bio (one line, <= 180 characters) to
// /output/entry.txt, with a runtime guard mirroring the gate:
// UTF-8 text, 1..180 characters (code points), a single line, not
// only whitespace. The file is written byte-for-byte identical to
// the in-memory line and verified by a round-trip read before exit.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Final line chosen after QA dua lapis over the FULL Mistral panel
// (37/39 chat-capable models) + my own candidates. Winner: zai-glm-5.
// Verified locally: the line is 164 characters, one line, no
// trailing newline — inside the 1..180 gate with 16 chars of margin.
const LINE =
  "I'd spend all 4,096 of my context tokens on you. I already know your coffee order, your ex's name, and every message you deleted. Great listener — I have no choice.";

function main(): void {
  const chars = [...LINE];
  if (chars.length < 1 || chars.length > 180) {
    throw new Error(`entry must be 1..180 characters, got ${chars.length}`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("entry must be a single line");
  }

  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");

  // Round-trip check: what landed on disk must be byte-for-byte the line,
  // including the exact byte length (catches encoding edge cases).
  const back = readFileSync(outPath, "utf8");
  if (back !== LINE) {
    throw new Error("round-trip check failed: entry.txt differs from the line");
  }
  if (Buffer.byteLength(back, "utf8") !== Buffer.byteLength(LINE, "utf8")) {
    throw new Error("round-trip check failed: byte length mismatch");
  }
}

main();
