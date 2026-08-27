import { bench, summary, run } from "mitata";
import { vector } from "../src/index";

const a = new Float32Array(1024);
const b = new Float32Array(1024);
for (let i = 0; i < 1024; i++) {
    a[i] = i;
    b[i] = i + 1;
}

summary(() => {
    bench("vector.add", () => {
        vector.add(a, b);
    });
});

summary(() => {
    bench("vector.sub", () => {
        vector.sub(a, b);
    });
});

summary(() => {
    bench("vector.mul", () => {
        vector.mul(a, b);
    });
});

summary(() => {
    bench("vector.div", () => {
        vector.div(a, b);
    });
});

summary(() => {
    bench("vector.dot", () => {
        vector.dot(a, b);
    });
});

summary(() => {
    bench("vector.cross", () => {
        vector.cross(
            new Float32Array([1, 2, 3]),
            new Float32Array([4, 5, 6])
        );
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
    bench("vector.scale", () => {
        vector.scale(a, 2.0);
    });
});

summary(() => {
    bench("vector.argmin", () => {
        vector.argmin(a);
    });
});

summary(() => {
    bench("vector.argmax", () => {
        vector.argmax(a);
    });
});

summary(() => {
    bench("vector.fill", () => {
        vector.fill(1024, 42.0);
    });
});

summary(() => {
    bench("vector.zero", () => {
        vector.zero(1024);
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
    bench("vector.lerp", () => {
        vector.lerp(a, b, 0.5);
    });
});

summary(() => {
    bench("vector.clamp", () => {
        vector.clamp(a, 100, 900);
    });
});

summary(() => {
    bench("vector.sort", () => {
        vector.sort(a);
    });
});

await run();
