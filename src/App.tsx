import { useEffect, useState } from "react";
import { Presentation } from "./Presentation";
import { decks } from "./slides";

const SLOTS_PER_PAGE = 4;

type Route = { deckIndex: number; remote: boolean } | null;

const getRoute = (): Route => {
  const path = window.location.pathname;
  const remoteMatch = path.match(/\/(\d+)\/(\d+)\/?$/);
  if (remoteMatch && Number(remoteMatch[1]) === 0) {
    const deckIndex = Number(remoteMatch[2]) - 1;
    return deckIndex >= 0 && deckIndex < decks.length && decks[deckIndex].slides.length > 0
      ? { deckIndex, remote: true }
      : null;
  }

  const match = path.match(/\/(\d+)\/?$/);
  if (!match) return null;
  const deckIndex = Number(match[1]) - 1;
  return deckIndex >= 0 && deckIndex < decks.length && decks[deckIndex].slides.length > 0
    ? { deckIndex, remote: false }
    : null;
};

const getBasePath = () => {
  const base = import.meta.env.BASE_URL;
  return base.endsWith("/") ? base.slice(0, -1) : base;
};

export default function App() {
  const [route, setRoute] = useState<Route>(getRoute);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const onPopState = () => setRoute(getRoute());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const openDeck = (index: number) => {
    if (decks[index].slides.length === 0) return;
    window.history.pushState({}, "", `${getBasePath()}/${index + 1}`);
    setRoute({ deckIndex: index, remote: false });
  };

  const backToMenu = () => {
    window.history.pushState({}, "", `${getBasePath()}/`);
    setRoute(null);
  };

  if (route !== null) {
    return <Presentation deckIndex={route.deckIndex} remote={route.remote} onBack={backToMenu} />;
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
          const isEmpty = deck.slides.length === 0;
          return (
            <button
              className="deck-card"
              key={`${index}-${deck.title}`}
              onClick={() => openDeck(index)}
              disabled={isEmpty}
              aria-label={isEmpty ? `Deck ${index + 1} empty` : deck.title}
            >
              <span className="deck-number">{index + 1}</span>
              <strong>{deck.title}</strong>
              <span>{deck.description}</span>
            </button>
          );
        })}
      </div>
      <nav className="deck-pagination" aria-label="Deck pages">
        <button className="deck-page-button" onClick={() => setPage((value) => Math.max(0, value - 1))} disabled={page === 0}>←</button>
        <span className="small">{page + 1} / {pageCount}</span>
        <button className="deck-page-button" onClick={() => setPage((value) => Math.min(pageCount - 1, value + 1))} disabled={page === pageCount - 1}>→</button>
      </nav>
      <p className="small">{start + 1}–{Math.min(start + SLOTS_PER_PAGE, decks.length)} / {decks.length}</p>
    </main>
  );
}
