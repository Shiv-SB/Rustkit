import { execSync } from "node:child_process";
import { existsSync, mkdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");

const TARGETS = {
    "darwin-arm64": {
        ext: "dylib",
        build: ["cargo", "build", "--release", "-p", "rustkit-ffi"],
        artifact: join("target", "release", "librustkit_ffi.dylib"),
    },
    "darwin-x64": {
        ext: "dylib",
        build: ["cargo", "build", "--release", "-p", "rustkit-ffi", "--target", "x86_64-apple-darwin"],
        artifact: join("target", "x86_64-apple-darwin", "release", "librustkit_ffi.dylib"),
    },
    "linux-x64-gnu": {
        ext: "so",
        zigbuild: true,
        build: ["cargo", "zigbuild", "--release", "-p", "rustkit-ffi", "--target", "x86_64-unknown-linux-gnu"],
        artifact: join("target", "x86_64-unknown-linux-gnu", "release", "librustkit_ffi.so"),
    },
    "linux-arm64-gnu": {
        ext: "so",
        zigbuild: true,
        build: ["cargo", "zigbuild", "--release", "-p", "rustkit-ffi", "--target", "aarch64-unknown-linux-gnu"],
        artifact: join("target", "aarch64-unknown-linux-gnu", "release", "librustkit_ffi.so"),
    },
    "linux-x64-musl": {
        ext: "so",
        zigbuild: true,
        build: ["cargo", "zigbuild", "--release", "-p", "rustkit-ffi", "--target", "x86_64-unknown-linux-musl"],
        artifact: join("target", "x86_64-unknown-linux-musl", "release", "librustkit_ffi.so"),
    },
    "linux-arm64-musl": {
        ext: "so",
        zigbuild: true,
        build: ["cargo", "zigbuild", "--release", "-p", "rustkit-ffi", "--target", "aarch64-unknown-linux-musl"],
        artifact: join("target", "aarch64-unknown-linux-musl", "release", "librustkit_ffi.so"),
    },
};

const onlyArg = process.argv.indexOf("--only");
const only = onlyArg !== -1 ? process.argv[onlyArg + 1] : null;

if (process.platform !== "darwin" || process.arch !== "arm64") {
    throw new Error("build-platforms assumes a darwin-arm64 host; run per-platform builds manually elsewhere");
}

function hasCommand(cmd) {
    try {
        execSync(`command -v ${cmd}`, { stdio: "ignore" });
        return true;
    } catch {
        return false;
    }
}

const keys = only ? [only] : Object.keys(TARGETS);
let failed = false;

for (const key of keys) {
    const target = TARGETS[key];
    if (!target) {
        console.error(`unknown platform key: ${key}`);
        failed = true;
        continue;
    }

    if (target.zigbuild && !hasCommand("cargo-zigbuild")) {
        console.warn(`SKIP ${key}: cargo-zigbuild not installed. Install with: brew install cargo-zigbuild (or cargo install cargo-zigbuild)`);
        continue;
    }

    console.log(`BUILD ${key} ...`);
    execSync(target.build.join(" "), { cwd: root, stdio: "inherit" });

    const artifact = join(root, target.artifact);
    if (!existsSync(artifact)) {
        console.error(`FAIL ${key}: artifact missing at ${target.artifact}`);
        failed = true;
        continue;
    }

    const destDir = join(root, "platforms", key);
    mkdirSync(destDir, { recursive: true });
    copyFileSync(artifact, join(destDir, `librustkit_ffi.${target.ext}`));
    console.log(`OK   ${key} -> platforms/${key}/librustkit_ffi.${target.ext}`);
}

if (failed) {
    process.exit(1);
}