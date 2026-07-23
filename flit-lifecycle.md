# Flit Lifecycle — NoC Simulator

## 1. Overview

A **flit** (flow control unit) is the atomic unit of data transfer in this CHI-protocol NoC simulator. Flits travel through four independent virtual channels: **REQ**, **RSP**, **DAT**, and **SNP**. The end-to-end journey of a flit is:

```
TrafficManager creates
       │
       ▼
LocalLink injects (itime stamped on head flit)
       │
       ▼
Router Pipeline: IQ → RC → VA → SA → ST
       │
       ▼ (repeated per router hop)
CHILink inter-router transfer (+ credit return upstream)
       │
       ▼
LocalLink ejects (atime stamped)
       │
       ▼
TrafficManager retires (stats recorded)
```

**Measurement gate:** `flit->record` is `true` only during `SimPhase::Running`. Flits created in WarmingUp carry `record = false` and are silently discarded from stats.

---

## 2. Flit Struct & Fields

**Source:** [Core/Protocol/chi_flit.h](../Core/Protocol/chi_flit.h) (lines 18–103)

### Core Identity
| Field | Type | Set by | Purpose |
|---|---|---|---|
| `id` | `uint64_t` | TM `_GeneratePacket()` | Unique flit ID |
| `pid` | `uint64_t` | TM `_GeneratePacket()` | Shared by all flits in a packet |
| `src_node` / `dst_node` | `int` | TM `_GeneratePacket()` | Logical source/destination |
| `src_port` / `dst_port` | `int` | TM `_GeneratePacket()` | Physical router port |
| `vc` | `int` | TM `_GeneratePacket()` | Requested VC |
| `type` | `CHIFlitType` | TM `_GeneratePacket()` | REQ / RSP / DAT / SNP |
| `head` / `tail` | `bool` | TM `_GeneratePacket()` | Packet boundary markers |
| `cl` | `int` | TM `_GeneratePacket()` | Traffic class index |
| `pri` | `int` | TM `_GeneratePacket()` | Priority |

### Timing & Measurement (TM-managed)
| Field | Type | Set by | Purpose |
|---|---|---|---|
| `creation_time` | `uint64_t` | `_GeneratePacket()` | Cycle flit was created in TM |
| `itime` | `uint64_t` | `_WriteFlits()` (head only) | Cycle head flit handed to router |
| `atime` | `uint64_t` | `LocalLink::DeliverFromRouter()` | Cycle flit reaches device side of local link (after local_flit_latency) |
| `record` | `bool` | `_GeneratePacket()` | Gate: true only in Running phase |

### Routing Scratchpad (pipeline-managed)
| Field | Type | Set by | Purpose |
|---|---|---|---|
| `out_port` | `int` | RC stage | Output port resolved by routing algo |
| `out_vc` | `int` | VA stage | Output VC allocated downstream |
| `hops` | `int` | `CHIRouter::inject_flit()` | Incremented per inter-router input |

### CHI Payload Variants
- **REQFlit** — `addr`, `tgt_id`, `txn_id`, CHI request opcode
- **RSPFlit** — response opcode, `txn_id`
- **DATFlit** — 256-bit data payload (`uint64_t data[4]`), `txn_id`, `data_id` (beat index: 0x0 = beat 0, 0x2 = beat 1)
- **SNPFlit** — snoop address, opcode

---

## 3. Simulation Phase Gate

**Source:** [Core/Experimentation/traffic_manager.h](../Core/Experimentation/traffic_manager.h) (line 81), `_AdvancePhase()` in [traffic_manager.cpp](../Core/Experimentation/traffic_manager.cpp)

```
SimPhase::WarmingUp  ──► SimPhase::Running  ──► SimPhase::Draining  ──► SimPhase::Done
     (warmup_cycles)      (convergence check)    (all record flits exit)   (display stats)
```

| Phase | Injection | Stats | Transition trigger |
|---|---|---|---|
| **WarmingUp** | Active | Ignored | `t >= warmup_cycles` |
| **Running** | Active | Recorded | CoV of `plat` window `< latency_thres` |
| **Draining** | Stopped | Recorded | `_measured_in_flight` empty |
| **Done** | Stopped | Final | — |

During **Draining**, per-source injection clocks stop advancing so no new packets enter the pipeline. All in-flight `record=true` flits drain to completion.

---

## 4. Flit Creation

