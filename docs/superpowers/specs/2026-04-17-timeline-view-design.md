# Timeline view for the event-logger dashboard

**Status:** Draft
**Date:** 2026-04-17
**Owner:** @yannbf
**Scope:** `libs/sb-utils/src/event-log-dashboard.html` (no server changes)

## Background

`sb utils event-logger` runs a Hono server that captures Storybook telemetry
events and renders them in a single-file HTML dashboard
(`libs/sb-utils/src/event-log-dashboard.html`). Today the dashboard presents
events as a chronological list with session separators and a sidebar for
filtering by event type and session.

When many sessions run in parallel or in quick succession, the list view does
not convey temporal relationships well — you cannot see at a glance which
sessions overlapped, when each one started, or how event types are distributed
across time.

## Goal

Add a second viewing mode, **Timeline**, that provides an eagle-eye canvas
chart of captured events across all sessions. The existing Dashboard view
remains the default; Timeline is opt-in via a toggle in the header.

The primary questions a user should be able to answer in Timeline view:

1. When did each session start and end, relative to the others?
2. Which sessions overlapped in time?
3. Roughly where in each session did specific event types occur?
4. What is happening right now, with new events appearing live?

Non-goals:

- Visualizing parent/child session relationships. Today's event model has no
  such relationship; sessions are independent. Timeline shows temporal
  emergence only.
- Replacing the Dashboard view. The list remains the detail-oriented view.

## User-facing design

### View toggle

A two-button segmented control is added to the dashboard header, immediately
after the title and status dot: `[Dashboard | Timeline]`. The active view is
persisted in `localStorage` under key `sbutils.eventlog.view`.

Keyboard shortcut `V` cycles between the two views. This is consistent with
the existing single-key shortcuts (`Space`, `/`, `Esc`, `E`).

Switching views preserves all captured events, the active search string, and
all sidebar filters (event types, selected session). Pause/resume state is
also preserved.

### Shared chrome

The existing left sidebar (Event Types, Sessions, Shortcuts) is shown in both
views. All sidebar filters apply to both views:

- Hidden event types do not render in Timeline (no dots, no labels).
- An active session filter dims all other lanes to ~25% opacity.
- The search string dims non-matching dots and their labels.

The header controls (Search, Pause, Clear, Export, event counter) remain
visible in both views. The Auto-scroll and Expand/Collapse buttons are hidden
in Timeline mode — they have no meaning there.

### Timeline layout

Below the header, Timeline mode replaces the list with this vertical stack:

1. **Toolbar** (34px): live-indicator pill, current zoom factor, visible time
   range, lane sort order ("start time ↑" is the only option in v1), and a
   right-aligned group of buttons: `Reset zoom`, `Fit all`, `Export PNG`.
2. **Time axis** (24px): horizontal ruler with adaptive tick marks. Labels
   are rendered in monospace as `mm:ss` relative to the first captured event.
   Major ticks at round intervals chosen to keep ~5–8 labels visible.
3. **Swim-lane canvas** (flex, scrolls vertically): one lane per session.
4. **Minimap** (40px, bottom): density preview of all captured events across
   the full time range, with a draggable viewport window showing the current
   zoom.

### Lane structure (two-row)

Each lane is **44px** tall, split into two sub-rows of 22px each:

- **Top row (22px)**: the session's translucent lifespan bar spans from the
  lane's first event to its last event, rendered at ~18% opacity in the
  session's assigned color. Event dots (8px diameter, colored by `eventType`
  using the existing color map) sit on the axis, horizontally centered on
  their `_receivedAt` timestamp.
- **Bottom row (22px)**: event-type labels, rendered in 10px mono, centered
  on each dot's x-coordinate. Collision rule: labels are placed left-to-right;
  if a label's bounding box would overlap the previous rendered label, it is
  dimmed to 35% opacity and skipped for collision purposes. Zooming in reveals
  hidden labels.

