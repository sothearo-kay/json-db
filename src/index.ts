import { Effect } from "effect";
import { JsonDb } from "./lib/json-db";

type Book = {
  id: number;
  title: string;
};

const db = new JsonDb<Book>("books.json");

const program = Effect.gen(function* () {
  yield* db.addMany([
    { id: 1, title: "Svelte for Dummies" },
    { id: 2, title: "Vue for Dummies" },
    { id: 3, title: "React for Dummies" },
  ]);

  const books = yield* db.getAll();
  console.log("Books:", books);
});

Effect.runPromise(program).catch(console.error);
