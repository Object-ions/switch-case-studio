/**
 * LC-26a-rev: the URL the visitor actually landed on, captured when the
 * ENTRY chunk evaluates — imported by src/index.js precisely so this module
 * can never be pulled into a lazy route chunk (a route-chunk capture reads
 * the pathname AFTER a client navigation has already happened and breaks
 * the land-elsewhere-then-navigate case; verified against the built chunks,
 * see .audit/legacy-cleanup.md LC-26a-rev).
 * null during SSG — no window in Node; consumers only read this in effects.
 */
export const LANDING_PATHNAME =
  typeof window !== 'undefined' ? window.location.pathname : null;

if (typeof window !== 'undefined') {
  // LOAD-BEARING, PERMANENT side effect — NOT leftover instrumentation, do
  // not remove in any cleanup sweep. Removing it makes this module
  // side-effect-free, rollup tree-shakes the bare import out of index.js,
  // and the module re-bundles into the first consumer's LAZY route chunk —
  // where the capture runs AFTER the first client navigation and reads the
  // wrong pathname. That silently breaks first-load detection
  // (land-elsewhere-then-navigate loses its entrance) with NO test failing.
  // Observed, not theoretical: it happened the first time the "debug"
  // global was removed (2026-07-22 tree-shaking incident, ledger
  // LC-26a-rev). The marker also keeps chunk placement verifiable by
  // artifact: the standing check in CLAUDE.md greps the built ENTRY chunk
  // for this name and fails the build verification if it is absent.
  window.__SCS_LANDING_PATHNAME__ = LANDING_PATHNAME;
}
