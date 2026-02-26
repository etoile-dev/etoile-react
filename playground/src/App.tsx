import { useState, useEffect } from "react";
import { Searchbar, SearchModal, useEtoileSearch } from "@etoile-dev/react";
import "@etoile-dev/react/styles.css";
import "./demo.css";

const apiKey = import.meta.env.VITE_ETOILE_API_KEY;
const collectionsRaw = import.meta.env.VITE_ETOILE_COLLECTIONS;

if (!apiKey || apiKey === "your-api-key-here") {
  throw new Error("VITE_ETOILE_API_KEY is required. Set it in playground/.env.local");
}
if (!collectionsRaw) {
  throw new Error("VITE_ETOILE_COLLECTIONS is required. Set it in playground/.env.local (e.g. paintings,artists)");
}

const collections = collectionsRaw.split(",").map((c: string) => c.trim()).filter(Boolean);

// ── Local dataset for headless demo ──────────────────────────────────────────

const PAINTINGS = [
  { id: "starry-night", title: "The Starry Night", artist: "Vincent van Gogh", year: 1889 },
  { id: "irises", title: "Irises", artist: "Vincent van Gogh", year: 1889 },
  { id: "water-lilies", title: "Water Lilies", artist: "Claude Monet", year: 1906 },
  { id: "impression-sunrise", title: "Impression, Sunrise", artist: "Claude Monet", year: 1872 },
  { id: "persistence-memory", title: "The Persistence of Memory", artist: "Salvador Dalí", year: 1931 },
  { id: "guernica", title: "Guernica", artist: "Pablo Picasso", year: 1937 },
  { id: "girl-pearl-earring", title: "Girl with a Pearl Earring", artist: "Johannes Vermeer", year: 1665 },
  { id: "birth-venus", title: "The Birth of Venus", artist: "Sandro Botticelli", year: 1485 },
  { id: "creation-adam", title: "The Creation of Adam", artist: "Michelangelo", year: 1512 },
  { id: "mona-lisa", title: "Mona Lisa", artist: "Leonardo da Vinci", year: 1503 },
];

