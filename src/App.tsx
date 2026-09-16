import { useEffect, useState, type ReactNode } from "react";

type Slide = {
  title?: string;
  body: ReactNode;
  center?: boolean;
};

type Deck = {
  title: string;
  description: string;
  slides: Slide[];
};

const decks: Deck[] = [
  {
    title: "小規模でもReactの状態を使うべきとき",
    description: "React stateを3分で理解するLT",
    slides: [
      { title: "小規模でもReactの\n状態を使うべきとき", body: <p className="small">3分LT</p>, center: true },
      { title: "Reactの state って何？", body: <><p className="big">「画面を変化させるための記憶」</p><ul><li>値を覚えておく</li><li>値が変わると React が再描画する</li></ul></> },
      { title: "小さな例：いいねボタン", body: <><pre><code>{`const [liked, setLiked] = useState(false)\n\n<button onClick={() => setLiked(!liked)}>\n  {liked ? "♥ いいね済み" : "♡ いいね"}\n</button>`}</code></pre><p>たった1つのボタンでも、UIの状態が変わる。</p></> },
      { title: "「普通の変数」ではダメ？", body: <><pre><code>{`let liked = false\n\nliked = true`}</code></pre><p className="big">値は変わる。でも React はそれを知らない。</p><p>UIを更新する必要があるなら、state が候補。</p></> },
      { title: "判断基準は「アプリの大きさ」ではない", body: <><p className="big">値が変わる → UIも変えたい？</p><p className="big">　　　　　↓ YES</p><p className="big">　　　　 state の候補</p></> },
      { title: "小規模でも state が効く場面", body: <ul><li>開く / 閉じる</li><li>選択中の項目</li><li>入力値</li><li>ON / OFF</li><li>タブ</li><li>Loading</li></ul> },
      { title: "ただし state を増やしすぎない", body: <><p>計算できる値は、state にしなくていい。</p><pre><code>const visible = isOpen &amp;&amp; !disabled</code></pre><p className="big">「保存する必要がある値」だけを state にする。</p></> },
      { title: "state かどうかの3問", body: <><ol><li>ユーザー操作などで変わる？</li><li>その変化を UI に反映したい？</li><li>前の値を覚えておく必要がある？</li></ol><p className="big">YES が揃うほど state。</p></> },
      { title: "小さいほどシンプルに始める", body: <><p className="big">useState</p><p>↓ 必要になったら</p><p className="big">Context</p><p>↓ さらに必要なら</p><p className="big">External Store</p><p className="small">最初から Redux にする必要はない。</p></> },
      { title: "まとめ", body: <><p className="big">React の state は<br />「画面を変化させるための記憶」</p><p className="big">小規模かどうかではなく、<br />UIが時間とともに変化するかで考える。</p><p className="small">まず useState。必要になったら広げる。</p></>, center: true },
    ],
  },
  {
    title: "AI時代の小さな開発スタック",
    description: "React × GitHub × ChatGPT Web × AW",
    slides: [
      { title: "STACK", body: <><p className="big">React × GitHub × ChatGPT Web × AW</p><p>小さな開発をAI時代の開発ループとして捉える。</p></>, center: true },
      { title: "React = Develop", body: <><p className="big">Reactは開発基盤</p><pre><code>{`React\n ├─ UI\n ├─ State\n ├─ Component\n └─ Browser Runtime`}</code></pre></> },
      { title: "GitHub = Canon", body: <><p className="big">GitHubは正本</p><pre><code>{`GitHub\n ├─ Code\n ├─ README\n ├─ Issues\n ├─ Actions\n └─ History`}</code></pre></> },
      { title: "ChatGPT Web = Intelligence", body: <><p className="big">考える・調べる・整理する・設計する</p><pre><code>{`Human\n  ↓\nChatGPT Web\n  ↓\nGitHub Canon`}</code></pre></> },
      { title: "AW = Agent Workflow", body: <><p className="big">開発後のループも回す</p><pre><code>{`Issue\n ↓\nAW\n ↓\nDebug\n ↓\nFix\n ↓\nTest\n ↓\nDeploy`}</code></pre></> },
      { title: "DebugもAW", body: <><p>CI/CDの失敗をAWが読み、原因を特定し、修正して再実行する。</p><pre><code>{`GitHub Actions\n      ↓\n    Error\n      ↓\n      AW\n      ↓\n  Logs解析\n      ↓\n  原因特定\n      ↓\n     修正\n      ↓\n     Push\n      ↓\n      CI\n      ↓\n    Success`}</code></pre></> },
      { title: "CI/CD = GitHub Actions", body: <><pre><code>{`git push\n   ↓\nGitHub Actions\n   ↓\nnpm install\n   ↓\nnpm run build\n   ↓\nDeploy\n   ↓\nGitHub Pages`}</code></pre><p>ActionsはCIを実行する場所。AWは前後を制御する。</p></> },
      { title: "STACK全体", body: <pre><code>{`Human\n  │ Goal / Judgment\n  ↓\nChatGPT Web\n  │ Intelligence\n  ↓\nGitHub\n  │ Canon\n  ↓\nAW\n  │ Debug → Fix → Test → Deploy\n  ↓\nGitHub Actions\n  │ CI execution\n  ↓\nProduction`}</code></pre> },
      { title: "人間の役割", body: <><p className="big">Goalと最終判断</p><pre><code>{`Goal\n ↓\nChatGPT\n ↓\nGitHub Canon\n ↓\nAW\n ↓\nCI/CD\n ↓\nResult\n ↓\nHuman Judgment`}</code></pre></> },
      { title: "まとめ", body: <><p className="big">React = Make</p><p className="big">GitHub = Canon</p><p className="big">ChatGPT Web = Think</p><p className="big">AW = Debug / Fix / Verify / Deploy</p><p className="small">ChatGPTが考え、AWが回す。</p></>, center: true },
    ],
  },
];

