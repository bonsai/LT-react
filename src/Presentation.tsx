import { useEffect, useState } from "react";
import { Slide } from "./Slide";
import { decks } from "./slides";

type PresentationProps = {
  deckIndex: number;
  onBack: () => void;
};

export function Presentation({ deckIndex, onBack }: PresentationProps) {
  const deck = decks[deckIndex];
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((value) => Math.min(deck.slides.length - 1, value + 1));
  };

  const prev = () => {
    setIndex((value) => Math.max(0, value - 1));
  };

  useEffect(() => {
    setIndex(0);
  }, [deckIndex]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onBack();
        return;
      }
      if (["ArrowRight", " ", "PageDown"].includes(event.key)) {
        event.preventDefault();
        next();
      } else if (["ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        prev();
      } else if (event.key === "Home") {
        setIndex(0);
      } else if (event.key === "End") {
        setIndex(deck.slides.length - 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deck, onBack]);

  const slide = deck.slides[index];

  return (
    <main
      onClick={(event) => {
        if (event.target instanceof HTMLButtonElement) return;
        if (event.clientX < window.innerWidth / 2) prev();
        else next();
      }}
    >
      <Slide
        title={slide.title}
        center={slide.center}
        number={index + 1}
        total={deck.slides.length}
      >
        {slide.body}
      </Slide>

      <button
        className="deck-switch"
        onClick={onBack}
      >
        Decks
      </button>
      <div className="arrow">← → / Space / Home / End / Esc</div>
    </main>
  );
}
