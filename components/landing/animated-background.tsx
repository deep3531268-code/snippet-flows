"use client"

import * as React from "react"
import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion"

const AURORAS = [
  {
    className: "left-[-10%] top-[-20%] h-[520px] w-[720px] bg-primary/10",
    duration: 36,
    drift: 60,
  },
  {
    className: "right-[-15%] top-[10%] h-[460px] w-[640px] bg-sky-500/10",
    duration: 44,
    drift: -50,
  },
  {
    className:
      "bottom-[-30%] left-[25%] h-[520px] w-[700px] bg-violet-500/10",
    duration: 40,
    drift: 40,
  },
]

const ORBS = [
  {
    className: "left-[8%] top-[18%] h-56 w-56 bg-primary/15",
    duration: 30,
    travel: 36,
  },
  {
    className: "left-[58%] top-[10%] h-40 w-40 bg-sky-400/10",
    duration: 24,
    travel: 28,
  },
  {
    className: "left-[40%] bottom-[12%] h-64 w-64 bg-violet-400/10",
    duration: 34,
    travel: 32,
  },
  {
    className: "left-[78%] bottom-[28%] h-28 w-28 bg-emerald-400/10",
    duration: 26,
    travel: 24,
  },
]

const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

export function AnimatedBackground() {
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const parallaxX = useSpring(pointerX, { stiffness: 40, damping: 20 })
  const parallaxY = useSpring(pointerY, { stiffness: 40, damping: 20 })
  const orbsX = useSpring(pointerX, { stiffness: 30, damping: 18 })
  const orbsY = useSpring(pointerY, { stiffness: 30, damping: 18 })

  React.useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches
    if (!finePointer) return

    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5
      const y = event.clientY / window.innerHeight - 0.5
      pointerX.set(x)
      pointerY.set(y)
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })
    return () => window.removeEventListener("pointermove", onPointerMove)
  }, [pointerX, pointerY])

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-background" />

      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:52px_52px] opacity-[0.045]"
        style={{
          maskImage:
            "radial-gradient(ellipse 90% 70% at 50% 35%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 90% 70% at 50% 35%, black, transparent)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{ backgroundImage: NOISE }}
      />

      <motion.div
        className="absolute inset-0"
        style={{ x: parallaxX, y: parallaxY }}
      >
        {AURORAS.map((aurora, index) => (
          <div
            key={`aurora-${index}`}
            className={`absolute rounded-full blur-2xl ${aurora.className} animate-ambient-drift`}
            style={
              {
                "--drift-x": `${aurora.drift}px`,
                "--drift-y": `${aurora.drift * 0.6}px`,
                "--ambient-duration": `${aurora.duration}s`,
                willChange: "transform",
              } as React.CSSProperties
            }
          />
        ))}
      </motion.div>

      <motion.div
        className="absolute inset-0"
        style={{ x: orbsX, y: orbsY }}
      >
        {ORBS.map((orb, index) => (
          <div
            key={`orb-${index}`}
            className={`absolute rounded-full blur-xl ${orb.className} animate-ambient-drift`}
            style={
              {
                "--drift-y": `${orb.travel}px`,
                "--ambient-duration": `${orb.duration}s`,
                animationDelay: `${index * 0.8}s`,
                willChange: "transform",
              } as React.CSSProperties
            }
          />
        ))}
      </motion.div>
    </div>
  )
}