**Source:** [Core/Experimentation/traffic_manager.cpp](../Core/Experimentation/traffic_manager.cpp) — `_GeneratePacket()` (lines 236–295)

### Decision Chain (per source node, per traffic class, per cycle)

```
_Inject(t)
  └─► _IssuePacket(src, cl, t)
        ├─ use_reply_model + pending reply? → return -1 (reply)
        └─ _process[cl]->Test(src, rng)   → Bernoulli or OnOff injection decision
              └─ true? → _GeneratePacket(src, cl, t)
                           └─ _pattern[cl]->Dest(src, rng) → select dst_node
```

### _GeneratePacket() Steps
1. Compute packet size: 1 REQ flit **or** 2 DAT flits (`dat_flit_size` is enforced = 2, asserted at construction)
2. For each flit `i` in packet:
   - Obtain the flit from the **recycling pool** via `Protocol::AcquireFlit<REQFlit/DATFlit>()` (not `make_shared`) — returns a `shared_ptr<Flit>` whose deleter recycles the object to a per-type free-list on last drop, eliminating malloc/free churn. See CREDIT_MECHANISM.md §15.3.
   - `flit->id = _cur_flit_id++`
   - `flit->pid = _cur_pid` (same for all flits in packet)
   - `flit->src_node`, `flit->dst_node`, `flit->cl`
   - `flit->head = (i == 0)`, `flit->tail = (i == size-1)`
   - `flit->creation_time = t`
   - `flit->record = (_phase == SimPhase::Running)`
   - **DAT only:** `dat->data_id = i * 2` → beat 0 gets `0x0`, beat 1 gets `0x2` (CHI DataID convention)
3. Enqueue to `_partial_packets[src][cl]`
4. Add to `_total_in_flight`; if `record`: add to `_measured_in_flight`

### Injection Processes
- **BernoulliProcess**: `Test()` returns true with prob = `injection_rate`; memoryless
- **OnOffProcess**: 2-state Markov (OFF→ON with prob `alpha`, stays ON with prob `beta`)

### Traffic Patterns
- **UniformRandom**: `dst = any node ≠ src`, equal probability
- **Hotspot**: weighted selection; hotspot nodes receive extra load
- **Tornado**: adversarial k-ary n-cube offset pattern

---

## 5. Flit Injection (TM → Router)

**Source:** `_WriteFlits()` (lines 301–323) in [traffic_manager.cpp](../Core/Experimentation/traffic_manager.cpp); [Core/Interconnect/local_link.cpp](../Core/Interconnect/local_link.cpp)

### Step-by-Step

```
_WriteFlits(t)
  └─ for each src node:
       peek front of _partial_packets[src][cl]
       └─ if head flit: flit->itime = t         ← injection timestamp
          call LocalLink::inject_flit(flit)
            └─ push to _inject_queues[flit->type]  ← per-channel staging queue
```

Then, in the same cycle, `NetworkFabric::tick()` calls the two-phase local-link inject steps:

```
Step 6a: LocalLink::ForwardFlits(cycle)
  └─ for each channel ch:                       ← channels are independent, no HOL blocking
       if _inject_queues[ch] empty or _inject_credits[ch] == 0: skip
       _inject_credits[ch]--
       _inject_flit_ch[ch].push(flit, cycle)    ← enters inject wire pipeline (1 flit/channel/cycle)

Step 6b: LocalLink::DeliverFlits(cycle)
  └─ for each channel:
       for each flit in _inject_flit_ch[ch] where deliver_at <= cycle:
         router->inject_flit(local_port, flit)   ← flit enters LOCAL_0 VC buffer
```

**Wire latency:** With `local_flit_latency = L`, the flit enters the router `L` cycles after it enters the pipeline. Default `L = 0` means delivery in the same tick as ForwardFlits (same behavior as before).

**Back-pressure:** `_inject_credits[ch]` counts available slots (router buffer + in-flight on wire) **per channel independently**. Credits return when an SA winner on LOCAL_0 is detected by NetworkFabric (Step 5b, before ForwardFlits). A credit shortage on REQ never stalls RSP, DAT, or SNP injection.

**Rate limit:** At most **one flit per channel per cycle** is forwarded from the staging queues. At most **one flit per source node per cycle** leaves `_partial_packets` (TM rate limit). Remaining flits queue until subsequent cycles.

