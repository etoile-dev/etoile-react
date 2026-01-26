# Contributing to @etoile-dev/react

## Philosophy

Étoile React is built on principles of **elegance**, **minimalism**, and **clarity**. Every component, every example, every line of documentation should reflect these values.

### Core Values

1. **Simplicity First** - The simplest solution is often the best
2. **Elegant Defaults** - Components should work beautifully out of the box
3. **Progressive Enhancement** - Start simple, layer complexity only when needed
4. **Developer Joy** - Code should be a pleasure to read and write

## Documentation Standards

### Writing Philosophy

Documentation is an art form. Like a well-designed component, it should be:
- **Minimal** - Say more with less
- **Clear** - No ambiguity, no confusion
- **Beautiful** - Even code examples should be aesthetically pleasing
- **Practical** - Show real-world usage, not toy examples

### Example Guidelines

#### 1. Use Elegant, Timeless Examples

We favor classic, sophisticated examples that resonate with creativity and culture:

**Preferred themes:**
- 🎨 **Art & Artists** - "paintings", "artists", "The Starry Night", "Vincent van Gogh"
- 📚 **Literature** - "books", "authors", "1984", "George Orwell"
- 🎵 **Music** - "albums", "musicians", "Clair de Lune", "Claude Debussy"
- 🏛️ **Architecture** - "buildings", "architects", "Fallingwater", "Frank Lloyd Wright"

**Avoid:**
- ❌ Generic "foo", "bar", "baz"
- ❌ Overly technical examples ("widgets", "items", "objects")
- ❌ Corporate/mundane examples ("employees", "products", "invoices")
- ❌ Trendy pop culture references that will age poorly

#### 2. Structure Examples from Simple → Complex

**Always follow this progression:**

##### ✅ First: The Absolute Minimum

Start with the simplest possible usage. No customization, no optional props.

```tsx
// ✅ Perfect first example
<Search
  apiKey="your-api-key"
  collections={["paintings"]}
/>
```

##### ✅ Second: Common Use Case

Show one level of practical customization.

```tsx
// ✅ Good second example
<Search
  apiKey={process.env.ETOILE_API_KEY!}
  collections={["paintings", "artists"]}
  limit={10}
/>
```

##### ✅ Last: Advanced Customization

Only after simple examples, show advanced patterns.

```tsx
// ✅ Advanced example - always last
<SearchRoot
  apiKey="your-api-key"
  collections={["paintings"]}
  debounceMs={150}
  autoFocus
>
  <div className="custom-layout">
    <SearchInput className="fancy-input" />
    <SearchResults>
      {(result) => (
        <SearchResult className="hover:shadow-lg">
          <img src={result.metadata?.image} />
          <h3>{result.title}</h3>
          <p>{result.metadata?.artist}</p>
        </SearchResult>
      )}
    </SearchResults>
  </div>
</SearchRoot>
```

#### 3. Example Anti-Patterns

**❌ Don't start with complexity:**
```tsx
// ❌ BAD - too complex as first example
<SearchRoot
  apiKey={process.env.ETOILE_API_KEY!}
  collections={["paintings", "artists", "museums"]}
  limit={25}
  debounceMs={150}
  autoFocus={true}
>
  <div className="flex flex-col gap-4 p-6 bg-gray-100">
    <SearchInput className="w-full px-4 py-2 border-2" />
    {/* ... complex JSX */}
  </div>
</SearchRoot>
```

**❌ Don't use generic examples:**
```tsx
// ❌ BAD - lacks elegance
<Search
  apiKey="key"
  collections={["items"]}
/>
```

**❌ Don't skip the simple case:**
```tsx
// ❌ BAD - jumping straight to customization
<Search
  renderResult={(result) => (
    <div>{result.title}</div>
  )}
/>
```

### JSDoc Standards

Every exported component, hook, and type must have:

#### 1. Clear Description

One or two sentences explaining **what** it does and **why** you'd use it.

```tsx
/**
 * Search input component with built-in keyboard navigation and accessibility.
 *
 * Automatically integrates with SearchRoot context to provide search functionality,
 * debouncing, and keyboard controls (ArrowUp, ArrowDown, Enter, Escape).
 */
```

