/* ================================================================
   RECAP PRESENTATION ENGINE — 6 PAGES, NO LANDING VIEW
   Sits between the hub TOC and the Quarterly Progress section, recapping
   the simulator landscape survey and the design decisions that followed
   from it, before handing off into the Hardware Architecture deck. Being
   a short recap, it opens straight on slide 1 — no landing/title screen.
   Engine mirrors sdlc-presentation/app.js (topicOrder/setTopic), plus a
   small custom table-panel sync for the two dense pages (Accuracy Models,
   Programming Languages) that each split their content across two tables
   instead of using the dim-in-place vv-focusable pattern.
================================================================ */

const STEPS = [
  {
    num: 1,
    name: "Existing NoC Simulators",
    badge: "Landscape Survey",
    badgeClass: "c-green",
    viewId: "view-0",
    noLegend: true,
    desc: "A survey of the established NoC simulation tools — Noxim, BookSim, Garnet (gem5), Nirgam, and Tejas — and where each one focuses its detail.",
    topicOrder: [null],
    details: ``
  },
  {
    num: 2,
    name: "Comparison of NoC Simulators",
    badge: "Landscape Survey",
    badgeClass: "c-green",
    viewId: "view-1",
    noLegend: true,
    desc: "Noxim, BookSim / BookSim 2.0, and Garnet (gem5) compared feature-by-feature — language, simulation type, topology and routing support, workload realism, power/area modeling, and scalability.",
    topicOrder: [null],
    details: ``
  },
  {
    num: 3,
    name: "Simulator Accuracy Models",
    badge: "Design Decision",
    badgeClass: "c-green",
    viewId: "view-2",
    noLegend: true,
    desc: "Functional-Accurate, Cycle-Approximate, and Cycle-Accurate models traded off across definition, timing representation, buffering, and contention handling.",
    topics: {
      def: "Functional-Accurate, Cycle-Approximate, and Cycle-Accurate models traded off across definition, timing representation, buffering, and contention handling.",
      perf: "Simulation speed, development effort, accuracy vs. RTL, and best-fit use cases compared across the three models."
    },
    topicOrder: ["def", "perf"],
    details: `
      <div class="det-sec">
        <div class="det-lbl">Focus a Table</div>
        <div class="opt-btn-group" style="flex-direction:column; gap:6px;">
          <button class="opt-btn" id="btn-topic-def" onclick="App.setTopic('def')">Definition &amp; Modeling</button>
          <button class="opt-btn" id="btn-topic-perf" onclick="App.setTopic('perf')">Speed, Effort &amp; Use Cases</button>
        </div>
      </div>
    `
  },
  {
    num: 4,
    name: "Programming Languages for Development of Simulator",
    badge: "Design Decision",
    badgeClass: "c-green",
    viewId: "view-3",
    noLegend: true,
    desc: "Custom C++ Framework vs. SystemC compared on performance, concurrency, timing accuracy, and complexity.",
    topics: {
      core: "Custom C++ Framework vs. SystemC compared on performance, concurrency, timing accuracy, and complexity.",
      adv: "Based on the requirements, <strong>C++ is identified</strong> for this project — scalability, interoperability, and deadlock-debugging tradeoffs, plus the recommendation for when each approach fits."
    },
    topicOrder: ["core", "adv"],
    details: `
      <div class="det-sec">
        <div class="det-lbl">Focus a Table</div>
        <div class="opt-btn-group" style="flex-direction:column; gap:6px;">
          <button class="opt-btn" id="btn-topic-core" onclick="App.setTopic('core')">Core Comparison</button>
          <button class="opt-btn" id="btn-topic-adv" onclick="App.setTopic('adv')">Scalability &amp; Recommendation</button>
        </div>
      </div>
    `
  },
  {
    num: 5,
    name: "Hierarchical View of the Proposed Simulator System",
    badge: "Proposed System",
    badgeClass: "c-green",
    viewId: "view-4",
    noLegend: true,
    desc: "The System is decomposed into a top-down hierarchy — Interconnect (NoC), IO, Memory, and Processor — with the Interconnect further broken into Router, Protocol, and Devices layers.",
    topicOrder: [null],
    details: ``
  },
  {
    num: 6,
    name: "Modules of the Proposed Simulator System",
    badge: "Proposed System",
    badgeClass: "c-green",
    viewId: "view-5",
    noLegend: true,
    desc: "The six modules of the proposed simulator — Simulation Kernel, Protocol Layer, Network Fabric, Devices &amp; Endpoints, Config &amp; Experimentation, and Performance Analysis.",
    topicOrder: [null],
    details: ``
  }
];

