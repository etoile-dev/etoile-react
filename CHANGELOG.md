# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-01-26

### Breaking Changes
- **`apiKey` is now required** in all components (`SearchRoot`, `Search`, `useSearch`). Previously it was optional but non-functional without it. Update your code:
  ```tsx
  // Before (0.1.0)
  <SearchRoot collections={["docs"]} />
  
  // After (0.1.1) - apiKey required
  <SearchRoot apiKey="your-api-key" collections={["docs"]} />
  ```

### Changed
- Default debounce delay reduced from 200ms to 100ms for faster search responsiveness
- SearchResults component now hides when query is empty or no results are found (returns null instead of rendering empty container)

### Added
- **Comprehensive JSDoc documentation** for all exported components, hooks, and types with practical examples
- Exported all TypeScript types for better developer experience: `SearchResultData`, `SearchRootProps`, `SearchInputProps`, etc.
- Exported `useSearchContext` hook for building custom search components
- Detailed parameter descriptions in JSDoc comments
- Multiple usage examples in documentation for each component

### Fixed
- Improved initial render performance by not showing results container until user enters a query
- Removed redundant apiKey validation check in useSearch (now handled by TypeScript)

## [0.1.0] - 2026-01-26

### Added
- Initial release of @etoile-dev/react
- Core search components: `SearchRoot`, `SearchInput`, `SearchResults`, `SearchResult`
- `useSearch` hook for search state management with debouncing
- `SearchContext` for sharing search state across components
- TypeScript support with full type definitions
- Keyboard navigation support (ArrowUp, ArrowDown, Enter, Escape)
- Customizable debounce timing
- ARIA-compliant accessibility features
- Headless component architecture for full styling control
