import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSwagger,
} from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { handler } from "@effect/platform/HttpApiBuilder";
import { serve } from "bun";
import { DateTime, Duration, Effect, Layer, Option, Schema } from "effect";

const health = HttpApiEndpoint.get("health", "/health").addSuccess(
  Schema.String,
);

const uptime = HttpApiEndpoint.get("uptime", "/health/uptime").addSuccess(
  Schema.String,
);

const StatusGroup = HttpApiGroup.make("status")
  .add(health)
  .add(uptime);

const StatusApi = HttpApi.make("Status").add(StatusGroup);

const StatusLive = HttpApiBuilder.group(StatusApi, "status", (handler) => {
  return Effect.gen(function* () {
    return handler.handle("health", () => Effect.succeed("Healthy"))
      .handle(
        "uptime",
        () => {
          const startup = Bun.nanoseconds() / 1_000_000;
          const startupOption = Duration.millis(startup)
            .pipe(Duration.format);
          return Effect.succeed(startupOption);
        },
      );
  });
});

export const StatusApiLive = HttpApiBuilder.api(StatusApi).pipe(
  Layer.provide(StatusLive),
);
