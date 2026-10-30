# CLAUDE.md

## Project
Interactive HTML/CSS/JS presentation for a Network-on-Chip (NoC) Simulator, built for C-DAC.
Plain static files, no build step, opened directly in a browser. Entry point: `index.html` (hub:
Cover → Team → Table of Contents). The master clicker flow, in order:
recap → quarterly → hardware → software progress → testing → repo/CI-CD/docs → (live demo, not a page) → mesh & node architecture → timeline → thank-you.
- `recap-presentation/` (Recap: roadmap & CHI nodes, 6-port router, ports by router position, system architecture,
  flit lifecycle & router pipeline summary). Same iframe + `postMessage` slide bridge as `hardware-presentation/`;
  slides 1, 2 and 4 wrap pages of the archived hardware / software decks (roadmap and architecture show only their
  finished state, with no bottom text: a step with an empty `desc` hides the bottom band).
- `quarterly-presentation/` (Quarterly Progress Report, Aug–Oct 2026: a one-page dashboard slide in an iframe, same bridge as
  `hardware-presentation/`; its single step has no `desc`, which hides the bottom band)
- `hardware-presentation/` (Hardware Architecture & Router Design: node/device link handshake, link-layer
  interface, CHI handshake, CHI router architecture, credit mechanism, QoS arbitration, QoS aging, router pipeline flow, CHI flit channels). Each page embeds a standalone slide from
  `hardware-presentation/slides/` in an iframe; the slide forwards ArrowLeft/ArrowRight/Space to the deck
  via `postMessage` and the deck tells it which step to show (see `Slides` in the deck's `index.html`).
- `presentation/` (Software Development Progress: simulation coverage, architecture, API/Drogon, run flow,
  backend module status)
- `testing-presentation/` (Testing & Verification: testing plan, GoogleTest, tools & next steps)
- `repo-presentation/` (Repository, CI/CD & Documentation: branching model, CI/CD pipeline,
  documentation)
- `mesh-presentation/` (Internal Mesh & Node Architecture, working title: the deck has no name yet; shown after the demo that follows the repo deck):
  internal mesh status, the RN-F/SN-F/HN-F architecture flow documents, and the architecture document status table. Same iframe + `postMessage` slide bridge as
  `hardware-presentation/`. The title lives in `TITLE` in the hub block, the deck's `index.html`, and the other decks' landing cards.
- `pcie-presentation/` (PCIe & RN-I Bridge) — no current deck: only `archive/` remains, linked from the hub TOC
  (its exits return to the hub Table of Contents, since there is no deck landing page)
- `timeline-presentation/` (Project Timeline: the 2026 Gantt chart as a native HTML table; its single step has no `desc`, which hides the bottom band)
- `thank-you/` (closing page)

Each new deck is a single self-contained `index.html` (landing → pages → next deck, no idle step).
Placeholder decks have one blank page (`Content to be added`) so the arrow-key chain stays intact;
fill in their pages later by replacing the `blank` page and `*_STEPS` in the deck's `index.html`.

### Archives
Material presented in a previous review meeting lives in `<deck>/archive/` (previous recap in `recap-presentation/archive/`, previous quarterly
report, hardware, PCIe & RN-I, timeline, software progress, V&V in `testing-presentation/archive/`,
SDLC in `repo-presentation/archive/`). An archive is NOT part of the clicker flow: it is linked only
from its deck's landing page (a dashed "Last meeting" card) and from the hub TOC (a dashed pill),
and every exit (ArrowLeft/ArrowRight at either end, back links) returns to that deck's
`index.html` landing page — never onward into the next deck. Archived sub-pages (for example
`hardware-presentation/archive/router-3d-explorer.html`) keep their internal chaining.

## Hard requirement: fully keyboard/clicker-driven navigation
This is delivered as a live talk. The presenter must be able to go through the ENTIRE
presentation — hub cover/team/TOC, every deck's landing page, every step in every deck, and
every deck-to-deck transition — using only a presentation clicker (Right Arrow = next, Left
Arrow = previous). No part of the flow should ever require walking back to the laptop to click
a button or card with the mouse.

For any new page or flow added here:
- Give it a `keydown` listener for `ArrowRight`/`ArrowLeft` (see `setupKeyListeners()` in each
  deck's `app.js` (for the archived multi-file decks), and the inline listeners in each deck's
  `index.html`).
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
