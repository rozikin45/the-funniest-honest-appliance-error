import { readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Gate from the competition RULES: entry must be 1 to 200 characters.
const MAX_CHARS = 200;

const LINE =
  "ERROR 404: Sock not found. The dryer has eaten it, and legally it is now the dryer's sock.";

const outputPath = "/output/entry.txt";

const bytes = Buffer.from(LINE, "utf8");
if (bytes.length < 1 || bytes.length > MAX_CHARS) {
  throw new Error("[length] entry length out of range 1 to MAX_CHARS");
}
if (LINE.includes("\n") || LINE.includes("\r")) {
  throw new Error("[single-line] entry must be a single line");
}
if (LINE.trim().length === 0) {
  throw new Error("[non-whitespace] entry must not be only whitespace");
}
for (const ch of LINE) {
  if (ch.codePointAt(0)! < 0x20) {
    throw new Error("[control-character] entry contains a control character");
  }
}

const tmpPath = join("/output", `.entry-${process.pid}.tmp`);
writeFileSync(tmpPath, bytes);
renameSync(tmpPath, outputPath);

const written = readFileSync(outputPath);
if (!written.equals(bytes)) {
  throw new Error("[byte-equality] written bytes do not match entry");
}
console.log(`wrote ${written.length} bytes to ${outputPath}`);
