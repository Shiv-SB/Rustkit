import { Layer, Logger } from "effect";
import { BunServices } from '@effect/platform-bun';

export const layers = Layer.mergeAll(
    BunServices.layer,
    Logger.layer([Logger.consolePretty()]),
);
