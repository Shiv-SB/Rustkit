import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const cargoToml = readFileSync(join(root, "crates", "rustkit-ffi", "Cargo.toml"), "utf8");
const match = cargoToml.match(/^version\s*=\s*"([^"]+)"/m);
if (!match) {
    throw new Error("Could not find version in crates/rustkit-ffi/Cargo.toml");
}

const version = match[1];
const pkgPath = join(root, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.version = version;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

console.log(`synced package.json version -> ${version}`);