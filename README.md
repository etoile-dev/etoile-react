<p align="center">
  <a href="https://etoile.dev">
    <img src="https://etoile.dev/assets/logo-black.svg" alt="Étoile" height="32" />
  </a>
</p>

<p align="center">
  <img src="https://etoile.dev/assets/hands-of-god.jpg" alt="Add search to your app in seconds" width="100%" />
</p>

<h1 align="center">@etoile-dev/react</h1>

<p align="center">
  <strong>Headless React primitives for search.</strong>
  <br />
  Composable. Accessible. Zero styling.
</p>

<p align="center">
  <a href="https://etoile.dev">Website</a> · <a href="https://etoile.dev/docs">Documentation</a>
</p>

---

## About

**@etoile-dev/react** provides headless, composable React components for search powered by [Étoile](https://etoile.dev).

Built on top of [@etoile-dev/client](https://www.npmjs.com/package/@etoile-dev/client), these primitives give you full control over styling while handling state, keyboard navigation, and accessibility.

---

## Philosophy

- **Headless-first** — You control the appearance
- **Composable** — Build your own search UX
- **Accessible** — Full ARIA support and keyboard navigation
- **No magic** — Behavior is predictable and documented
- **No opinions** — Bring your own styles (or use our optional theme)

---

## Install

```bash
npm i @etoile-dev/react
```

---

## Quickstart

```tsx
import { Search } from "@etoile-dev/react";

export default function App() {
  return <Search apiKey="your-api-key" collections={["paintings"]} />;
}
```

---

## Composable Primitives

For full control, use the headless primitives:

```tsx
import {
  SearchRoot,
  SearchInput,
  SearchResults,
  SearchResult,
} from "@etoile-dev/react";

export default function CustomSearch() {
  return (
    <SearchRoot
      apiKey={process.env.ETOILE_API_KEY}
      collections={["paintings"]}
      limit={20}
    >
      <SearchInput placeholder="Search paintings..." className="search-input" />
      
      <SearchResults className="results-list">
        {(result) => (
          <SearchResult className="result-item">
            <h3>{result.title}</h3>
            <p>{result.metadata.artist}</p>
            <small>Score: {result.score.toFixed(2)}</small>
          </SearchResult>
        )}
      </SearchResults>
    </SearchRoot>
  );
}
```

---

## Styling with data attributes

Each result automatically gets `data-selected` and `data-index` attributes:

```css
.result-item {
  padding: 1rem;
  cursor: pointer;
}

.result-item[data-selected="true"] {
  background: #f0f9ff;
  border-left: 3px solid #0ea5e9;
}
```

---

## Optional theme

Import the optional default theme:

```tsx
import "@etoile-dev/react/styles.css";
```

Then use the `.etoile-theme` class:

```tsx
<div className="etoile-theme">
  <Search {...props} />
</div>
```

Customize with CSS variables:

```css
.etoile-theme {
  --etoile-bg: #ffffff;
  --etoile-border: #e4e4e7;
  --etoile-text: #09090b;
  --etoile-muted: #71717a;
  --etoile-accent: #2563eb;
}
```

---

## Headless hook

For complete control, use the `useSearch` hook:

```tsx
import { useSearch } from "@etoile-dev/react";

function MyCustomSearch() {
  const { query, setQuery, results, isLoading } = useSearch({
    apiKey: "your-api-key",
    collections: ["paintings"],
  });

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search paintings..."
      />
      {isLoading && <p>Loading...</p>}
      <ul>
        {results.map((result) => (
          <li key={result.external_id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## API

### `<Search>`

Convenience component that composes all primitives.

| Prop           | Type                                          | Required | Default |
|----------------|-----------------------------------------------|----------|---------|
| `apiKey`       | `string`                                      | ✓        |         |
| `collections`  | `string[]`                                    | ✓        |         |
| `limit`        | `number`                                      |          | `10`    |
| `renderResult` | `(result: SearchResultData) => React.ReactNode` |          |         |

---

### `<SearchRoot>`

Context provider that manages search state and keyboard navigation.

| Prop          | Type              | Required | Default |
|---------------|-------------------|----------|---------|
| `apiKey`      | `string`          | ✓        |         |
| `collections` | `string[]`        | ✓        |         |
| `limit`       | `number`          |          | `10`    |
| `debounceMs`  | `number`          |          | `100`   |
| `autoFocus`   | `boolean`         |          | `false` |
| `children`    | `React.ReactNode` | ✓        |         |

---

### `<SearchInput>`

Controlled input with ARIA combobox role.

| Prop          | Type     |
|---------------|----------|
| `placeholder` | `string` |
| `className`   | `string` |

**Keyboard shortcuts:**
- `ArrowUp` / `ArrowDown` — Navigate results
- `Enter` — Select active result
- `Escape` — Clear search

---

### `<SearchResults>`

Results container with ARIA listbox role.

| Prop        | Type                                          | Required |
|-------------|-----------------------------------------------|----------|
| `className` | `string`                                      |          |
| `children`  | `(result: SearchResultData) => React.ReactNode` | ✓        |

---

### `<SearchResult>`

Individual result with ARIA option role.

| Prop        | Type              | Required |
|-------------|-------------------|----------|
| `className` | `string`          |          |
| `children`  | `React.ReactNode` | ✓        |

**Data attributes:**
- `data-selected="true" | "false"` — Active state
- `data-index="number"` — Result position

---

### `useSearch(options)`

Headless hook for complete control.

**Options:**

| Field         | Type       | Required | Default |
|---------------|------------|----------|---------|
| `apiKey`      | `string`   | ✓        |         |
| `collections` | `string[]` | ✓        |         |
| `limit`       | `number`   |          | `10`    |
| `debounceMs`  | `number`   |          | `100`   |

**Returns:**

| Field              | Type                       |
|--------------------|----------------------------|
| `query`            | `string`                   |
| `setQuery`         | `(q: string) => void`      |
| `results`          | `SearchResultData[]`       |
| `isLoading`        | `boolean`                  |
| `selectedIndex`    | `number`                   |
| `setSelectedIndex` | `(i: number) => void`      |
| `clear`            | `() => void`               |

---

## Types

```ts
type SearchResultData = {
  external_id: string;
  title: string;
  collection: string;
  score: number;
  content?: string;
  metadata: Record<string, unknown>;
};
```

---

## Why @etoile-dev/react?

- **Radix / shadcn-style primitives** — Composable and unstyled
- **Accessibility built-in** — ARIA roles, keyboard navigation, focus management
- **Behavior, not appearance** — You own the design
- **TypeScript-first** — Full type safety
- **Zero dependencies** — Only React and @etoile-dev/client

---

<p align="center">
  <a href="https://etoile.dev/docs"><strong>Read the docs →</strong></a>
</p>