#### 2. Documented Parameters

Use JSDoc tags for all parameters:

```tsx
export type SearchRootProps = {
  /** Your Étoile API key. Get one at https://etoile.dev */
  apiKey: string;
  /** Collections to search in (e.g., ["paintings", "artists"]) */
  collections: string[];
  /** Maximum number of results to return (default: 10) */
  limit?: number;
};
```

#### 3. Progressive Examples

Use `@example` tags following simple → complex progression:

```tsx
/**
 * Search hook for managing search state.
 *
 * @param options - Search configuration
 * @returns Search state and controls
 *
 * @example Basic usage
 * ```tsx
 * const search = useSearch({
 *   apiKey: "your-api-key",
 *   collections: ["paintings"],
 * });
 * ```
 *
 * @example With all options
 * ```tsx
 * const search = useSearch({
 *   apiKey: process.env.ETOILE_API_KEY!,
 *   collections: ["paintings", "artists"],
 *   limit: 20,
 *   debounceMs: 150,
 * });
 * ```
 */
```

### Code Style

#### Component Examples

```tsx
// ✅ GOOD - Simple, elegant, clear
<Search
  apiKey="your-api-key"
  collections={["paintings"]}
/>

// ✅ GOOD - Real-world example
const { results, isLoading } = useSearch({
  apiKey: process.env.ETOILE_API_KEY!,
  collections: ["paintings", "artists"],
});

// ❌ BAD - Overly verbose
const myApiKey = process.env.ETOILE_API_KEY;
const myCollections = ["paintings"];
const myLimit = 10;
<Search apiKey={myApiKey} collections={myCollections} limit={myLimit} />
```

#### Example Data

When showing result data, use our elegant theme:

```tsx
// ✅ GOOD - Elegant, cultural reference
const result: SearchResultData = {
  external_id: "starry-night",
  title: "The Starry Night",
  collection: "paintings",
  score: 0.95,
  content: "A swirling night sky over a village...",
  metadata: {
    artist: "Vincent van Gogh",
    year: 1889,
  }
};

// ❌ BAD - Generic, uninspired
const result: SearchResultData = {
  external_id: "item-1",
  title: "Test Item",
  collection: "items",
  score: 0.5,
  metadata: {}
};
```

## Changelog Guidelines

Follow [Keep a Changelog](https://keepachangelog.com/) format:

### Categories (in order)
1. **Breaking Changes** - API changes requiring user action
2. **Added** - New features
3. **Changed** - Changes to existing functionality
4. **Deprecated** - Soon-to-be-removed features
5. **Removed** - Removed features
6. **Fixed** - Bug fixes
7. **Security** - Security improvements

### Writing Style

- Be clear and actionable
- Include code examples for breaking changes
- Use present tense ("Add feature" not "Added feature")
- Focus on user impact, not implementation details

```markdown
## [0.2.0] - 2026-01-27

### Breaking Changes
- **`apiKey` is now required**. Update your code:
  ```tsx
  // Before
  <SearchRoot collections={["docs"]} />
  
  // After
  <SearchRoot apiKey="your-api-key" collections={["docs"]} />
  ```

### Added
- Comprehensive JSDoc documentation with examples
- Exported all TypeScript types for better IDE support

### Changed
- Default debounce reduced from 200ms to 100ms for faster responsiveness

### Fixed
- SearchResults now hides when query is empty
```

## Code Review Checklist

Before submitting changes, ensure:

- [ ] All new exports have JSDoc comments
- [ ] Examples follow simple → complex progression
- [ ] Examples use elegant themes (art, literature, music)
- [ ] TypeScript compiles without errors
- [ ] CHANGELOG.md is updated
- [ ] No breaking changes without migration guide

## Getting Help

- **Documentation questions**: See existing JSDoc comments in `src/`
- **Philosophy questions**: Re-read this guide, focus on simplicity
- **Example inspiration**: Check `etoile-js` repository for consistency

---

*"Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away."* – Antoine de Saint-Exupéry
