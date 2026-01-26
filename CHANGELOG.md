# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-01-26

### Changed
- Default debounce delay reduced from 200ms to 100ms for faster search responsiveness
- SearchResults component now hides when query is empty or no results are found (returns null instead of rendering empty container)

### Fixed
- Improved initial render performance by not showing results container until user enters a query

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
