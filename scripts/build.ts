import { join } from "node:path";

const root = join(import.meta.dir, "..");

const result = await Bun.build({
    entrypoints: [join(root, "src", "index.ts")],
    outdir: join(root, "dist"),
    target: "bun",
});

if (!result.success) {
    console.error("BUILD FAILED:");
    for (const log of result.logs) {
        console.error(log.message);
    }
    process.exit(1);
}

console.log(`bundled ${result.outputs.length} output(s) into dist/`);

const tsc = Bun.spawn(
    [
        "bunx",
        "tsc",
        "--ignoreConfig",
        "--declaration",
        "--emitDeclarationOnly",
        "--outDir",
        join(root, "dist"),
        "--module",
        "preserve",
        "--moduleResolution",
        "bundler",
        "--allowImportingTsExtensions",
        "--skipLibCheck",
        "--types",
        "bun",
        join(root, "src", "index.ts"),
    ],
    {
        cwd: root,
        stdin: "inherit",
        stdout: "inherit",
        stderr: "inherit",
    }
);

const exitCode = await tsc.exited;
if (exitCode !== 0) {
    console.error(`tsc declaration emit failed with exit code ${exitCode}`);
    process.exit(1);
}

console.log("declarations emitted into dist/");