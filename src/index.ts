import { createJsonDb } from "./lib/json-db-wrapper";

type Book = {
  id: number;
  title: string;
};

const db = createJsonDb<Book>("books.json");

async function main() {
  await db.addMany([
    { id: 1, title: "Svelte for Dummies" },
    { id: 2, title: "Vue for Dummies" },
    { id: 3, title: "React for Dummies" },
  ]);

  const books = await db.getAll();
  console.log("Books:", books);
}

main().catch(console.error);
