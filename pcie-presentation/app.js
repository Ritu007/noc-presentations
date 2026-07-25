/* ================================================================
   PCIe & RN-I BRIDGE PRESENTATION ENGINE
   Content sourced from "Copy of 07072026 (2).pptx" (5 slides after merge):
   PCIe fundamentals, device hierarchy off the CHI mesh, RN-F vs
   RN-I comparison, and the RN-I bridge's full 11-step pipeline.
================================================================ */

const STEPS = [
  /* ─────────────────────────────────────────────────────────────
     PAGE 1 — PCIe Overview & Evolution
  ───────────────────────────────────────────────────────────── */
  {
    num: 1,
    name: "PCIe Overview & Evolution",
    badge: "PCIe Fundamentals",
    badgeClass: "c-blue",
    viewId: "view-0",
    desc: "PCI Express (PCIe) replaces the legacy PCI/PCI-X shared parallel bus with a scalable, point-to-point serial interconnect built from independent lanes and full-duplex links — organized into three protocol layers that mirror the layered thinking already used across the CHI-based NoC.",
    meta: [
      { lbl: "Interface Type", val: "Point-to-Point Serial" },
      { lbl: "Lane Configs", val: "x1, x2, x4, x8, x16" },
      { lbl: "Duplex Mode", val: "Full Duplex (independent TX/RX)" },
      { lbl: "Protocol Layers", val: "Transaction → Data Link → Physical" }
    ],
    topics: {
      /* Introduction — 5 sub-topics */
      intro_serial: "<strong>Point-to-Point Serial Interface:</strong> Replaces legacy PCI/PCI-X shared parallel buses to reduce pin count and simplify routing.",
      intro_targets: "<strong>Target Applications:</strong> High-performance devices like GPUs, NVMe SSDs, and Network cards, etc. ",
      intro_lanes: "<strong>Lane Configurations:</strong> Scalable lanes (x1, x2, x4, x8, x16) — higher lane count yields higher bandwidth.",
      intro_duplex: "<strong>Full Duplex Operation:</strong> Independent TX and RX lines allow concurrent bidirectional data flow.",
      intro_perf: "<strong>Key Advantages:</strong> High bandwidth, extremely low latency, and superior power efficiency.",
      /* Physical diagram */
      physical: "<strong>Physical Interface — PCI vs PCIe:</strong>",
      /* Layered Architecture — 3 sub-topics */
      layer_txn: "<strong>Transaction Layer:</strong>Generates request/completion packets (TLPs) and handles transaction ordering.",
      layer_dl: "<strong>Data Link Layer:</strong> Ensures reliable data transfer via ACK/NAK protocols and link management.",
      layer_phy: "<strong>Physical Layer:</strong> Converts parallel data to serial format; drives data over physical differential lanes."
    },
    topicOrder: [null, "intro_serial", "intro_targets", "intro_lanes", "intro_duplex", "intro_perf", "physical", "layer_txn", "layer_dl", "layer_phy"],
    details: `
      <div class="det-sec">
        <div class="det-lbl">Introduction</div>
        <div class="opt-btn-group">
          <button class="opt-btn" id="btn-topic-intro_serial"  onclick="App.setTopic('intro_serial')">Point-to-Point Serial Interface</button>
          <button class="opt-btn" id="btn-topic-intro_targets" onclick="App.setTopic('intro_targets')">Target Applications</button>
          <button class="opt-btn" id="btn-topic-intro_lanes"   onclick="App.setTopic('intro_lanes')">Lane Configurations</button>
          <button class="opt-btn" id="btn-topic-intro_duplex"  onclick="App.setTopic('intro_duplex')">Full Duplex Operation</button>
          <button class="opt-btn" id="btn-topic-intro_perf"    onclick="App.setTopic('intro_perf')">Key Advantages</button>
        </div>
      </div>
      <div class="det-sec">
        <div class="det-lbl">Physical Interface Diagram</div>
        <div class="opt-btn-group">
          <button class="opt-btn" id="btn-topic-physical" onclick="App.setTopic('physical')">PCI vs PCIe Architecture</button>
        </div>
      </div>
      <div class="det-sec">
        <div class="det-lbl">Layered Architecture</div>
        <div class="opt-btn-group">
          <button class="opt-btn" id="btn-topic-layer_txn" onclick="App.setTopic('layer_txn')">Transaction Layer</button>
          <button class="opt-btn" id="btn-topic-layer_dl"  onclick="App.setTopic('layer_dl')">Data Link Layer</button>
          <button class="opt-btn" id="btn-topic-layer_phy" onclick="App.setTopic('layer_phy')">Physical Layer</button>
        </div>
      </div>
    `
  },

  /* ─────────────────────────────────────────────────────────────
     PAGE 2 — PCIe Hierarchy & Operations
  ───────────────────────────────────────────────────────────── */
  {
    num: 2,
    name: "PCIe Hierarchy & Operations",
    badge: "Device Topology",
    badgeClass: "c-cyan",
    viewId: "view-1",
    desc: "The PCIe device tree hangs off the CHI mesh through a single RN-I bridge node: a Root Complex fans out over dedicated PCIe links to switches, bridges, and endpoints, while every lane is a differential TX/RX pair whose count directly scales available bandwidth.",
    meta: [
      { lbl: "Hierarchy Root", val: "Root Complex (RC)" },
      { lbl: "Fabric Elements", val: "Root Port, Switch, Bridge, Endpoint" },
      { lbl: "Lane Aggregation", val: "x1 → x16 (linear scaling)" },
      { lbl: "Bridges Into", val: "CHI Mesh via RN-I" }
    ],
    topics: {
      /* Topology diagram */
      tree: "<strong>PCIe Tree Topology:</strong> The CPU cluster's CHI routers (R00/R01/R10/R11) expose one RN-I node, which drives a Root Complex (RC). The RC fans out over independent PCIe Links to a PCIe Switch (serving a GPU endpoint, an NVMe/NIC endpoint, and a legacy PCIe endpoint) and, in parallel, to a PCIe-to-PCI/PCI-X Bridge carrying two legacy PCI devices.",
      /* Key Components — 4 sub-topics */
      comp_rc: "<strong>Root Complex (RC):</strong> Starting point of the hierarchy. Connects CPU/memory subsystem to PCIe, generates transactions, and manages boot configuration.",
      comp_rp: "<strong>Root Port (RP):</strong> A Root Port is the host-side PCIe interface that connects the CPU and memory to PCIe devices. It transfers PCIe requests and responses between them.",
      comp_sw: "<strong>Switches & Bridges:</strong> Switches act as fan-out logical PCI-to-PCI bridges to connect multiple devices. Bridges interface to legacy buses (PCI/PCI-X, Ethernet, USB).",
      comp_ep: "<strong>Endpoints:</strong> Peripheral devices (Requesters or Completers) at branch tips with a single upstream port.",
      /* PCIe Lane Mechanics — 3 sub-topics */
      lane_pair: "<strong>Differential Pair:</strong> A single PCIe lane consists of 1 Transmit (TX) differential pair and 1 Receive (RX) differential pair — enabling full-duplex simultaneous bidirectional transfer on just 4 wires per lane.",
      lane_agg: "<strong>Lane Aggregation (x1–x16):</strong> Combining multiple lanes linearly scales bandwidth. Example: PCIe 4.0 x1 ≈ 2 GB/s; x16 ≈ 32 GB/s. High-demand devices like NVMe SSDs (x4) and GPUs (x16) exploit this to achieve their rated peak throughputs.",
      lane_scale: "<strong>System Scalability:</strong> Total active high-speed devices depend directly on CPU and lane availability."
    },
    topicOrder: [null, "tree", "comp_rc", "comp_rp", "comp_sw", "comp_ep", "lane_pair", "lane_agg", "lane_scale"],
    noHighlightTopics: new Set(["tree", "lane_pair", "lane_agg", "lane_scale"]),
    details: `
      <div class="det-sec">
        <div class="det-lbl">Topology Diagram</div>
        <div class="opt-btn-group">
          <button class="opt-btn" id="btn-topic-tree" onclick="App.setTopic('tree')">PCIe Tree Topology</button>
        </div>
      </div>
      <div class="det-sec">
        <div class="det-lbl">Key Components</div>
        <div class="opt-btn-group">
          <button class="opt-btn" id="btn-topic-comp_rc" onclick="App.setTopic('comp_rc')">Root Complex (RC)</button>
          <button class="opt-btn" id="btn-topic-comp_rp" onclick="App.setTopic('comp_rp')">Root Port (RP)</button>
          <button class="opt-btn" id="btn-topic-comp_sw" onclick="App.setTopic('comp_sw')">Switches &amp; Bridges</button>
          <button class="opt-btn" id="btn-topic-comp_ep" onclick="App.setTopic('comp_ep')">Endpoints</button>
        </div>
      </div>
      <div class="det-sec">
        <div class="det-lbl">PCIe Lane Mechanics</div>
        <div class="opt-btn-group">
          <button class="opt-btn" id="btn-topic-lane_pair"  onclick="App.setTopic('lane_pair')">Differential Pair</button>
          <button class="opt-btn" id="btn-topic-lane_agg"   onclick="App.setTopic('lane_agg')">Lane Aggregation (x1–x16)</button>
          <button class="opt-btn" id="btn-topic-lane_scale" onclick="App.setTopic('lane_scale')">System Scalability</button>
        </div>
      </div>
    `
  },

  /* ─────────────────────────────────────────────────────────────
     PAGE 3 — Request Node Comparison: RN-F vs RN-I
  ───────────────────────────────────────────────────────────── */
  {
    num: 3,
    name: "Request Node Comparison: RN-F vs RN-I",
    badge: "Node Comparison",
    badgeClass: "c-purple",
    viewId: "view-2",
    desc: "In CHI interconnect topologies, Request Nodes (RN) generate transaction requests — the protocol differentiates between fully coherent CPU clusters (RN-F) and I/O bridge controllers (RN-I) across seven architectural axes.",
    meta: [
      { lbl: "Node Types Compared", val: "2 — RN-F, RN-I" },
      { lbl: "RN-F Connects", val: "CPU Cluster (Cache Subsystem)" },
      { lbl: "RN-I Connects", val: "I/O Subsystems (PCIe RC, DMA, Ethernet)" },
      { lbl: "Comparison Axes", val: "7" }
    ],
    topics: {
      rn_overview: "In System-on-Chip (SoC) interconnect topologies using the CHI protocol, <strong>Request Nodes (RN)</strong> generate all memory and I/O transaction requests. The protocol defines two types — <strong>RN-F</strong> (Fully Coherent) and <strong>RN-I</strong> (I/O) — that share the same request-generating role in the mesh but have fundamentally different internal behavior.",
      rn_rnf: "<strong>RN-F — Fully Coherent CPU Node:</strong> RN-F is attached to a CPU cluster with local L1/L2 caches. It generates native, fully-coherent CPU loads and stores, and issues cache operations (clean, invalidate, evict) to maintain coherence across the CHI mesh. It is a full participant in the coherence domain.",
      rn_rni: "<strong>RN-I — I/O Bridge Controller:</strong> RN-I has no local cache. It bridges external I/O subsystems (PCIe Root Complex, DMA engines, Ethernet controllers) into the CHI mesh — translating external protocol frames (e.g., PCIe TLPs) into CHI request flits. It supports coherent or non-coherent I/O without ever issuing cache operations itself.",
      table: "<strong>Architectural Difference Matrix:</strong> The 7-row comparison covers: Full Name, Connected Device, Local Cache, Cache Coherency, CHI Request Generation, Typical Transactions, and Cache Operations — showing how RN-F and RN-I serve fundamentally different roles despite both being Request Nodes."
    },
    topicOrder: [null, "rn_overview", "rn_rnf", "rn_rni", "table"],
    details: `
      <div class="det-sec">
        <div class="det-lbl">Focus a Topic</div>
        <div class="opt-btn-group">
          <button class="opt-btn" id="btn-topic-rn_overview" onclick="App.setTopic('rn_overview')">CHI Request Node Types</button>
          <button class="opt-btn" id="btn-topic-rn_rnf"      onclick="App.setTopic('rn_rnf')">RN-F: Fully Coherent CPU Node</button>
          <button class="opt-btn" id="btn-topic-rn_rni"      onclick="App.setTopic('rn_rni')">RN-I: I/O Bridge Controller</button>
          <button class="opt-btn" id="btn-topic-table"       onclick="App.setTopic('table')">Architectural Comparison Table</button>
        </div>
      </div>
    `
  },

  /* ─────────────────────────────────────────────────────────────
     PAGE 4 — RN-I Bridge: Full Request-Response Pipeline (MERGED)
     Inbound steps 1–6 + Outbound steps 7–11 on one page.
     phase_in / phase_out topics trigger the SVG tab swap via
     _syncSvgPhase(); all step topics dim the correct SVG elements.
  ───────────────────────────────────────────────────────────── */
  {
    num: 4,
    name: "RN-I Bridge: Full Request-Response Pipeline",
    badge: "Bridge Pipeline",
    badgeClass: "c-orange",
    viewId: "view-3",
    desc: "The RN-I bridge handles an 11-step round-trip: an inbound PCIe request (Steps 1–6) is captured, decoded, address-translated, logged, and injected into the CHI mesh; the return CHI response (Steps 7–11) is depacketized, matched, synthesized, and serialized back as a PCIe completion TLP.",
    meta: [
      { lbl: "Total Steps", val: "11 (Steps 1–11)" },
      { lbl: "Inbound Phase", val: "Steps 1–6  (TLP → CHI REQ flit)" },
      { lbl: "Outbound Phase", val: "Steps 7–11 (CHI RSP → Completion TLP)" },
      { lbl: "Bridge Role", val: "Protocol & Address Translation" }
    ],
    topics: {
      /* Phase intro topics — no diagram visual, so nothing dims */
      phase_in: "<strong>Inbound Request Phase (Steps 1–6):</strong> A PCIe TLP from an external device crosses the RN-I bridge's inbound path — captured off the PCIe RX link, decoded, address-translated, logged in the inbound tracker, then packetized into a CHI REQ flit and injected into the local mesh router.",
      phase_out: "<strong>Outbound Response Phase (Steps 7–11):</strong> The CHI response returns from the mesh. The RN-I bridge depacketizes it, matches it against the outbound tracker, synthesizes PCIe completion metadata, and serializes the result back to the originating PCIe device as a Completion TLP.",
      /* Inbound steps */
      step1: "<strong>Step 1 — TLP Injection:</strong> External PCIe Device initiates transaction over physical PCIe RX Link.",
      step2: "<strong>Step 2 — Capture &amp; Buffer (PCIe RX Port):</strong> Validates CRC/errors and queues TLP to absorb clock-domain mismatches.",
      step3: "<strong>Step 3 — Protocol Conversion &amp; Address Mapping:</strong> Decode TLP Header: Strips framing, parses command & payload. Address Translation: Maps PCIe virtual address to physical address.",
      step4: "<strong>Step 4 — State Logging (Inbound Tracker Allocation):</strong> Assigns a unique internal Transaction ID and queues the transaction details.",
      step56: "<strong>Steps 5 &amp; 6 — Packetization &amp; Network Injection:</strong> Packetizes transaction into CHI REQ/DAT flits; injects into Local Mesh Router node.",
      /* Outbound steps */
      step7: "<strong>Step 7 — Response Capture (CHI RX Interface):</strong> Local Mesh Router delivers response flits to CHI RX Interface for depacketization (RSP/DAT).",
      step8: "<strong>Step 8 — State Match &amp; Free (Outbound Tracker):</strong> Performs Lookup &amp; Free using Synced Queue; matches incoming transaction ID and frees tracker slot.",
      step9: "<strong>Step 9 — TLP Synthesis (Response Processing):</strong> Combines retrieved PCIe metadata with incoming payload data to synthesize a standard PCIe message block.",
      step1011: "<strong>Steps 10 &amp; 11 — Serialization &amp; Completion Return:</strong> PCIe TX Port: Appends headers, sequence numbers, and LCRC. PCIe TX Link: Serializes Completion TLP back to target PCIe device."
    },
    topicOrder: [null, "phase_in", "step1", "step2", "step3", "step4", "step56", "phase_out", "step7", "step8", "step9", "step1011"],
    details: `
      <div class="det-sec">
        <div class="det-lbl">▶ Inbound Path (Steps 1–6)</div>
        <div class="opt-btn-group">
          <button class="opt-btn" id="btn-topic-phase_in" onclick="App.setTopic('phase_in')">Phase Overview</button>
          <button class="opt-btn" id="btn-topic-step1"   onclick="App.setTopic('step1')">Step 1: TLP Injection</button>
          <button class="opt-btn" id="btn-topic-step2"   onclick="App.setTopic('step2')">Step 2: Capture &amp; Buffer</button>
          <button class="opt-btn" id="btn-topic-step3"   onclick="App.setTopic('step3')">Step 3: Protocol Conversion &amp; Address Mapping</button>
          <button class="opt-btn" id="btn-topic-step4"   onclick="App.setTopic('step4')">Step 4: State Logging</button>
          <button class="opt-btn" id="btn-topic-step56"  onclick="App.setTopic('step56')">Steps 5 &amp; 6: Packetization &amp; Injection</button>
        </div>
      </div>
      <div class="det-sec">
        <div class="det-lbl">◀ Outbound Path (Steps 7–11)</div>
        <div class="opt-btn-group">
          <button class="opt-btn" id="btn-topic-phase_out"  onclick="App.setTopic('phase_out')">Phase Overview</button>
          <button class="opt-btn" id="btn-topic-step7"      onclick="App.setTopic('step7')">Step 7: Response Capture</button>
          <button class="opt-btn" id="btn-topic-step8"      onclick="App.setTopic('step8')">Step 8: State Match &amp; Free</button>
          <button class="opt-btn" id="btn-topic-step9"      onclick="App.setTopic('step9')">Step 9: TLP Synthesis</button>
          <button class="opt-btn" id="btn-topic-step1011"   onclick="App.setTopic('step1011')">Steps 10 &amp; 11: Serialization &amp; Return</button>
        </div>
      </div>
    `
  },

  /* ─────────────────────────────────────────────────────────────
     PAGE 5 — Address Translation & Ordering Enforcement
  ───────────────────────────────────────────────────────────── */
  {
    num: 5,
    name: "Address Translation & Ordering Enforcement",
    badge: "Bridge Semantics",
    badgeClass: "c-pink",
    viewId: "view-4",
    desc: "Two RN-I responsibilities keep a PCIe device honest about an out-of-order CHI mesh: translating PCIe's own address space into system physical addresses, and re-imposing PCIe's ordering rules on completions that the CHI-based CMN-700 interconnect may have executed out of order.",
    meta: [
      { lbl: "Address Spaces", val: "PCIe Bus Addr ↔ System Physical Addr" },
      { lbl: "Translation Aid", val: "IOMMU / Address Translation Table" },
      { lbl: "Ordering Model", val: "PCIe order over an out-of-order mesh" },
      { lbl: "Goal", val: "Correctness without losing parallelism" }
    ],
    topics: {
      translation: "<strong>Address Translation Support:</strong> PCIe devices send memory requests using their own address space (a PCIe bus address or I/O Virtual Address) — not the actual system memory address. The CHI-based NoC and system memory instead use System Physical Addresses, so they cannot directly understand the address sent by the PCIe device. RN-I checks the incoming address and, if required, works with the IOMMU or an address translation table to find the corresponding System Physical Address, which is inserted into the CHI request — ensuring it is routed to the correct destination within the CHI-based NoC.",
      ordering: "<strong>Ordering Enforcement:</strong> Ensures that PCIe devices observe transactions in the correct protocol-defined order, even though the CHI-based CMN-700 interconnect may execute and complete them out of order. RN-I does this by tracking outstanding PCIe requests, understanding which requests have ordering dependencies, translating requests into CHI transactions, delaying the issue of dependent requests or holding responses/completions when necessary, and delivering PCIe completions only when doing so preserves the required PCIe ordering semantics."
    },
    topicOrder: [null, "translation", "ordering"],
    details: `
      <div class="det-sec">
        <div class="det-lbl">Focus a Topic</div>
        <div class="opt-btn-group">
          <button class="opt-btn" id="btn-topic-translation" onclick="App.setTopic('translation')">Address Translation Support</button>
          <button class="opt-btn" id="btn-topic-ordering"    onclick="App.setTopic('ordering')">Ordering Enforcement</button>
        </div>
      </div>
    `
  }
];

