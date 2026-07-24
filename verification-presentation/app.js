/* ================================================================
   VERIFICATION & VALIDATION PRESENTATION ENGINE — SLIDES 18 to 26
   All content sourced from Copy of 07072026.pptx, slides 18–26.
================================================================ */

const STEPS = [
  {
    num: 1,
    name: "IEEE Standard V&V Lifecycle",
    badge: "IEEE Std 1012",
    badgeClass: "c-cyan",
    viewId: "view-0",
    desc: "The System Development Life Cycle (SDLC) runs in parallel with a dedicated IEEE Std 1012 Verification & Validation track — every development phase has a matching V&V phase, tied together by continuous feedback loops and anomaly reporting.",
    meta: [
      { lbl: "Standard", val: "IEEE Std 1012" },
      { lbl: "Life Cycle Model", val: "SDLC — 6 phases" },
      { lbl: "V&V Track", val: "6 parallel V&V phases" },
      { lbl: "Closure", val: "Feedback Loops & Anomaly Reporting" }
    ],
    topics: {
      concept: "<strong>Concept V&V:</strong> Concept Plan, Feasibility, Risk / Hazard Analysis, and development of the SVVP (Software Verification & Validation Plan) itself.",
      requirements: "<strong>Requirements V&V:</strong> Traceability Analysis (System → Needs), Requirement Evaluation (completeness, consistency), and Interface Analysis.",
      design: "<strong>Design V&V:</strong> Architecture V&V, Detailed Design V&V, Interface Analysis, and Test Plan V&V.",
      implementation: "<strong>Implementation V&V:</strong> Code/RTL Review, Unit Tests, Traceability (Code → Design), and Static Analysis.",
      integration: "<strong>Integration &amp; Acceptance V&V:</strong> Qualification Testing, User Acceptance Testing, System Validation, and Installation V&V.",
      maintenance: "<strong>Maintenance V&V:</strong> Impact &amp; Regression Analysis, Re-verification &amp; Re-validation, Upgrade V&V, and Problem Report V&V."
    },
    topicOrder: [null, "concept", "requirements", "design", "implementation", "integration", "maintenance"],
    details: `
      <div class="det-sec">
        <div class="det-lbl">Focus a V&amp;V Phase</div>
        <div class="opt-btn-group">
          <button class="opt-btn" id="btn-topic-concept" onclick="App.setTopic('concept')">Concept V&amp;V</button>
          <button class="opt-btn" id="btn-topic-requirements" onclick="App.setTopic('requirements')">Requirements V&amp;V</button>
          <button class="opt-btn" id="btn-topic-design" onclick="App.setTopic('design')">Design V&amp;V</button>
          <button class="opt-btn" id="btn-topic-implementation" onclick="App.setTopic('implementation')">Implementation V&amp;V</button>
          <button class="opt-btn" id="btn-topic-integration" onclick="App.setTopic('integration')">Integration &amp; Acceptance V&amp;V</button>
          <button class="opt-btn" id="btn-topic-maintenance" onclick="App.setTopic('maintenance')">Maintenance V&amp;V</button>
        </div>
      </div>
    `
  },
  {
    num: 2,
    name: "Standard Testing Methodology",
    badge: "Testing Levels",
    badgeClass: "c-purple",
    viewId: "view-2",
    desc: "A 5-stage testing methodology: two stages analyse the Software Requirement Specification and Software Design Documentation to build the test basis, then three stages execute tests bottom-up — from a single unit up to the fully integrated simulator.",
    meta: [
      { lbl: "Total Stages", val: "5" },
      { lbl: "Test-Basis Stages", val: "2 — Requirement &amp; Design Docs" },
      { lbl: "Test-Execution Stages", val: "3 — Unit → Integration → System" },
      { lbl: "Ends With", val: "System Testing" }
    ],
    topics: {
      srs: "<strong>1. Analyse Software Requirement Specification:</strong> Review the requirements document to derive system-level test cases and acceptance criteria — the test basis for System Testing.",
      sdd: "<strong>2. Analyse Software Design Documentation:</strong> Review the architecture, modules, and interfaces to derive integration-level test cases — the test basis for Integration Testing.",
      unit: "<strong>3. Unit Testing of Implemented Code:</strong> Translates design into code and verifies each component in isolation.",
      integ: "<strong>4. Integration Testing:</strong> Combines individual modules to ensure they communicate correctly together, using the test cases derived from the Software Design Documentation.",
      system: "<strong>5. System Testing:</strong> Validates the fully assembled software against the original end-to-end requirements, using the test cases derived from the Software Requirement Specification."
    },
    topicOrder: [null, "srs", "sdd", "unit", "integ", "system"],
    details: `
      <div class="det-sec">
        <div class="det-lbl">Focus a Testing Level</div>
        <div class="opt-btn-group">
          <button class="opt-btn" id="btn-topic-srs" onclick="App.setTopic('srs')">1. Analyse Software Requirement Specification</button>
          <button class="opt-btn" id="btn-topic-sdd" onclick="App.setTopic('sdd')">2. Analyse Software Design Documentation</button>
          <button class="opt-btn" id="btn-topic-unit" onclick="App.setTopic('unit')">3. Unit Testing of Implemented Code</button>
          <button class="opt-btn" id="btn-topic-integ" onclick="App.setTopic('integ')">4. Integration Testing</button>
          <button class="opt-btn" id="btn-topic-system" onclick="App.setTopic('system')">5. System Testing</button>
        </div>
      </div>
    `
  },
  {
    num: 3,
    name: "Taxonomy of Failure",
    badge: "Possible Bugs",
    badgeClass: "c-orange",
    viewId: "view-3",
    desc: "Bugs found during simulator development split into two families: core logic / concurrency bugs (functional or scheduling errors) and memory / timing bugs (resource or clock-domain errors).",
    meta: [
      { lbl: "Root Category", val: "Possible Bugs" },
      { lbl: "Branch A", val: "Core Logic & Concurrency (4 types)" },
      { lbl: "Branch B", val: "Memory Bugs" },
      { lbl: "Branch C", val: "Timing Bugs" }
    ],
    topics: {
      core: "<strong>Core Logic &amp; Concurrency Bugs</strong> — functional and scheduling errors: <br><strong>Core logic bug:</strong> the implementation doesn't match the intended design logic.<br><strong>Deadlock:</strong> a circular wait for resources where no participant can make progress.<br><strong>Livelock:</strong> state keeps changing in response to other threads, but no participant makes progress.<br><strong>Starvation:</strong> a request is repeatedly denied resources and never gets served.",
      other: "<strong>Memory Bugs:</strong> incorrect buffer/queue reads, writes, or lifetime handling in the flit pools and VC buffers.<br><br><strong>Timing Bugs:</strong> incorrect cycle-accurate timestamps or evaluate/update-phase ordering errors."
    },
    topicOrder: [null, "core", "other"],
    details: `
      <div class="det-sec">
        <div class="det-lbl">Focus a Branch</div>
        <div class="opt-btn-group">
          <button class="opt-btn" id="btn-topic-core" onclick="App.setTopic('core')">Core Logic & Concurrency Bugs</button>
          <button class="opt-btn" id="btn-topic-other" onclick="App.setTopic('other')">Memory Bugs / Timing Bugs</button>
        </div>
      </div>
    `
  },
  {
    num: 4,
    name: "Validation Methods without RTL",
    badge: "RTL-Free Validation",
    badgeClass: "c-green",
    viewId: "view-4",
    desc: "Without a reference RTL implementation, three independent methods cross-check the simulator's correctness against math, published data, and other tools.",
    meta: [
      { lbl: "Method Count", val: "3" },
      { lbl: "RTL Required", val: "No" },
      { lbl: "Key Laws", val: "Little's Law, Flit/Credit Conservation" },
      { lbl: "Reference Simulators", val: "BookSim, Garnet" }
    ],
    topics: {
      analytical: "<strong>Analytical Method:</strong> Compares against queueing math to verify zero-load latency and maximum throughput, while enforcing Little's Law and Flit/Credit Conservation (zero flit drops or credit leaks).",
      published: "<strong>Published Results:</strong> Replicates published paper setups to check if latency/throughput curves match.",
      simulator: "<strong>Other Simulator:</strong> Runs identical traffic on established tools (BookSim, Garnet) to spot timing discrepancies."
    },
    topicOrder: [null, "analytical", "published", "simulator"],
    details: `
      <div class="det-sec">
        <div class="det-lbl">Focus a Method</div>
        <div class="opt-btn-group">
          <button class="opt-btn" id="btn-topic-analytical" onclick="App.setTopic('analytical')">Analytical Method</button>
          <button class="opt-btn" id="btn-topic-published" onclick="App.setTopic('published')">Published Results</button>
          <button class="opt-btn" id="btn-topic-simulator" onclick="App.setTopic('simulator')">Other Simulator</button>
        </div>
      </div>
    `
  },
  {
    num: 5,
    name: "Formal Verification Tools",
    badge: "Formal Methods",
    badgeClass: "c-pink",
    viewId: "view-5",
    desc: "Match the tool to the property you need to prove — from concurrent-protocol model checking to bounded checks of the actual C/C++ source.",
    meta: [
      { lbl: "Tool Count", val: "4" },
      { lbl: "Deadlock Proofs", val: "SPIN/Promela, Channel Dep. Graph" },
      { lbl: "System Spec", val: "TLA+" },
      { lbl: "Source-Level", val: "CBMC (bounded model check)" }
    ],
    topics: {
      spin: "<strong>SPIN / Promela:</strong> Model-checks concurrent protocols for deadlock and liveness.",
      cdg: "<strong>Channel Dependency Graph:</strong> Proves a routing algorithm is deadlock-free by design.",
      tla: "<strong>TLA+:</strong> Specifies and verifies system-level state machines.",
      cbmc: "<strong>CBMC:</strong> Bounded model-checks the actual C/C++ source directly."
    },
    topicOrder: [null, "spin", "cdg", "tla", "cbmc"],
    details: `
      <div class="det-sec">
        <div class="det-lbl">Focus a Tool</div>
        <div class="opt-btn-group">
          <button class="opt-btn" id="btn-topic-spin" onclick="App.setTopic('spin')">SPIN / Promela</button>
          <button class="opt-btn" id="btn-topic-cdg" onclick="App.setTopic('cdg')">Channel Dependency Graph</button>
          <button class="opt-btn" id="btn-topic-tla" onclick="App.setTopic('tla')">TLA+</button>
          <button class="opt-btn" id="btn-topic-cbmc" onclick="App.setTopic('cbmc')">CBMC</button>
        </div>
      </div>
    `
  },
  {
    num: 6,
    name: "The Verification Toolchain",
    badge: "Practical Tools",
    badgeClass: "c-yellow",
    viewId: "view-6",
    desc: "Practical tools that make correctness routine: unit testing, property-based testing, runtime sanitizers, and coverage measurement, all wired into CI.",
    meta: [
      { lbl: "Tool Count", val: "4" },
      { lbl: "Unit Testing", val: "GTest" },
      { lbl: "Property Testing", val: "RapidCheck" },
      { lbl: "Runtime Checks", val: "ASan / UBSan" }
    ],
    topics: {
      gtest: "<strong>GTest:</strong> The unit-test framework that structures and runs every test case.",
      rapidcheck: "<strong>RapidCheck:</strong> Drives property-based testing with generated random inputs.",
      asan: "<strong>ASan / UBSan:</strong> Sanitizers that catch memory and undefined-behavior bugs at runtime.",
      lcov: "<strong>lcov:</strong> Measures code coverage so untested paths become visible."
    },
    topicOrder: [null, "gtest", "rapidcheck", "asan", "lcov"],
    details: `
      <div class="det-sec">
        <div class="det-lbl">Focus a Tool</div>
        <div class="opt-btn-group">
          <button class="opt-btn" id="btn-topic-gtest" onclick="App.setTopic('gtest')">GTest</button>
          <button class="opt-btn" id="btn-topic-rapidcheck" onclick="App.setTopic('rapidcheck')">RapidCheck</button>
          <button class="opt-btn" id="btn-topic-asan" onclick="App.setTopic('asan')">ASan / UBSan</button>
          <button class="opt-btn" id="btn-topic-lcov" onclick="App.setTopic('lcov')">lcov</button>
        </div>
      </div>
    `
  },
  {
    num: 7,
    name: "The Complete Picture",
    badge: "11-Stage Pipeline",
    badgeClass: "c-teal",
    viewId: "view-7",
    desc: "All eight preceding pages collapse into one 11-stage verification pipeline — requirements in, a trusted simulator out.",
    meta: [
      { lbl: "Total Stages", val: "11" },
      { lbl: "Final Outcome", val: "Trusted simulator" },
      { lbl: "Spans", val: "Requirements → Sign-off" },
      { lbl: "Ties Together", val: "All Preceding Topics" }
    ],
    topics: {
      s1: "<strong>01. Requirements</strong> — captured as the Software Requirement Specification (SRS).",
      s2: "<strong>02. Specification</strong> — formalized by the V&amp;V Plan (SVVP) and Software Design Documentation.",
      s3: "<strong>03. Unit testing</strong> — the Implementation &amp; Unit Testing stage of the Standard Testing Methodology, enforced with GTest.",
      s4: "<strong>04. Integration</strong> — Integration Testing combines modules, per the Standard Testing Methodology.",
      s5: "<strong>05. System testing</strong> — full end-to-end validation against the original requirements.",
      s6: "<strong>06. Property testing</strong> — randomized, generated-input testing via RapidCheck in the Verification Toolchain.",
      s7: "<strong>07. Cycle accuracy</strong> — cross-checked against the cycle-accurate Evaluate/Update pipeline timing model.",
      s8: "<strong>08. Validation</strong> — RTL-free validation via the Analytical Method, Published Results, or an Other Simulator.",
      s9: "<strong>09. Formal methods</strong> — proofs via SPIN/Promela, Channel Dependency Graphs, TLA+, and CBMC.",
      s10: "<strong>10. Coverage review</strong> — measured with lcov to surface untested paths.",
      s11: "<strong>11. Sign-off</strong> — the final Software Test Report closes the loop, per IEEE Std 1012."
    },
    topicOrder: [null, "s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8", "s9", "s10", "s11"],
    details: `
      <div class="det-sec">
        <div class="det-lbl">Focus a Stage</div>
        <div class="opt-btn-group" style="max-height:280px; overflow-y:auto; padding-right:4px;">
          <button class="opt-btn" id="btn-topic-s1" onclick="App.setTopic('s1')">01. Requirements</button>
          <button class="opt-btn" id="btn-topic-s2" onclick="App.setTopic('s2')">02. Specification</button>
          <button class="opt-btn" id="btn-topic-s3" onclick="App.setTopic('s3')">03. Unit testing</button>
          <button class="opt-btn" id="btn-topic-s4" onclick="App.setTopic('s4')">04. Integration</button>
          <button class="opt-btn" id="btn-topic-s5" onclick="App.setTopic('s5')">05. System testing</button>
          <button class="opt-btn" id="btn-topic-s6" onclick="App.setTopic('s6')">06. Property testing</button>
          <button class="opt-btn" id="btn-topic-s7" onclick="App.setTopic('s7')">07. Cycle accuracy</button>
          <button class="opt-btn" id="btn-topic-s8" onclick="App.setTopic('s8')">08. Validation</button>
          <button class="opt-btn" id="btn-topic-s9" onclick="App.setTopic('s9')">09. Formal methods</button>
          <button class="opt-btn" id="btn-topic-s10" onclick="App.setTopic('s10')">10. Coverage review</button>
          <button class="opt-btn" id="btn-topic-s11" onclick="App.setTopic('s11')">11. Sign-off</button>
        </div>
      </div>
    `
  }
];

/* Neighbors in the master presentation sequence */
const PREV_DECK_URL = "../sdlc-presentation/index.html?end=1";
const NEXT_DECK_URL = "../pcie-presentation/index.html";

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
            <div class="det-lbl">Specifications</div>
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

  /* Generic focus/dim mechanism shared by every page's diagram —
     canvas elements opt in via class="vv-focusable" data-topic="key".
     Next/Prev and direct button clicks share this same state, walking
     through each page's topicOrder ([null, ...keys]) in lockstep. */
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