---

## 6. Router Pipeline (5 Stages)

**Source:** [Core/Network/channel_pipeline.cpp](../Core/Network/channel_pipeline.cpp); [Core/Network/channel_pipeline.h](../Core/Network/channel_pipeline.h)

Each `CHIRouter` contains **4 independent ChannelPipeline** instances (REQ, RSP, DAT, SNP), ported to a BookSim IQ-router-style design. Every stage splits into an **Evaluate** half (stamp timing, submit allocator requests) and an **Update** half (consume matured entries, advance VC state). All Evaluates run in forward pipeline order (RC → VA → SA → ST), followed by all Updates in the same forward order — there is no backward/reverse execution and no implicit per-cycle latch; each stage costs exactly its configured `StageCycles` delay. See [CHI_ROUTER_Pipeline_Stages.md](CHI_ROUTER_Pipeline_Stages.md) for full detail.

### Execution Order per cycle
```
ChannelPipeline::Step():
  ++_cycle
  _InputQueuing()          ← Stage 1 (IQ); internally drains _pending_credits first

  // ---- Evaluate ----
  _RouteEvaluate()         ← Stage 2 (RC)
  _vc_allocator->Clear()
  _VCAllocEvaluate()       ← Stage 3 (VA)
  [if hold_switch_for_packet] _SWHoldEvaluate()
  _sw_allocator->Clear()
  _SWAllocEvaluate()       ← Stage 4 (SA)
  _SwitchEvaluate()        ← Stage 5 (ST)

  // ---- Update ----
  _RouteUpdate()
  _VCAllocUpdate()
  [if hold_switch_for_packet] _SWHoldUpdate()
  _SWAllocUpdate()
  _SwitchUpdate()
```

Pipeline entries carry a `time` field: `-1` means "not yet stamped." Once a stage's Evaluate stamps an entry, `time = _cycle + delay - 1`; that stage's Update consumes it once `_cycle >= time`.

---

### Stage 1 — Input Queuing (IQ)

```
_InputQueuing()
  └─ _DrainPendingCredits()   ← apply any credits whose stage_cd delay elapsed, so SA sees them this cycle
  └─ for each (in_port, in_vc):
       if vc_state == idle AND head flit present:
         vc_state = routing
         push {time=-1, in_port, in_vc} → _route_vcs
       if vc_state == active AND non-head flit at front:
         push {time=-1, ...} → _sw_alloc_vcs (or _sw_hold_vcs if switch is held)
```

- **Trigger:** idle VC with a head flit in its buffer
- **Output:** entry in `_route_vcs`
- **VC transition:** `idle → routing`

---

### Stage 2 — Route Compute (RC)

```
_RouteEvaluate()
  └─ stamp time==-1 entries in _route_vcs → time = _cycle + stage_iq + stage_rc - 1

_RouteUpdate()
  └─ for each entry where _cycle >= time:
       flit = vc_state[in_port][in_vc].buffer.front()  (peek, not pop)
       flit->out_port = _router_algo->compute_route(flit)
       vc_state = vc_alloc
       push {time=-1, in_port, in_vc, REQUESTED} → _vc_alloc_vcs
```

**MeshXY Routing (X-first):**
- If `dst_col > my_col`: route East (port 1)
- If `dst_col < my_col`: route West (port 3)
- Else if `dst_row > my_row`: route South (port 2)
- Else if `dst_row < my_row`: route North (port 0)
- If `src_node == dst_node`: route LOCAL_0 (port 4) — eject

---

### Stage 3 — VC Allocation (VA)

```
_VCAllocEvaluate()
  └─ stamp time==-1 entries in _vc_alloc_vcs → time = _cycle + stage_va - 1
  └─ for each stamped-this-cycle entry: request candidate out_vc via
       _vc_allocator->AddRequest(...) only if BufferState::IsAvailableFor(vc) && !IsFullFor(vc)
  └─ _vc_allocator->Allocate()   ← one collective round-robin pass
  └─ read back OutputAssigned()/InputAssigned() → record grant as result, or REQUESTED to retry

_VCAllocUpdate()
  └─ for each entry where _cycle >= time:
       if result >= 0 (granted):
         _next_buf[out_port].TakeBuffer(out_vc)
         flit->out_vc = out_vc
         vc_state = active
         push {time=-1, ...} → _sw_alloc_vcs
       else:
         re-push {time=-1, ...} → _vc_alloc_vcs   ← retry next cycle
```

