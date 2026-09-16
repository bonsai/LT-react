import { useEffect, useState } from "react";

export type PeerConnection = { send: (data: string) => void; close: () => void; on: (event: string, handler: (...args: any[]) => void) => void };
export type PeerInstance = { id?: string; connect: (id: string) => PeerConnection; destroy: () => void; on: (event: string, handler: (...args: any[]) => void) => void };
export type PeerConstructor = new (id?: string) => PeerInstance;

declare global { interface Window { Peer?: PeerConstructor } }
const PEER_SCRIPT = "https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js";

export function loadPeer(): Promise<PeerConstructor> {
  if (window.Peer) return Promise.resolve(window.Peer);
  return new Promise((resolve, reject) => {
    const script = document.createElement("script"); script.src = PEER_SCRIPT;
    script.onload = () => window.Peer ? resolve(window.Peer) : reject(new Error("PeerJS unavailable"));
    script.onerror = () => reject(new Error("PeerJS failed to load")); document.head.appendChild(script);
  });
}

type PairingStep = "gesture" | "ready" | "connecting" | "connected" | "cancelled";
const GESTURE = ["→", "↓", "→", "↑", "←"];

export function RemoteController({ peerId }: { peerId: string }) {
  const [connection, setConnection] = useState<PeerConnection | null>(null);
  const [status, setStatus] = useState("ペアリング待ち");
  const [step, setStep] = useState<PairingStep>("gesture");
  const [gesture, setGesture] = useState<string[]>([]);

  useEffect(() => {
    if (!window.confirm("この端末をスライド操作用にペアリングしますか？")) {
      setStep("cancelled"); setStatus("ペアリングしていません");
    }
  }, []);

  useEffect(() => {
    if (step !== "connecting") return;
    let peer: PeerInstance | undefined; let cancelled = false;
    loadPeer().then((Peer) => {
      if (cancelled) return; peer = new Peer();
      peer.on("open", () => {
        const conn = peer!.connect(peerId);
        conn.on("open", () => { if (!cancelled) { setConnection(conn); setStep("connected"); setStatus("接続しました"); } });
        conn.on("error", () => !cancelled && setStatus("接続できません"));
      });
      peer.on("error", () => !cancelled && setStatus("接続できません"));
    }).catch(() => !cancelled && setStatus("PeerJSを読み込めません"));
    return () => { cancelled = true; peer?.destroy(); };
  }, [peerId, step]);

  const addGesture = (value: string) => {
    const next = [...gesture, value];
    setGesture(next);
    if (next.length === GESTURE.length) {
      if (next.every((item, i) => item === GESTURE[i])) {
        setStep("ready");
        setStatus("ペアリング準備完了");
      } else {
        setGesture([]);
        setStatus("違います。もう一度");
      }
    }
  };

  const connect = () => {
    setStep("connecting");
    setStatus("接続中…");
  };

  const send = (command: string) => connection?.send(command);

  if (step === "gesture" || step === "ready") return <main className="remote-controller"><div className="remote-card">
    <p className="small">LT React · Pairing</p><h1>ペアリング</h1><p>この順番を入力してください</p>
    <div style={{ fontSize: "2rem", letterSpacing: ".4rem", margin: "1.5rem 0" }}>{GESTURE.join(" ")}</div>
    <p className="remote-status">{gesture.join(" ") || "待機中"}</p>
    <div className="remote-grid">
      <button onClick={() => addGesture("←")}>←</button><button onClick={() => addGesture("→")}>→</button>
      <button onClick={() => addGesture("↑")}>↑</button><button onClick={() => addGesture("↓")}>↓</button>
    </div>
    {step === "ready" && <button className="remote-connect" onClick={connect}>接続する</button>}
  </div></main>;

  if (step === "cancelled") return <main className="remote-controller"><div className="remote-card"><h1>Remote</h1><p>{status}</p></div></main>;

  return <main className="remote-controller"><div className="remote-card">
    <p className="small">LT React · Remote</p><h1>スライド操作</h1><p className="remote-status">● {status}</p>
    <div className="remote-grid">
      <button onClick={() => send("prev")}>←<span>前へ</span></button><button onClick={() => send("next")}>→<span>次へ</span></button>
      <button onClick={() => send("home")}>⌂<span>最初</span></button><button onClick={() => send("end")}>◆<span>最後</span></button>
    </div>
  </div></main>;
}
