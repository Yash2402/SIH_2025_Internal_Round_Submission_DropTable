import React from "react";

export function Quote() {
  return (
    <figure className="mx-auto flex max-w-3xl flex-col items-center px-4 py-12 text-center">
      <blockquote className="text-3xl leading-[1.1] font-medium tracking-tighter text-balance md:text-5xl md:text-wrap">
        <span>&quot;I was always hesitant to visit the campus counseling center. </span>
        <span className="text-muted-foreground/50">
          This platform gave me the confidence to understand my feelings privately and take that first step.&quot;
        </span>
      </blockquote>
      <figcaption className="mt-10">
        <span className="block font-semibold tracking-tight md:text-xl">Anonymous Student</span>
        <span className="text-muted-foreground mt-1 block text-xs tracking-tighter md:text-xl">
          From a partner institution
        </span>
      </figcaption>
    </figure>
  );
}