- **Stall condition:** All VCs on `out_port` are owned (`IsAvailableFor` false) or downstream-full (`IsFullFor` true)
- **VC transition:** `vc_alloc → active`
- **Allocator:** the collective `Allocator` class (`Core/Network/allocators.h`) — one instance shared across all VA requests this cycle, replacing the old per-flit `IterativeVCAllocator`

---

### Stage 4 — Switch Allocation (SA)

```
_SWAllocEvaluate()
  └─ stamp time==-1 entries in _sw_alloc_vcs → time = _cycle + stage_sa - 1
  └─ for each active VC: if _next_buf[out_port].IsFullFor(out_vc) → stall;
       else submit request via _SWAllocAddReq() (separable round-robin supersede)
  └─ _sw_allocator->Allocate()   ← one collective round-robin pass
  └─ grant check: OutputAssigned(in_port)==out_port AND ReadRequest(...).label==in_vc

_SWAllocUpdate()
  └─ for each granted entry where _cycle >= time:
       _SendFlit(in_port, in_vc, out_port, out_vc):
         flit = vc_state[in_port][in_vc].buffer.pop()   ← flit leaves VC buffer
         _next_buf[out_port].SendingFlit(out_vc)         ← decrement downstream credit
         record SA event in _switched_this_cycle          ← upstream credit return
         if tail AND wait_for_tail_credit: _next_buf[out_port].MarkTailSent(out_vc)
         else: _next_buf[out_port].ReleaseVC(out_vc)
         push {time=-1, flit, in_port, out_port} → _crossbar_flits
         vc_state = flit->tail ? idle : active   ← tail flit MUST return VC to idle
```

- **Stall conditions:** (a) downstream buffer full for the requested VC, or (b) allocator did not grant this input/output pair
- **SA event:** recorded so `NetworkFabric` can return a credit to the upstream router
- **Allocator:** the collective `Allocator` class, a second instance sized `num_ports × num_ports`, replacing the old per-flit `SimpleSwitchAllocator`

---

### Stage 5 — Switch Traversal (ST)

```
_SwitchEvaluate()
  └─ stamp time==-1 entries in _crossbar_flits → time = _cycle + stage_st - 1

_SwitchUpdate()
  └─ for each entry where _cycle >= time:
       _output_buffer[out_port].push(flit)
```

Flit is now in `_output_buffer[out_port]`, ready for `NetworkFabric` to pull it this cycle or the next.

**Per-router latency (defaults, all stages = 1):** `iq + rc + va + sa + st = 5` cycles — no extra hidden `+1`.

---

### VC State Machine

```
         IQ (head flit in buffer)
  idle ─────────────────────► routing
                                  │
                                  │ RouteUpdate (compute_route)
                                  ▼
                             vc_alloc ◄── retry (no downstream VC owned / full)
                                  │
                                  │ VCAllocUpdate (grant)
                                  ▼
                               active ◄─── retry (no credit / no allocator grant)
                                  │
                                  │ SWAllocUpdate (switch granted)
                                  ▼
                       tail flit → idle   |   non-tail flit → active
```

---

## 7. Inter-Router Transfer (CHILink)

**Source:** [Core/Interconnect/chi_link.cpp](../Core/Interconnect/chi_link.cpp) (lines 27–66); [Core/Interconnect/network_fabric.cpp](../Core/Interconnect/network_fabric.cpp) (lines 79–128)

`NetworkFabric::tick()` drives all inter-router movement:

### Step A — ForwardFlits (per CHILink)
```
src_router->eject_flit(src_out_port, channel)  ← pull from _output_buffer
push into FlitChannel with deliver_at = cycle + flit_latency
```

### Step B — DeliverFlits (per CHILink)
```
for each flit in FlitChannel where deliver_at <= cycle:
  dst_router->inject_flit(dst_in_port, flit)
```

Inside `CHIRouter::inject_flit()`:
```
if in_port is directional (0–3, not LOCAL):
  flit->hops++
push flit into vc_state[in_port][vc].buffer
```

**FlitChannel** is a timed FIFO: each entry carries `{flit_ptr, deliver_at}`. Configurable `flit_latency` (default 1 cycle) models wire/repeater delay.

---

## 8. Credit Return Flow

