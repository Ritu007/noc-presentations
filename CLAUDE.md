# CLAUDE.md

## Project
Interactive HTML/CSS/JS presentation for a Network-on-Chip (NoC) Simulator, built for C-DAC.
Plain static files, no build step, opened directly in a browser. Entry point: `index.html` (hub:
Cover → Team → Table of Contents). Five decks, each self-contained, chained in this order:
- `hardware-presentation/` (Hardware Architecture & Router Design, + `router-3d-explorer.html`)
- `presentation/` (Software Development Progress, + 3 sub-pages: `flit-lifecycle.html`,
  `router-pipeline.html`, `chi-channel-architecture.html`)
- `sdlc-presentation/` (Software Development Lifecycle)
- `verification-presentation/` (Verification & Validation)
- `pcie-presentation/` (PCIe & RN-I Bridge, + `rni-bridge-walkthrough.html`)

## Hard requirement: fully keyboard/clicker-driven navigation
This is delivered as a live talk. The presenter must be able to go through the ENTIRE
presentation — hub cover/team/TOC, every deck's landing page, every step in every deck, and
every deck-to-deck transition — using only a presentation clicker (Right Arrow = next, Left
Arrow = previous). No part of the flow should ever require walking back to the laptop to click
a button or card with the mouse.

For any new page or flow added here:
- Give it a `keydown` listener for `ArrowRight`/`ArrowLeft` (see `setupKeyListeners()` in each
  deck's `app.js`, and the inline listeners in `presentation/index.html`, `router-pipeline.html`,
  `chi-channel-architecture.html`, `pcie-presentation/rni-bridge-walkthrough.html`).
- Landing/title screens (`#landing-view`) are stops in the flow, not just a launch menu:
  ArrowRight must enter the first topic (same as the "Start Presentation →" button), ArrowLeft
  must return to the hub Table of Contents (`../index.html?end=1`, same as the "← Table of
  Contents" link).
- The end of one deck's flow must land on the next deck's landing page, not skip straight into
  its content — each `NEXT_DECK_URL` must never carry a `?page=`/`?topic=` param for a
  deck-to-deck transition (those params are reserved for direct deep-links from the hub TOC's
  subtopic pills).
- Mouse affordances (cards, buttons) are fine as shortcuts, but must never be the *only* way to
  reach a page.

When touching navigation in this project, walk the arrow-key path end-to-end before calling the
change done.
