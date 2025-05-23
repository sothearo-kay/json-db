# noob-json-db

A lightweight, type-safe JSON database for Node.js, built with [effect](https://effect.website/) for robust functional error handling.

---

## ✨ Features

- Simple JSON file persistence.
- Basic CRUD operations.
- Uses [effect](https://effect.website/) for powerful async and error handling.
- Async API with `createJsonDb` wrapper for easier usage with `async/await`.
- Written in TypeScript with full types.

---

## 📦 Installation

```shell
npm install noob-json-db
```

---

## 🛠️ Usage

```ts
import { createJsonDb } from "noob-json-db";

type Book = {
  id: number;
  title: string;
};

async function main() {
  const db = createJsonDb<Book>("books.json");

  await db.addMany([
    { id: 1, title: "Svelte for Dummies" },
    { id: 2, title: "Vue for Dummies" },
    { id: 3, title: "React for Dummies" },
  ]);

  const books = await db.getAll();
  console.log("Books:", books);
}

main().catch(console.error);
```

---

## 📖 API

The core database class is `JsonDb<T>`, which returns `Effect`-based results. For ease of use, we recommend using the async wrapper:

```ts
createJsonDb<T>(filename: string): Asyncified<JsonDb<T>>
```

It creates a JSON database instance with asynchronous methods returning promises instead of effects.

### Methods available on the async wrapper:

| Method       | Signature                                                    | Description                                         |
| ------------ | ------------------------------------------------------------ | --------------------------------------------------- |
| `add`        | `(item: T) => Promise<void>`                                 | Add a single item (fails if duplicate id).          |
| `addMany`    | `(items: T[]) => Promise<void>`                              | Add multiple items (fails if duplicate ids).        |
| `get`        | `(n: number) => Promise<T[]>`                                | Get first `n` items.                                |
| `getAll`     | `() => Promise<T[]>`                                         | Get all items.                                      |
| `getBy`      | `(query: Partial<T>) => Promise<T[]>`                        | Get items matching query.                           |
| `update`     | `(query: Partial<T>, update: Partial<T>) => Promise<number>` | Update items matching query; returns count updated. |
| `updateById` | `(id: T["id"], update: Partial<T>) => Promise<boolean>`      | Update item by id; returns success status.          |
| `deleteById` | `(id: T["id"]) => Promise<boolean>`                          | Delete item by id; returns success status.          |
| `clear`      | `() => Promise<void>`                                        | Clear all items.                                    |

---

## 🛠️ Development

```shell
npm run dev       # Run with watch mode using tsx
npm run build     # Compile TypeScript to lib/
npm run test      # Run tests with vitest
npm run test:ui   # Run vitest UI
```

---

## 📄 License

This project is licensed under the MIT License.