**Source:** [Core/Interconnect/network_fabric.cpp](../Core/Interconnect/network_fabric.cpp) (lines 87–128); [Core/Interconnect/chi_link.cpp](../Core/Interconnect/chi_link.cpp) (lines 47–66)

Credits flow **backwards** (downstream → upstream) to replenish upstream `_credits[out_port][out_vc]`.

### Inter-Router Credit Path

```
1. _CollectAllSAEvents()
     └─ drain _switched_this_cycle from every router
        bucket into _sa_events[router_idx][in_port]

2. CHILink::EnqueueCredits()
     └─ batch all SA winners on dst_in_port (= this link's dst) by channel:
          one pooled Credit::New() per channel, vcs = {all freed VC ids}
          push Credit* → CreditChannel
          deliver_at = cycle + credit_latency   ← inter-router credit wire delay

3. CHILink::DeliverCredits()
     └─ for each Credit where deliver_at <= cycle:
          for vc in credit->vcs:
            src_router->add_credit(src_out_port, channel, vc)
              └─ ChannelPipeline::ReturnCredit()
                   └─ if stage_cd == 0: _credits[out_port][vc]++ immediately
                      if stage_cd > 0:  push to _pending_credits
                                        (deliver_at = cycle + stage_cd)
                        └─ _DrainPendingCredits() at start of next Step()
                             └─ _credits[out_port][vc]++
          credit->Free()   ← return to pool
```

> Credit is a first-class pooled entity (`Core/Protocol/credit.h`) carrying a
> batched `vcs` list, not a value `CreditToken`. See CREDIT_MECHANISM.md §15.

**`stage_cd` (in-router credit processing delay):** Models the delay inside the upstream router between when a credit physically arrives at the port and when the VC counter is updated. BookSim's `credit_delay` (default 2 in real mesh configs). Default 0 = immediate (current behavior).

### Injection Credit Path (LOCAL_0)

SA winner on `LOCAL_0` input port triggers an **immediate** (0-cycle) credit return to the inject budget:
```
NetworkFabric::tick() Step 5b:
  LocalLink::AddInjectCredit(channel)
    └─ _inject_credits[ch]++
```

This runs before Step 6a (`ForwardFlits`) so freed inject slots are reusable the same cycle.

### Eject Credit Path (LOCAL_0 output → router)

When `LocalLink::ForwardFromRouter()` pulls a flit from the router's LOCAL output buffer, it immediately enqueues a credit back to the router via the `_credit_ch` CreditChannel:

```
ForwardFromRouter(cycle)
  └─ flit = router->eject_flit(LOCAL_0, ch)
     add_credit(ch, ret_vc, cycle)
       └─ credit = Protocol::Credit::New(); credit->vcs = {ret_vc}
          _credit_ch[ch].push(credit, cycle)
            deliver_at = cycle + local_credit_latency

Step 8: LocalLink::DeliverCreditsToRouter(cycle)
  └─ for each credit where deliver_at <= cycle:
       for vc in credit->vcs: router->add_credit(LOCAL_0, ch, vc)
         └─ ChannelPipeline::ReturnCredit()
       credit->Free()
```

With `local_credit_latency = 0` (default): credit reaches the router the same cycle the flit is pulled, preserving the LOCAL_0 starvation fix.

### Credit Invariant

`_credits[out_port][vc]` is initialized to `vc_depth` (buffer depth of downstream VC). It is:
- **Decremented** when SA grants the flit onto that output
- **Incremented** when the downstream SA winner acknowledgment returns

At no point can `_credits < 0`.

---

## 9. Flit Ejection (Router → TM)

**Source:** [Core/Interconnect/local_link.cpp](../Core/Interconnect/local_link.cpp)

Ejection is now a two-phase operation mirroring injection, called by `NetworkFabric::tick()`:

```
Step 7a: LocalLink::ForwardFromRouter(cycle)
  └─ for each channel ch:
       flit = router->eject_flit(local_port, ch)   ← pull from _output_buffer[LOCAL_0]
       if flit:
         add_credit(ch, ret_vc, cycle)              ← enqueue eject credit (may be delayed)
         _eject_flit_ch[ch].push(flit, cycle)       ← enter eject wire pipeline

Step 7b: LocalLink::DeliverFromRouter(cycle)
  └─ for each flit in _eject_flit_ch[ch] where deliver_at <= cycle:
       flit->atime = cycle                          ← stamped at device arrival, not router exit
       _eject_queues[ch].push(flit)                 ← available for TM to pick up
```

