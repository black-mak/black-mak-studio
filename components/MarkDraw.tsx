"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { sound } from "@/lib/sound";
import { MARK_D, MARK_VIEWBOX } from "./HeroMark";

// ============================================================================
// MarkDraw — Master Architectural Construction Proof
// Slowly demonstrates the geometric stages of constructing the BLACK-MAK mark:
// 1. Stage 1 (0.0s–1.0s): Blueprint grid, 45° bisectors & compass calibration
// 2. Stage 2 (1.0s–4.5s): Slow vector contour drafting with traveling laser spark
//    and pulsating coordinate nodes at key apex & facet vertices (~3.5s draw)
// 3. Stage 3 (4.5s–5.5s): Solid ink flood transition into razor-sharp mark
// 4. Stage 4 (5.5s+): Golden specular sheen sweep + 3D tilt + Replay capability
// ============================================================================

type Stage = "blueprint" | "draw" | "fill" | "done";

const KEY_NODES = [
  { x: 77.5, y: 0, label: "APEX 00°" },
  { x: 8, y: 18.5, label: "CUT 45°L" },
  { x: 145, y: 18.5, label: "CUT 45°R" },
  { x: 57.5, y: 68, label: "CORE L" },
  { x: 95.5, y: 68, label: "CORE R" },
  { x: 0, y: 149.5, label: "AXIS L" },
  { x: 154, y: 146.5, label: "AXIS R" },
  { x: 77.5, y: 164.5, label: "BASE" },
];

