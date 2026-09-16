import { useEffect, useState } from "react";

type Slide = {
  title?: string;
  body: React.ReactNode;
  center?: boolean;
};

const slides: Slide[] = [
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
];

export default function App() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((value) => Math.min(slides.length - 1, value + 1));
  const prev = () => setIndex((value) => Math.max(0, value - 1));

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowRight", " ", "PageDown"].includes(event.key)) {
        event.preventDefault();
        next();
      } else if (["ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        prev();
      } else if (event.key === "Home") setIndex(0);
      else if (event.key === "End") setIndex(slides.length - 1);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  const slide = slides[index];

  return (
    <main onClick={(event) => event.clientX < window.innerWidth / 2 ? prev() : next()}>
      <section className={`slide ${slide.center ? "center" : ""}`}>
        {slide.title && <h1>{slide.title.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</h1>}
        {slide.title && index !== 0 && <h2>{slide.title}</h2>}
        {slide.body}
        <span className="num">{index + 1} / {slides.length}</span>
      </section>
      <div className="arrow">← → / Space / Home / End / Click</div>
    </main>
  );
}
