import { bench, summary, run } from "mitata";
import { vector } from "../src/index";

const a = new Float32Array(1024);
const b = new Float32Array(1024);
for (let i = 0; i < 1024; i++) {
    a[i] = i;
    b[i] = i + 1;
}

summary(() => {
    bench("vector.dot", () => {
        vector.dot(a, b);
    });
});

summary(() => {
    bench("vector.sum", () => {
        vector.sum(a);
    });
});

summary(() => {
    bench("vector.mean", () => {
        vector.mean(a);
    });
});

summary(() => {
    bench("vector.norm", () => {
        vector.norm(a);
    });
});

summary(() => {
    bench("vector.normalize", () => {
        vector.normalize(a);
    });
});

summary(() => {
    bench("vector.l1Norm", () => {
        vector.l1Norm(a);
    });
});

summary(() => {
    bench("vector.lInfNorm", () => {
        vector.lInfNorm(a);
    });
});

await run();
