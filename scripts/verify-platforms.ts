import { existsSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const warnOnly = process.argv.includes("--warn");

const PLATFORMS: Array<[string, string]> = [
    ["darwin-arm64", "dylib"],
    ["darwin-x64", "dylib"],
    ["linux-x64-gnu", "so"],
    ["linux-arm64-gnu", "so"],
    ["linux-x64-musl", "so"],
    ["linux-arm64-musl", "so"],
];

let missing = 0;

console.log("platform            status");
console.log("------------------- -------");

for (const [key, ext] of PLATFORMS) {
    const path = join(root, "platforms", key, `librustkit_ffi.${ext}`);
    const ok = existsSync(path) && statSync(path).size > 0;
    if (!ok) {
        missing += 1;
    }
    console.log(`${key.padEnd(19)} ${ok ? "OK" : "MISSING"}`);
}

if (missing > 0) {
    if (warnOnly) {
        console.warn(`\n${missing} platform binary(ies) missing (dry-run: continuing; --publish will hard-fail). Run: bun run build:platforms`);
        process.exit(0);
    }
    console.error(`\n${missing} platform binary(ies) missing. Run: bun run build:platforms`);
    process.exit(1);
}

console.log("\nAll 6 platform binaries present.");