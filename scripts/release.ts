import { execSync } from "node:child_process";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const publish = process.argv.includes("--publish");

function step(name: string, cmd: string) {
    console.log(`\n=== ${name} ===`);
    execSync(cmd, { cwd: root, stdio: "inherit" });
}

try {
    step("sync version", "bun run sync:version");
    step("build platforms", "bun run build:platforms");
    step("verify platforms", `bun scripts/verify-platforms.ts ${publish ? "" : "--warn"}`);
    step("test suite", "bun test");
    step("build dist", "bun run build");
    step("smoke test", "bun run smoke");

    if (publish) {
        console.log("\n=== PUBLISH ===");
        execSync("bun publish --access public", { cwd: root, stdio: "inherit" });
        console.log("\nPUBLISHED");
    } else {
        console.log("\nDRY-RUN: no publish (pass --publish to ship)");
    }
} catch (e) {
    console.error(`\nRELEASE FAILED at step: ${(e as Error).message}`);
    process.exit(1);
}