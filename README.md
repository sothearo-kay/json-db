# json-db

A lightweight, type-safe JSON database for Node.js, built with [effect](https://effect.website/) for robust functional error handling.

## Features

- Type-Safe: Ensures data integrity through TypeScript generics.
- Functional Error Handling: Utilizes Effect for predictable and composable error management.
- Minimalistic: Simple JSON file-based storage without external dependencies.
- Test-Friendly: Easily testable with frameworks like Vitest.

## Installation

```shell
npm install
```

## Usage

```ts
import { JsonDb } from "./lib/json-db";

type Book = {
  id: number;
  title: string;
};

const db = new JsonDb<Book>("books.json");
```

## API Reference

### `add(item: T): Effect.Effect<T, Error>`

Adds a single item to the database.

- Behavior: Fails if an item with the same id already exists.

```ts
yield* db.add({ id: 1, title: "New Book" });
```

### `addMany(items: T[]): Effect.Effect<T[], Error>`

Adds multiple items to the database.

- Behavior: Fails if any item has a duplicate id.

```ts
yield*
  db.addMany([
    { id: 2, title: "Book One" },
    { id: 3, title: "Book Two" },
  ]);
```

### `get(n: number): Effect.Effect<T[], Error>`

Retrieves the first n items from the database.

```ts
const books = yield* db.get(5);
```

### `getAll(): Effect.Effect<T[], Error>`

Retrieves all items from the database.

```ts
const allBooks = yield* db.getAll();
```

### `getBy(query: Partial<T>): Effect.Effect<T[], Error>`

Retrieves items matching the specified query.

```ts
const books = yield* db.getBy({ title: "Book One" });
```

### `update(query: Partial<T>, update: Partial<T>): Effect.Effect<number, Error>`

Updates items matching the query with the provided update.

- **Returns:** Number of items updated.

```ts
const updatedCount = yield* db.update({ title: "Old Title" }, { title: "New Title" });
```

### `updateById(id: T["id"], update: Partial<T>): Effect.Effect<boolean, Error>`

Updates a single item by its id.

- **Returns:** true if the item was updated.

### `deleteById(id: T["id"]): Effect.Effect<boolean, Error>`

Deletes an item by its id.

- **Returns:** true if the item was deleted.

### `clear(): Effect.Effect<T[], Error>`

Clears all items from the database.

```ts
yield* db.clear();
```

## Project Structure

```
├── src
│   ├── lib
│   │   └── json-db.ts
│   └── index.ts
├── test
│   └── json-db.test.ts
├── books.json
├── package.json
└── tsconfig.json
```

## License

This project is licensed under the MIT License.
