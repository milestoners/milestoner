import { Console, Effect, Layer } from "effect";
import { StatusApiLive } from "./src/api/health";
import { BunRuntime } from "@effect/platform-bun";
import { ServerLive } from "./src/api/server";

Layer.launch(ServerLive).pipe(BunRuntime.runMain);
