import { Console, Effect } from "effect";

const program = Console.log("Hello, stoners");

Effect.runSync(program);
