/* ================================================================
   SDLC RECAP PRESENTATION ENGINE — 5 PAGES
   Generic topicOrder/setTopic engine ported from verification-presentation/app.js —
   pages with no topics just use topicOrder:[null] and fall straight through to
   page-level nav; pages 0 and 4 use it for real click-to-focus interactivity.
================================================================ */

const STEPS = [
  {
    num: 1,
    name: "Standard SDLC Flow",
    badge: "Reference",
    badgeClass: "c-orange",
    viewId: "view-0",
    noLegend: true,
    desc: "The project's software development lifecycle — six phases from Concept through Operation &amp; Maintenance — followed by a pipelined incremental model showing how successive increments overlap across time blocks, each at a different phase. Verification &amp; Validation activities for each phase are covered in the Verification &amp; Validation deck.",
    meta: [
      { lbl: "SDLC Phases", val: "6" },
      { lbl: "Process Model", val: "Incremental / Iterative" },
      { lbl: "Pipeline Depth", val: "Up to 4 Concurrent Increments" },
      { lbl: "V&amp;V Detail", val: "See Verification &amp; Validation deck" }
    ],
    topics: {
      concept: "<strong>Concept / Needs:</strong> Study of concepts, feasibility study, and understanding client requirements.",
      requirements: "<strong>Requirements:</strong> Define functionalities and features, and produce the requirement document.",
      design: "<strong>Architecture / Design:</strong> High-level system architecture, modules and components, and GUI design; low-level component design, class definitions, and algorithm design.",
      implementation: "<strong>Implementation:</strong> Implement and integrate the modules and components, and develop the frontend, backend engine, and integration framework.",
      integration: "<strong>Integration &amp; Test:</strong> Prepare and run test cases across the integrated system.",
      maintenance: "<strong>Operation &amp; Maintenance:</strong> Maintain the bug list and update the code based on reported errors and bugs.",
      tb1: "<strong>Time Block 1:</strong> Increment 1 begins Requirements.",
      tb2: "<strong>Time Block 2:</strong> Increment 1 moves to Design while Increment 2 begins Requirements.",
      tb3: "<strong>Time Block 3:</strong> Increment 1 reaches Coding, Increment 2 reaches Design, and Increment 3 begins Requirements.",
      tb4: "<strong>Time Block 4:</strong> the pipeline reaches steady state — four increments run concurrently, one at each phase.",
      tb5: "<strong>Time Block 5:</strong> Increment 1 completes and exits the pipeline as Increment 5 begins — the cycle repeats indefinitely."
    },
    topicOrder: [null, "concept", "requirements", "design", "implementation", "integration", "maintenance",
                       "tb1", "tb2", "tb3", "tb4", "tb5"],
    details: `
      <div class="det-sec">
        <div class="det-lbl">Focus a Phase</div>
        <div class="opt-btn-group" style="flex-direction:column; gap:6px;">
          <button class="opt-btn" id="btn-topic-concept" onclick="App.setTopic('concept')">Concept / Needs</button>
          <button class="opt-btn" id="btn-topic-requirements" onclick="App.setTopic('requirements')">Requirements</button>
          <button class="opt-btn" id="btn-topic-design" onclick="App.setTopic('design')">Architecture / Design</button>
          <button class="opt-btn" id="btn-topic-implementation" onclick="App.setTopic('implementation')">Implementation</button>
          <button class="opt-btn" id="btn-topic-integration" onclick="App.setTopic('integration')">Integration &amp; Test</button>
          <button class="opt-btn" id="btn-topic-maintenance" onclick="App.setTopic('maintenance')">Operation &amp; Maint.</button>
        </div>
      </div>
      <div class="det-sec">
        <div class="det-lbl">Pipeline Time Blocks</div>
        <div class="opt-btn-group" style="flex-direction:column; gap:6px;">
          <button class="opt-btn" id="btn-topic-tb1" onclick="App.setTopic('tb1')">Time Block 1</button>
          <button class="opt-btn" id="btn-topic-tb2" onclick="App.setTopic('tb2')">Time Block 2</button>
          <button class="opt-btn" id="btn-topic-tb3" onclick="App.setTopic('tb3')">Time Block 3</button>
          <button class="opt-btn" id="btn-topic-tb4" onclick="App.setTopic('tb4')">Time Block 4</button>
          <button class="opt-btn" id="btn-topic-tb5" onclick="App.setTopic('tb5')">Time Block 5</button>
        </div>
      </div>
    `
  },
  {
    num: 2,
    name: "Requirement Gathering and Analysis",
    badge: "Phase 1 of 3",
    badgeClass: "c-orange",
    viewId: "view-1",
    desc: "Detailed study of the CHI protocol and existing simulators, a feasibility study on cycle-accurate vs. functional modeling, and defining the simulator's features and requirements.",
    meta: [
      { lbl: "Total Items", val: "10" },
      { lbl: "Completed", val: "7" },
      { lbl: "In Progress", val: "2" },
      { lbl: "Planned", val: "1" }
    ],
    topicOrder: [null],
    details: ``
  },
  {
    num: 3,
    name: "System Design",
    badge: "Phase 2 of 3",
    badgeClass: "c-orange",
    viewId: "view-2",
    desc: "High-level system design (hierarchy, workflow, modules) and low-level system design (router architecture, flit lifecycle, class and algorithm design).",
    meta: [
      { lbl: "Total Items", val: "24" },
      { lbl: "Completed", val: "12" },
      { lbl: "In Progress", val: "9" },
      { lbl: "Planned", val: "3" }
    ],
    topicOrder: [null],
    details: ``
  },
  {
    num: 4,
    name: "Development and Coding",
    badge: "Phase 3 of 3",
    badgeClass: "c-orange",
    viewId: "view-3",
    desc: "Component-by-component build status across the Simulation Kernel, Network Layer, Device &amp; Endpoints, and GUI Tool.",
    meta: [
      { lbl: "Total Items", val: "59" },
      { lbl: "Completed", val: "19" },
      { lbl: "In Progress", val: "12" },
      { lbl: "Planned", val: "28" }
    ],
    topicOrder: [null],
    details: ``
  },
  {
    num: 5,
    name: "Documentation Flow",
    badge: "Document Trail",
    badgeClass: "c-orange",
    viewId: "view-4",
    noLegend: true,
    desc: "A 7-stage top-down documentation trail carries a single requirement from its initial specification all the way to the final signed-off test report.",
    meta: [
      { lbl: "Total Documents", val: "7" },
      { lbl: "Starts With", val: "Software Requirement Spec." },
      { lbl: "Ends With", val: "Software Test Report" },
      { lbl: "Flow Direction", val: "Top-down, sequential" }
    ],
    topics: {
      srs: "<strong>1. Software Requirement Specification (SRS):</strong> Establishes functional requirements, protocols, and performance goals.",
      svvp: "<strong>2. V&amp;V Plan (SVVP):</strong> Formulated early using the requirements to set up the Requirements Traceability Matrix (RTM), acceptance criteria, and compliance standards.",
      sdd: "<strong>3. Software Design Documentation (SDD):</strong> High-Level and Low-Level architecture designs written to satisfy the requirements and align with the V&amp;V criteria.",
      impl: "<strong>4. Software Implementation Documentation:</strong> Onboarding, module specifications, and build guidelines established during coding.",
      testplan: "<strong>5. Software Test Plan:</strong> Defines the exact scope, setup, and criteria for test execution based on the SDD and SVVP.",
      testcases: "<strong>6. Software Test Cases:</strong> Detailed step-by-step test vectors, workloads, and expected outputs derived from the Test Plan.",
      testreport: "<strong>7. Software Test Report:</strong> The final output document summarizing pass/fail results, test coverage, and residual issues before release."
    },
    topicOrder: [null, "srs", "svvp", "sdd", "impl", "testplan", "testcases", "testreport"],
    details: `
      <div class="det-sec">
        <div class="det-lbl">Focus a Document</div>
        <div class="opt-btn-group" style="flex-direction:column; gap:6px;">
          <button class="opt-btn" id="btn-topic-srs" onclick="App.setTopic('srs')">1. SRS</button>
          <button class="opt-btn" id="btn-topic-svvp" onclick="App.setTopic('svvp')">2. V&amp;V Plan (SVVP)</button>
          <button class="opt-btn" id="btn-topic-sdd" onclick="App.setTopic('sdd')">3. SDD</button>
          <button class="opt-btn" id="btn-topic-impl" onclick="App.setTopic('impl')">4. Implementation Docs</button>
          <button class="opt-btn" id="btn-topic-testplan" onclick="App.setTopic('testplan')">5. Test Plan</button>
          <button class="opt-btn" id="btn-topic-testcases" onclick="App.setTopic('testcases')">6. Test Cases</button>
          <button class="opt-btn" id="btn-topic-testreport" onclick="App.setTopic('testreport')">7. Test Report</button>
        </div>
      </div>
    `
  }
];

