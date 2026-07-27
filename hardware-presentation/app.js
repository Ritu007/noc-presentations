/* ================================================================
   HARDWARE ARCHITECTURE PRESENTATION ENGINE — SLIDES 1 to 7
================================================================ */

const STEPS = [
  {
    num: 1,
    name: "Roadmap & CHI Node Integration",
    badge: "System Roadmap",
    badgeClass: "c-cyan",
    viewId: "view-roadmap",
    microValues: [0, 1, 2, 3],
    desc: [
      "CHI Exploration & Node Design: Exploring the CHI protocol alongside identifying key functionalities of nodes (RN, HN, SN) required for simulator design.<br><br><strong>CHI Node Taxonomy</strong> — <strong>RN-F (Fully Coherent Request Node):</strong> Generates coherent cache requests &amp; CPU traffic. <strong>HN-F (Fully Coherent Home Node):</strong> Manages coherence directory &amp; ordering. <strong>SN-F (Slave Node):</strong> Interfaces to main memory controllers.",
      "Router Development: Working on the router architecture required for CHI based NoC.",
      "Mesh Formation: Interconnect routers to form a scalable mesh network topology.",
      "Node Integration: Gradually integrate CHI nodes (RN-F, HN-F, SN-F, etc.) into the router mesh as shown in the block diagram."
    ],
    meta: [
      { lbl: "Project", val: "C-DAC NoC Simulator" },
      { lbl: "Protocol", val: "ARM CHI (Coherent Hub Interface)" },
      { lbl: "Node Types", val: "RN-F, HN-F, SN-F" },
      { lbl: "Topology", val: "2D Scalable Mesh Interconnect" }
    ],
    details: `
      <div class="det-sec">
        <div class="det-lbl">Development Milestones</div>
        <div class="opt-btn-group" style="flex-direction:column; gap:8px;">
          <button class="opt-btn active" id="btn-roadmap-0" onclick="App.setRoadmapStep(0)">1. CHI Exploration & Node Design</button>
          <button class="opt-btn" id="btn-roadmap-1" onclick="App.setRoadmapStep(1)">2. Router Development</button>
          <button class="opt-btn" id="btn-roadmap-2" onclick="App.setRoadmapStep(2)">3. Mesh Formation</button>
          <button class="opt-btn" id="btn-roadmap-3" onclick="App.setRoadmapStep(3)">4. Node Integration</button>
        </div>
      </div>
    `
  },
  {
    num: 2,
    name: "6-Port Configurable Router Architecture",
    badge: "Router Mesh",
    badgeClass: "c-blue",
    viewId: "view-router-ports",
    microValues: ["middle", "edge", "corner"],
    desc: {
      middle: "Middle Router: Located in the center of the mesh, this configuration uses 4 Directional ports to connect to adjacent routers (North, South, East, West) and up to 2 Local ports for CHI nodes.",
      edge: "Left Edge Router: Positioned on the boundary of the mesh, it requires only 3 Directional ports, freeing up an additional port to support 3 Local CHI nodes.",
      corner: "Top-Left Corner Router: Situated at the corner of the mesh, it connects to only 2 adjacent routers (South, East), allowing up to 4 Local ports for maximum node density."
    },
    meta: [
      { lbl: "Total Ports", val: "6 Identical Ports" },
      { lbl: "Middle Node", val: "2 Local, 4 Directional" },
      { lbl: "Edge Node", val: "3 Local, 3 Directional" },
      { lbl: "Corner Node", val: "4 Local, 2 Directional" }
    ],
    details: `
      <div class="det-sec">
        <div class="det-lbl">Select Router Layout</div>
        <div class="opt-btn-group" style="flex-direction:column; gap:8px;">
          <button class="opt-btn active" id="btn-layout-middle" onclick="App.setRouterLayout('middle')">Middle Router (2L, 4D)</button>
          <button class="opt-btn" id="btn-layout-edge" onclick="App.setRouterLayout('edge')">Left Edge Router (3L, 3D)</button>
          <button class="opt-btn" id="btn-layout-corner" onclick="App.setRouterLayout('corner')">Top-Left Corner (4L, 2D)</button>
        </div>
      </div>
    `
  },
  {
    num: 3,
    name: "CHI Buffer Sizing & Credit Flow Control",
    badge: "Buffer & Credit Sizing",
    badgeClass: "c-purple",
    viewId: "view-buffers",
    microValues: [null, "vcs", "credit", "flit"],
    desc: "Each CHI router consists of six identical ports, and every port contains independent buffers for the four CHI channels: REQ (162b), DAT (756b), SNP (126b), and RSP (73b).",
    meta: [
      { lbl: "REQ Flit Width", val: "162 bits" },
      { lbl: "DAT Flit Width", val: "756 bits" },
      { lbl: "SNP Flit Width", val: "126 bits" },
      { lbl: "RSP Flit Width", val: "73 bits" }
    ],
    details: `
      <div class="det-sec">
        <div class="det-lbl">Explore Channel Topics</div>
        <div class="opt-btn-group" style="flex-direction:column; gap:8px;">
          <button class="opt-btn" id="btn-topic-vcs" onclick="App.setSlide3Topic('vcs')">Dedicated VCs & Sizing</button>
          <button class="opt-btn" id="btn-topic-credit" onclick="App.setSlide3Topic('credit')">Credit Mechanism</button>
          <button class="opt-btn" id="btn-topic-flit" onclick="App.setSlide3Topic('flit')">Single Atomic Flit</button>
        </div>
      </div>
    `
  },
  {
    num: 4,
    name: "Router Data Path & 5-Stage Pipeline",
    badge: "Hardware Data Path",
    badgeClass: "c-orange",
    viewId: "view-datapath",
    microValues: [null, "links", "input", "pipe", "control", "flow"],
    desc: "Flits traverse a 5-stage pipeline: Buffer Write (BW) → Routing Computation (RC) → VC Allocation (VA) → Switch Allocation (SA) → Switch Traversal (ST). Credit returns guarantee conflict-free flow.",
    meta: [
      { lbl: "Pipeline Stages", val: "BW → RC → VA → SA → ST" },
      { lbl: "Input Interface", val: "Decodes VC ID & Buffer Write" },
      { lbl: "Control Path", val: "Credit counters & VC allocation" },
      { lbl: "Guarantee", val: "Conflict-Free & Deadlock-Free" }
    ],
    details: `
      <div class="det-sec">
        <div class="det-lbl">Explore Pipeline & Control</div>
        <div class="opt-btn-group" style="flex-direction:column; gap:8px;">
          <button class="opt-btn" id="btn-topic4-links" onclick="App.setSlide4Topic('links')">Dedicated CHI Links</button>
          <button class="opt-btn" id="btn-topic4-input" onclick="App.setSlide4Topic('input')">Input Processing</button>
          <button class="opt-btn" id="btn-topic4-pipe" onclick="App.setSlide4Topic('pipe')">Router Pipeline</button>
          <button class="opt-btn" id="btn-topic4-control" onclick="App.setSlide4Topic('control')">Control Path</button>
          <button class="opt-btn" id="btn-topic4-flow" onclick="App.setSlide4Topic('flow')">Flow Control</button>
        </div>
      </div>
    `
  },
  {
    num: 5,
    name: "Router Functional Blocks",
    badge: "Functional Schema",
    badgeClass: "c-green",
    viewId: "view-allocators",
    microValues: [null, "step1", "step2", "step3", "step4", "step5", "step6", "step7", "step8", "step9"],
    desc: "Detailed functional schema of router components and allocation mechanisms.",
    meta: [
      { lbl: "Inputs", val: "6 Physical Ports (E,W,N,S,L0,L1)" },
      { lbl: "Buffers", val: "REQ, DAT, SNP, RSP VCs" },
      { lbl: "Routing", val: "XY Coordinate Routing" },
      { lbl: "Crossbar", val: "6x6 Switch Matrix" }
    ],
    details: `
      <div class="det-sec">
        <div class="det-lbl">9-Step Execution Flow</div>
        <div class="opt-btn-group" style="flex-direction:column; gap:6px;">
          <button class="opt-btn" id="btn-topic5-step1" onclick="App.setSlide5Topic('step1')">1. Input Port</button>
          <button class="opt-btn" id="btn-topic5-step2" onclick="App.setSlide5Topic('step2')">2. Buffer Write (BW)</button>
          <button class="opt-btn" id="btn-topic5-step3" onclick="App.setSlide5Topic('step3')">3. VC State & Flow Control</button>
          <button class="opt-btn" id="btn-topic5-step4" onclick="App.setSlide5Topic('step4')">4. Route Computation (RC)</button>
          <button class="opt-btn" id="btn-topic5-step5" onclick="App.setSlide5Topic('step5')">5. VC State Machine</button>
          <button class="opt-btn" id="btn-topic5-step6" onclick="App.setSlide5Topic('step6')">6. VC Allocator (VA)</button>
          <button class="opt-btn" id="btn-topic5-step7" onclick="App.setSlide5Topic('step7')">7. Switch Allocator (SA)</button>
          <button class="opt-btn" id="btn-topic5-step8" onclick="App.setSlide5Topic('step8')">8. Switch Traversal (ST)</button>
          <button class="opt-btn" id="btn-topic5-step9" onclick="App.setSlide5Topic('step9')">9. Flow Control Unit</button>
        </div>
      </div>
    `
  },
  {
    num: 6,
    name: "Arbiters & Allocators",
    badge: "Arbiter / Allocator Trees",
    badgeClass: "c-pink",
    viewId: "view-5",
    microValues: [null, "arbiter_root", "arbiter_active", "arbiter_rr", "allocator_root", "allocator_active", "allocator_sparse", "allocator_separable", "allocator_sep_in"],
    desc: "Hierarchical breakdown of Arbiters and Allocators.",
    meta: [
      { lbl: "Arbiters", val: "Round-Robin, Tree, Matrix, Priority" },
      { lbl: "Allocators", val: "Sparse, Dense, Separable, etc." }
    ],
    details: `
      <div class="det-sec">
        <div class="det-lbl">Explore Node Hierarchy</div>
        <div class="opt-btn-group" style="flex-direction:column; gap:6px;">
          <button class="opt-btn" id="btn-topic6-arbiter_root" onclick="App.setSlide6Topic('arbiter_root')">Arbiter Root</button>
          <button class="opt-btn" id="btn-topic6-arbiter_active" onclick="App.setSlide6Topic('arbiter_active')">Activate Arbiter Tree</button>
          <button class="opt-btn" id="btn-topic6-arbiter_rr" onclick="App.setSlide6Topic('arbiter_rr')">Round-Robin Arbiter</button>
          <button class="opt-btn" id="btn-topic6-allocator_root" onclick="App.setSlide6Topic('allocator_root')">Allocator Root</button>
          <button class="opt-btn" id="btn-topic6-allocator_active" onclick="App.setSlide6Topic('allocator_active')">Activate Allocator Tree</button>
          <button class="opt-btn" id="btn-topic6-allocator_sparse" onclick="App.setSlide6Topic('allocator_sparse')">Sparse Allocator</button>
          <button class="opt-btn" id="btn-topic6-allocator_separable" onclick="App.setSlide6Topic('allocator_separable')">Separable Allocator</button>
          <button class="opt-btn" id="btn-topic6-allocator_sep_in" onclick="App.setSlide6Topic('allocator_sep_in')">Separable Input First</button>
        </div>
      </div>
    `
  }
];

