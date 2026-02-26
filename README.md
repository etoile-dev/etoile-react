<p align="center">
  <a href="https://etoile.dev">
    <img src="https://etoile.dev/assets/logo-black.svg" alt="Etoile" height="32" />
  </a>
</p>

<p align="center">
  <img src="https://etoile.dev/assets/hands-of-god.jpg" alt="Add search to your app in seconds" width="100%" />
</p>

<h1 align="center">@etoile-dev/react</h1>

<p align="center">
  <strong>Headless React primitives for search — with Etoile-powered components and hooks.</strong>
  <br />
  Composable. Accessible. Zero styling.
</p>

<p align="center">
  <a href="https://etoile.dev">Website</a> · <a href="https://etoile.dev/docs">Documentation</a>
</p>

---

## About

**@etoile-dev/react** is the React SDK for **Etoile**, and also a set of unstyled primitives you can wire to any data source.

You get three layers:

- **Ready-to-use Etoile components** — `<Searchbar />` and `<SearchModal />`
- **Etoile data hooks** — `useEtoileSearch` (and `useSearch` alias)
- **Headless primitives** — `Searchbar.Root`, `Searchbar.Input`, `Searchbar.List`, `Searchbar.Item`, …

---

## Philosophy

- **Headless-first** — You control the appearance
- **Composable** — Build any search UX from small primitives
- **Accessible** — Full ARIA combobox / listbox pattern, keyboard navigation
- **No magic** — Predictable behavior, clear contracts
- **Zero style opinions** — Bring your own CSS (or use our optional theme)

---

## Install

```bash
npm i @etoile-dev/react
```

---

## Quickstart

The simplest possible usage — just an API key and a collection:

```tsx
import "@etoile-dev/react/styles.css";
import { Searchbar } from "@etoile-dev/react";

export default function App() {
  return <Searchbar apiKey="your-api-key" collections={["paintings"]} />;
}
```

Search multiple collections and handle selection:

```tsx
<Searchbar
  apiKey={process.env.ETOILE_API_KEY!}
  collections={["paintings", "artists"]}
  limit={10}
  onSelect={(id) => router.push(`/work/${id}`)}
/>
```

---

## Headless primitives

Use `Searchbar.Root` and friends for full control with no Etoile dependency:

```tsx
import { Searchbar } from "@etoile-dev/react";

export default function LocalSearch() {
  return (
    <Searchbar.Root onSelect={(id) => router.push(`/paintings/${id}`)}>
      <Searchbar.Input placeholder="Search paintings…" />
      <Searchbar.List>
        {paintings.map((p) => (
          <Searchbar.Item key={p.id} value={p.id} label={p.title}>
            {p.title}
          </Searchbar.Item>
        ))}
        <Searchbar.Empty>No results.</Searchbar.Empty>
        <Searchbar.Loading />
      </Searchbar.List>
    </Searchbar.Root>
  );
}
```

Primitives are unstyled by default. To opt into the built-in theme while using
primitives, add `className="etoile-search"` on `Searchbar.Root` and import
`@etoile-dev/react/styles.css`.

For modal compositions, apply the theme class once on `Searchbar.Root`.
`Searchbar.Overlay` and `Searchbar.Content` inherit it automatically.

---

## Custom rendering

```tsx
<Searchbar
  apiKey={process.env.ETOILE_API_KEY!}
  collections={["paintings", "artists"]}
  onSelectResult={(result) => router.push(`/work/${result.external_id}`)}
  renderItem={(result) => (
    <Searchbar.Item value={result.external_id} label={result.title}>
      <Searchbar.Thumbnail />
      <div>
        <strong>{result.title}</strong>
        <span>{String(result.metadata?.artist ?? "")}</span>
      </div>
    </Searchbar.Item>
  )}
/>
```

Or use a fully custom link strategy in your item renderer:

```tsx
<Searchbar.Item value={result.external_id} label={result.title}>
  <a href={String(result.metadata?.linkUrl ?? `/work/${result.external_id}`)}>
    {result.title}
  </a>
</Searchbar.Item>
```

---

## Command palette / modal mode

Use the `<SearchModal />` convenience component for an Etoile-powered palette:

```tsx
import "@etoile-dev/react/styles.css";
import { SearchModal } from "@etoile-dev/react";

<SearchModal apiKey="your-api-key" collections={["paintings"]} />;
```

Or compose the primitives yourself for full control:

```tsx
<Searchbar.Root className="etoile-search">
  <Searchbar.Trigger>
    <Searchbar.Icon /> Search
  </Searchbar.Trigger>

  <Searchbar.Portal>
    <Searchbar.Overlay className="overlay" />
    <Searchbar.Content aria-label="Search paintings" className="palette">
      <Searchbar.Input autoFocus placeholder="Search…" />
      <Searchbar.List>
        {results.map((r) => (
          <Searchbar.Item key={r.id} value={r.id}>
            {r.title}
          </Searchbar.Item>
        ))}
        <Searchbar.Empty>No results.</Searchbar.Empty>
      </Searchbar.List>
    </Searchbar.Content>
  </Searchbar.Portal>
</Searchbar.Root>
```