To the left of each lane is a **sticky 130px label column** showing the
session short-id (first 8 chars of `sessionId`) and its total event count. The
column is rendered as an HTML overlay layered above the canvas so that it can
scroll with the lane but remain pinned horizontally during pan/zoom.

Lane order: ascending by the session's first-event `_receivedAt` timestamp
(oldest at top). New sessions appear at the bottom as they arrive.

### Playhead

When Timeline is in live-tail mode, a vertical 1px `--accent` blue line marks
"now" at the right edge of the viewport. A small `now` chip hangs above it on
the axis. As new events arrive, the viewport window shifts rightward so the
playhead stays pinned to the right edge.

### Interactions

- **Hover event dot** → tooltip appears above/below the dot with:
  event type badge, `session: <short-id>`, `received: +mm:ss.mmm`,
  `index: #N`, and a muted hint `click for details →`.
- **Click event dot** → a **right-side details drawer** slides in (400px
  wide). It reuses the same JSON-tabbed renderer the Dashboard card body
  uses (payload / context / metadata / raw). Click outside or press `Esc` to
  close.
- **Click lane label** → toggles the session filter. Syncs with the sidebar's
  active-session state (so switching back to Dashboard view applies the same
  filter).
- **Mouse wheel on canvas** → zoom to cursor position. Zoom factor clamps to
  `[1×, 500×]`, where `1×` means the full captured range fits in the viewport
  (i.e. identical to `Fit all`).
- **Drag on canvas background** → pan horizontally. Cursor changes to
  `grabbing`.
- **Double-click on canvas** → `Fit all` (resets zoom and pan so the full
  captured range fits).
- **Minimap window drag** → pan the main view. Drag the left/right edge of
  the window to zoom by widening/narrowing the window.
- **Live tail**: if the viewport's right edge is within 1s of the most recent
  event, new events auto-scroll the view to keep the playhead at the right
  edge. If the user pans or zooms away, live-tail disengages and a floating
  `Jump to now` pill appears at the bottom-right; clicking it re-engages.
- **Pause button (existing)**: freezes the timeline in place. Incoming events
  still buffer into `state.events` but are not rendered until resume.

### Empty state

When no events have been captured yet, Timeline shows the same empty state as
the Dashboard ("Waiting for telemetry events", with the collector URL) — just
centered inside the timeline canvas area instead of the list area.

## Technical design

### File scope

All changes land in `libs/sb-utils/src/event-log-dashboard.html`. No changes
to `event-logger.ts`, no new dependencies, no build-config changes.

The existing CSS tokens (`--bg`, `--accent`, event colors, etc.) are reused
throughout. No new fonts or external assets.

### State

The existing dashboard state object gains:

```js
state.view = 'dashboard' | 'timeline'     // persisted
state.timeline = {
  zoom: number,              // 1..500, default 1
  panOffsetMs: number,       // left edge of viewport in ms from first event
  followTail: boolean,       // default true; disengages on user pan/zoom
  hoveredEventIndex: number | null,
  selectedEventIndex: number | null,  // drives the details drawer
}
```

Switching to Timeline initializes these on first entry. The existing
`state.events`, `state.activeFilter`, `state.activeSession`, `state.hiddenTypes`,
`state.hiddenSessions`, and `state.search` continue to be the single source of
truth for what is visible.

### Rendering

Two `<canvas>` elements are stacked inside the timeline area, both sized to
the device pixel ratio:

1. **Background canvas** — redraws only when data or view-state (zoom, pan,
   filters) changes. Paints: axis gridlines, lane separators, session
   lifespan bars.
2. **Foreground canvas** — redraws on every animation frame while hovering,
   panning, zooming, or in live-tail. Paints: event dots, event labels,
   playhead, hover highlight ring.

An HTML div overlay hosts: sticky lane-label column, tooltip, details drawer,
`Jump to now` pill. These don't need canvas.

