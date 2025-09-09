# 🦐 ShrimpSwap – An Intent-Centric DEX Playground

## What is ShrimpSwap?
ShrimpSwap is a lightweight, intent-centric decentralized exchange (DEX) built to showcase the power of Anoma’s intent architecture. Instead of traditional order books or AMMs, ShrimpSwap focuses on what the user wants (the “intent”) and lets the protocol find the optimal way to make it happen.

In simple terms:
- **You** tell ShrimpSwap, “I want to swap Token A for Token B, at this range, with privacy.”
- **ShrimpSwap** translates your intent into Anoma’s language.
- **The settlement layer + solver** finds the best path.
- **You** get your swap done without dealing with messy mechanics.

All you see is a fun, intuitive UI with shrimps carrying your swaps across the ocean.

## Why ShrimpSwap?
Most DEXes feel like math homework. ShrimpSwap feels like a game:
- **Shrimp Mascots** – friendly shrimps animate the swap process.
- **Fast, Simple UI** – minimal clicks, everything happens in one clean dashboard.
- **Intent-Centric** – no need to learn LPs, AMMs, slippage formulas; just express your intent.
- **Privacy-first** – thanks to Anoma’s architecture, user swaps can be shielded.

## Core Features
- **Express Intent Form** – Users input what they want (e.g., “Swap 10 XAN to USDC if rate ≥ X”).
- **Solver Simulation** – A playful “shrimp” character dives into liquidity pools to find the route.
- **Result Visualization** – UI shows possible execution paths in a fun, animated way.
- **Multi-Chain Preview** – Demo how intents could work across chains (mocked in frontend).
- **Educational Twist** – Each swap shows a “Did You Know?” fact about Anoma or intents.

## How it Works (Concept)
1. **Frontend (React + Vite + Tailwind)**
   - Clean dashboard with a swap form.
   - Shrimps animate depending on the action.
   - Mock data simulates intent → solver → settlement flow.
2. **Intent Simulation (Mocked Backend)**
   - Instead of real contracts, a JSON file simulates solver responses.
   - This keeps the demo simple, but still demonstrates intent resolution.
3. **Anoma Vibes**
   - Uses Anoma branding (colors, motifs).
   - Terminology is aligned with Anoma’s ecosystem (“intents,” “solvers,” etc.).

## User Experience (What it looks like)
- **Landing Page** – A big happy shrimp saying “What do you want to swap today?”
- **Swap Screen** – Two token dropdowns, amount input, intent preferences.
- **Processing Screen** – Shrimp animation “carrying” your swap to the pool.
- **Result Screen** – Confetti 🎉 with the text “Your intent is fulfilled!”

## Why It Matters
ShrimpSwap is not “just another DEX mockup.” It’s a teaching tool for the community:
- Shows how intents simplify UX.
- Makes the concept fun & memorable.
- Can be extended into real prototypes if integrated with Anoma testnets.

## Tech Stack
- **Frontend**: React + Vite + TailwindCSS
- **Animations**: Lottie / simple CSS animations for shrimps
- **Mock Solver**: JSON file simulating intent → solution mapping
- **Hosting**: Vercel / Netlify (demo link possible)

## Getting Started
```bash
npm install
npm run dev
# build for production
npm run build
# preview production build
npm run preview
```

## Closing Note
ShrimpSwap is built with love for Anoma’s shrimp community. It proves that serious infrastructure can still be fun, engaging, and community-driven.

Because let’s be real: if swapping tokens can feel like a shrimp rave party… why would anyone settle for boring swaps? 💃🦐
