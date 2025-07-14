import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSwagger,
} from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { serve } from "bun";
import { Effect, Layer, Schema } from "effect";

const StatusApi = HttpApi.make("Status").add(
  HttpApiGroup.make("status").add(
    HttpApiEndpoint.get("health", "/health").addSuccess(
      Schema.String,
    ),
  ),
);

const StatusLive = HttpApiBuilder.group(
  StatusApi,
  "status",
  (handlers) =>
    handlers.handle("health", (): Effect.Effect<"Healthy", never, never> => {
      console.log("Accessed /health");
      return Effect.succeed("Healthy");
    }),
);

export const StatusApiLive = HttpApiBuilder.api(StatusApi).pipe(
  Layer.provide(StatusLive),
);