/* Neighbors in the master presentation sequence — Prev now lands on the hub's
   Quarterly Progress section (Recap's new successor), not the TOC directly. */
const PREV_DECK_URL = "../index.html?show=progress";
const NEXT_DECK_URL = "router-3d-explorer.html";

/* Application State */
const App = {
  curStep: 0,
  roadmapStep: 0,
  routerLayout: "middle",
  isPlaying: false,
  playTimer: null,
  allocMode: "dense",
  slide3Topic: null,

  slide3Texts: {
    intro: "Each CHI router consists of six identical ports, and every port contains independent buffers for the four CHI channels: REQ (162b), DAT (756b), SNP (126b), and RSP (73b).",
    vcs: "<strong>Dedicated VCs & Sizing:</strong> Each channel has its own dedicated VCs. The width of each VC buffer is equal to the corresponding channel flit width.",
    credit: "<strong>Credit Mechanism:</strong> Credit-based flow control is implemented using four independent credit channels, each having n-bit width, where n equals the number of VCs. Credit information indicates downstream VC availability before transmitting a flit.<br><br><span style='opacity:0.8; font-style:italic;'>The current implementation uses a standard router credit mechanism for flow control. CHI-specific credit management and QoS-based priority support will be integrated in future revisions.</span>",
    flit: "<strong>Single Atomic Flit:</strong> There will be no concept of Head, Body and Tail flits, there will be only one flit which will carry all the information."
  },

  slide4Topic: null,
  slide4Texts: {
    intro: "Flits traverse a 5-stage pipeline: Buffer Write (BW) → Routing Computation (RC) → VC Allocation (VA) → Switch Allocation (SA) → Switch Traversal (ST). Credit returns guarantee conflict-free flow.",
    links: "<strong>Dedicated CHI Links:</strong> Each router port has independent REQ (162b), DAT (756b), SNP (126b), and RSP (73b) links with associated control and credit signals.",
    input: "<strong>Input Processing:</strong> The Input Interface decodes the VC ID and writes the incoming flit into the corresponding Virtual Channel (VC) buffer during the Buffer Write (BW) stage.",
    pipe: "<strong>Router Pipeline:</strong> Flits traverse the five-stage pipeline BW → RC → VA → SA → ST before being forwarded to the selected output link.",
    control: "<strong>Control Path:</strong> Credits and VC status drive RC, VA, and SA decisions, while successful flit transmission regenerates a credit that is returned to the upstream router.",
    flow: "<strong>Flow Control:</strong> A flit advances only when buffer credits are available, an output VC is allocated, and crossbar access is granted, ensuring conflict-free and deadlock-free communication."
  },

  slide5Topic: null,
  slide5Texts: {
    intro: "Detailed functional block diagram of a CHI-based router illustrating the five-stage pipeline and flow-control unit for a single CHI channel; the remaining CHI channels follow the same router pipeline architecture.",
    step1: "<strong>1. Input Port:</strong> The router features 6 distinct physical input ports (East, West, North, South, Local 0, Local 1). Each port receives incoming flits partitioned into REQ, DAT, SNP, and RSP networks.",
    step2: "<strong>2. Buffer Write (BW):</strong> Incoming flits are decoded and written into the Virtual Channel (VC) buffers. Each network message class is assigned to dedicated VC buffers (e.g., VC0-VC3) awaiting further processing.",
    step3: "<strong>3. VC State & Flow Control:</strong> The VC State Machine monitors buffer occupancy and VC status, while the Flow Control Unit manages the credit ecosystem for upstream and downstream synchronization.",
    step4: "<strong>4. Route Computation (RC):</strong> Once a flit is buffered, the RC unit computes the output port using XY routing by comparing the current router coordinates with the destination coordinates.",
    step5: "<strong>5. VC State Machine:</strong> The State Machine transitions the VC from IDLE to ROUTING, locking the computed output port for the duration of the flit.",
    step6: "<strong>6. VC Allocator (VA):</strong> The VA utilizes separable allocators to reserve available downstream VCs for requesting flits, ensuring buffer space exists at the next router before advancing.",
    step7: "<strong>7. Switch Allocator (SA):</strong> Flits with reserved downstream VCs compete for switch crossbar access. The SA grants access based on Round-Robin arbitration across port requests.",
    step8: "<strong>8. Switch Traversal (ST):</strong> Winning flits read from their BW buffers, traverse the 6x6 Crossbar switch matrix, and are forwarded to their designated output ports.",
    step9: "<strong>9. Flow Control Unit:</strong> Upon successful traversal, the Flow Control Unit decrements the local credit counter and regenerates a credit, returning it to the upstream router to free its buffers."
  },

  slide6Topic: null,
  slide6Texts: {
    intro: "Overview of different arbiter and allocator architectures used for resource arbitration and allocation in NoC routers.",
    arbiter_root: "<strong>Arbiter:</strong> The root component responsible for resolving conflicts when multiple requests target the same resource.",
    arbiter_active: "<strong>Arbiter Types:</strong> There are various types of arbiters such as Round-Robin, Tree, Matrix, and Priority.",
    arbiter_rr: "<strong>Round-Robin Arbiter:</strong> A Round-Robin Arbiter grants requests in a rotating order to ensure fair access and avoid starvation.",
    allocator_root: "<strong>Allocator:</strong> The root component responsible for matching requests to available resources.",
    allocator_active: "<strong>Allocator Types:</strong> Dense Allocator stores full request matrix (eg. 64x64). Sparse Allocator stores only active requests.",
    allocator_sparse: "<strong>Sparse Allocator:</strong> Stores only active requests (more efficient).",
    allocator_separable: "<strong>Separable Allocator:</strong> Two stage Arbitration (one across the inputs and one across the outputs). Each input chooses its favorite output. Each output chooses its favorite input.",
    allocator_sep_in: "<strong>Separable Input First Allocator:</strong> A variant where input arbitration is performed first before output arbitration."
  },

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

    // Footer updates
    document.getElementById("prog-num").innerText = step.num;
    document.getElementById("prog-total").innerText = STEPS.length;
    document.getElementById("prog-name").innerText = step.name;

    // Progress Pips
    STEPS.forEach((_, idx) => {
      const pip = document.getElementById(`pip-${idx}`);
      if (pip) {
        pip.className = "pip" + (idx < this.curStep ? " done" : idx === this.curStep ? " cur" : "");
      }

      const navBtn = document.getElementById(`nav-${idx}`);
      if (navBtn) {
        navBtn.className = "nav-item" + (idx < this.curStep ? " done" : idx === this.curStep ? " active" : "");
      }
    });

    // Toggle views
    document.querySelectorAll(".canvas-view").forEach(v => v.classList.remove("active"));
    const activeView = document.getElementById(step.viewId);
    if (activeView) activeView.classList.add("active");

    if (this.curStep === 0) {
      this.updateRoadmapView();
    }

    // Readability Band
    const bandBody = document.getElementById("band-body");
    if (bandBody) {
      bandBody.classList.add("fading");
      setTimeout(() => {
        let currentDesc = step.desc;
        if (Array.isArray(step.desc)) {
          currentDesc = step.desc[this.curStep === 0 ? this.roadmapStep : 0];
        } else if (typeof step.desc === 'object' && step.desc !== null) {
          if (this.curStep === 1) currentDesc = step.desc[this.routerLayout];
        } else if (this.curStep === 2) {
          currentDesc = this.slide3Topic ? this.slide3Texts[this.slide3Topic] : this.slide3Texts.intro;
        } else if (this.curStep === 3) {
          currentDesc = this.slide4Topic ? this.slide4Texts[this.slide4Topic] : this.slide4Texts.intro;
        } else if (this.curStep === 4) {
          currentDesc = this.slide5Topic ? this.slide5Texts[this.slide5Topic] : this.slide5Texts.intro;
        } else if (this.curStep === 5) {
          currentDesc = this.slide6Topic ? this.slide6Texts[this.slide6Topic] : this.slide6Texts.intro;
        }
        bandBody.innerHTML = `
          <div class="band-desc" id="dynamic-band-desc">${currentDesc}</div>
        `;
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

    // Re-sync facet buttons/SVG classes to current state (not a hardcoded reset —
    // lets Next/Prev and deep-links land mid-page, not just at the intro). Topic
    // buttons now live permanently in the nav (see renderNavTopics), so this just
    // re-applies .active/desc state to whichever step is current.
    if (step.num === 2) {
      this.setRouterLayout(this.routerLayout);
    }
    if (step.num === 3) {
      this.setSlide3Topic(this.slide3Topic);
    }
    if (step.num === 4) {
      this.setSlide4Topic(this.slide4Topic);
    }
    if (step.num === 5) {
      this.setSlide5Topic(this.slide5Topic);
      this.setAllocMode(this.allocMode);
    }
    if (step.num === 6) {
      this.setSlide6Topic(this.slide6Topic);
    }

    // Button states — both ends of the deck now navigate to a neighboring file
    document.getElementById("btn-prev").disabled = false;
    document.getElementById("btn-next").disabled = false;
  },

  /* Ordered facet value per curStep, and how to read/apply it — this is what
     Next/Prev and direct button clicks both walk through in lockstep. */
  _microAccessors() {
    return {
      0: { get: () => this.roadmapStep, set: v => this.setRoadmapStep(v) },
      1: { get: () => this.routerLayout, set: v => this.setRouterLayout(v) },
      2: { get: () => this.slide3Topic, set: v => this.setSlide3Topic(v) },
      3: { get: () => this.slide4Topic, set: v => this.setSlide4Topic(v) },
      4: { get: () => this.slide5Topic, set: v => this.setSlide5Topic(v) },
      5: { get: () => this.slide6Topic, set: v => this.setSlide6Topic(v) },
    }[this.curStep];
  },

  /* Jump straight to page stepIdx, landing on its first micro-value, its last,
     or a specific micro-index (pos: 'first' | 'last' | number). */
  _landOnStep(stepIdx, pos) {
    if (stepIdx < 0 || stepIdx >= STEPS.length) return;
    const values = STEPS[stepIdx].microValues;
    let val;
    if (pos === "last") val = values[values.length - 1];
    else if (pos === "first" || pos === undefined) val = values[0];
    else val = values[Math.max(0, Math.min(pos, values.length - 1))];

    this.curStep = stepIdx;
    switch (stepIdx) {
      case 0: this.roadmapStep = val; break;
      case 1: this.routerLayout = val; break;
      case 2: this.slide3Topic = val; break;
      case 3: this.slide4Topic = val; break;
      case 4: this.slide5Topic = val; break;
      case 5: this.slide6Topic = val; break;
    }
    this.updateView();
  },

  goToPage(idx) {
    this._landOnStep(idx, "first");
  },

  next() {
    const values = STEPS[this.curStep].microValues;
    const acc = this._microAccessors();
    const idx = values.indexOf(acc.get());
    if (idx < values.length - 1) { acc.set(values[idx + 1]); return; }
    if (this.curStep < STEPS.length - 1) {
      this._landOnStep(this.curStep + 1, "first");
    } else {
      window.location.href = NEXT_DECK_URL;
    }
  },

  prev() {
    const values = STEPS[this.curStep].microValues;
    const acc = this._microAccessors();
    const idx = values.indexOf(acc.get());
    if (idx > 0) { acc.set(values[idx - 1]); return; }
    if (this.curStep > 0) {
      this._landOnStep(this.curStep - 1, "last");
    } else {
      window.location.href = PREV_DECK_URL;
    }
  },

  setRoadmapStep(i) {
    this.roadmapStep = i;
    this.updateRoadmapView();
  },

  updateRoadmapView() {
    const rs = this.roadmapStep;

    for (let i = 0; i < 4; i++) {
      const card = document.getElementById(`step-card-${i}`);
      if (card) {
        if (i === rs) {
          card.classList.add("active");
        } else {
          card.classList.remove("active");
        }
      }
      const btn = document.getElementById(`btn-roadmap-${i}`);
      if (btn) btn.classList.toggle("active", i === rs);
    }

    const devices = document.getElementById("rm-devices");
    const r00 = document.getElementById("rm-r00");
    const meshNodes = document.getElementById("rm-mesh-nodes");
    const meshLinks = document.getElementById("rm-mesh-links");
    const nodeLinks = document.getElementById("rm-node-links");

    const setMuted = (el, muted) => {
      if (!el) return;
      if (muted) el.classList.add("rm-muted");
      else el.classList.remove("rm-muted");
    };

    if (rs === 0) {
      setMuted(devices, false);
      setMuted(r00, true);
      setMuted(meshNodes, true);
      setMuted(meshLinks, true);
      setMuted(nodeLinks, true);
    } else if (rs === 1) {
      setMuted(devices, true);
      setMuted(r00, false);
      setMuted(meshNodes, true);
      setMuted(meshLinks, true);
      setMuted(nodeLinks, true);
    } else if (rs === 2) {
      setMuted(devices, true);
      setMuted(r00, false);
      setMuted(meshNodes, false);
      setMuted(meshLinks, false);
      setMuted(nodeLinks, true);
    } else if (rs === 3) {
      setMuted(devices, false);
      setMuted(r00, false);
      setMuted(meshNodes, false);
      setMuted(meshLinks, false);
      setMuted(nodeLinks, false);
    }

    document.getElementById("btn-prev").disabled = false;

    const descEl = document.getElementById("dynamic-band-desc");
    if (descEl && Array.isArray(STEPS[0].desc)) {
      descEl.innerHTML = STEPS[0].desc[rs];
    }
  },

  reset() {
    if (this.isPlaying) this.togglePlay();
    this._landOnStep(0, "first");
  },

  togglePlay() {
    const playBtn = document.getElementById("btn-play");
    if (this.isPlaying) {
      this.isPlaying = false;
      clearInterval(this.playTimer);
      playBtn.classList.remove("playing");
      playBtn.innerText = "▶ Play";
    } else {
      this.isPlaying = true;
      playBtn.classList.add("playing");
      playBtn.innerText = "⏸ Pause";
      this.playTimer = setInterval(() => {
        const values = STEPS[this.curStep].microValues;
        const acc = this._microAccessors();
        const idx = values.indexOf(acc.get());
        if (idx < values.length - 1) { acc.set(values[idx + 1]); return; }
        if (this.curStep < STEPS.length - 1) { this._landOnStep(this.curStep + 1, "first"); }
        else { this.togglePlay(); }
      }, 4000);
    }
  },

  setRouterLayout(layout) {
    this.routerLayout = layout;

    // Update live text description
    const descEl = document.getElementById("dynamic-band-desc");
    if (descEl && this.curStep === 1 && typeof STEPS[1].desc === 'object') {
      descEl.innerText = STEPS[1].desc[layout];
    }

    ["middle", "edge", "corner"].forEach(l => {
      const btn = document.getElementById(`btn-layout-${l}`);
      if (btn) {
        if (l === layout) btn.classList.add("active");
        else btn.classList.remove("active");
      }
      const grp = document.getElementById(`layout-${l}`);
      if (grp) grp.style.display = (l === layout) ? "block" : "none";
    });
  },

  setSlide3Topic(topic) {
    if (this.curStep !== 2) return;
    this.slide3Topic = topic;

    // Update buttons
    ["vcs", "credit", "flit"].forEach(t => {
      const btn = document.getElementById(`btn-topic-${t}`);
      if (btn) {
        if (t === topic) btn.classList.add("active");
        else btn.classList.remove("active");
      }
    });

    // Update bottom description
    const descEl = document.getElementById("dynamic-band-desc");
    if (descEl) {
      descEl.innerHTML = topic ? this.slide3Texts[topic] : this.slide3Texts.intro;
    }

    // Update SVG classes
    const svgEl = document.getElementById("slide3-svg");
    if (svgEl) {
      svgEl.setAttribute("class", "hw-svg" + (topic ? ` topic-${topic}-active` : ""));
    }
  },

  setSlide4Topic(topic) {
    if (this.curStep !== 3) return;
    this.slide4Topic = topic;

    // Update buttons
    ["links", "input", "pipe", "control", "flow"].forEach(t => {
      const btn = document.getElementById(`btn-topic4-${t}`);
      if (btn) {
        if (t === topic) btn.classList.add("active");
        else btn.classList.remove("active");
      }
    });

    // Update bottom description
    const descEl = document.getElementById("dynamic-band-desc");
    if (descEl) {
      descEl.innerHTML = topic ? this.slide4Texts[topic] : this.slide4Texts.intro;
    }

    // Update SVG classes
    const svgEl = document.getElementById("slide4-svg");
    if (svgEl) {
      svgEl.setAttribute("class", "hw-svg" + (topic ? ` topic4-${topic}-active` : ""));
    }
  },

  setSlide5Topic(topic) {
    if (this.curStep !== 4) return;
    this.slide5Topic = topic;

    // Update buttons
    ["step1", "step2", "step3", "step4", "step5", "step6", "step7", "step8", "step9"].forEach(t => {
      const btn = document.getElementById(`btn-topic5-${t}`);
      if (btn) {
        if (t === topic) btn.classList.add("active");
        else btn.classList.remove("active");
      }
    });

    // Update bottom description
    const descEl = document.getElementById("dynamic-band-desc");
    if (descEl) {
      descEl.innerHTML = topic ? this.slide5Texts[topic] : this.slide5Texts.intro;
    }

    // Update SVG classes
    const svgEl = document.getElementById("slide5-svg");
    if (svgEl) {
      svgEl.setAttribute("class", "hw-svg" + (topic ? ` topic5-${topic}-active` : ""));
    }
  },

  setSlide6Topic(topic) {
    this.slide6Topic = topic;
    const vals = STEPS[5].microValues;
    const curIdx = vals.indexOf(topic);

    // Update buttons
    vals.forEach(t => {
      if (!t) return;
      const btn = document.getElementById(`btn-topic6-${t}`);
      if (btn) btn.classList.toggle("active", t === topic);
    });

    // Handle tree activation (dimmed -> active) and cumulative node highlighting
    const arbTree = document.getElementById("arbiter-tree");
    const arbRR = document.getElementById("arbiter-rr");
    const allocTree = document.getElementById("allocator-tree");
    const allocSparse = document.getElementById("alloc-sparse");
    const allocSep = document.getElementById("alloc-separable");
    const allocSepIn = document.getElementById("alloc-sep-in");

    if (arbTree) arbTree.classList.toggle("tree-dimmed", curIdx < vals.indexOf("arbiter_active"));
    if (arbRR) arbRR.className = "tree-leaf arb-node" + (curIdx >= vals.indexOf("arbiter_rr") ? " node-active-green" : "");

    if (allocTree) allocTree.classList.toggle("tree-dimmed", curIdx < vals.indexOf("allocator_active"));
    if (allocSparse) allocSparse.className = "tree-leaf alloc-node" + (curIdx >= vals.indexOf("allocator_sparse") ? " node-active-green" : "");
    if (allocSep) allocSep.className = "tree-leaf alloc-node" + (curIdx >= vals.indexOf("allocator_separable") ? " node-active-green" : "");
    if (allocSepIn) allocSepIn.className = "tree-leaf alloc-node" + (curIdx >= vals.indexOf("allocator_sep_in") ? " node-active-green" : "");

    // Update bottom description
    const descEl = document.getElementById("dynamic-band-desc");
    if (descEl) {
      descEl.innerHTML = topic ? this.slide6Texts[topic] : this.slide6Texts.intro;
    }
  },

  setAllocMode(mode) {
    this.allocMode = mode;
    ["dense", "sparse", "sep"].forEach(m => {
      const btn = document.getElementById(`btn-alloc-${m}`);
      if (btn) btn.classList.toggle("active", m === mode);
    });

    const descSec = document.getElementById("alloc-desc-sec");
    if (!descSec) return;

    if (mode === "dense") {
      descSec.innerHTML = `
        <div class="det-lbl">Dense Allocator (64x64)</div>
        <p style="font-size:.74rem; color:var(--muted); line-height:1.4;">
          Stores complete crossbar request matrix across all input Virtual Channels and output ports. Ensures total conflict resolution.
        </p>
      `;
    } else if (mode === "sparse") {
      descSec.innerHTML = `
        <div class="det-lbl">Sparse Allocator</div>
        <p style="font-size:.74rem; color:var(--muted); line-height:1.4;">
          Filters empty request entries and stores active flit requests only. Highly optimized for timing efficiency and reduced area.
        </p>
      `;
    } else if (mode === "sep") {
      descSec.innerHTML = `
        <div class="det-lbl">Separable Allocator (2-Stage)</div>
        <p style="font-size:.74rem; color:var(--muted); line-height:1.4;">
          Decouples arbitration into 2 consecutive stages: Stage 1 arbitrates across input requests; Stage 2 arbitrates across output grants.
        </p>
      `;
    }

    // Update matrix grid highlights
    document.querySelectorAll(".alloc-cell").forEach((cell, idx) => {
      cell.classList.remove("active", "grant");
      if (mode === "dense") {
        if (idx % 3 === 0 || idx % 7 === 0) cell.classList.add("active");
        if (idx === 8 || idx === 20) cell.classList.add("grant");
      } else if (mode === "sparse") {
        if (idx === 2 || idx === 10 || idx === 18) cell.classList.add("active");
        if (idx === 10) cell.classList.add("grant");
      } else {
        if (idx < 6 || idx > 20) cell.classList.add("active");
        if (idx === 4 || idx === 22) cell.classList.add("grant");
      }
    });
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
    });
  }
};

const Landing = {
  show() {
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
