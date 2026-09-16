import { useEffect, useState } from "react";
import { Presentation } from "./Presentation";
import { decks } from "./slides";

const SLOTS_PER_PAGE = 4;

const getDeckIndexFromPath = () => {
  const match = window.location.pathname.match(/\/(\d+)\/?$/);
  if (!match) return null;

  const index = Number(match[1]) - 1;
  return index >= 0 && index < decks.length ? index : null;
};

const getBasePath = () => {
  const base = import.meta.env.BASE_URL;
  return base.endsWith("/") ? base.slice(0, -1) : base;
};

export default function App() {
  const [deckIndex, setDeckIndex] = useState<number | null>(getDeckIndexFromPath);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const onPopState = () => setDeckIndex(getDeckIndexFromPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const openDeck = (index: number) => {
    window.history.pushState({}, "", `${getBasePath()}/${index + 1}`);
    setDeckIndex(index);
  };

  const backToMenu = () => {
    window.history.pushState({}, "", `${getBasePath()}/`);
    setDeckIndex(null);
  };

  if (deckIndex !== null) {
    return <Presentation deckIndex={deckIndex} onBack={backToMenu} />;
  }

  const pageCount = Math.ceil(decks.length / SLOTS_PER_PAGE);
  const start = page * SLOTS_PER_PAGE;
  const visibleDecks = decks.slice(start, start + SLOTS_PER_PAGE);

  return (
    <main className="deck-menu">
      <h1>LT React</h1>
      <p className="small">発表資料を選択してください</p>
      <div className="deck-list">
        {visibleDecks.map((deck, offset) => {
          const index = start + offset;
          return (
            <button
              className="deck-card"
              key={deck.title}
              onClick={() => openDeck(index)}
            >
              <span className="deck-number">{index + 1}</span>
              <strong>{deck.title}</strong>
              <span>{deck.description}</span>
            </button>
          );
        })}
      </div>
      <nav className="deck-pagination" aria-label="Deck pages">
        <button
          className="deck-page-button"
          onClick={() => setPage((value) => Math.max(0, value - 1))}
          disabled={page === 0}
        >
          ←
        </button>
        <span className="small">
          {page + 1} / {pageCount}
        </span>
        <button
          className="deck-page-button"
          onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))}
          disabled={page === pageCount - 1}
        >
          →
        </button>
      </nav>
      <p className="small">{start + 1}–{Math.min(start + SLOTS_PER_PAGE, decks.length)} / {decks.length}</p>
    </main>
  );
}