export default function App() {
  const [deckIndex, setDeckIndex] = useState<number | null>(null);
  const [slideIndex, setSlideIndex] = useState(0);
  const deck = deckIndex === null ? null : decks[deckIndex];

  const openDeck = (index: number) => {
    setDeckIndex(index);
    setSlideIndex(0);
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (deckIndex === null) {
        if (event.key === "1" || event.key === "2") openDeck(Number(event.key) - 1);
        return;
      }
      if (event.key === "Escape") {
        setDeckIndex(null);
        return;
      }
      if (["ArrowRight", " ", "PageDown"].includes(event.key)) {
        event.preventDefault();
        setSlideIndex((value) => Math.min(deck.slides.length - 1, value + 1));
      } else if (["ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        setSlideIndex((value) => Math.max(0, value - 1));
      } else if (event.key === "Home") {
        setSlideIndex(0);
      } else if (event.key === "End") {
        setSlideIndex(deck.slides.length - 1);
      } else if (event.key === "1" || event.key === "2") {
        openDeck(Number(event.key) - 1);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [deckIndex, deck]);

  if (deckIndex === null) {
    return (
      <main className="deck-menu">
        <h1>LT React</h1>
        <p className="small">発表資料を選択してください</p>
        <div className="deck-list">
          {decks.map((item, index) => (
            <button className="deck-card" key={item.title} onClick={() => openDeck(index)}>
              <span className="deck-number">{index + 1}</span>
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </button>
          ))}
        </div>
        <p className="small">1 / 2 で選択</p>
      </main>
    );
  }

  const slide = deck.slides[slideIndex];

  return (
    <main onClick={(event) => {
      if (event.clientX < window.innerWidth / 2) {
        setSlideIndex((value) => Math.max(0, value - 1));
      } else {
        setSlideIndex((value) => Math.min(deck.slides.length - 1, value + 1));
      }
    }}>
      <section className={`slide ${slide.center ? "center" : ""}`}>
        <button className="deck-switch" onClick={(event) => { event.stopPropagation(); setDeckIndex(null); }}>Decks</button>
        {slide.title && <h1>{slide.title.split("\n").map((line, lineIndex) => <span key={`${line}-${lineIndex}`}>{line}<br /></span>)}</h1>}
        {slide.body}
        <span className="num">{slideIndex + 1} / {deck.slides.length}</span>
      </section>
      <div className="arrow">← → / Space / Home / End / Esc</div>
    </main>
  );
}
