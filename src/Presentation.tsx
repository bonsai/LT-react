import { useEffect, useState } from "react";
import { Slide } from "./Slide";
import { decks } from "./slides";

type PresentationProps = {
  deckIndex: number;
  onBack: () => void;
};

type Direction = "forward" | "backward";

export function Presentation({ deckIndex, onBack }: PresentationProps) {
  const deck = decks[deckIndex];
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("forward");
  const [transitionKey, setTransitionKey] = useState(0);

  const goTo = (nextIndex: number, nextDirection: Direction) => {
    setIndex((current) => {
      if (nextIndex === current) return current;
      setDirection(nextDirection);
      setTransitionKey((key) => key + 1);
      return nextIndex;
    });
  };

  useEffect(() => {
    setIndex(0);
    setDirection("forward");
    setTransitionKey(0);
  }, [deckIndex]);

  const next = () => {
    goTo(Math.min(deck.slides.length - 1, index + 1), "forward");
  };

  const prev = () => {
    goTo(Math.max(0, index - 1), "backward");
  };

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
        goTo(0, "backward");
      } else if (event.key === "End") {
        goTo(deck.slides.length - 1, "forward");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deck, index, onBack]);

  const slide = deck.slides[index];
  const transitionClass = `slide-transition slide-transition-${direction}`;

  return (
    <main
      onClick={(event) => {
        if (event.target instanceof HTMLButtonElement) return;
        if (event.clientX < window.innerWidth / 2) prev();
        else next();
      }}
    >
      <div key={transitionKey} className={transitionClass}>
        <Slide
          title={slide.title}
          center={slide.center}
          number={index + 1}
          total={deck.slides.length}
        >
          {slide.body}
        </Slide>
      </div>

      <button className="deck-switch" onClick={onBack}>
        Decks
      </button>
      <div className="arrow">← → / Space / Home / End / Esc</div>
    </main>
  );
}
