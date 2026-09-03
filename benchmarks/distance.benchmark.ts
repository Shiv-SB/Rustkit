import { bench, summary, run } from "mitata";
import { distance } from "../src/index";

const a = new Float32Array(1024);
const b = new Float32Array(1024);
for (let i = 0; i < 1024; i++) {
    a[i] = i;
    b[i] = i + 1;
}

summary(() => {
    bench("distance.euclidean", () => {
        distance.euclidean(a, b);
    });
});

summary(() => {
    bench("distance.manhattan", () => {
        distance.manhattan(a, b);
    });
});

summary(() => {
    bench("distance.cosineSimilarity", () => {
        distance.cosineSimilarity(a, b);
    });
});

summary(() => {
    bench("distance.chebyshev", () => {
        distance.chebyshev(a, b);
    });
});

await run();