---

## Styling

### Data attributes

All primitives emit `data-*` attributes — no class coupling required:

```css
[role="option"][data-selected="true"] {
  background: #f0f9ff;
}

[role="option"][data-disabled="true"] {
  opacity: 0.4;
  cursor: not-allowed;
}

[data-state="open"] {
  border-color: #3b82f6;
}
```

### Dark mode

```tsx
<Searchbar className="dark" apiKey="your-api-key" collections={["paintings"]} />
```

Or wrap a parent element:

```tsx
<div className="dark">
  <Searchbar apiKey="your-api-key" collections={["paintings"]} />
</div>
```

### CSS variables

Every value is customizable:

```css
.etoile-search {
  --etoile-bg: #ffffff;
  --etoile-border: #e4e4e7;
  --etoile-text: #09090b;
  --etoile-text-muted: #71717a;
  --etoile-selected: #f4f4f5;
  --etoile-radius: 12px;
  --etoile-input-height: 44px;
}
```

See `styles.css` for all 40+ variables.

---

## API

### `<Searchbar />`

Ready-to-use search component powered by Etoile.

| Prop          | Type                                  | Default           |
| ------------- | ------------------------------------- | ----------------- |
| `apiKey`      | `string`                              | **required**      |
| `collections` | `string[]`                            | **required**      |
| `limit`       | `number`                              | `10`              |
| `offset`      | `number`                              | `0` (API default) |
| `debounceMs`  | `number`                              | `100`             |
| `placeholder` | `string`                              | `"Search…"`       |
| `filters`     | `SearchFilter[]`                      |                   |
| `autoFilters` | `boolean`                             |                   |
| `renderItem`  | `(result: SearchResult) => ReactNode` |                   |
| `onSelect`    | `(value: string) => void`             |                   |
| `onSelectResult` | `(result: SearchResult) => void`  |                   |
| `hotkey`      | `string`                              |                   |
| `className`   | `string`                              | `"etoile-search"` |

Also supports non-state DOM/behavior props from `Searchbar.Root`.
Use `onSelectResult` for simple routing with `external_id`.

---

### `<SearchModal />`

Ready-to-use command palette powered by Etoile.

| Prop          | Type                                  | Default           |
| ------------- | ------------------------------------- | ----------------- |
| `apiKey`      | `string`                              | **required**      |
| `collections` | `string[]`                            | **required**      |
| `limit`       | `number`                              | `10`              |
| `offset`      | `number`                              | `0` (API default) |
| `debounceMs`  | `number`                              | `100`             |
| `placeholder` | `string`                              | `"Search…"`       |
| `filters`     | `SearchFilter[]`                      |                   |
| `autoFilters` | `boolean`                             |                   |
| `hotkey`      | `string`                              | `"mod+k"`         |
| `modalLabel`  | `string`                              | `"Search"`        |
| `renderItem`  | `(result: SearchResult) => ReactNode` |                   |
| `onSelect`    | `(value: string) => void`             |                   |
| `onSelectResult` | `(result: SearchResult) => void`  |                   |
| `className`   | `string`                              | `"etoile-search"` |

Use `onSelectResult` for simple routing with `external_id`.

---

### `<Searchbar.Root />`

Context provider and state machine for headless usage.

| Prop             | Type                              | Default    |
| ---------------- | --------------------------------- | ---------- |
| `open`           | `boolean`                         |            |
| `defaultOpen`    | `boolean`                         | `false`    |
| `onOpenChange`   | `(open: boolean) => void`         |            |
| `search`         | `string`                          |            |
| `defaultSearch`  | `string`                          | `""`       |
| `onSearchChange` | `(search: string) => void`        |            |
| `value`          | `string \| null`                  |            |
| `defaultValue`   | `string \| null`                  | `null`     |
| `onValueChange`  | `(value: string \| null) => void` |            |
| `isLoading`      | `boolean`                         | `false`    |
| `error`          | `unknown`                         |            |
| `hotkey`         | `string`                          |            |
| `hotkeyBehavior` | `"focus" \| "toggle"`             | `"toggle"` |
| `onSelect`       | `(value: string) => void`         |            |
| `themeClassName` | `string`                          |            |
| `className`      | `string`                          |            |
| `asChild`        | `boolean`                         | `false`    |

**Keyboard shortcuts:**

- `↑` / `↓` — Navigate items
- `Enter` — Select active item
- `Escape` — Close list

---

### `<Searchbar.Modal />`

Headless modal primitive (`Root + Portal + Overlay + Content`).

| Prop         | Type     | Default    |
| ------------ | -------- | ---------- |
| `aria-label` | `string` | `"Search"` |

Also accepts `Searchbar.Root` props.

---

### `<Searchbar.Input />`

| Prop          | Type      | Default |
| ------------- | --------- | ------- |
| `placeholder` | `string`  |         |
| `asChild`     | `boolean` | `false` |

---

### `<Searchbar.ModalInput />`

Pre-composed modal input row.

