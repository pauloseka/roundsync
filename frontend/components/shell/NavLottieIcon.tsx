"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import type { DotLottie } from "@lottiefiles/dotlottie-web";
import { useCallback, useEffect, useState } from "react";

interface NavLottieIconProps {
  src: string;
  active?: boolean;
  label: string;
}

function showFirstFrame(instance: DotLottie) {
  instance.setFrame(0);
  instance.pause();
}

export function NavLottieIcon({ src, active = false, label }: NavLottieIconProps) {
  const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);

  const dotLottieRefCallback = useCallback((instance: DotLottie | null) => {
    setDotLottie(instance);
  }, []);

  useEffect(() => {
    if (!dotLottie) return;

    const handleReady = () => {
      showFirstFrame(dotLottie);
    };

    dotLottie.addEventListener("load", handleReady);
    dotLottie.addEventListener("ready", handleReady);

    if (dotLottie.isLoaded) {
      showFirstFrame(dotLottie);
    }

    return () => {
      dotLottie.removeEventListener("load", handleReady);
      dotLottie.removeEventListener("ready", handleReady);
    };
  }, [dotLottie, src]);

  useEffect(() => {
    if (!dotLottie || !active) return;
    dotLottie.setFrame(0);
    dotLottie.play();
  }, [active, dotLottie]);

  function handleEnter() {
    if (!dotLottie) return;
    dotLottie.setFrame(0);
    dotLottie.play();
  }

  function handleLeave() {
    if (!dotLottie) return;
    showFirstFrame(dotLottie);
  }

  return (
    <span
      className={`relative flex size-6 shrink-0 items-center justify-center overflow-visible transition-opacity ${
        active ? "opacity-100" : "opacity-70 group-hover:opacity-100"
      }`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      aria-hidden="true"
    >
      <DotLottieReact
        src={src}
        loop={false}
        autoplay={false}
        layout={{ fit: "contain", align: [0.5, 0.5] }}
        dotLottieRefCallback={dotLottieRefCallback}
        style={{ width: 24, height: 24, display: "block" }}
        aria-label={label}
      />
    </span>
  );
}
