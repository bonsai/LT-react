import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Slide } from "./Slide";
import { decks } from "./slides";
import { loadPeer, RemoteController, type PeerConnection, type PeerInstance } from "./RemoteController";

type PresentationProps = { deckIndex: number; onBack: () => void };
type Direction = "forward" | "backward";

const getBasePath = () => import.meta.env.BASE_URL.replace(/\/$/, "");

export function Presentation({ deckIndex, onBack }: PresentationProps) {
  const deck = decks[deckIndex];
  const remotePeerId = new URLSearchParams(window.location.search).get("remote");
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>("forward");
  const [transitionKey, setTransitionKey] = useState(0);
  const [remoteUrl, setRemoteUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [showQr, setShowQr] = useState(false);

  const goTo = (nextIndex: number, nextDirection: Direction) => {
    setIndex((current) => {
      if (nextIndex === current) return current;
      setDirection(nextDirection);
      setTransitionKey((key) => key + 1);
      return nextIndex;
    });
  };

  const next = () => goTo(Math.min(deck.slides.length - 1, index + 1), "forward");
  const prev = () => goTo(Math.max(0, index - 1), "backward");

  useEffect(() => {
    setIndex(0); setDirection("forward"); setTransitionKey(0);
  }, [deckIndex]);

  useEffect(() => {
    if (remotePeerId) return;
    let peer: PeerInstance | undefined;
    let cancelled = false;
    loadPeer().then((Peer) => {
      if (cancelled) return;
      peer = new Peer();
      peer.on("open", () => {
        const id = peer?.id;
        if (id) setRemoteUrl(`${window.location.origin}${getBasePath()}/${deckIndex + 1}?remote=${encodeURIComponent(id)}`);
      });
      peer.on("connection", (conn: PeerConnection) => {
        conn.on("data", (data: unknown) => {
          const command = String(data);
          if (command === "next") {
            setIndex((current) => { const nextIndex = Math.min(deck.slides.length - 1, current + 1); if (nextIndex !== current) { setDirection("forward"); setTransitionKey((key) => key + 1); } return nextIndex; });
          } else if (command === "prev") {
            setIndex((current) => { const nextIndex = Math.max(0, current - 1); if (nextIndex !== current) { setDirection("backward"); setTransitionKey((key) => key + 1); } return nextIndex; });
          } else if (command === "home") goTo(0, "backward");
          else if (command === "end") goTo(deck.slides.length - 1, "forward");
        });
      });
    }).catch(() => setRemoteUrl(""));
    return () => { cancelled = true; peer?.destroy(); };
  }, [deckIndex, remotePeerId, deck.slides.length]);

  useEffect(() => {
    if (!remoteUrl) {
      setQrDataUrl("");
      return;
    }
    QRCode.toDataURL(remoteUrl, { width: 280, margin: 2 }).then(setQrDataUrl).catch(() => setQrDataUrl(""));
  }, [remoteUrl]);

  useEffect(() => {
    if (remotePeerId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { onBack(); return; }
      if (["ArrowRight", " ", "PageDown"].includes(event.key)) { event.preventDefault(); next(); }
      else if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); prev(); }
      else if (event.key === "Home") goTo(0, "backward");
      else if (event.key === "End") goTo(deck.slides.length - 1, "forward");
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [deck, index, onBack, remotePeerId]);

  if (remotePeerId) return <RemoteController peerId={remotePeerId} />;

  const slide = deck.slides[index];
  const transitionClass = `slide-transition slide-transition-${direction}`;
  const rpgClass = deckIndex === 7 ? "rpg-ui" : "";

  return (
    <main className={rpgClass}
      onClick={(event) => {
        if (event.target instanceof HTMLButtonElement || event.target instanceof HTMLAnchorElement) return;
        if (event.clientX < window.innerWidth / 2) prev(); else next();
      }}
    >
      <div key={transitionKey} className={transitionClass}>
        <Slide title={slide.title} center={slide.center} number={index + 1} total={deck.slides.length}>{slide.body}</Slide>
      </div>
      {remoteUrl && deckIndex === 13 && (
        <>
          <div className="remote-info">
            <strong>📱 Remote</strong>
            <button
              onClick={() => setShowQr((visible) => !visible)}
              style={{ fontSize: "1rem", padding: "0.4rem 0.8rem", cursor: "pointer" }}
            >
              {showQr ? "QRを閉じる" : "📱 QR"}
            </button>
            <input readOnly value={remoteUrl} onFocus={(event) => event.currentTarget.select()} />
            <button onClick={() => navigator.clipboard?.writeText(remoteUrl)}>URLをコピー</button>
          </div>
          {showQr && qrDataUrl && (
            <div
              onClick={(event) => event.stopPropagation()}
              style={{ position: "fixed", right: "1rem", bottom: "4rem", zIndex: 20, background: "#fff", padding: "1rem", borderRadius: "0.75rem", boxShadow: "0 4px 24px rgba(0,0,0,.3)", textAlign: "center" }}
            >
              <img src={qrDataUrl} alt="スマホ操作用QRコード" width={280} height={280} />
              <div style={{ color: "#111", marginTop: "0.5rem", fontWeight: 600 }}>スマホで読み取って操作</div>
            </div>
          )}
        </>
      )}
      <a className="bonsai-link" href="https://github.com/bonsai/" target="_blank" rel="noreferrer" aria-label="bonsai GitHub"><span aria-hidden="true">◈</span> bonsai / GitHub</a>
      <button className="deck-switch" onClick={onBack}>Decks</button>
      <div className="arrow">← → / Space / Home / End / Esc</div>
    </main>
  );
}