**`atime` stamping:** Now set in `DeliverFromRouter`, reflecting the cycle the flit actually reaches the device side. With `local_flit_latency = 0` (default), this is the same cycle the flit exits the router.

**Why eject credit is enqueued before delivery:** The credit is returned as soon as the flit leaves the router's output buffer (in `ForwardFromRouter`), so the router's LOCAL_0 output VC slot is freed immediately — preserving the LOCAL_0 starvation fix. With `local_credit_latency = 0` (default), it reaches the router the same cycle via `DeliverCreditsToRouter`.

---

## 10. Flit Retirement (TrafficManager._RetireFlit)

**Source:** [Core/Experimentation/traffic_manager.cpp](../Core/Experimentation/traffic_manager.cpp) (lines 85–173)

### _ReadFlits(t)
```
for each node, for each channel:
  flit = LocalLink::eject_flit(ch)
  if flit and flit->dst_node == node:
    _RetireFlit(flit, t)
```

### _RetireFlit(flit, t) Steps

**1. Remove from in-flight tracking**
```
_total_in_flight.erase(flit->id)
if flit->record: _measured_in_flight.erase(flit->id)
```

**2. Per-flit stats** (only if `flit->record == true`)
```
flat = flit->atime - flit->creation_time    ← flit latency (total)
hops = flit->hops
_flat_stats[cl].AddSample(flat)
_hop_stats[cl].AddSample(hops)
```

**3. Head flit stash** (if head, not tail — multi-flit packets only)
```
_retired_heads[flit->pid] = flit
```

**4. Per-packet stats** (when tail flit arrives)
```
head = _retired_heads[flit->pid]
plat = flit->atime - head->creation_time    ← packet latency (tail exit - head creation)
nlat = flit->atime - head->itime            ← network latency (excludes TM queuing)
frag = flit->atime - flit->creation_time    ← tail flit own latency

_plat_stats[cl].AddSample(plat)
_nlat_stats[cl].AddSample(nlat)
_frag_stats[cl].AddSample(frag)
_accepted_packets[dst_node]++
```

**5. Reply scheduling** (if `use_reply_model == true` and this was a REQ)
```
_replies_pending[flit->src_node].push({dst_node, t + reply_delay})
```

### Latency Definitions
| Metric | Formula | Meaning |
|---|---|---|
| `flat` | `atime - creation_time` | Total per-flit latency including TM queuing |
| `nlat` | `atime (tail) - itime (head)` | Network latency: injection handoff → last router exit |
| `plat` | `atime (tail) - creation_time (head)` | Full packet latency from creation to exit |
| `frag` | `atime (tail) - creation_time (tail)` | Tail flit fragmentation latency |

---

## 11. Timing Diagram (Single-Hop, No Contention, 1-cycle stages)

```
Cycle:  T      T+1    T+2    T+3    T+4    T+5    T+6    T+7
        │      │      │      │      │      │      │      │
TM gen: [create, creation_time=T]
        │
TM inj: └──────[itime=T+1]──►[LOCAL_0 input VC buffer]
                       │
IQ:                    └──────[route_latch, deliver_at=T+2]
                                      │
RC:                                   └──────[vc_alloc_latch, deliver_at=T+3]
                                                     │
VA:                                                  └──────[sw_alloc_latch, deliver_at=T+4]
                                                                    │
SA:                                                                 └──────[crossbar_latch, deliver_at=T+5+1=T+6]
                                                                                   │
ST:                                                                                └──────[output_buffer]
                                                                                                  │
Eject:                                                                                            └──[atime=T+6]

flat  = T+6 - T   = 6 cycles  (creation_time to atime)
nlat  = T+6 - T+1 = 5 cycles  (itime to atime, single hop)
```

**Multi-hop:** Each additional router adds 5 cycles (IQ+RC+VA+SA+ST) plus `flit_latency` for the inter-router wire.

---

## 12. Full Lifecycle Flowchart

