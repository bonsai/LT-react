import { useEffect, useState, type ReactNode } from "react";
import data from "./decks/01-03-slides.json";
import browserData from "./decks/04-browser.json";
import githubPluginData from "./decks/05-github-plugin.json";
import mastraReactRemotionData from "./decks/06-mastra-react-remotion.json";
import promptImagegenFps4Data from "./decks/07-prompt-imagegen-fps4.json";
import emptyData from "./decks/08-empty.json";
import githubBonsaiSummaryData from "./decks/09-github-bonsai-summary.json";
import connpassVonsaiSummaryData from "./decks/10-connpass-vonsai-summary.json";
import empty11to12Data from "./decks/11-12-empty.json";
import empty13Data from "./decks/13-empty.json";
import empty14Data from "./decks/14-empty.json";
import empty15Data from "./decks/15-empty.json";
import empty16Data from "./decks/16-empty.json";

export type SlideData = { title: string; body: ReactNode; center?: boolean };
export type Deck = { title: string; description: string; slides: SlideData[] };
type Block = { type: "p" | "ul" | "ol" | "code" | "aa"; text?: string; html?: string; className?: string; items?: string[]; frames?: string[]; interval?: number };
type JsonSlide = { title: string; center?: boolean; body: Block[] };
type JsonDeck = { title: string; description: string; slides: JsonSlide[] };
type DeckData = { decks: JsonDeck[] };

function AAAnimation({ frames, interval = 180 }: { frames: string[]; interval?: number }) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (frames.length < 2) return;
    const timer = window.setInterval(() => setFrame((value) => (value + 1) % frames.length), interval);
    return () => window.clearInterval(timer);
  }, [frames, interval]);
  return <pre aria-label="Animated ASCII art" style={{ margin: "1rem auto", minHeight: "8rem", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}><code>{frames[frame]}</code></pre>;
}

const renderBlock = (block: Block): ReactNode => {
  if (block.type === "code") return <pre key={block.text}><code>{block.text}</code></pre>;
  if (block.type === "aa") return <AAAnimation key={block.frames?.join("\n")} frames={block.frames ?? [""]} interval={block.interval} />;
  if (block.type === "ul" || block.type === "ol") { const List = block.type; return <List key={block.items?.join("|")}>{block.items?.map((item) => <li key={item}>{item}</li>)}</List>; }
  return <p key={block.text ?? block.html} className={block.className}>{block.html ? <span dangerouslySetInnerHTML={{ __html: block.html }} /> : block.text}</p>;
};

const allDeckData = [
  ...(data as DeckData).decks,
  ...(browserData as DeckData).decks,
  ...(githubPluginData as DeckData).decks,
  ...(mastraReactRemotionData as DeckData).decks,
  ...(promptImagegenFps4Data as DeckData).decks,
  ...(emptyData as DeckData).decks,
  ...(githubBonsaiSummaryData as DeckData).decks,
  ...(connpassVonsaiSummaryData as DeckData).decks,
  ...(empty11to12Data as DeckData).decks,
  ...(empty13Data as DeckData).decks,
  ...(empty14Data as DeckData).decks,
  ...(empty15Data as DeckData).decks,
  ...(empty16Data as DeckData).decks,
];

export const decks: Deck[] = allDeckData.map((deck) => ({ ...deck, slides: deck.slides.map((slide) => ({ title: slide.title, center: slide.center, body: <>{slide.body.map(renderBlock)}</> })) }));