A render is scheduled via `requestAnimationFrame` — callers call
`invalidate('bg' | 'fg' | 'both')` which coalesces multiple invalidations per
frame.

### Hit testing

For hover/click detection on event dots, each lane maintains a sorted array
of `{ x, y, eventIndex }` for currently-rendered events plus a simple x-bucket
index (`Map<number, eventIndex[]>`, bucket width ~8px). Lookup is
`O(bucket density)` — sub-millisecond at 10k events.

### Virtualization

- **Horizontal**: only events whose `_receivedAt` maps to an `x` within
  `[-50px, canvasWidth + 50px]` are processed for dot + label painting.
  Lifespan bars still draw because a clipped rect is cheap.
- **Vertical**: only lanes whose `y` range intersects the scroll viewport
  receive dot/label paint; off-screen lanes draw only their lifespan bar in
  the background layer.

This keeps redraw cost proportional to visible content, not total content.

### Label collision

For each visible lane, iterate events left-to-right. Maintain `lastRight =
-Infinity`. For each event, compute its label's `x` center and width (via
canvas `measureText` cached per eventType). If `labelLeft >= lastRight + 4px`,
paint the label at full opacity and set `lastRight = labelRight`. Otherwise
paint at 35% opacity (collision) and leave `lastRight` unchanged.

### Live update path

The existing SSE handler appends events to `state.events`. In Timeline mode
it additionally:

- If `followTail` is true and the new event's timestamp is past the current
  viewport's right edge, adjust `panOffsetMs` so the playhead stays pinned.
- Call `invalidate('fg')`. Recompute the background only if this event
  introduced a new session (adds a lane) or extended an existing session's
  lifespan bar beyond its prior right edge.

### Keyboard shortcuts

| Key | Action |
|-----|--------|
| `V` | Toggle view (Dashboard ↔ Timeline) |
| `Esc` | Close details drawer if open; else clear search (existing) |
| `Space` | Pause/resume stream (existing, works in both views) |
| `/` | Focus search (existing) |

`E` (expand/collapse all) is ignored in Timeline mode.

### Export

`Export JSON` (existing header button) continues to export the raw event
list. The timeline toolbar's `Export PNG` button calls
`backgroundCanvas.toDataURL('image/png')` after compositing the foreground
canvas on top into a temporary canvas, then triggers a download with filename
`storybook-telemetry-timeline-<ISO8601>.png`.

## Out of scope for v1

Explicitly deferred:

- Brush-to-filter (rubber-band a time range to filter the event list).
- Keyboard event stepping (`←` / `→` to move between events).
- Multi-select event comparison.
- Session grouping or collapsing.
- Per-session color customization.
- Parent/child session relationships (would require event-model changes).

## Risks and trade-offs

- **Vanilla canvas vs. chart library.** Using vanilla canvas adds ~400–600
  lines to the HTML file but avoids any new runtime dependency and keeps the
  single-file delivery model. No off-the-shelf library (uPlot, visx, d3)
  provides swim-lanes + density minimap + live-tail out of the box, so the
  savings from adopting one are modest. Decision: vanilla canvas.
- **Two-row lanes vs. compact inline pills.** Two-row takes more vertical
  space, so fewer sessions fit without scrolling. Accepted trade-off because
  always-visible event-type names are the primary value driver here.
- **Sticky label column as HTML overlay.** Mixing HTML and canvas is slightly
  awkward but is the simplest way to get native text, cursor, and click
  behavior on lane labels. Chrome DevTools Performance uses the same pattern.
- **HTML file size.** The dashboard is already ~1800 lines. Adding ~600
  lines keeps it manageable, and it is cached at server start so runtime
  impact is negligible.

## Open questions

None at spec time. Any ambiguities surfaced during implementation should be
resolved in favor of closest behavioral match to Chrome DevTools Performance
(lane model) and Grafana annotations (label behavior).
