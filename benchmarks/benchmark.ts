import { Glob } from "bun";
import { parseArgs } from "util";

const { positionals } = parseArgs({
    args: Bun.argv.slice(2),
    allowPositionals: true,
});

const glob = new Glob("*.benchmark.ts");
const files: string[] = [];

for await (const file of glob.scan("benchmarks")) {
    if (positionals.length === 0) {
        files.push(file);
    } else {
        const match = positionals.some((pattern) =>
            file.includes(pattern)
        );
        if (match) {
            files.push(file);
        }
    }
}

if (files.length === 0) {
    console.error("No matching benchmark files found.");
    process.exit(1);
}

for (const file of files) {
    console.log(`\n--- ${file} ---\n`);
    await import(`./${file}`);
}
