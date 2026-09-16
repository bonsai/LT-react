import { useEffect, useState } from "react";
import { Presentation } from "./Presentation";
import { decks } from "./slides";

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

  return (
    <main className="deck-menu">
      <h1>LT React</h1>
      <p className="small">発表資料を選択してください</p>
      <div className="deck-list">
        {decks.map((deck, index) => (
          <button
            className="deck-card"
            key={deck.title}
            onClick={() => openDeck(index)}
          >
            <span className="deck-number">{index + 1}</span>
            <strong>{deck.title}</strong>
            <span>{deck.description}</span>
          </button>
        ))}
      </div>
      <p className="small">{decks.map((_, index) => index + 1).join(" / ")} で選択</p>
    </main>
  );
}
