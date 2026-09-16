import type { ReactNode } from "react";
import data from "./slides.json";

export type SlideData = {
  title: string;
  body: ReactNode;
  center?: boolean;
};

export type Deck = {
  title: string;
  description: string;
  slides: SlideData[];
};

type Block = {
  type: "p" | "ul" | "ol" | "code";
  text?: string;
  html?: string;
  className?: string;
  items?: string[];
};

type JsonSlide = {
  title: string;
  center?: boolean;
  body: Block[];
};

type JsonDeck = {
  title: string;
  description: string;
  slides: JsonSlide[];
};

const renderBlock = (block: Block): ReactNode => {
  if (block.type === "code") {
    return (
      <pre key={block.text}>
        <code>{block.text}</code>
      </pre>
    );
  }

  if (block.type === "ul" || block.type === "ol") {
    const List = block.type;
    return (
      <List key={block.items?.join("|")}>
        {block.items?.map((item) => <li key={item}>{item}</li>)}
      </List>
    );
  }

  return (
    <p key={block.text ?? block.html} className={block.className}>
      {block.html ? <span dangerouslySetInnerHTML={{ __html: block.html }} /> : block.text}
    </p>
  );
};

export const decks: Deck[] = (data.decks as JsonDeck[]).map((deck) => ({
  ...deck,
  slides: deck.slides.map((slide) => ({
    title: slide.title,
    center: slide.center,
    body: <>{slide.body.map(renderBlock)}</>,
  })),
}));