export default function App() {
  const [dark, setDark] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(true);
  const [groupedModalOpen, setGroupedModalOpen] = useState(true);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="pg-layout">
      <header className="pg-header">
        <div className="pg-wordmark">
          <span className="pg-wordmark-star">✦</span>
          Etoile React
          <span className="pg-wordmark-badge">playground · vNext</span>
        </div>
        <button className="pg-theme-toggle" onClick={() => setDark((d) => !d)}>
          {dark ? "☀ Light" : "☽ Dark"}
        </button>
      </header>

      <div className="pg-sections">

        {/* ── 01: Simple Etoile wrapper ───────────────────────────────── */}
        <section className="pg-section">
          <div className="pg-section-header">
            <span className="pg-section-label">01 — Simple</span>
            <h2 className="pg-section-title">&lt;Searchbar /&gt;</h2>
            <p className="pg-section-desc">
              Fully Etoile-powered. Drop it in with just <code>apiKey</code> and{" "}
              <code>collections</code>.
            </p>
          </div>
          <div className="pg-demo">
            <Searchbar
              apiKey={apiKey}
              collections={collections}
              className={dark ? "dark" : undefined}
              hotkey="/"
            />
          </div>
        </section>

        <hr className="pg-divider" />

        {/* ── 02: Headless primitives ─────────────────────────────────── */}
        <section className="pg-section">
          <div className="pg-section-header">
            <span className="pg-section-label">02 — Headless</span>
            <h2 className="pg-section-title">&lt;Searchbar.Root&gt; + local data</h2>
            <p className="pg-section-desc">
              Pure UI primitives — no Etoile dependency. Bring your own items.
              Filtering is external (your data layer). Last selected:{" "}
              <code>{selected ?? "none"}</code>
            </p>
          </div>
          <div className="pg-demo">
            <HeadlessDemo dark={dark} onSelect={setSelected} />
          </div>
        </section>

        <hr className="pg-divider" />

        {/* ── 03: Custom Etoile render ────────────────────────────────── */}
        <section className="pg-section">
          <div className="pg-section-header">
            <span className="pg-section-label">03 — Custom rendering</span>
            <h2 className="pg-section-title">renderItem prop</h2>
            <p className="pg-section-desc">
              Etoile-powered but with a custom item renderer showing score and
              metadata.
            </p>
          </div>
          <div className="pg-demo">
            <Searchbar
              apiKey={apiKey}
              collections={collections}
              className={dark ? "dark" : undefined}
              renderItem={(result) => (
                <Searchbar.Item value={result.external_id} label={result.title}>
                  <Searchbar.Thumbnail />
                  <div className="pg-custom-result">
                    <span className="pg-custom-result-title">{result.title}</span>
                    <span className="pg-custom-result-meta">
                      {String(result.metadata?.artist ?? result.collection)}
                      {result.metadata?.year ? ` · ${result.metadata.year}` : ""}
                    </span>
                    <span className="pg-custom-result-score">
                      {result.score.toFixed(3)}
                    </span>
                  </div>
                </Searchbar.Item>
              )}
            />
          </div>
        </section>

        <hr className="pg-divider" />

        {/* ── 04: Command palette (⌘K) ────────────────────────────────── */}
        <section className="pg-section">
          <div className="pg-section-header">
            <span className="pg-section-label">04 — Command palette</span>
            <h2 className="pg-section-title">&lt;SearchModal /&gt;</h2>
            <p className="pg-section-desc">
              Plug-and-play modal search. Open with{" "}
              <kbd className="pg-kbd-inline">⌘K</kbd> /{" "}
              <kbd className="pg-kbd-inline">Ctrl+K</kbd>.
            </p>
          </div>
          <div className="pg-demo">
            <SearchModal
              apiKey={apiKey}
              collections={collections}
              className={dark ? "dark" : undefined}
              open={modalOpen}
              onOpenChange={setModalOpen}
            />
          </div>
        </section>

        <hr className="pg-divider" />

        {/* ── 05: Grouped modal results ───────────────────────────────── */}
        <section className="pg-section">
          <div className="pg-section-header">
            <span className="pg-section-label">05 — Grouped modal</span>
            <h2 className="pg-section-title">&lt;Searchbar.Modal&gt; + Group</h2>
            <p className="pg-section-desc">
              Modal search with grouped results by collection using{" "}
              <code>Searchbar.Group</code>.
            </p>
          </div>
          <div className="pg-demo">
            <GroupedModalDemo
              dark={dark}
              open={groupedModalOpen}
              onOpenChange={setGroupedModalOpen}
            />
          </div>
        </section>

        <hr className="pg-divider" />

        {/* ── 06: Dark mode side-by-side ──────────────────────────────── */}
        <section className="pg-section">
          <div className="pg-section-header">
            <span className="pg-section-label">06 — Themes</span>
            <h2 className="pg-section-title">Light vs dark</h2>
            <p className="pg-section-desc">
              Pass <code>className="dark"</code> to any component or wrap a
              parent element with <code>.dark</code>.
            </p>
          </div>
          <div className="pg-demo pg-demo-side-by-side">
            <div className="pg-demo-light">
              <Searchbar apiKey={apiKey} collections={collections} />
            </div>
            <div className="pg-demo-dark">
              <Searchbar apiKey={apiKey} collections={collections} className="dark" />
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

// ── Headless demo ─────────────────────────────────────────────────────────────

function HeadlessDemo({
  dark,
  onSelect,
}: {
  dark: boolean;
  onSelect: (value: string) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = PAINTINGS.filter(
    (p) =>
      query.trim() === "" ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.artist.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Searchbar.Root
      onSearchChange={setQuery}
      onSelect={onSelect}
      className={dark ? "etoile-search dark" : "etoile-search"}
    >
      <div className="etoile-input-wrapper">
        <Searchbar.Icon />
        <Searchbar.Input placeholder="What are you looking for?" />
        <Searchbar.Kbd className="etoile-kbd" />
      </div>
      <Searchbar.List>
        {filtered.map((p) => (
          <Searchbar.Item key={p.id} value={p.id} label={p.title}>
            <div className="etoile-result-content">
              <span className="etoile-result-title">{p.title}</span>
              <span className="etoile-result-subtitle">
                {p.artist} · {p.year}
              </span>
            </div>
          </Searchbar.Item>
        ))}
        <Searchbar.Empty>
          No paintings found for <span className="etoile-empty-query">"{query}"</span>
        </Searchbar.Empty>
      </Searchbar.List>
    </Searchbar.Root>
  );
}

function GroupedModalDemo({
  dark,
  open,
  onOpenChange,
}: {
  dark: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");

  const { results, isLoading, error } = useEtoileSearch({
    apiKey,
    collections,
    query,
  });

  const grouped = results.reduce<Record<string, typeof results>>((acc, result) => {
    const key = result.collection;
    if (!acc[key]) acc[key] = [];
    acc[key].push(result);
    return acc;
  }, {});

  return (
    <Searchbar.Modal
      className={dark ? "dark" : undefined}
      open={open}
      onOpenChange={onOpenChange}
      hotkey="mod+/"
      search={query}
      onSearchChange={setQuery}
      isLoading={isLoading}
      error={error ?? undefined}
    >
      <Searchbar.ModalInput placeholder="Search paintings and artists..." />
      <Searchbar.List>
        {Object.entries(grouped).map(([collectionName, items]) => (
          <Searchbar.Group key={collectionName} label={collectionName}>
            {items.map((result) => (
              <Searchbar.Item
                key={result.external_id}
                value={result.external_id}
                label={result.title}
              >
                <Searchbar.Thumbnail />
                <div data-slot="searchbar-result-content">
                  <span data-slot="searchbar-result-title">{result.title}</span>
                  <span data-slot="searchbar-result-subtitle">
                    {String(result.metadata?.artist ?? collectionName)}
                  </span>
                </div>
              </Searchbar.Item>
            ))}
          </Searchbar.Group>
        ))}
        <Searchbar.Empty>
          No results found for <span data-slot="searchbar-empty-query">"{query}"</span>
        </Searchbar.Empty>
        <Searchbar.Loading />
        <Searchbar.Error />
      </Searchbar.List>
    </Searchbar.Modal>
  );
}


