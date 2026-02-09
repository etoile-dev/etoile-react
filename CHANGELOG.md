# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.2] - 2026-02-06

### Improved

- **Composable props** — `SearchInput`, `SearchResults`, `SearchResult`, and `SearchResultThumbnail` now accept standard DOM props for custom handlers and attributes
- **Event chaining** — `SearchInput` safely chains `onChange`, `onFocus`, and `onKeyDown` without breaking built-in behavior

## [0.2.1] - 2026-02-06

### Improved

- **Click-outside dismiss** — Results close when clicking outside the search component
- **Focus-out dismiss** — Results close when focus leaves the component entirely
- **Escape key** — First press closes results (preserves query), second press clears
- **Re-open on focus** — Results reappear when input is re-focused with an existing query
- **Screen reader announcements** — Live region announces result count changes
- **ARIA** — Added `aria-autocomplete="list"` to combobox input, `aria-expanded` now reflects actual visibility
- **Context** — `useSearchContext()` now exposes `isOpen` and `setOpen` for custom implementations