/* Neighbors in the master presentation sequence */
const PREV_DECK_URL = "../verification-presentation/index.html?end=1";
const NEXT_DECK_URL = "../timeline-presentation/index.html";

/* Outbound topics that trigger showing the outbound SVG on page 4 */
const OUTBOUND_TOPICS = new Set(["phase_out", "step7", "step8", "step9", "step1011"]);

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
    this._syncSvgPhase();

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

  /* Generic focus/dim mechanism — canvas elements opt in via
     class="focusable" data-topic="key". If the active topic has no
     corresponding focusable element, nothing is dimmed so the whole
     diagram stays fully lit (e.g. text-only intro topics). */
  setTopic(key) {
    this.topicByStep[this.curStep] = key;
    this._paintTopic();
    this._syncSvgPhase();

    const step = STEPS[this.curStep];
    const topic = this.topicByStep[this.curStep];
    const descEl = document.getElementById("dynamic-band-desc");
    if (descEl) descEl.innerHTML = (topic && step.topics) ? step.topics[topic] : step.desc;

    this._syncTopicButtons();
  },

  _paintTopic() {
    const topic = this.topicByStep[this.curStep];
    const step = STEPS[this.curStep];
    const view = document.getElementById(step.viewId);
    if (!view) return;
    const focusables = view.querySelectorAll(".focusable");
    // Some topics are informational only — don't dim or highlight anything
    const skipHighlight = !topic || (step.noHighlightTopics && step.noHighlightTopics.has(topic));
    const topicHasVisual = !skipHighlight && Array.from(focusables).some(el => (el.dataset.topic || "").split(" ").includes(topic));
    focusables.forEach(el => {
      const elTopics = (el.dataset.topic || "").split(" ");
      const isMatch = elTopics.includes(topic);
      el.classList.toggle("dimmed", topicHasVisual && !isMatch);
      el.classList.toggle("lit", topicHasVisual && isMatch);
      if (skipHighlight) { el.classList.remove("dimmed"); el.classList.remove("lit"); }
    });

    if (step.viewId === "view-3") {
      this._applyBridgeAnimation(topic);
    }
  },

  _applyBridgeAnimation(topic) {
    const BOX_POS = {
      ext: { id: "box-ext", cx: 90, cy: 230 },
      rx: { id: "box-rx", cx: 295, cy: 95 },
      req: { id: "box-req", cx: 475, cy: 95 },
      chitx: { id: "box-chitx", cx: 637, cy: 95 },
      ibt: { id: "box-ibt", cx: 475, cy: 172 },
      obt: { id: "box-obt", cx: 475, cy: 244 },
      resp: { id: "box-resp", cx: 475, cy: 321 },
      chirx: { id: "box-chirx", cx: 637, cy: 321 },
      tx: { id: "box-tx", cx: 295, cy: 321 },
      mesh: { id: "box-mesh", cx: 810, cy: 230 }
    };

    const ANIM_STEPS = {
      step1: { boxAct: ["ext"], tokenTo: "ext", tokenKind: "pcie", tokenLabel: "TLP" },
      step2: { boxAct: ["rx"], tokenTo: "rx", tokenKind: "pcie", tokenLabel: "TLP" },
      step3: { boxAct: ["req"], tokenTo: "req", tokenKind: "pcie", tokenLabel: "TLP" },
      step4: { boxAct: ["req", "ibt"], sigAct: ["sig-alloc"], tokenTo: "req", tokenKind: "pcie", tokenLabel: "TLP" },
      step56: { boxAct: ["chitx", "mesh"], tokenTo: "mesh", tokenKind: "chi", tokenLabel: "REQ" },
      step7: { boxAct: ["mesh", "chirx"], tokenTo: "chirx", tokenKind: "chi", tokenLabel: "RSP" },
      step8: { boxAct: ["chirx", "obt", "ibt"], sigAct: ["sig-sync"], tokenTo: "obt", tokenKind: "chi", tokenLabel: "RSP" },
      step9: { boxAct: ["obt", "resp"], sigAct: ["sig-free"], tokenTo: "resp", tokenKind: "pcie", tokenLabel: "TLP" },
      step1011: { boxAct: ["resp", "tx", "ext"], tokenTo: "ext", tokenKind: "pcie", tokenLabel: "TLP" }
    };

    // Reset all
    Object.values(BOX_POS).forEach(b => {
      const el = document.getElementById(b.id);
      if (el) {
        const rect = el.querySelector("rect");
        if (rect) rect.classList.remove("act", "act-chi");
      }
    });
    ["sig-alloc", "sig-sync", "sig-free"].forEach(id => {
      const el = document.getElementById(id);
      const lbl = document.getElementById(id + "-lbl");
      if (el) el.classList.remove("active");
      if (lbl) lbl.classList.remove("active");
    });

    const token = document.getElementById("pcie-token");
    if (!token) return;

    if (!topic || topic === "phase_in" || topic === "phase_out") {
      token.classList.remove("show");
      return;
    }

    const s = ANIM_STEPS[topic];
    if (!s) return;

    s.boxAct.forEach(key => {
      const box = BOX_POS[key];
      const el = document.getElementById(box.id);
      if (el) {
        const rect = el.querySelector("rect");
        if (rect) rect.classList.add(s.tokenKind === "chi" ? "act-chi" : "act");
      }
    });

    (s.sigAct || []).forEach(id => {
      const el = document.getElementById(id);
      const lbl = document.getElementById(id + "-lbl");
      if (el) el.classList.add("active");
      if (lbl) lbl.classList.add("active");
    });

    token.classList.toggle("is-chi", s.tokenKind === "chi");
    const tokenLabel = document.getElementById("pcie-token-label");
    if (tokenLabel) tokenLabel.textContent = s.tokenLabel;

    const dest = BOX_POS[s.tokenTo];
    if (topic === "step1") {
      token.style.transition = "none";
      token.setAttribute("transform", `translate(${dest.cx - 35},${dest.cy - 11})`);
      token.classList.add("show");
      void token.offsetWidth;
      token.style.transition = "";
    } else {
      token.classList.add("show");
      token.setAttribute("transform", `translate(${dest.cx - 35},${dest.cy - 11})`);
    }
  },

  /* Kept for any other page 4 logic, though we removed tabs and double SVG */
  _syncSvgPhase() {
    const step = STEPS[this.curStep];
    if (!step || step.viewId !== "view-3") return;
    const topic = this.topicByStep[this.curStep];
    const isOut = !!(topic && OUTBOUND_TOPICS.has(topic));
  },

  _syncTopicButtons() {
    const topic = this.topicByStep[this.curStep];
    document.querySelectorAll("#details-body .opt-btn[id^='btn-topic-']").forEach(btn => {
      const key = btn.id.replace("btn-topic-", "");
      btn.classList.toggle("active", key === topic);
    });
  },

  /* Jump to page stepIdx, landing at a specific topicOrder position. */
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

  goToPage(idx) { this._landOnStep(idx, "first"); },

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
