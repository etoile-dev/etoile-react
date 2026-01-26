# Agent Guidelines for @etoile-dev/react

You're working on Étoile React, a library of elegant, minimalist React primitives for search. These guidelines ensure consistency and quality.

## Core Philosophy

**Elegance. Minimalism. Clarity.**

Every line of code, every example, every comment should embody these principles. When in doubt, choose simplicity.

## Documentation Standards

### Example Themes

**Always use elegant, timeless examples:**

✅ **Preferred:**
- Art & Artists: "paintings", "artists", "The Starry Night", "Vincent van Gogh"
- Literature: "books", "authors", "1984", "George Orwell"  
- Music: "albums", "musicians", "Clair de Lune", "Claude Debussy"
- Architecture: "buildings", "architects", "Fallingwater", "Frank Lloyd Wright"

❌ **Never use:**
- Generic: "foo", "bar", "items", "widgets"
- Corporate: "employees", "products", "invoices"
- Technical: "objects", "entities", "records"
- Pop culture that will age poorly

### Example Progression

**CRITICAL: Always order examples from simple → complex**

#### 1️⃣ First Example: The Absolute Minimum

No optional props. Just the essentials. One look and anyone understands.

```tsx
// ✅ Perfect first example
<Search
  apiKey="your-api-key"
  collections={["paintings"]}
/>
```

#### 2️⃣ Second Example: Common Real-World Usage

One step up. Still clean, but showing practical patterns.

```tsx
// ✅ Good second example
<Search
  apiKey={process.env.ETOILE_API_KEY!}
  collections={["paintings", "artists"]}
  limit={10}
/>
```

#### 3️⃣ Final Example: Advanced Customization

Only NOW show complex patterns, custom components, styling, etc.

```tsx
// ✅ Advanced example - always last
<SearchRoot apiKey="your-api-key" collections={["paintings"]}>
  <SearchInput className="custom-style" />
  <SearchResults>
    {(result) => (
      <SearchResult>
        <img src={result.metadata?.image} />
        <h3>{result.title}</h3>
      </SearchResult>
    )}
  </SearchResults>
</SearchRoot>
```

### JSDoc Template

```tsx
/**
 * [One-line description of what it does]
 *
 * [Optional: One more line explaining why/when to use it]
 *
 * @param props - Component props
 *
 * @example Basic usage
 * ```tsx
 * // Simplest possible usage
 * <Component apiKey="key" collections={["paintings"]} />
 * ```
 *
 * @example [Optional: Common use case]
 * ```tsx
 * // Slightly more realistic
 * <Component
 *   apiKey={process.env.KEY!}
 *   collections={["paintings", "artists"]}
 * />
 * ```
 *
 * @example [Optional: Advanced customization]
 * ```tsx
 * // Complex patterns - always last
 * <Component {...advancedProps}>
 *   {/* Custom implementation */}
 * </Component>
 * ```
 */
```

### Type Documentation

Every exported type property needs a JSDoc comment:

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

## Code Style

### Component Props

```tsx
// ✅ GOOD - Required props first, optional after
export type Props = {
  apiKey: string;           // Required
  collections: string[];    // Required
  limit?: number;           // Optional
  debounceMs?: number;      // Optional
};

// ❌ BAD - Mixed order
export type Props = {
  limit?: number;
  apiKey: string;
  debounceMs?: number;
  collections: string[];
};
```

### Example Data

Use our elegant theme consistently:

```tsx
// ✅ GOOD
{
  id: "starry-night",
  title: "The Starry Night",
  collection: "paintings",
  metadata: { artist: "Vincent van Gogh", year: 1889 }
}

// ❌ BAD
{
  id: "item-123",
  title: "Test Item",
  collection: "items",
  metadata: {}
}
```

## Making Changes

### Adding New Features

1. **Start with the API** - What's the simplest possible interface?
2. **Write JSDoc first** - If you can't explain it simply, it's too complex
3. **Add to index.ts** - Export types, components, hooks
4. **Update CHANGELOG.md** - Document what changed and why

### Breaking Changes

Breaking changes need:
1. Clear explanation in CHANGELOG.md
2. Before/after code examples
3. Migration instructions
4. Updated version (minor or major bump)

### Documentation Updates

When updating docs:
1. **Simplify first** - Can you use fewer words?
2. **Check examples** - Do they follow simple → complex?
3. **Verify theme** - Are you using our elegant examples?
4. **Test TypeScript** - Run `npm run build` to check types

## Common Patterns

### Naming Conventions

```tsx
// ✅ GOOD - Clear, descriptive, not verbose
<SearchRoot>
<SearchInput>
<SearchResults>

// ❌ BAD - Too verbose or unclear
<SearchRootContainer>
<SearchTextInput>
<SearchResultsList>
```

### Default Values

```tsx
// ✅ GOOD - Sensible defaults in type definition
export const useSearch = ({
  apiKey,
  collections,
  limit = 10,              // Clear default
  debounceMs = 100,        // Clear default
}: UseSearchOptions) => {
```

### Error Messages

```tsx
// ✅ GOOD - Clear, actionable
throw new Error("Search components must be used within SearchRoot.");

// ❌ BAD - Vague or technical
throw new Error("Context is undefined.");
```

## Pre-Commit Checklist

Before committing changes:

- [ ] `npm run build` succeeds (TypeScript compiles)
- [ ] All exports have JSDoc comments
- [ ] Examples follow simple → complex order
- [ ] Examples use elegant themes (paintings, artists, etc.)
- [ ] CHANGELOG.md updated if user-facing changes
- [ ] No `console.log` or debug code left in

## AI-Specific Guidelines

### When Generating Code

1. **Default to minimal** - Only add complexity when explicitly requested
2. **Follow existing patterns** - Match the style of existing code
3. **Document immediately** - Add JSDoc as you write the code, not after
4. **Use our examples** - "paintings", "artists", Van Gogh, The Starry Night

### When Answering Questions

1. **Show simple examples first** - Even if the question is complex
2. **Use our theme** - Replace generic examples with art/culture references
3. **Be concise** - Prefer clarity over comprehensiveness
4. **Link to docs** - Reference existing documentation when possible

### When Reviewing Code

Look for:
- Are examples ordered simple → complex?
- Are we using elegant themes (paintings, artists)?
- Is JSDoc complete and clear?
- Could anything be simpler?

## References

- **Code style reference**: See `src/hooks/useSearch.ts` for well-documented hook
- **Component reference**: See `src/components/SearchRoot.tsx` for component docs
- **Type reference**: See `src/types.ts` for type documentation
- **Philosophy reference**: See `CONTRIBUTING.md` for detailed guidelines

---

**Remember:** Simplicity is sophistication. Every example is an opportunity to show elegance.