/* Neighbors in the master presentation sequence — this deck sits between the
   hub TOC and the hub's Quarterly Progress section (not another deck page). */
const PREV_DECK_URL = "../index.html?end=1";
const NEXT_DECK_URL = "../index.html?show=progress";

/* Application State */
const App = {
  curStep: 0,
  isPlaying: false,
  playTimer: null,
  topicByStep: {},

  init() {
    this.renderPips();
    this.renderNavTopics();
    this.updateView();
    this.setupKeyListeners();
  },

  renderNavTopics() {
    STEPS.forEach((step, idx) => {
      if (!step.details) return;
      const navBtn = document.getElementById(`nav-${idx}`);
      if (!navBtn) return;
      const topicsEl = document.createElement("div");
      topicsEl.className = "nav-topics";
      topicsEl.id = `nav-topics-${idx}`;
      topicsEl.innerHTML = step.details;
      navBtn.insertAdjacentElement("afterend", topicsEl);
    });
  },

  renderPips() {
    const container = document.getElementById("prog-pips");
    if (!container) return;
    container.innerHTML = "";
    STEPS.forEach((step, idx) => {
      const pip = document.createElement("div");
      pip.className = "pip" + (idx === 0 ? " cur" : "");
      pip.id = `pip-${idx}`;
      pip.onclick = () => this.goToPage(idx);
      container.appendChild(pip);
    });
  },

  updateView() {
    const step = STEPS[this.curStep];

    document.getElementById("prog-num").innerText = step.num;
    document.getElementById("prog-total").innerText = STEPS.length;
    document.getElementById("prog-name").innerText = step.name;

    STEPS.forEach((_, idx) => {
      const pip = document.getElementById(`pip-${idx}`);
      if (pip) pip.className = "pip" + (idx < this.curStep ? " done" : idx === this.curStep ? " cur" : "");

      const navBtn = document.getElementById(`nav-${idx}`);
      if (navBtn) navBtn.className = "nav-item" + (idx < this.curStep ? " done" : idx === this.curStep ? " active" : "");
    });

    document.querySelectorAll(".canvas-view").forEach(v => v.classList.remove("active"));
    const activeView = document.getElementById(step.viewId);
    if (activeView) activeView.classList.add("active");

    this._syncTablePanels();

    const legend = document.getElementById("status-legend");
    if (legend) legend.style.display = step.noLegend ? "none" : "flex";

    const bandBody = document.getElementById("band-body");
    if (bandBody) {
      bandBody.classList.add("fading");
      setTimeout(() => {
        const topic = this.topicByStep[this.curStep];
        const currentDesc = (topic && step.topics) ? step.topics[topic] : step.desc;
        bandBody.innerHTML = `<div class="band-desc" id="dynamic-band-desc">${currentDesc}</div>`;

        const canvasHeader = document.getElementById("canvas-header");
        if (canvasHeader) {
          canvasHeader.innerHTML = `
            <div class="band-badge ${step.badgeClass}">${step.badge}</div>
            <div class="band-title">${step.name}</div>
          `;
        }
        bandBody.classList.remove("fading");
      }, 150);
    }

    this._syncTopicButtons();

    document.getElementById("btn-prev").disabled = false;
    document.getElementById("btn-next").disabled = false;
    document.getElementById("btn-next").innerText = (this.curStep === STEPS.length - 1) ? "Next Deck ➔" : "Next ➔";
  },

  setTopic(key) {
    this.topicByStep[this.curStep] = key;
    this._syncTablePanels();

    const step = STEPS[this.curStep];
    const topic = this.topicByStep[this.curStep];
    const descEl = document.getElementById("dynamic-band-desc");
    if (descEl) descEl.innerHTML = (topic && step.topics) ? step.topics[topic] : step.desc;

    this._syncTopicButtons();
  },

  /* Pages 2 and 3 (index 2, 3) split their content into two ".table-panel"
     divs per view, each tagged data-topic="def"/"perf" or "core"/"adv". Show
     only the panel matching that step's current topic — every step is
     synced (not just the current one) so a page never renders showing the
     wrong table before its first visit. */
  _syncTablePanels() {
    STEPS.forEach((step, idx) => {
      const view = document.getElementById(step.viewId);
      if (!view) return;
      const panels = view.querySelectorAll(".table-panel[data-topic]");
      if (!panels.length) return;
      const cur = this.topicByStep[idx] ?? step.topicOrder[0];
      panels.forEach(p => { p.style.display = (p.dataset.topic === cur) ? "" : "none"; });
    });
  },

  _syncTopicButtons() {
    const topic = this.topicByStep[this.curStep];
    const container = document.getElementById(`nav-topics-${this.curStep}`);
    if (!container) return;
    container.querySelectorAll(".opt-btn[id^='btn-topic-']").forEach(btn => {
      const key = btn.id.replace("btn-topic-", "");
      btn.classList.toggle("active", key === topic);
    });
  },

  _landOnStep(stepIdx, pos) {
    if (stepIdx < 0 || stepIdx >= STEPS.length) return;
    const order = STEPS[stepIdx].topicOrder;
    let val;
    if (pos === "last") val = order[order.length - 1];
    else if (pos === "first" || pos === undefined) val = order[0];
    else val = order[Math.max(0, Math.min(pos, order.length - 1))];

    this.curStep = stepIdx;
    this.topicByStep[stepIdx] = val;
    this.updateView();
  },

  goToPage(idx) {
    this._landOnStep(idx, "first");
  },

  next() {
    const order = STEPS[this.curStep].topicOrder;
    const idx = order.indexOf(this.topicByStep[this.curStep] ?? order[0]);
    if (idx < order.length - 1) { this.setTopic(order[idx + 1]); return; }
    if (this.curStep < STEPS.length - 1) {
      this._landOnStep(this.curStep + 1, "first");
    } else {
      window.location.href = NEXT_DECK_URL;
    }
  },

  prev() {
    const order = STEPS[this.curStep].topicOrder;
    const idx = order.indexOf(this.topicByStep[this.curStep] ?? order[0]);
    if (idx > 0) { this.setTopic(order[idx - 1]); return; }
    if (this.curStep > 0) {
      this._landOnStep(this.curStep - 1, "last");
    } else {
      window.location.href = PREV_DECK_URL;
    }
  },

  reset() {
    this.stopPlay();
    this.curStep = 0;
    this.topicByStep = {};
    this.updateView();
  },

  togglePlay() {
    if (this.isPlaying) this.stopPlay();
    else this.startPlay();
  },

  startPlay() {
    this.isPlaying = true;
    const btn = document.getElementById("btn-play");
    btn.classList.add("playing");
    btn.innerText = "⏸ Pause";
    this.playTimer = setInterval(() => {
      const order = STEPS[this.curStep].topicOrder;
      const idx = order.indexOf(this.topicByStep[this.curStep] ?? order[0]);
      if (idx < order.length - 1) { this.setTopic(order[idx + 1]); return; }
      if (this.curStep < STEPS.length - 1) { this._landOnStep(this.curStep + 1, "first"); }
      else { this.stopPlay(); }
    }, 4000);
  },

  stopPlay() {
    this.isPlaying = false;
    clearInterval(this.playTimer);
    const btn = document.getElementById("btn-play");
    if (btn) { btn.classList.remove("playing"); btn.innerText = "▶ Play"; }
  },

  setupKeyListeners() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") this.next();
      if (e.key === "ArrowLeft") this.prev();
      if (e.key === " ") { e.preventDefault(); this.togglePlay(); }
      if (e.key === "r" || e.key === "R") this.reset();
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
  const params = new URLSearchParams(location.search);
  if (params.get("end") === "1") {
    App._landOnStep(STEPS.length - 1, "last");
  } else if (params.get("page") !== null) {
    const idx = parseInt(params.get("page"), 10);
    const topic = params.get("topic");
    App._landOnStep(idx, topic !== null ? parseInt(topic, 10) : "first");
  }
});
