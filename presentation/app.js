/* ================================================================
   CHI NOC FLIT LIFECYCLE — app.js (Dual-Mode View Separation)
   All data sourced directly from flit-lifecycle.md & 07072026.pptx
================================================================ */

/* ──────────────────────────────────────────────────────────────
   STAGE & SUB-STEP DATA  (6 stages with granular sub-steps)
────────────────────────────────────────────────────────────── */
const STAGES = [

  /* ─── 0: FLIT CREATION ────────────────────────────────────────── */
  {
    id: 0, name: "Flit Creation",
    color: "var(--col-cyan)", hex: "#0284c7", icon: "⬡",
    module: "TrafficManager Module (Node N₀)",
    overview: "TrafficManager evaluates traffic generation per node and creates packet flits from a memory-efficient recycling pool.",
    summary: [
      { lbl: "Module", val: "TrafficManager" },
      { lbl: "Key Function", val: "_GeneratePacket()" },
      { lbl: "Target Queue", val: "_partial_packets" },
      { lbl: "Timestamp", val: "creation_time = t" }
    ],
    subSteps: [
      {
        subnum: "1.1", subname: "Inject Trigger",
        title: "Event Scheduler Trigger",
        desc: "Event scheduler calls <code>TrafficManager::_Inject(t)</code> for active source nodes per cycle.",
        moduleState: { injectProc: "idle", trafficPattern: "idle", poolCount: 64, signal: null },
        net: { srcNode: "n0", showFlitCard: false, showInspector: false }
      },
      {
        subnum: "1.2", subname: "Injection Test",
        title: "Query InjectionProcess Module",
        desc: "<code>_IssuePacket()</code> queries external <code>InjectionProcess</code> module (Bernoulli / OnOff). Evaluates & returns <code>bool: true</code>.",
        moduleState: { injectProc: "act", trafficPattern: "idle", poolCount: 64, signal: "ip" },
        net: { srcNode: "n0", showFlitCard: false, showInspector: false }
      },
      {
        subnum: "1.3", subname: "Select Destination",
        title: "Query TrafficPattern Module",
        desc: "TM queries external <code>TrafficPattern</code> module (e.g. UniformRandom). Computes & returns <code>dst_node = N1</code>.",
        moduleState: { injectProc: "done", trafficPattern: "act", poolCount: 64, signal: "tp" },
        net: { srcNode: "n0", dstNode: "n1", showFlitCard: false, showInspector: false }
      },
      {
        subnum: "1.4", subname: "Generate Packet",
        title: "Acquire Flit & Stamp Fields",
        desc: "Acquires flit from <code>RecyclingPool</code>. Stamped with fields: <code>id=0</code>, <code>type=REQ</code>, <code>src=0</code>, <code>dst=1</code>, <code>creation_time=T</code>, <code>head=1</code>, <code>tail=1</code>.",
        moduleState: { injectProc: "done", trafficPattern: "done", poolCount: 63, signal: "pool" },
        net: { srcNode: "n0", dstNode: "n1", showFlitCard: true, cardPos: { x: 120, y: 170 }, showInspector: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", vc: 0 } }
      },
      {
        subnum: "1.5", subname: "Queue in TM",
        title: "Enqueue to Partial Packet Queue",
        desc: "Flit Data Card slides into <code>_partial_packets[0][REQ]</code> queue slot inside TrafficManager & registered in <code>_total_in_flight</code> list.",
        moduleState: { injectProc: "idle", trafficPattern: "idle", poolCount: 63, signal: null },
        net: { srcNode: "n0", dstNode: "n1", showFlitCard: false, partialQueueFilled: true, showInspector: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", vc: 0 } }
      }
    ]
  },

  /* ─── 1: FLIT INJECTION ───────────────────────────────────────── */
  {
    id: 1, name: "Flit Injection",
    color: "var(--col-blue)", hex: "#2563eb", icon: "↑",
    module: "TrafficManager → LocalLink",
    overview: "TrafficManager dequeues flits and injects them into the network through the local link channel.",
    summary: [
      { lbl: "Module", val: "LocalLink" },
      { lbl: "Key Function", val: "ForwardFlits() / DeliverFlits()" },
      { lbl: "Target Queue", val: "_inject_queues → Attached Input Queue" },
      { lbl: "Timestamp", val: "itime = t | delivery_time = t+1" }
    ],
    subSteps: [
      {
        subnum: "2.1", subname: "Write Flits",
        title: "Dequeue & Stamp Injection Time",
        desc: "TM dequeues front flit from <code>_partial_packets</code> (TM queue slot 1 empties). Stamps injection timestamp <code>flit->itime = t</code> on Flit Inspector Card. Flit moves into LocalLink staging queue (<code>_inject_queues[REQ]</code>).",
        net: { srcNode: "n0", actRouter: "r00", showFlitCard: false, partialQueueFilled: false, injectQueueFilled: true, actLocalLink: true, showInspector: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", vc: 0 } }
      },
      {
        subnum: "2.2", subname: "Credit Check",
        title: "LocalLink Credit Verification",
        desc: "LocalLink verifies channel credit (<code>_inject_credits[REQ] > 0</code>). Flit remains staged in <code>_inject_queues</code> ready for wire injection.",
        net: { srcNode: "n0", actRouter: "r00", showFlitCard: false, partialQueueFilled: false, injectQueueFilled: true, actLocalLink: true, showInspector: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", vc: 0 } }
      },
      {
        subnum: "2.3", subname: "Forward Flits",
        title: "Set Delivery Time & Inject Wire",
        desc: "LocalLink sets <code>delivery_time = current_cycle + channel_latency</code> (stamped as <code>delivery_time: T+1</code> on Flit Inspector Card). Decrements credit & pushes flit into local wire channel.",
        net: { srcNode: "n0", actRouter: "r00", showFlitCard: true, cardPos: { x: 300, y: 210 }, partialQueueFilled: false, injectQueueFilled: false, localChannelFilled: true, actLocalLink: true, showInspector: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+1", vc: 0 } }
      },
      {
        subnum: "2.4", subname: "Deliver Flits",
        title: "Deliver to Attached Vertical Input Queue",
        desc: "At delivery cycle, flit badge traverses local wire channel into Router R00's <strong>attached vertical Input Queue (Port 4 LOCAL_0)</strong>.",
        net: { srcNode: "n0", actRouter: "r00", showFlitCard: true, cardPos: { x: 345, y: 172 }, partialQueueFilled: false, injectQueueFilled: false, routerVcFilled: true, actLocalLink: false, glowLink: "lk-n0", showInspector: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+1", vc: 0 } }
      }
    ]
  },

  /* ─── 2: ROUTER PIPELINE ──────────────────────────────────────── */
  {
    id: 2, name: "Router Pipeline",
    color: "var(--col-purple)", hex: "#7c3aed", icon: "⚙",
    module: "ChannelPipeline (R₀₀ Dedicated Architecture)",
    overview: "Each router channel runs an independent 5-stage pipeline (IQ → RC → VA → SA → ST) in Evaluate and Update phases.",
    summary: [
      { lbl: "Module", val: "ChannelPipeline" },
      { lbl: "Execution Phases", val: "Evaluate & Update" },
      { lbl: "Channels", val: "REQ, RSP, DAT, SNP" },
      { lbl: "Router Delay", val: "5 Cycles" }
    ],
    subSteps: [
      {
        subnum: "3.1", subname: "IQ — Input Queuing",
        title: "Stage 1: Input Queuing & VC Writing",
        desc: "Flit enters Router R00 core, is written into VC0 buffer, and placed in the routing queue.",
        microSteps: [
          {
            title: "Flit in Local Queue", desc: "Flit waits in attached <code>input_buffer[LOCAL_0]</code>.",
            net: { isPipelineView: true, pipeVcFilled: true, vcBufFilled: false, actStg: "iq", vcState: "idle", showInspector: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+1", vc: 0, state: "idle" } }
          },
          {
            title: "Write to VC Buffer", desc: "Flit is written into <code>VC0 Buffer</code> slot. State changes to <code>routing</code>.",
            net: { isPipelineView: true, pipeVcFilled: false, vcBufFilled: true, actStg: "iq", vcState: "routing", showInspector: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+1", vc: 0, state: "routing" } }
          },
          {
            title: "Move to _route_vcs", desc: "Flit pointer moves into <code>_route_vcs</code> queue awaiting route computation.",
            net: { isPipelineView: true, cardPos: { x: 187, y: 196 }, pipeVcFilled: false, vcBufFilled: true, actStg: "iq", vcState: "routing", showInspector: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+1", vc: 0, state: "routing" } }
          }
        ]
      },
      {
        subnum: "3.2", subname: "RC — Route Compute",
        title: "Stage 2: Route Compute Engine",
        desc: "Router determines the output port for the flit using the Routing Algorithm.",
        microSteps: [
          {
            title: "Query RoutingAlgorithm", desc: "Pulse query to external <code>RoutingAlgorithm</code> module (MeshXY). Computes output port <code>out_port = East</code>.",
            net: { isPipelineView: true, cardPos: { x: 187, y: 196 }, vcBufFilled: true, actStg: "rc", sigQuery: "rc", vcState: "routing", showInspector: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+1", vc: 0, state: "routing", out_port: "East" } }
          },
          {
            title: "Move to _vc_alloc_vcs", desc: "Route computed. Flit moves to <code>_vc_alloc_vcs</code> queue. State: <code>vc_alloc</code>.",
            net: { isPipelineView: true, cardPos: { x: 187, y: 276 }, vcBufFilled: true, actStg: "rc", vcState: "vc_alloc", showInspector: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+1", vc: 0, state: "vc_alloc", out_port: "East" } }
          }
        ]
      },
      {
        subnum: "3.3", subname: "VA — VC Allocation",
        title: "Stage 3: VC Allocation Engine",
        desc: "Router allocates a downstream VC for the computed output port.",
        microSteps: [
          {
            title: "Query VCAllocator", desc: "Pulse query to external <code>VCAllocator</code> module. Allocates downstream output VC on R01 (<code>out_vc = 0</code> granted).",
            net: { isPipelineView: true, cardPos: { x: 187, y: 276 }, vcBufFilled: true, actStg: "va", sigQuery: "va", vcState: "vc_alloc", showInspector: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+1", vc: 0, state: "vc_alloc", out_vc: 0 } }
          },
          {
            title: "Move to _sa_vcs", desc: "VC allocated. Flit moves to <code>_sa_vcs</code> queue. State: <code>active</code>.",
            net: { isPipelineView: true, cardPos: { x: 187, y: 356 }, vcBufFilled: true, actStg: "va", vcState: "active", showInspector: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+1", vc: 0, state: "active", out_vc: 0 } }
          }
        ]
      },
      {
        subnum: "3.4", subname: "SA — Switch Allocation",
        title: "Stage 4: Switch Allocation Engine",
        desc: "Router arbitrates for crossbar traversal.",
        microSteps: [
          {
            title: "Query SwitchAllocator", desc: "Pulse query to external <code>SwitchAllocator</code> module for crossbar traversal grant.",
            net: { isPipelineView: true, cardPos: { x: 187, y: 356 }, vcBufFilled: true, actStg: "sa", sigQuery: "sa", vcState: "active", showInspector: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+1", vc: 0, state: "active", out_vc: 0 } }
          },
          {
            title: "Move to _st_vcs", desc: "Grant received. Flit moves to <code>_st_vcs</code> queue awaiting traversal.",
            net: { isPipelineView: true, cardPos: { x: 187, y: 436 }, vcBufFilled: true, actStg: "sa", vcState: "active", showInspector: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+1", vc: 0, state: "active", out_vc: 0 } }
          }
        ]
      },
      {
        subnum: "3.5", subname: "ST — Switch Traversal",
        title: "Stage 5: Switch Traversal (ST)",
        desc: "Flit physically leaves the VC buffer and crosses the router fabric.",
        microSteps: [
          {
            title: "Traverse Crossbar", desc: "Flit leaves the VC0 buffer and traverses the crossbar fabric.",
            net: { isPipelineView: true, cardPos: { x: 380, y: 427 }, outputBufFilled: false, vcBufFilled: false, actStg: "st", vcState: "idle", showInspector: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+1", vc: 0, state: "active", out_vc: 0 } }
          },
          {
            title: "Enter Output Buffer", desc: "Flit enters <code>_output_buffer[East]</code>. Ready for inter-router transfer.",
            net: { isPipelineView: true, cardPos: { x: 636, y: 427 }, outputBufFilled: true, vcBufFilled: false, actStg: "st", vcState: "idle", showInspector: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+1", vc: 0, state: "active", out_vc: 0 } }
          }
        ]
      }
    ]
  },

  /* ─── 3: INTER-ROUTER TRANSFER ────────────────────────────────── */
  {
    id: 3, name: "Inter-Router Transfer",
    color: "var(--col-orange)", hex: "#ea580c", icon: "→",
    module: "NetworkFabric & CHILink",
    overview: "Flits transfer across inter-router links while credit returns flow in the reverse direction.",
    summary: [
      { lbl: "Module", val: "CHILink / NetworkFabric" },
      { lbl: "Forward Path", val: "FlitChannel" },
      { lbl: "Reverse Path", val: "CreditChannel" },
      { lbl: "Wire Delay", val: "flit_latency (1 cyc)" }
    ],
    subSteps: [
      {
        subnum: "4.1", subname: "Forward Flit",
        title: "Router Eject to CHILink",
        desc: "Router R00 <code>ForwardFlit()</code> removes flit from <code>_output_buffer</code> and pushes it to <code>CHILink H0</code> queue.",
        microSteps: [
          {
            title: "Flit in Output Buffer", desc: "Flit awaits transfer in the internal <code>_output_buffer</code>.",
            net: { srcNode: "n0", dstNode: "n1", actRouter: "r00", showFlitCard: true, cardPos: { x: 501, y: 172 }, showInspector: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", vc: 0 } }
          },
          {
            title: "Inject to Flit Channel Queue", desc: "Flit is injected into the external <code>Flit Channel Queue</code> on the link. Delivery timestamp (dtime) is set.",
            net: { srcNode: "n0", dstNode: "n1", actRouter: "r00", showFlitCard: true, cardPos: { x: 560, y: 193 }, showInspector: true, flitChannelFilled: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+1", vc: 0 } }
          }
        ]
      },
      {
        subnum: "4.2", subname: "Deliver Flit",
        title: "Link Traversal to R01",
        desc: "Flit traverses the horizontal link and is delivered to the input queue of the downstream router.",
        microSteps: [
          {
            title: "Traverse Horizontal Link", desc: "Flit traverses across the router-router link from Router R00 to R01.",
            net: { srcNode: "n0", dstNode: "n1", showFlitCard: true, cardPos: { x: 595, y: 193 }, showInspector: true, glowLink: "lk-h0", flitChannelFilled: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+1", vc: 0 } }
          },
          {
            title: "Enter R01 Input Queue", desc: "Flit arrives and snaps into the WEST Input Queue of Router R01.",
            net: { srcNode: "n0", dstNode: "n1", actRouter: "r01", showFlitCard: true, cardPos: { x: 612, y: 172 }, showInspector: true, glowLink: "lk-h0", fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+1", vc: 0 } }
          }
        ]
      }
    ]
  },

  /* ─── 4: FLIT EJECTION ────────────────────────────────────────── */
  {
    id: 4, name: "Flit Ejection",
    color: "var(--col-green)", hex: "#16a34a", icon: "↓",
    module: "LocalLink",
    overview: "Destination router ejects flit via the local link to the Traffic Manager's eject queue.",
    summary: [
      { lbl: "Module", val: "LocalLink" },
      { lbl: "Port", val: "LOCAL_0 (Port 4)" },
      { lbl: "Target Queue", val: "_eject_queues" },
      { lbl: "Timestamp", val: "atime = cycle" }
    ],
    subSteps: [
      {
        subnum: "5.1", subname: "Forward from Router",
        title: "Router Eject to LocalLink",
        desc: "Router R01 <code>ForwardFlit()</code> removes flit from its output buffer and pushes it to the <code>Eject Flit Channel</code>.",
        microSteps: [
          {
            title: "Flit in Output Buffer", desc: "Flit awaits transfer in the internal <code>_output_buffer</code> of R01.",
            net: { srcNode: "n0", dstNode: "n1", actRouter: "r01", showFlitCard: true, cardPos: { x: 774, y: 172 }, showInspector: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+1", vc: 0 } }
          },
          {
            title: "Inject to Eject Channel Queue", desc: "Flit is injected into the external <code>Eject Flit Channel</code>. Delivery timestamp (dtime) is set.",
            net: { srcNode: "n0", dstNode: "n1", actRouter: "r01", showFlitCard: true, cardPos: { x: 812, y: 196 }, showInspector: true, actLocalLink2: true, ejectChannelFilled: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+2", vc: 0 } }
          }
        ]
      },
      {
        subnum: "5.2", subname: "Deliver to TM",
        title: "Eject to Traffic Manager",
        desc: "Flit traverses the local link and is delivered into the destination node's <code>_eject_queues</code>.",
        microSteps: [
          {
            title: "Traverse Local Link", desc: "Flit traverses across local link towards the Traffic Manager.",
            net: { srcNode: "n0", dstNode: "n1", showFlitCard: true, cardPos: { x: 844, y: 196 }, showInspector: true, actLocalLink2: true, glowLink: "lk-n1", ejectChannelFilled: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+2", vc: 0 } }
          },
          {
            title: "Enter N1 Eject Queue", desc: "Flit arrives and snaps into the <code>_eject_queues</code> of Node N1. Arrival timestamp (atime) is recorded.",
            net: { srcNode: "n0", dstNode: "n1", showFlitCard: true, cardPos: { x: 855, y: 200 }, showInspector: true, glowLink: "lk-n1", ejectQueueFilled: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+2", atime: "T+2", vc: 0 } }
          }
        ]
      }
    ]
  },

  /* ─── 5: FLIT RETIREMENT ──────────────────────────────────────── */
  {
    id: 5, name: "Flit Retirement",
    color: "var(--col-pink)", hex: "#db2777", icon: "✓",
    module: "TrafficManager",
    overview: "TrafficManager collects delivered flits, records simulation latency stats, and manages replies.",
    summary: [
      { lbl: "Module", val: "TrafficManager" },
      { lbl: "Key Function", val: "_RetireFlit()" },
      { lbl: "Primary Metrics", val: "flat, nlat, plat, hops" },
      { lbl: "Completion", val: "_measured_in_flight empty" }
    ],
    subSteps: [
      {
        subnum: "6.1", subname: "Read Flit",
        title: "TM Collects Delivered Flit",
        desc: "TM reads delivered flits from LocalLink's <code>_eject_queues</code>.",
        microSteps: [
          {
            title: "Highlight Ejected Flit", desc: "The flit in the <code>_eject_queues</code> is highlighted as ReadFlit() processes it.",
            net: { dstNode: "n1", showFlitCard: true, cardPos: { x: 855, y: 200 }, highlightFlit: true, showInspector: true, ejectQueueFilled: true, trackingFilled: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+2", atime: "T+2", vc: 0 } }
          }
        ]
      },
      {
        subnum: "6.2", subname: "Retire Flit",
        title: "Erase from In-Flight List",
        desc: "Removes flit from <code>total_in_flight</code> and <code>measured_in_flight</code> tracking maps.",
        microSteps: [
          {
            title: "Clear Tracking Tokens", desc: "The tracking tokens are removed from the global tracking queues.",
            net: { dstNode: "n1", showFlitCard: true, cardPos: { x: 855, y: 200 }, showInspector: true, ejectQueueFilled: true, trackingFilled: false, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+2", atime: "T+2", vc: 0 } }
          }
        ]
      },
      {
        subnum: "6.3", subname: "Stats Calculation",
        title: "Record Latency & Hop Metrics",
        desc: "Calculates latency and hop counts and adds sample to stats.",
        microSteps: [
          {
            title: "Compute Latency", desc: "Calculates latency (<code>atime - itime</code>) and displays it on the Stats Calculator.",
            net: { dstNode: "n1", showFlitCard: true, cardPos: { x: 855, y: 200 }, showInspector: true, ejectQueueFilled: true, trackingFilled: false, showStats: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+2", atime: "T+2", vc: 0 } }
          }
        ]
      },
      {
        subnum: "6.4", subname: "Final Disposition",
        title: "Handle Payload",
        desc: "Because this is a REQ packet, it must wait for a data payload or response. It is queued into <code>replies_pending</code>.",
        microSteps: [
          {
            title: "Move to replies_pending", desc: "Flit is moved into the TM's internal <code>replies_pending</code> queue.",
            net: { dstNode: "n1", showFlitCard: true, cardPos: { x: 1051, y: 199 }, showInspector: true, ejectQueueFilled: false, trackingFilled: false, repliesQueueFilled: true, showStats: true, fields: { id: 0, type: "REQ", src: "Node N₀ (0)", dst: "Node N₁ (1)", time: "T", itime: "T", dtime: "T+2", atime: "T+2", vc: 0 } }
          }
        ]
      }
    ]
  }
];

const SVG = {
  routers: { r00: 'rt-r00', r01: 'rt-r01', r10: 'rt-r10', r11: 'rt-r11' },
  rLabels: { r00: 'rl-r00', r01: 'rl-r01', r10: 'rl-r10', r11: 'rl-r11' },
  nodes: { n0: 'nd-n0', n1: 'nd-n1', n2: 'nd-n2', n3: 'nd-n3' },
  nLabels: { n0: 'nl-n0', n1: 'nl-n1', n2: 'nl-n2', n3: 'nl-n3' },
  nSubs: { n0: 'ns-n0', n1: 'ns-n1' }
};

/* ================================================================
   STATE
================================================================ */
let _stage = 0;
let _subStep = 0;
let _microStep = 0;
let _playing = false;
let _timer = null;
let _credRAF = null;

/* Neighbors in the master presentation sequence */
const PREV_DECK_URL = "index.html?end=1";
const NEXT_DECK_URL = "router-pipeline.html?step=0";

/* ================================================================
   NAVIGATOR
================================================================ */
const Nav = {
  init() {
    const pips = document.getElementById('prog-pips');
    if (!pips) return;
    pips.innerHTML = '';
    for (let i = 0; i < 6; i++) {
      const d = document.createElement('div');
      d.className = 'pip'; d.id = `pip-${i}`;
      pips.appendChild(d);
    }
  },

  update(stageIdx, subIdx) {
    const stage = STAGES[stageIdx];
    const sub = stage.subSteps[subIdx];

    _el('hdr-num').textContent = stageIdx + 1;
    _el('hdr-subnum').textContent = subIdx + 1;
    _el('hdr-name').textContent = stage.name;
    const hBadge = _el('hdr-subname-badge');
    if (hBadge) hBadge.textContent = sub.subname;

    _el('prog-num').textContent = stageIdx + 1;
    const pSubnum = _el('prog-subnum'); if (pSubnum) pSubnum.textContent = subIdx + 1;
    const pName = _el('prog-name'); if (pName) pName.textContent = stage.name;
    const pSubname = _el('prog-subname'); if (pSubname) pSubname.textContent = sub.subname;

    for (let i = 0; i < 6; i++) {
      const p = _el(`pip-${i}`);
      if (p) p.className = 'pip' + (i < stageIdx ? ' done' : i === stageIdx ? ' cur' : '');
    }

    for (let i = 0; i < 6; i++) {
      const ni = _el(`nav-${i}`);
      if (!ni) continue;
      ni.classList.remove('active', 'done');
      if (i < stageIdx) ni.classList.add('done');
      if (i === stageIdx) ni.classList.add('active');
    }

    _el('btn-prev').disabled = false;
    const nb = _el('btn-next');
    const isLast = (stageIdx === 5 && subIdx === stage.subSteps.length - 1);
    nb.disabled = false;
    nb.textContent = isLast ? 'Next Deck ➔' : 'Next Step ➔';
  }
};

/* ================================================================
   NETWORK VIEW
================================================================ */
const NetView = {
  clear() {
    Object.values(SVG.routers).forEach(id => {
      const el = _el(id); if (el) el.className = id === 'rt-r00' || id === 'rt-r01' ? 'router-box focus' : 'router-box';
    });
    Object.values(SVG.rLabels).forEach(id => {
      const el = _el(id); if (el) el.className = 'svg-lbl router-lbl';
    });

    Object.values(SVG.nodes).forEach(id => {
      const el = _el(id); if (el) el.className = (id === 'nd-n0') ? 'tm-container-box' : 'node-circle';
    });
    Object.values(SVG.nLabels).forEach(id => {
      const el = _el(id); if (el) el.className = (id === 'nl-n0') ? 'svg-lbl tm-container-title' : 'svg-lbl node-lbl';
    });
    ['ns-n0', 'ns-n1'].forEach(id => {
      const el = _el(id); if (el) { el.className = (id === 'ns-n0') ? 'svg-lbl tm-container-sub' : 'svg-lbl node-sub'; }
    });

    const linkBases = {
      'lk-h0': 'net-link', 'lk-h1': 'net-link',
      'lk-v0': 'net-link', 'lk-v1': 'net-link',
      'lk-n0': 'net-link', 'lk-n1': 'net-link',
      'lk-n2': 'net-link local-link', 'lk-n3': 'net-link local-link'
    };
    Object.entries(linkBases).forEach(([id, base]) => {
      const el = _el(id); if (el) el.className = base;
    });

    // Reset module badges
    ['mod-inject-proc', 'mod-traffic-pattern', 'mod-recycling-pool'].forEach(id => {
      const el = _el(id); if (el) el.querySelector('.mod-box').setAttribute('class', 'mod-box');
    });

    const ipB = _el('mod-ip-badge'); if (ipB) ipB.setAttribute('class', 'mod-badge-idle');
    const ipBT = _el('mod-ip-badge-txt'); if (ipBT) { ipBT.setAttribute('class', 'mod-badge-txt'); ipBT.textContent = 'Test() idle'; }

    const tpB = _el('mod-tp-badge'); if (tpB) tpB.setAttribute('class', 'mod-badge-idle');
    const tpBT = _el('mod-tp-badge-txt'); if (tpBT) { tpBT.setAttribute('class', 'mod-badge-txt'); tpBT.textContent = 'Dest() idle'; }

    ['sig-arrow-ip', 'sig-arrow-tp', 'sig-arrow-pool'].forEach(id => {
      const el = _el(id); if (el) el.setAttribute('opacity', '0');
    });

    // Reset Stage 3 Helper Modules & Arrows
    ['sig-arrow-rc', 'sig-arrow-va', 'sig-arrow-sa'].forEach(id => {
      const el = _el(id); if (el) el.setAttribute('opacity', '0');
    });
    ['mod-ra-badge', 'mod-va-badge', 'mod-sa-badge'].forEach(id => {
      const el = _el(id); if (el) el.setAttribute('class', 'mod-badge-idle');
    });

    // Reset LocalLink containers
    const ll = _el('mod-locallink');
    if (ll) ll.querySelector('.locallink-box').setAttribute('class', 'locallink-box');

    const lln1 = _el('mod-locallink-n1');
    if (lln1) lln1.querySelector('.locallink-box').setAttribute('class', 'locallink-box');

    // Reset queues
    const slotP = _el('q-slots-partial');
    if (slotP) Array.from(slotP.children).forEach(c => c.setAttribute('class', 'q-slot'));

    const slotI = _el('q-slots-inject');
    if (slotI) Array.from(slotI.children).forEach(c => c.setAttribute('class', 'q-slot'));

    const slotVC = _el('q-slots-vc');
    if (slotVC) Array.from(slotVC.children).forEach(c => c.setAttribute('class', 'q-slot-v'));

    const slotR00Out = _el('q-slots-r00-out-internal');
    if (slotR00Out) Array.from(slotR00Out.children).forEach(c => c.setAttribute('class', 'q-slot-v'));

    const slotR01Out = _el('q-slots-r01-out-internal');
    if (slotR01Out) Array.from(slotR01Out.children).forEach(c => c.setAttribute('class', 'q-slot-v'));

    const slotFlitCh = _el('q-slot-flit-channel');
    if (slotFlitCh) slotFlitCh.setAttribute('class', 'q-slot');

    const slotLocalCh = _el('q-slot-local-channel');
    if (slotLocalCh) slotLocalCh.setAttribute('class', 'q-slot');

    const slotEjectCh = _el('q-slot-eject-channel');
    if (slotEjectCh) slotEjectCh.setAttribute('class', 'q-slot');

    const slotsEject = _el('q-slots-eject');
    if (slotsEject) Array.from(slotsEject.children).forEach(c => c.setAttribute('class', 'q-slot-v'));

    const slotsReplies = _el('q-slots-replies');
    if (slotsReplies) Array.from(slotsReplies.children).forEach(c => c.setAttribute('class', 'q-slot'));

    const slotTotFl = _el('q-slot-total-flight');
    if (slotTotFl) slotTotFl.setAttribute('class', 'q-slot');

    const slotMeasFl = _el('q-slot-measured-flight');
    if (slotMeasFl) slotMeasFl.setAttribute('class', 'q-slot');

    const statsBox = _el('stats-calc-box');
    if (statsBox) statsBox.setAttribute('opacity', '0');

    // Reset Stage 3 Router Internal Queues
    ['q-slots-vc-buf', 'q-slots-route', 'q-slots-vcalloc', 'q-slots-switched', 'q-slots-st', 'q-slots-output', 'q-slots-vc-pipe'].forEach(id => {
      const q = _el(id);
      if (q) Array.from(q.children).forEach(c => c.setAttribute('class', id === 'q-slots-vc-pipe' ? 'q-slot-v' : 'q-slot'));
    });

    // Reset Stage 3 Pipeline Boxes
    ['stg-iq-box', 'stg-rc-box', 'stg-va-box', 'stg-sa-box', 'stg-st-box'].forEach(id => {
      const b = _el(id);
      if (b) b.querySelector('.stg-pipe-box').setAttribute('class', 'stg-pipe-box');
    });

    // Reset flit cards & inspector
    const fcg = _el('flit-card-group'); if (fcg) fcg.setAttribute('opacity', '0');
    const fpcg = _el('flit-pipe-card-group'); if (fpcg) fpcg.setAttribute('opacity', '0');
    const insp = _el('flit-inspector'); if (insp) insp.setAttribute('opacity', '0');

    if (_credRAF) { cancelAnimationFrame(_credRAF); _credRAF = null; }
    const cd = _el('credit-dot'); if (cd) cd.style.opacity = '0';
    const h0l = _el('h0-ch-label'); if (h0l) h0l.setAttribute('opacity', '0');
  },

  update(stageIdx, subIdx, microIdx = 0) {
    this.clear();
    const stage = STAGES[stageIdx];
    const sub = stage.subSteps[subIdx];
    let ns = sub.net;
    if (sub.microSteps && sub.microSteps.length > 0) {
      ns = sub.microSteps[microIdx].net;
    }
    if (!ns) return;

    const nv = _el('network-view');

    // Dual Mode View Mode Selection
    if (stageIdx === 2 || ns.isPipelineView) {
      if (nv) nv.className = 'view-mode-pipe';

      if (ns.sigQuery === 'rc') {
        _el('sig-arrow-rc').setAttribute('opacity', '1');
        _el('mod-ra-badge').setAttribute('class', 'mod-badge-act');
      }
      if (ns.sigQuery === 'va') {
        _el('sig-arrow-va').setAttribute('opacity', '1');
        _el('mod-va-badge').setAttribute('class', 'mod-badge-act');
      }
      if (ns.sigQuery === 'sa') {
        _el('sig-arrow-sa').setAttribute('opacity', '1');
        _el('mod-sa-badge').setAttribute('class', 'mod-badge-act');
      }

      if (ns.actStg) {
        const boxId = { iq: 'stg-iq-box', rc: 'stg-rc-box', va: 'stg-va-box', sa: 'stg-sa-box', st: 'stg-st-box' }[ns.actStg];
        const b = _el(boxId);
        if (b) b.querySelector('.stg-pipe-box').setAttribute('class', 'stg-pipe-box act');
      }

      if (ns.pipeVcFilled) {
        const slots = _el('q-slots-vc-pipe');
        if (slots && slots.children[0]) slots.children[0].setAttribute('class', 'q-slot-v filled');
      }
      if (ns.vcBufFilled) {
        const slots = _el('q-slots-vc-buf');
        if (slots && slots.children[0]) slots.children[0].setAttribute('class', 'q-slot filled');
      }
      if (ns.outputBufFilled) {
        const slots = _el('q-slots-output');
        if (slots && slots.children[3]) slots.children[3].setAttribute('class', 'q-slot filled');
      }

      if (ns.cardPos) {
        const fpcg = _el('flit-pipe-card-group');
        if (fpcg) {
          fpcg.setAttribute('transform', `translate(${ns.cardPos.x}, ${ns.cardPos.y})`);
          fpcg.setAttribute('opacity', '1');
        }
      }

      if (ns.vcState) {
        const txt = _el('vc-state-txt');
        const bg = _el('vc-state-box').querySelector('.vc-state-bg');
        if (txt && bg) {
          _el('vc-state-box').setAttribute('opacity', '1');
          txt.textContent = `State: ${ns.vcState}`;
          bg.setAttribute('class', `vc-state-bg st-${ns.vcState}`);
        }
      } else {
        const box = _el('vc-state-box');
        if (box) box.setAttribute('opacity', '0');
      }
    } else {
      if (nv) nv.className = 'view-mode-net';

      if (ns.srcNode) {
        _el(SVG.nodes[ns.srcNode]).className = 'tm-container-box src-nd';
        _el(SVG.nLabels[ns.srcNode]).className = 'svg-lbl tm-container-title src';
      }

      if (ns.dstNode) {
        _el(SVG.nodes[ns.dstNode]).className = (ns.dstNode === 'n1') ? 'tm-container-box dst-nd' : 'node-circle dst-nd';
        _el(SVG.nLabels[ns.dstNode]).className = (ns.dstNode === 'n1') ? 'svg-lbl tm-container-title dst' : 'svg-lbl node-lbl dst';
        const subEl = _el(SVG.nSubs[ns.dstNode]);
        if (subEl) { subEl.className = 'svg-lbl node-sub dst'; subEl.textContent = 'Destination Endpoint'; }
      }

      if (ns.actRouter) {
        _el(SVG.routers[ns.actRouter]).className = 'router-box focus act-rtr';
        _el(SVG.rLabels[ns.actRouter]).className = 'svg-lbl router-lbl act';
      }

      if (stageIdx === 0) {
        _el('rt-r00').className = 'router-box focus src-rtr';
        _el('rl-r00').className = 'svg-lbl router-lbl src';
      }

      if (ns.actLocalLink) {
        const ll = _el('mod-locallink');
        if (ll) ll.querySelector('.locallink-box').setAttribute('class', 'locallink-box act');
      }
      if (ns.actLocalLink2) {
        const lln1 = _el('mod-locallink-n1');
        if (lln1) lln1.querySelector('.locallink-box').setAttribute('class', 'locallink-box act');
      }

      if (ns.glowLink) {
        const link = _el(ns.glowLink);
        if (link) {
          const isLocal = (ns.glowLink === 'lk-n2' || ns.glowLink === 'lk-n3') ? ' local-link' : '';
          link.setAttribute('class', 'net-link act' + isLocal);
        }
      }

      if (ns.flitChannelFilled) {
        const fslot = _el('q-slot-flit-channel');
        if (fslot) fslot.setAttribute('class', 'q-slot filled');
      }
      if (ns.localChannelFilled) {
        const lslot = _el('q-slot-local-channel');
        if (lslot) lslot.setAttribute('class', 'q-slot filled');
      }
      if (ns.ejectChannelFilled) {
        const eslot = _el('q-slot-eject-channel');
        if (eslot) eslot.setAttribute('class', 'q-slot filled');
      }
      if (ns.ejectQueueFilled) {
        const slots = _el('q-slots-eject');
        if (slots && slots.children[0]) slots.children[0].setAttribute('class', 'q-slot-v filled');
      }

      // Automatically keep tracking queues filled while flit is in-flight 
      // (From Stage 1.5 creation until Stage 6.2 retirement)
      const isTrackingActive = (stageIdx > 0 || (stageIdx === 0 && subIdx >= 4)) && !(stageIdx === 5 && subIdx >= 1);
      if (ns.trackingFilled || isTrackingActive) {
        const s1 = _el('q-slot-total-flight'); if (s1) s1.setAttribute('class', 'q-slot filled');
        const s2 = _el('q-slot-measured-flight'); if (s2) s2.setAttribute('class', 'q-slot filled');
      }

      if (ns.repliesQueueFilled) {
        const rslots = _el('q-slots-replies');
        if (rslots && rslots.children[0]) rslots.children[0].setAttribute('class', 'q-slot filled');
      }
      if (ns.showStats) {
        const sb = _el('stats-calc-box');
        if (sb) {
          sb.setAttribute('opacity', '1');
          _el('stats-lbl-latency').textContent = 'latency: 18 cycles';
          _el('stats-lbl-hops').textContent = 'hops: 1 (N0 → N1)';
        }
      }

      // Module State Rendering (Stage 1 Granular Modules)
      const ms = sub.moduleState;
      if (ms) {
        if (ms.injectProc === 'act') {
          _el('mod-inject-proc').querySelector('.mod-box').setAttribute('class', 'mod-box act');
          _el('mod-ip-badge').setAttribute('class', 'mod-badge-act');
          _el('mod-ip-badge-txt').setAttribute('class', 'mod-badge-txt act');
          _el('mod-ip-badge-txt').textContent = 'true (Generated)';
        }
        if (ms.trafficPattern === 'act') {
          _el('mod-traffic-pattern').querySelector('.mod-box').setAttribute('class', 'mod-box act');
          _el('mod-tp-badge').setAttribute('class', 'mod-badge-act');
          _el('mod-tp-badge-txt').setAttribute('class', 'mod-badge-txt act');
          _el('mod-tp-badge-txt').textContent = 'dst = N₁ (Node 1)';
        }
        if (ms.poolCount !== undefined) {
          _el('mod-pool-count').textContent = `Available: ${ms.poolCount} Flits`;
        }
        if (ms.signal === 'ip') _el('sig-arrow-ip').setAttribute('opacity', '1');
        if (ms.signal === 'tp') _el('sig-arrow-tp').setAttribute('opacity', '1');
        if (ms.signal === 'pool') _el('sig-arrow-pool').setAttribute('opacity', '1');
      }

      if (ns.partialQueueFilled) {
        const slots = _el('q-slots-partial');
        if (slots && slots.children[0]) slots.children[0].setAttribute('class', 'q-slot filled');
      }
      if (ns.injectQueueFilled) {
        const slots = _el('q-slots-inject');
        if (slots && slots.children[0]) {
          const cls = sub.subnum === "2.3" ? 'q-slot act' : 'q-slot filled';
          slots.children[0].setAttribute('class', cls);
        }
      }
      if (ns.routerVcFilled) {
        const slots = _el('q-slots-vc');
        if (slots && slots.children[0]) slots.children[0].setAttribute('class', 'q-slot-v filled');
      }

      if (ns.showFlitCard && ns.cardPos) {
        const fcg = _el('flit-card-group');
        if (fcg) {
          fcg.setAttribute('transform', `translate(${ns.cardPos.x}, ${ns.cardPos.y})`);
          fcg.setAttribute('opacity', '1');
          if (ns.highlightFlit) {
            fcg.setAttribute('filter', 'url(#glow-c)');
          } else {
            fcg.removeAttribute('filter');
          }
        }
      }

      if (ns.showCredit) this._animCredit();
    }

    // Flit Inspector Card rendering underneath TM
    if (ns.showInspector) {
      const insp = _el('flit-inspector');
      if (insp) insp.setAttribute('opacity', '1');
      if (ns.fields) {
        let dtxt = '';
        if (ns.fields.atime) {
          dtxt = ` | itime: ${ns.fields.itime} | dtime: ${ns.fields.dtime} | atime: ${ns.fields.atime}`;
        } else if (ns.fields.dtime) {
          dtxt = ` | itime: ${ns.fields.itime} | dtime: ${ns.fields.dtime}`;
        } else if (ns.fields.itime) {
          dtxt = ` | itime: ${ns.fields.itime}`;
        }

        const stxt = ns.fields.state ? ` | state: ${ns.fields.state}` : '';
        const ptxt = ns.fields.out_port ? ` | out_port: ${ns.fields.out_port}` : '';
        const vtxt = ns.fields.out_vc !== undefined ? ` | out_vc: ${ns.fields.out_vc}` : '';

        _el('insp-title').textContent = `${ns.fields.type} Flit #${ns.fields.id} [HEAD|TAIL]`;
        _el('insp-route').textContent = `Src: ${ns.fields.src} ➔ Dst: ${ns.fields.dst}`;

        _el('insp-meta').textContent = `creation_time: ${ns.fields.time}${dtxt}`;

        const meta2 = _el('insp-meta-2');
        if (meta2) {
          meta2.textContent = `VC: ${ns.fields.vc}${stxt}${ptxt}${vtxt} | record: true`;
        }
      }
    }
  },

  _animCredit() {
    const cd = _el('credit-dot');
    if (!cd) return;
    let t = 0;
    const step = () => {
      t = (t + 0.018) % 1;
      const x = 660 + (520 - 660) * t;
      cd.setAttribute('cx', x);
      cd.setAttribute('cy', 202.5);
      cd.style.opacity = (t > 0.04 && t < 0.93) ? '1' : '0';
      _credRAF = requestAnimationFrame(step);
    };
    step();
  },

  show() { _el('network-view').classList.remove('hidden'); },
  hide() { _el('network-view').classList.add('hidden'); }
};

/* ================================================================
   DETAILS PANEL
================================================================ */
const Details = {
  update(stageIdx, subIdx, microIdx = 0) {
    const band = _el('band-body');
    const body = _el('details-body');
    if (!band || !body) return;
    band.classList.add('fading');
    body.classList.add('fading');
    setTimeout(() => {
      band.innerHTML = this._renderBand(stageIdx, subIdx, microIdx);
      body.innerHTML = this._renderPanel(stageIdx, subIdx);
      band.classList.remove('fading');
      body.classList.remove('fading');
    }, 150);
  },

  _renderBand(stageIdx, subIdx, microIdx = 0) {
    const s = STAGES[stageIdx];
    const curSub = s.subSteps[subIdx];

    let curTitle = curSub.title;
    let curDesc = curSub.desc;
    if (curSub.microSteps && curSub.microSteps.length > 0) {
      curTitle = curSub.microSteps[microIdx].title || curTitle;
      curDesc = curSub.microSteps[microIdx].desc || curDesc;
    }

    _el('band-body').style.borderLeftColor = s.hex;

    return `
      <div class="band-title">${curTitle}</div>
      <div class="band-desc">${curDesc}</div>
    `;
  },

  _renderPanel(stageIdx, subIdx) {
    const s = STAGES[stageIdx];

    return `
      <div class="det-sec">
        <div class="det-lbl">Stage Flow Steps (Click to Jump)</div>
        <div class="flow-timeline">
          ${s.subSteps.map((step, i) => {
      const isAct = (i === subIdx);
      return `
              <div class="flow-step${isAct ? ' active' : ''}" onclick="App.jumpSubStep(${i})">
                <div class="flow-num" style="background:${isAct ? s.hex : s.hex + '18'};color:${isAct ? '#ffffff' : s.hex};border-color:${s.hex}">${i + 1}</div>
                <div class="flow-content">
                  <div class="flow-title" style="color:${isAct ? s.hex : 'var(--text)'}">${step.subname}</div>
                  <div class="flow-desc">${step.desc}</div>
                </div>
              </div>
            `;
    }).join('')}
        </div>
      </div>

      <div class="det-sec">
        <div class="det-lbl">Stage Summary</div>
        <div class="summary-grid">
          ${s.summary.map(item => `
            <div class="sum-card">
              <div class="sum-lbl">${item.lbl}</div>
              <div class="sum-val" style="color:${s.hex}">${item.val}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};

/* ================================================================
   MAIN APPLICATION
================================================================ */
const App = {
  goTo(stageIdx) {
    if (stageIdx < 0 || stageIdx > 5) return;
    _stage = stageIdx;
    _subStep = 0;
    _microStep = 0;
    this._render();
  },

  jumpSubStep(subIdx) {
    if (subIdx < 0 || subIdx >= STAGES[_stage].subSteps.length) return;
    _subStep = subIdx;
    _microStep = 0;
    this._render();
  },

  next() {
    const curStage = STAGES[_stage];
    const sub = curStage.subSteps[_subStep];

    if (sub.microSteps && _microStep < sub.microSteps.length - 1) {
      _microStep++;
      this._render();
      return;
    }

    _microStep = 0;
    if (_subStep < curStage.subSteps.length - 1) {
      _subStep++;
      this._render();
    } else if (_stage < 5) {
      _stage++;
      _subStep = 0;
      _microStep = 0;
      this._render();
    } else {
      window.location.href = NEXT_DECK_URL;
    }
  },

  prev() {
    if (_microStep > 0) {
      _microStep--;
      this._render();
      return;
    }

    if (_subStep > 0) {
      _subStep--;
      const sub = STAGES[_stage].subSteps[_subStep];
      _microStep = sub.microSteps ? sub.microSteps.length - 1 : 0;
      this._render();
    } else if (_stage > 0) {
      _stage--;
      _subStep = STAGES[_stage].subSteps.length - 1;
      const sub = STAGES[_stage].subSteps[_subStep];
      _microStep = sub.microSteps ? sub.microSteps.length - 1 : 0;
      this._render();
    } else {
      window.location.href = PREV_DECK_URL;
    }
  },

  reset() {
    this._stopPlay();
    _stage = 0; _subStep = 0; _microStep = 0;
    this._render();
  },

  togglePlay() {
    if (_playing) this._stopPlay();
    else this._startPlay();
  },

  _startPlay() {
    _playing = true;
    const btn = _el('btn-play');
    btn.classList.add('playing'); btn.textContent = '⏸ Pause';
    this._tick();
  },

  _tick() {
    if (!_playing) return;
    const curStage = STAGES[_stage];
    const sub = curStage.subSteps[_subStep];

    if (sub.microSteps && _microStep < sub.microSteps.length - 1) {
      _microStep++;
      this._render();
      _timer = setTimeout(() => this._tick(), 1400);
    } else if (_subStep < curStage.subSteps.length - 1) {
      _microStep = 0;
      _subStep++;
      this._render();
      _timer = setTimeout(() => this._tick(), 2400);
    } else if (_stage < 5) {
      _stage++; _subStep = 0; _microStep = 0;
      this._render();
      _timer = setTimeout(() => this._tick(), 2400);
    } else {
      this._stopPlay();
    }
  },

  _stopPlay() {
    _playing = false; clearTimeout(_timer);
    const btn = _el('btn-play');
    btn.classList.remove('playing'); btn.textContent = '▶ Play';
  },

  _render() {
    Nav.update(_stage, _subStep);
    NetView.update(_stage, _subStep, _microStep);
    Details.update(_stage, _subStep, _microStep);
  },

  init() {
    Nav.init();
    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); App.next(); }
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); App.prev(); }
      else if (e.key === ' ') { e.preventDefault(); App.togglePlay(); }
      else if (e.key === 'r' || e.key === 'R') App.reset();
    });
    this._render();
  }
};

function _el(id) { return document.getElementById(id); }

document.addEventListener('DOMContentLoaded', () => {
  App.init();
  const params = new URLSearchParams(location.search);
  if (params.get('end') === '1') {
    _stage = STAGES.length - 1;
    _subStep = STAGES[_stage].subSteps.length - 1;
    const lastSub = STAGES[_stage].subSteps[_subStep];
    _microStep = lastSub.microSteps ? lastSub.microSteps.length - 1 : 0;
    App._render();
  } else {
    const stage = params.get('stage');
    if (stage !== null) App.goTo(parseInt(stage, 10));
  }
});
