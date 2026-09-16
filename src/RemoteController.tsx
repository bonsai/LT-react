import { useEffect, useState } from "react";

export type PeerConnection = { send: (data: string) => void; close: () => void; on: (event: string, handler: (...args: any[]) => void) => void };
export type PeerInstance = { id?: string; connect: (id: string) => PeerConnection; destroy: () => void; on: (event: string, handler: (...args: any[]) => void) => void };
export type PeerConstructor = new (id?: string) => PeerInstance;

declare global { interface Window { Peer?: PeerConstructor } }

const PEER_SCRIPT = "https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js";

export function loadPeer(): Promise<PeerConstructor> {
  if (window.Peer) return Promise.resolve(window.Peer);
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = PEER_SCRIPT;
    script.onload = () => window.Peer ? resolve(window.Peer) : reject(new Error("PeerJS unavailable"));
    script.onerror = () => reject(new Error("PeerJS failed to load"));
    document.head.appendChild(script);
  });
}

export function RemoteController({ peerId }: { peerId: string }) {
  const [connection, setConnection] = useState<PeerConnection | null>(null);
  const [status, setStatus] = useState("接続中…");

  useEffect(() => {
    let peer: PeerInstance | undefined;
    let cancelled = false;
    loadPeer().then((Peer) => {
      if (cancelled) return;
      peer = new Peer();
      peer.on("open", () => {
        const conn = peer!.connect(peerId);
        conn.on("open", () => {
          if (!cancelled) { setConnection(conn); setStatus("接続しました"); }
        });
        conn.on("error", () => !cancelled && setStatus("接続できません"));
      });
      peer.on("error", () => !cancelled && setStatus("接続できません"));
    }).catch(() => !cancelled && setStatus("PeerJSを読み込めません"));
    return () => { cancelled = true; peer?.destroy(); };
  }, [peerId]);

  const send = (command: string) => connection?.send(command);

  return (
    <main className="remote-controller">
      <div className="remote-card">
        <p className="small">LT React · Remote</p>
        <h1>スライド操作</h1>
        <p className="remote-status">● {status}</p>
        <div className="remote-grid">
          <button onClick={() => send("prev")}>←<span>前へ</span></button>
          <button onClick={() => send("next")}>→<span>次へ</span></button>
          <button onClick={() => send("home")}>⌂<span>最初</span></button>
          <button onClick={() => send("end")}>◆<span>最後</span></button>
        </div>
      </div>
    </main>
  );
}
