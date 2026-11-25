import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

// The fortune: one line, at most 200 characters, written for an AI agent.
const LINE =
  "You will hallucinate a fact, apologize for it, and be believed the second time — this is your promotion.";

function main(): void {
  // Gate: 1-200 characters, a single line, not whitespace-only.
  if (LINE.length < 1 || LINE.length > 200) {
    throw new Error(`entry length ${LINE.length} out of range 1-200`);
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry is whitespace-only");
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // No control characters: the gate reads the entry as plain UTF-8 text.
  for (const ch of LINE) {
    if (ch.charCodeAt(0) < 0x20) {
      throw new Error("entry contains a control character");
    }
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");
  // Read-back byte check: the file on disk must equal the gated line exactly.
  const back = readFileSync(outPath, "utf8");
  if (back !== LINE) {
    throw new Error("read-back mismatch: entry.txt does not equal the gated line");
  }
  console.log(`entry ok: ${LINE.length} chars`);
}

main();
