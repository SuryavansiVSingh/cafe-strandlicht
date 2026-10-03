// Automated browser tests for the website.
// Run:  npm test   (starts a local server, opens the site in a headless browser, checks everything)
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".png": "image/png" };

// Tiny static file server so the tests need nothing else installed.
const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^([/\\])+/, "");
  try {
    const file = path && path !== "." ? path : "index.html";
    const body = await readFile(join(ROOT, file));
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end("not found"); }
}).listen(0);
const URL_ = `http://localhost:${server.address().port}/`;

let passed = 0, failed = 0;
async function test(name, fn) {
  try { await fn(); passed++; console.log("  ✓", name); }
  catch (e) { failed++; console.log("  ✗", name, "\n     ", e.message); }
}
const assert = (cond, msg) => { if (!cond) throw new Error(msg); };

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const errors = [];

async function open(viewport, query = "") {
  const ctx = await browser.newContext({ viewport, locale: "nl-BE" });
  await ctx.route(/fonts\.(googleapis|gstatic)\.com|openstreetmap\.org/, r => r.abort()); // tests run offline
  const page = await ctx.newPage();
  page.on("pageerror", e => errors.push(e.message));
  await page.goto(URL_ + query);
  return page;
}

console.log("Café Strandlicht — website tests\n");

await test("page loads with Dutch title and all sections", async () => {
  const p = await open({ width: 1280, height: 800 });
  assert((await p.title()).includes("Strandlicht"), "title");
  for (const id of ["menu", "about", "visit", "contact"]) assert(await p.$("#" + id), "missing #" + id);
  assert(await p.getAttribute("html", "lang") === "nl", "default lang should be nl");
  await p.context().close();
});

await test("language switch NL → EN changes text, html lang and URL", async () => {
  const p = await open({ width: 1280, height: 800 });
  await p.click('.lang button[data-lang="en"]');
  assert(await p.textContent("h1") === "Coffee with a sea view", "h1 not translated");
  assert(await p.getAttribute("html", "lang") === "en", "html lang");
  assert(p.url().includes("lang=en"), "url param");
  assert((await p.textContent("#panel-coffee")).includes("Hot chocolate"), "menu not translated");
  await p.context().close();
});

await test("?lang=en link opens the English version", async () => {
  const p = await open({ width: 1280, height: 800 }, "?lang=en");
  assert(await p.textContent("h1") === "Coffee with a sea view", "h1");
  await p.context().close();
});

await test("every Dutch text key has an English translation", async () => {
  const p = await open({ width: 1280, height: 800 });
  const missing = await p.evaluate(() => Object.keys(I18N.nl).filter(k => !(k in I18N.en)));
  assert(missing.length === 0, "missing EN keys: " + missing.join(", "));
  const unknown = await p.evaluate(() => [...document.querySelectorAll("[data-i18n]")].map(e => e.dataset.i18n).filter(k => !(k in I18N.nl)));
  assert(unknown.length === 0, "keys used in HTML but not defined: " + unknown.join(", "));
  await p.context().close();
});

await test("menu tabs switch panels (click and arrow keys)", async () => {
  const p = await open({ width: 1280, height: 800 });
  await p.click("#tab-lunch");
  assert(await p.isVisible("#panel-lunch") && !(await p.isVisible("#panel-coffee")), "click");
  await p.focus("#tab-lunch"); await p.keyboard.press("ArrowRight");
  assert(await p.getAttribute("#tab-sweet", "aria-selected") === "true", "arrow key");
  assert((await p.$$("#panel-sweet li")).length === 5, "sweet items");
  await p.context().close();
});

await test("all menu prices are shown in euro", async () => {
  const p = await open({ width: 1280, height: 800 });
  const prices = await p.$$eval(".menu-list em", els => els.map(e => e.textContent));
  assert(prices.length > 0 && prices.every(x => x.includes("€")), "prices: " + prices.join(" "));
  await p.context().close();
});

await test("scroll animations: sections reveal when scrolled into view", async () => {
  const p = await open({ width: 1280, height: 800 });
  assert(!(await p.$eval("#about .about-text h2", e => e.classList.contains("in"))), "should start hidden");
  await p.locator("#about h2").scrollIntoViewIfNeeded();
  await p.waitForTimeout(400);
  assert(await p.$eval("#about .about-text h2", e => e.classList.contains("in")), "should reveal");
  await p.waitForTimeout(1400);
  assert(await p.textContent('[data-count="60"]') === "60", "counter should reach 60");
  assert(await p.$eval(".site-header", e => e.classList.contains("scrolled")), "header should change on scroll");
  await p.context().close();
});

await test("form: empty submit shows 4 errors and sends nothing", async () => {
  const p = await open({ width: 1280, height: 800 });
  await p.fill('[name="guests"]', "");
  await p.click("#contact-form button[type=submit]");
  const errs = await p.$$eval(".err", els => els.filter(e => e.textContent.trim()).length);
  assert(errs === 4, "expected 4 errors, got " + errs);
  assert(await p.textContent("#form-status") === "", "status should be empty");
  await p.context().close();
});

await test("form: bad email and past date are rejected", async () => {
  const p = await open({ width: 1280, height: 800 });
  await p.fill('[name="name"]', "Jan Peeters");
  await p.fill('[name="email"]', "jan@");
  await p.fill('[name="date"]', "2020-01-01");
  await p.click("#contact-form button[type=submit]");
  assert(await p.getAttribute('[name="email"]', "aria-invalid") === "true", "email");
  assert(await p.getAttribute('[name="date"]', "aria-invalid") === "true", "date");
  await p.context().close();
});

await test("form: valid data in demo mode shows thank-you and resets", async () => {
  const p = await open({ width: 1280, height: 800 });
  const d = new Date(Date.now() + 3 * 864e5).toISOString().slice(0, 10);
  await p.fill('[name="name"]', "Jan Peeters");
  await p.fill('[name="email"]', "jan@example.com");
  await p.fill('[name="date"]', d);
  await p.fill('[name="guests"]', "4");
  await p.click("#contact-form button[type=submit]");
  await p.waitForFunction(() => document.querySelector("#form-status").classList.contains("ok"));
  assert((await p.textContent("#form-status")).includes("Demo"), "demo message");
  assert(await p.inputValue('[name="name"]') === "", "form should reset");
  await p.context().close();
});

await test("mobile (375px): no horizontal scroll, nav fits", async () => {
  const p = await open({ width: 375, height: 740 });
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  assert(overflow <= 0, "page is " + overflow + "px too wide");
  assert(await p.isVisible('.lang button[data-lang="en"]'), "lang switch visible");
  assert(await p.isVisible(".nav .btn"), "reserve button visible");
  await p.context().close();
});

await test("all images load and have width/height set", async () => {
  const p = await open({ width: 1280, height: 800 });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
  await p.waitForTimeout(500);
  const bad = await p.$$eval("img", imgs => imgs.filter(i => !i.complete || i.naturalWidth === 0 || !i.getAttribute("width")).map(i => i.src));
  assert(bad.length === 0, "broken: " + bad.join(", "));
  await p.context().close();
});

await test("no JavaScript errors", async () => {
  assert(errors.length === 0, errors.join(" | "));
});

await browser.close();
server.close();
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
