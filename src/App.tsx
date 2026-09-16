import { useState } from "react";
import { Presentation } from "./Presentation";
import { decks } from "./slides";

export default function App() {
  const [deckIndex, setDeckIndex] = useState<number | null>(null);

  if (deckIndex !== null) {
    return (
      <Presentation
        deckIndex={deckIndex}
        onBack={() => setDeckIndex(null)}
      />
    );
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
            onClick={() => setDeckIndex(index)}
          >
            <span className="deck-number">{index + 1}</span>
            <strong>{deck.title}</strong>
            <span>{deck.description}</span>
          </button>
        ))}
      </div>
      <p className="small">1 / 2 で選択</p>
    </main>
  );
}
