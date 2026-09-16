import type { ReactNode } from "react";

type SlideProps = {
  title: string;
  children: ReactNode;
  center?: boolean;
  number: number;
  total: number;
};

export function Slide({
  title,
  children,
  center = false,
  number,
  total,
}: SlideProps) {
  return (
    <section className={`slide ${center ? "center" : ""}`}>
      <h1>{title.split("\n").map((line, index) => <span key={`${line}-${index}`}>{line}<br /></span>)}</h1>
      {children}
      <span className="num">{number} / {total}</span>
    </section>
  );
}