```
TrafficManager::Tick(t)
  │
  ├─[Phase 1] _ReadFlits(t)
  │     for each node × channel:
  │       flit ← LocalLink::eject_flit(ch)
  │       _RetireFlit(flit)  → flat, nlat, plat, frag stats
  │
  ├─[Phase 2] _Inject(t)
  │     _IssuePacket() → injection process decides
  │     _GeneratePacket() → flits to _partial_packets
  │
  ├─[Phase 3] _WriteFlits(t)
  │     dequeue flit → LocalLink::inject_flit()
  │     head flit: itime stamped
  │
  └─[Phase 4] _AdvancePhase(t)
        check convergence / draining / done

NetworkFabric::tick(cycle)
  │
  ├─ _CollectAllSAEvents()              ← bucket SA wins by router/port
  ├─ CHILink::ForwardFlits()            ← src output_buffer → FlitChannel
  ├─ CHILink::DeliverFlits()            ← FlitChannel → dst input VC  (+hops++)
  ├─ CHILink::EnqueueCredits()          ← SA events → CreditChannel (upstream)
  ├─ CHILink::DeliverCredits()          ← CreditChannel → src _credits[port][vc]++
  ├─ LocalLink::AddInjectCredit()       ← SA on LOCAL_0 → _inject_credits++ (0-latency)
  ├─ LocalLink::ForwardFlits()          ← _inject_queues[ch] → inject FlitChannel (1 flit/channel/cycle)
  ├─ LocalLink::DeliverFlits()          ← inject FlitChannel → router LOCAL_0 input buffer
  ├─ LocalLink::ForwardFromRouter()     ← router LOCAL_0 output → eject FlitChannel (1 flit/channel/cycle)
  └─ LocalLink::DeliverCreditsToRouter()← eject credit queues → router add_credit

CHIRouter::tick()
  └─ for each ChannelPipeline (REQ/RSP/DAT/SNP):
       pipeline.Step():
         _SwitchEvaluate()   → crossbar_latch → _output_buffer[out_port]
         _SWAllocEvaluate()  → SA grant → pop VC buffer, record event, decrement credit
         _VCAllocEvaluate()  → allocate out_vc
         _RouteEvaluate()    → compute out_port
         _InputQueuing()     → idle VC + flit → route_latch
```

---

## 13. Key File Reference

| Lifecycle Phase | File | Lines |
|---|---|---|
| Flit struct | [Core/Protocol/chi_flit.h](../Core/Protocol/chi_flit.h) | 18–103 |
| Flit creation | [Core/Experimentation/traffic_manager.cpp](../Core/Experimentation/traffic_manager.cpp) | 236–295 |
| Flit injection (TM side) | [Core/Experimentation/traffic_manager.cpp](../Core/Experimentation/traffic_manager.cpp) | 301–323 |
| Flit injection (link side) | [Core/Interconnect/local_link.cpp](../Core/Interconnect/local_link.cpp) | 21–54 |
| Router pipeline — all stages | [Core/Network/channel_pipeline.cpp](../Core/Network/channel_pipeline.cpp) | 28–200 |
| VC state enum | [Core/Network/virtual_channel.h](../Core/Network/virtual_channel.h) | 22–44 |
| Routing algorithm (MeshXY) | [Core/Network/routing_algo.h](../Core/Network/routing_algo.h) | 44–73 |
| VC & switch allocators | [Core/Network/allocators.h](../Core/Network/allocators.h) | 9–57 |
| Inter-router link | [Core/Interconnect/chi_link.cpp](../Core/Interconnect/chi_link.cpp) | 27–66 |
| Flit channel (timed FIFO) | [Core/Interconnect/flit_channel.h](../Core/Interconnect/flit_channel.h) | 14–47 |
| Credit channel (timed FIFO) | [Core/Interconnect/credit_channel.h](../Core/Interconnect/credit_channel.h) | 13–51 |
| NetworkFabric tick | [Core/Interconnect/network_fabric.cpp](../Core/Interconnect/network_fabric.cpp) | 79–128 |
| Flit ejection | [Core/Interconnect/local_link.cpp](../Core/Interconnect/local_link.cpp) | 56–75 |
| Flit retirement & stats | [Core/Experimentation/traffic_manager.cpp](../Core/Experimentation/traffic_manager.cpp) | 85–173 |
| Simulation phase gate | [Core/Experimentation/traffic_manager.h](../Core/Experimentation/traffic_manager.h) | 81 |
| Simulation kernel cycle order | [Core/SimulationKernel/event_scheduler.cpp](../Core/SimulationKernel/event_scheduler.cpp) | 81–96 |