export default function MarkDraw() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [stage, setStage] = useState<Stage>("blueprint");
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glintActive, setGlintActive] = useState(false);
  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  const clearAllTimers = () => {
    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];
  };

  const runSequence = useCallback(() => {
    clearAllTimers();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setStage("done");
      return;
    }

    const path = pathRef.current;
    if (path) {
      const len = path.getTotalLength();
      path.style.transition = "none";
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
    }

    setStage("blueprint");
    setGlintActive(false);

    // Stage 1 -> Stage 2 (Drafting): 1.0s
    const t1 = setTimeout(() => {
      setStage("draw");
      if (pathRef.current) {
        const len = pathRef.current.getTotalLength();
        pathRef.current.style.strokeDasharray = `${len}`;
        pathRef.current.style.strokeDashoffset = `${len}`;
        // Slow architectural drafting over 3.4 seconds
        pathRef.current.style.transition =
          "stroke-dashoffset 3.4s cubic-bezier(0.25, 0.1, 0.25, 1)";
        requestAnimationFrame(() => {
          if (pathRef.current) {
            pathRef.current.style.strokeDashoffset = "0";
          }
        });
      }
    }, 1000);

    // Stage 2 -> Stage 3 (Ink flood): 4.5s
    const t2 = setTimeout(() => {
      setStage("fill");
    }, 4500);

    // Stage 3 -> Stage 4 (Done + Glint): 5.5s
    const t3 = setTimeout(() => {
      setStage("done");
      setGlintActive(true);
    }, 5500);

    timerRefs.current = [t1, t2, t3];
  }, []);

  useEffect(() => {
    runSequence();

    // Periodic magical glint sweep every 8 seconds in done stage
    const interval = setInterval(() => {
      setStage((curr) => {
        if (curr === "done") {
          setGlintActive(true);
          setTimeout(() => setGlintActive(false), 1200);
        }
        return curr;
      });
    }, 8000);

    return () => {
      clearAllTimers();
      clearInterval(interval);
    };
  }, [runSequence]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({
      x: -(y / rect.height) * 10,
      y: (x / rect.width) * 10,
    });
  };

  const handleMouseEnter = () => {
    sound.click("soft");
    if (stage === "done") {
      setGlintActive(true);
    }
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex h-full w-full items-center justify-center select-none"
      style={{ perspective: 900 }}
    >
      {/* 3D Tilted Container */}
      <div
        className="relative h-full w-full flex items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        }}
      >
        {/* Cardinal Technical Markings */}
        <span className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 font-mono text-[0.56rem] tracking-widest text-faint opacity-60">
          + 00° N
        </span>
        <span className="pointer-events-none absolute top-1/2 -right-3 -translate-y-1/2 font-mono text-[0.56rem] tracking-widest text-faint opacity-60">
          + 90° E
        </span>
        <span className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 font-mono text-[0.56rem] tracking-widest text-seal opacity-80">
          45.0° CUT
        </span>
        <span className="pointer-events-none absolute top-1/2 -left-3 -translate-y-1/2 font-mono text-[0.56rem] tracking-widest text-faint opacity-60">
          + 270° W
        </span>

        {/* Construction Stage Indicator Tag (Top Left) */}
        <div className="pointer-events-none absolute top-1.5 left-2 flex items-center gap-1.5 font-mono text-[0.52rem] uppercase tracking-wider text-muted z-20">
          <span
            className={`inline-block h-1.5 w-1.5 rounded-full transition-colors duration-300 ${
              stage === "done"
                ? "bg-seal"
                : "bg-white animate-ping"
            }`}
          />
          <span className="text-ink/80 font-medium">
            {stage === "blueprint" && "STAGE 01 · BLUEPRINT GRID"}
            {stage === "draw" && "STAGE 02 · VECTOR DRAFT"}
            {stage === "fill" && "STAGE 03 · INK SOLIDIFICATION"}
            {stage === "done" && "CALIBRATED · 45° IDENTITY"}
          </span>
        </div>

        {/* Replay Construction Trigger (Bottom Right) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            sound.click("soft");
            runSequence();
          }}
          className="absolute bottom-1.5 right-2 z-20 flex items-center gap-1 font-mono text-[0.52rem] uppercase tracking-wider text-muted hover:text-ink transition-colors border border-line/50 hover:border-seal/60 px-2 py-0.5 rounded bg-surface/80 backdrop-blur-sm"
          title="Replay Construction Stages"
        >
          <span className="text-seal">↻</span>
          <span>REPLAY</span>
        </button>

        {/* The Monogram SVG Canvas with Blueprint & Dynamic Geometry */}
        <div className="relative h-[82%] w-[82%] flex items-center justify-center">
          <svg
            viewBox={MARK_VIEWBOX}
            shapeRendering="geometricPrecision"
            aria-hidden="true"
            className="h-full w-full overflow-visible drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
          >
            <defs>
              {/* Golden Specular Sheen Gradient */}
              <linearGradient id="markGlint" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#ffffff" />
                <stop offset="50%" stopColor="#e8c76b" />
                <stop offset="65%" stopColor="#c9a227" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>

              {/* Sweeping Sheen Mask */}
              <mask id="glintMask">
                <rect width="100%" height="100%" fill="black" />
                <motion.rect
                  width="50"
                  height="260"
                  fill="white"
                  initial={{ x: -100, y: -50 }}
                  animate={
                    glintActive
                      ? { x: 250, y: 150 }
                      : { x: -100, y: -50 }
                  }
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transform: "rotate(35deg)" }}
                />
              </mask>
            </defs>

            {/* ========================================================= */}
            {/* STAGE 1: Architectural Blueprint Construction Guides      */}
            {/* ========================================================= */}
            <g
              className="transition-opacity duration-700 pointer-events-none"
              style={{ opacity: stage === "done" ? 0.18 : 0.65 }}
            >
              {/* Center Axis & Bisectors */}
              <line
                x1="77.5"
                y1="-10"
                x2="77.5"
                y2="175"
                stroke="#c9a227"
                strokeWidth="0.6"
                strokeDasharray="3 3"
                opacity="0.6"
              />
              <line
                x1="-10"
                y1="82.5"
                x2="165"
                y2="82.5"
                stroke="#c9a227"
                strokeWidth="0.6"
                strokeDasharray="3 3"
                opacity="0.6"
              />

              {/* 45° Diagonal Construction Rays */}
              <line
                x1="-5"
                y1="-5"
                x2="160"
                y2="160"
                stroke="#ffffff"
                strokeWidth="0.5"
                strokeDasharray="4 4"
                opacity="0.3"
              />
              <line
                x1="160"
                y1="-5"
                x2="-5"
                y2="160"
                stroke="#ffffff"
                strokeWidth="0.5"
                strokeDasharray="4 4"
                opacity="0.3"
              />
              <line
                x1="77.5"
                y1="0"
                x2="0"
                y2="77.5"
                stroke="#e8c76b"
                strokeWidth="0.5"
                opacity="0.35"
              />
              <line
                x1="77.5"
                y1="0"
                x2="155"
                y2="77.5"
                stroke="#e8c76b"
                strokeWidth="0.5"
                opacity="0.35"
              />

              {/* Center Compass Calibration Rings */}
              <circle
                cx="77.5"
                cy="82.5"
                r="65"
                fill="none"
                stroke="#ffffff"
                strokeWidth="0.5"
                strokeDasharray="2 4"
                opacity="0.25"
              />
              <circle
                cx="77.5"
                cy="82.5"
                r="45"
                fill="none"
                stroke="#c9a227"
                strokeWidth="0.5"
                strokeDasharray="1 3"
                opacity="0.3"
              />
            </g>

            {/* ========================================================= */}
            {/* STAGE 2: Geometric Node Calibration Markers               */}
            {/* ========================================================= */}
            <AnimatePresence>
              {(stage === "draw" || stage === "blueprint") && (
                <g className="pointer-events-none">
                  {KEY_NODES.map((node, i) => (
                    <g key={i}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={2.2}
                        fill="#c9a227"
                        className="animate-pulse"
                      />
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={5}
                        fill="none"
                        stroke="#e8c76b"
                        strokeWidth="0.5"
                        opacity="0.5"
                      />
                    </g>
                  ))}
                </g>
              )}
            </AnimatePresence>

            {/* ========================================================= */}
            {/* BASE VECTOR MONOGRAM PATH: Drawn Slowly with Precision    */}
            {/* ========================================================= */}
            <path
              ref={pathRef}
              fillRule="evenodd"
              clipRule="evenodd"
              d={MARK_D}
              fill={stage === "done" ? "currentColor" : "#ffffff"}
              stroke={stage === "done" ? "none" : "#e8c76b"}
              strokeWidth={stage === "done" ? 0 : 1.3}
              strokeLinejoin="miter"
              strokeMiterlimit={10}
              className="text-ink transition-colors duration-500"
              style={{
                fillOpacity:
                  stage === "blueprint" || stage === "draw"
                    ? 0
                    : stage === "fill"
                    ? 0.45
                    : 1,
                transition: "fill-opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            />

            {/* Traveling Drafting Laser Spark during Stage 2 */}
            <AnimatePresence>
              {stage === "draw" && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="pointer-events-none"
                >
                  <circle
                    cx="77.5"
                    cy="0"
                    r="3"
                    fill="#ffffff"
                    className="drop-shadow-[0_0_8px_#ffffff]"
                  />
                  <circle
                    cx="77.5"
                    cy="0"
                    r="8"
                    fill="none"
                    stroke="#e8c76b"
                    strokeWidth="0.8"
                    className="animate-ping"
                  />
                </motion.g>
              )}
            </AnimatePresence>

            {/* ========================================================= */}
            {/* STAGE 4: Golden Specular Sheen Layer                      */}
            {/* ========================================================= */}
            {stage === "done" && (
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d={MARK_D}
                fill="url(#markGlint)"
                mask="url(#glintMask)"
                className="pointer-events-none opacity-90"
              />
            )}
          </svg>

          {/* Ambient Subtle Golden Under-Glow on hover / done */}
          <div
            className={`pointer-events-none absolute inset-0 -z-10 rounded-full bg-seal/20 blur-2xl transition-opacity duration-700 ${
              glintActive ? "opacity-60" : "opacity-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
}