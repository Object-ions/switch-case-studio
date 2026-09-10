// Headless Chrome probe over raw CDP, no dependencies (Node 22+ has WebSocket).
// Why: the MCP/visible automation window stops producing frames when occluded, so
// IntersectionObservers, video playback and scroll-driven state silently stall
// there (CLAUDE.md: occluded-window trap). New headless renders frames on its own.
//
//   node scripts/headless-probe.mjs <url> '<js expression, may be an async IIFE>' [--phone] [--shot out.png]
//
// --phone emulates 390×844 @2x (Chrome refuses windows narrower than ~500px, so
// --window-size cannot do this). The expression is evaluated with awaitPromise and
// its JSON value printed.
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const [, , url, expr, ...flags] = process.argv;
if (!url || !expr) { console.error("usage: node scripts/headless-probe.mjs <url> '<expr>' [--phone] [--shot file.png]"); process.exit(2); }
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = 9333 + Math.floor(Math.random() * 500);
const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", `--remote-debugging-port=${PORT}`, "--window-size=1440,900", "--autoplay-policy=no-user-gesture-required", "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let ws, id = 0; const pending = new Map();
for (let i = 0; i < 40 && !ws; i++) {
  try { const list = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); const page = list.find((t) => t.type === "page"); const sock = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r, j) => { sock.onopen = r; sock.onerror = j; }); ws = sock; } catch { await sleep(250); }
}
if (!ws) { chrome.kill(); throw new Error("Chrome did not expose a debugging target"); }
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
await send("Page.enable"); await send("Runtime.enable");
if (flags.includes("--phone")) await send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
await send("Page.navigate", { url }); await sleep(2500);
const r = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
console.log(JSON.stringify(r.result?.result?.value ?? r.result?.exceptionDetails ?? r, null, 1));
const shotIdx = flags.indexOf("--shot");
if (shotIdx !== -1 && flags[shotIdx + 1]) { const shot = await send("Page.captureScreenshot", { format: "png" }); writeFileSync(flags[shotIdx + 1], Buffer.from(shot.result.data, "base64")); }
ws.close(); chrome.kill();