/* Neighbors in the master presentation sequence — this deck now sits between
   System Architecture's last sub-page and Verification & Validation. */
const PREV_DECK_URL = "../presentation/chi-channel-architecture.html?end=1";
const NEXT_DECK_URL = "../verification-presentation/index.html";

/* Page 0's "Pipelined Incremental SDLC Model" diagram — Time Block reveal order. */
const TB_ORDER = ["tb1", "tb2", "tb3", "tb4", "tb5"];

/* Application State */
const App = {
  curStep: 0,
  isPlaying: false,
  playTimer: null,
  topicByStep: {},

  init() {
    this.renderPips();
    this.updateView();
    this.setupKeyListeners();
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

    this._paintTopic();

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

    const detBody = document.getElementById("details-body");
    if (detBody) {
      detBody.classList.add("fading");
      setTimeout(() => {
        const metaHtml = step.meta.map(m => `
          <div class="sum-card">
            <div class="sum-lbl">${m.lbl}</div>
            <div class="sum-val">${m.val}</div>
          </div>
        `).join("");

        detBody.innerHTML = `
          <div class="det-sec">
            <div class="det-lbl">Snapshot</div>
            <div class="summary-grid">${metaHtml}</div>
          </div>
          ${step.details}
        `;
        detBody.classList.remove("fading");
        this._syncTopicButtons();
      }, 150);
    }

    document.getElementById("btn-prev").disabled = false;
    document.getElementById("btn-next").disabled = false;
    document.getElementById("btn-next").innerText = (this.curStep === STEPS.length - 1) ? "Next Deck ➔" : "Next ➔";
  },

  /* Generic focus/dim mechanism shared by page 0 and page 4's diagrams — canvas
     elements opt in via class="vv-focusable" data-topic="key". Next/Prev and
     direct button clicks share this same state, walking through each page's
     topicOrder ([null, ...keys]) in lockstep. Pages with topicOrder:[null] never
     produce a truthy topic, so this is a no-op for them. */
  setTopic(key) {
    this.topicByStep[this.curStep] = key;
    this._paintTopic();

    const step = STEPS[this.curStep];
    const topic = this.topicByStep[this.curStep];
    const descEl = document.getElementById("dynamic-band-desc");
    if (descEl) descEl.innerHTML = (topic && step.topics) ? step.topics[topic] : step.desc;

    this._syncTopicButtons();
  },

  _paintTopic() {
    const topic = this.topicByStep[this.curStep];
    const view = document.getElementById(STEPS[this.curStep].viewId);
    if (!view) return;

    view.querySelectorAll(".vv-focusable").forEach(el => {
      if (!topic) { el.classList.remove("dimmed"); return; }
      el.classList.toggle("dimmed", el.dataset.topic !== topic);
    });

    // Page-0-specific (harmless no-op on page 4, which has no .pipeline-grid):
    // grow the pipeline grid one Time Block column at a time per "tbN" step —
    // grid-template-columns only defines as many tracks as are revealed, so
    // not-yet-revealed columns take no space; earlier columns/boxes stay
    // visible once revealed, only the newest column's boxes get "active".
    const pipelineGrid = view.querySelector(".pipeline-grid");
    if (pipelineGrid) {
      const revealCount = TB_ORDER.indexOf(topic) + 1; // 0 if topic isn't a tb step
      pipelineGrid.style.gridTemplateColumns = revealCount > 0
        ? `repeat(${revealCount}, minmax(140px, 1fr))`
        : "0px";
      pipelineGrid.querySelectorAll("[data-tb]").forEach(el => {
        const n = Number(el.dataset.tb);
        el.classList.toggle("revealed", n <= revealCount);
        el.classList.toggle("active", n === revealCount && el.classList.contains("tb-box"));
      });
    }
  },

  _syncTopicButtons() {
    const topic = this.topicByStep[this.curStep];
    document.querySelectorAll("#details-body .opt-btn[id^='btn-topic-']").forEach(btn => {
      const key = btn.id.replace("btn-topic-", "");
      btn.classList.toggle("active", key === topic);
    });
  },

  /* Jump straight to page stepIdx, landing on its first topic (null/intro), its
     last, or a specific topicOrder index (pos: 'first' | 'last' | number). */
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
    const idx = order.indexOf(this.topicByStep[this.curStep] ?? null);
    if (idx < order.length - 1) { this.setTopic(order[idx + 1]); return; }
    if (this.curStep < STEPS.length - 1) {
      this._landOnStep(this.curStep + 1, "first");
    } else {
      window.location.href = NEXT_DECK_URL;
    }
  },

  prev() {
    const order = STEPS[this.curStep].topicOrder;
    const idx = order.indexOf(this.topicByStep[this.curStep] ?? null);
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
      const idx = order.indexOf(this.topicByStep[this.curStep] ?? null);
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
      if (document.getElementById("landing-view").style.display !== "none") {
        if (e.key === "ArrowRight") { e.preventDefault(); Landing.enter(0); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); window.location.href = "../index.html?end=1"; }
        return;
      }
      if (e.key === "ArrowRight") this.next();
      if (e.key === "ArrowLeft") this.prev();
      if (e.key === " ") { e.preventDefault(); this.togglePlay(); }
      if (e.key === "r" || e.key === "R") this.reset();
    });
  }
};

const Landing = {
  show() {
    App.stopPlay();
    const view = document.getElementById("landing-view");
    if (view) view.style.display = "flex";
  },
  enter(stepIdx = 0) {
    const view = document.getElementById("landing-view");
    if (view) view.style.display = "none";
    App.goToPage(stepIdx);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  App.init();
  const params = new URLSearchParams(location.search);
  const hasDeepLink = params.get("end") === "1" || params.get("page") !== null;
  if (!hasDeepLink) return;

  const landing = document.getElementById("landing-view");
  if (landing) landing.style.display = "none";

  if (params.get("end") === "1") {
    App._landOnStep(STEPS.length - 1, "last");
  } else {
    const idx = parseInt(params.get("page"), 10);
    const topic = params.get("topic");
    App._landOnStep(idx, topic !== null ? parseInt(topic, 10) : "first");
  }
});
