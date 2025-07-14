import {
  HttpApi,
  HttpApiBuilder,
  HttpApiEndpoint,
  HttpApiGroup,
  HttpApiSwagger,
} from "@effect/platform";
import { BunHttpServer, BunRuntime } from "@effect/platform-bun";
import { serve } from "bun";
import { Layer } from "effect";
import { StatusApiLive } from "./health.ts";

export const ServerLive = HttpApiBuilder.serve().pipe(
  Layer.provide(HttpApiSwagger.layer()),
  Layer.provide(StatusApiLive),
  Layer.provide(BunHttpServer.layer({ port: 3000 })),
);
