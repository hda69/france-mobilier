"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import Image from "next/image";
import { IconArrow } from "@/components/icons";

const AUTOPLAY_MS = 4500;

export function ProductGallery({
  images,
  name,
  index,
  onIndexChange,
  autoplayIndexes,
}: {
  images: string[];
  name: string;
  index: number;
  onIndexChange: (index: number) => void;
  autoplayIndexes?: number[];
}) {
  const startX = useRef<number | null>(null);
  const thumbsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const [paused, setPaused] = useState(false);
  const current = images[index] ?? images[0];
  const hasMany = images.length > 1;
  const sequence = useMemo(
    () => (autoplayIndexes?.length ? autoplayIndexes : images.map((_, imageIndex) => imageIndex)),
    [autoplayIndexes, images],
  );

  const go = useCallback(
    (next: number) => {
      if (images.length === 0) return;
      onIndexChange((next + images.length) % images.length);
    },
    [images.length, onIndexChange],
  );

  useEffect(() => {
    thumbsRef.current[index]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [index]);

  useEffect(() => {
    if (!hasMany || paused || sequence.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      const position = sequence.indexOf(index);
      const next = sequence[(position >= 0 ? position + 1 : 0) % sequence.length];
      onIndexChange(next);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [hasMany, index, onIndexChange, paused, sequence]);

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    startX.current = event.clientX;
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (startX.current == null || !hasMany) return;
    const delta = event.clientX - startX.current;
    startX.current = null;
    if (delta > 40) go(index - 1);
    if (delta < -40) go(index + 1);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!hasMany) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(index - 1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(index + 1);
    }
  }

  if (!current) return null;

  return (
    <div>
      <div
        className="group relative aspect-square overflow-hidden rounded-[var(--radius)] bg-white"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onKeyDown={onKeyDown}
        tabIndex={hasMany ? 0 : undefined}
        role={hasMany ? "region" : undefined}
        aria-roledescription={hasMany ? "carrousel" : undefined}
        aria-label={hasMany ? `Photos de ${name}` : undefined}
      >
        <div
          className="flex h-full transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {images.map((src, imageIndex) => (
            <div key={`${src}-${imageIndex}`} className="relative aspect-square min-w-full shrink-0 basis-full overflow-hidden">
              <Image
                src={src}
                alt={`${name} — photo ${imageIndex + 1}`}
                fill
                className="object-cover select-none transition-transform duration-500 md:group-hover:scale-[1.06]"
                priority={imageIndex === 0}
                sizes="(max-width:768px) 100vw, 50vw"
                draggable={false}
              />
            </div>
          ))}
        </div>
        {hasMany ? (
          <>
            <button
              type="button"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow-sm"
              aria-label="Photo précédente"
              onClick={(event) => {
                event.stopPropagation();
                go(index - 1);
              }}
            >
              <IconArrow className="h-5 w-5 rotate-180" />
            </button>
            <button
              type="button"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-navy shadow-sm"
              aria-label="Photo suivante"
              onClick={(event) => {
                event.stopPropagation();
                go(index + 1);
              }}
            >
              <IconArrow className="h-5 w-5" />
            </button>
            <p className="absolute bottom-3 right-3 rounded-full bg-navy/80 px-2.5 py-1 text-xs text-white">
              {index + 1}/{images.length}
            </p>
          </>
        ) : null}
      </div>
      {hasMany ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, imageIndex) => {
            const selected = imageIndex === index;
            return (
              <button
                key={`${src}-${imageIndex}`}
                ref={(node) => {
                  thumbsRef.current[imageIndex] = node;
                }}
                type="button"
                onClick={() => onIndexChange(imageIndex)}
                aria-label={`Voir la photo ${imageIndex + 1}`}
                aria-current={selected ? "true" : undefined}
                className={`relative aspect-square w-16 shrink-0 overflow-hidden rounded-md bg-white sm:w-[4.5rem] ${
                  selected ? "ring-2 ring-navy" : "ring-1 ring-border"
                }`}
              >
                <Image src={src} alt="" fill className="object-cover" sizes="72px" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