| Prop          | Type                | Default     |
| ------------- | ------------------- | ----------- |
| `placeholder` | `string`            | `"Search…"` |
| `icon`        | `ReactNode \| null` | `<Icon />`  |
| `kbd`         | `ReactNode \| null` | `"Esc"`     |

---

### `<Searchbar.List />`

Container with `role="listbox"`. Renders when open. In modal mode, it hides when
query is empty.

| Prop      | Type      | Default |
| --------- | --------- | ------- |
| `asChild` | `boolean` | `false` |

---

### `<Searchbar.Results />`

Helper primitive to render arrays of results with optional built-in states.

```tsx
<Searchbar.List>
  <Searchbar.Results
    results={results}
    renderItem={(result) => (
      <Searchbar.Item value={result.external_id} label={result.title}>
        {result.title}
      </Searchbar.Item>
    )}
  />
</Searchbar.List>
```

| Prop         | Type                                          |
| ------------ | --------------------------------------------- |
| `results`    | `T[]`                                         |
| `renderItem` | `(result: T, index: number) => ReactNode`     |
| `getValue`   | `(result: T, index: number) => string`        |
| `getLabel`   | `(result: T, index: number) => string`        |
| `empty`      | `ReactNode \| null`                           |
| `loading`    | `ReactNode \| null`                           |
| `error`      | `ReactNode \| ((error: unknown) => ReactNode) \| null` |

---

### `<Searchbar.Item />`

| Prop       | Type                      | Default  |
| ---------- | ------------------------- | -------- |
| `value`    | `string`                  | required |
| `label`    | `string`                  | `value`  |
| `disabled` | `boolean`                 | `false`  |
| `onSelect` | `(value: string) => void` |          |
| `asChild`  | `boolean`                 | `false`  |

**Data attributes:** `data-selected`, `data-disabled`, `data-value`

---

### `<Searchbar.Group />`

| Prop    | Type     |
| ------- | -------- |
| `label` | `string` |

---

### `<Searchbar.Separator />`

Visual separator (`role="separator"`).

---

### `<Searchbar.Empty />`

Renders when: list is open, query is non-empty, no items match, and not loading.

---

### `<Searchbar.Loading />`

Renders when `isLoading={true}` is passed to `Searchbar.Root`.

---

### `<Searchbar.Error />`

Renders when `error` is set on `Searchbar.Root`. Accepts a render function:

```tsx
<Searchbar.Error>{(err) => `Search failed: ${String(err)}`}</Searchbar.Error>
```

---

### `<Searchbar.Portal />`

Portals children to `document.body` (or a custom `container`).

---

### `<Searchbar.Overlay />`

Backdrop for modal/palette mode. Renders when open.

---

### `<Searchbar.Content />`

Dialog panel for modal/palette mode. Focuses first focusable child on open.

---

### `<Searchbar.Trigger />`

Button that toggles open state.

---

### `<Searchbar.Icon />`

Search magnifying glass SVG icon.

| Prop   | Type     | Default |
| ------ | -------- | ------- |
| `size` | `number` | `18`    |

---

### `<Searchbar.Kbd />`

Keyboard shortcut badge.

```tsx
<Searchbar.Kbd />          // "⌘K"
<Searchbar.Kbd>/</Searchbar.Kbd>
```

---

### `<Searchbar.Thumbnail />`

Thumbnail image. Auto-reads `metadata.thumbnailUrl` from item context when
used inside the Etoile `<Searchbar />` wrapper.

| Prop   | Type     | Default      |
| ------ | -------- | ------------ |
| `src`  | `string` | from context |
| `alt`  | `string` | item title   |
| `size` | `number` | `40`         |

---

### `useSearchbarContext()`

Access store helpers from any component inside `Searchbar.Root`.

```tsx
import { useSearchbarContext, useSearchbarStore } from "@etoile-dev/react";

function QueryDisplay() {
  const { store } = useSearchbarContext();
  const query = useSearchbarStore(store, (s) => s.query);
  return <span>{query}</span>;
}
```

---

### `useEtoileSearch(options)`

Headless data hook for live Etoile search.

```tsx
import { useEtoileSearch } from "@etoile-dev/react";

const [query, setQuery] = useState("");
const { results, isLoading } = useEtoileSearch({
  apiKey: process.env.ETOILE_API_KEY!,
  collections: ["paintings"],
  query,
  shouldRetryOnError: true,
  errorRetryCount: 2,
  errorRetryInterval: 1000,
});
```

Returns `results`, `isLoading`, `error`, `isError`, `appliedFilters`, and `refinedQuery`.

---

## Types

```ts
import type {
  SearchResult,
  SearchFilter,
  FilterOperator,
} from "@etoile-dev/react";
```

`SearchResultData` remains exported as a deprecated alias.

---

## Why @etoile-dev/react?

- **Fast by default** — only the components that depend on the query re-render, not the whole tree
- **Stable selection** — items are identified by value, not by index
- **Controlled or uncontrolled** — every stateful prop supports both patterns
- **Composable** — render any element as any primitive with `asChild`
- **No opinions** — primitives emit `data-*` attributes and inject no theme classes

---

<p align="center">
  <a href="https://etoile.dev/docs"><strong>Read the docs →</strong></a>
</p>
