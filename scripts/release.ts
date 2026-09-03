import { join } from "node:path";

const root = join(import.meta.dir, "..");
const publish = process.argv.includes("--publish");

async function step(name: string, cmd: string[]) {
    console.log(`\n=== ${name} ===`);
    const proc = Bun.spawn(cmd, {
        cwd: root,
        stdin: "inherit",
        stdout: "inherit",
        stderr: "inherit",
    });
    const exitCode = await proc.exited;
    if (exitCode !== 0) {
        throw new Error(`${name} failed with exit code ${exitCode}`);
    }
}

try {
    await step("sync version", ["bun", "run", "sync:version"]);
    await step("build platforms", ["bun", "run", "build:platforms"]);
    await step("verify platforms", ["bun", "scripts/verify-platforms.ts", `${publish ? "" : "--warn"}`]);
    await step("test suite", ["bun", "test"]);
    await step("build dist", ["bun", "run", "build"]);
    await step("smoke test", ["bun", "smoke"]);

    if (publish) {
        console.log("\n=== PUBLISH ===");
        await step("publish", ["bun", "publish", "--access", "public"]);
        console.log("\nPUBLISHED");
    } else {
        console.log("\nDRY-RUN: no publish (pass --publish to ship)");
    }
} catch (e) {
    console.error(`\nRELEASE FAILED at step: ${(e as Error).message}`);
    process.exit(1);
}