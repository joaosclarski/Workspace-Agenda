#!/usr/bin/env node
// Executa as restrições de CONSTRAINTS.md. Uso: node scripts/check.mjs <fast|task|full>
// CONSTRAINTS.md é a fonte canônica: este script apenas espelha suas regras e lê dele os valores de ratchet.

import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const STAGE = process.argv[2] ?? "fast";
const PORT = 3210;
const URL = `http://localhost:${PORT}`;
const REPORTS = join(ROOT, ".constraints", "reports");
mkdirSync(REPORTS, { recursive: true });

/** @type {{ name: string; level: "block" | "warn"; ok: boolean; detail: string; ms: number }[]} */
const results = [];

async function check(name, level, fn) {
  const t0 = Date.now();
  let ok = false;
  let detail = "";
  try {
    [ok, detail] = await fn();
  } catch (error) {
    detail = error instanceof Error ? error.message : String(error);
  }
  const ms = Date.now() - t0;
  results.push({ name, level, ok, detail, ms });
  const icon = ok ? "✔" : level === "block" ? "✖" : "⚠";
  console.log(`${icon} ${name} (${(ms / 1000).toFixed(1)}s)${detail ? ` — ${detail}` : ""}`);
}

const run = (cmd, opts = {}) => spawnSync(cmd, { shell: true, encoding: "utf8", cwd: ROOT, ...opts });
const tail = (text, lines = 15) => text.trim().split("\n").slice(-lines).join("\n");

// ---------- Ratchets: lidos da tabela "Medido" de CONSTRAINTS.md ----------
function baseline(metric) {
  const md = readFileSync(join(ROOT, "CONSTRAINTS.md"), "utf8");
  const row = md.split("\n").find((line) => line.startsWith(`| ${metric} |`));
  const value = row?.split("|")[2]?.trim();
  const num = value ? Number.parseFloat(value.replace(",", ".")) : Number.NaN;
  if (Number.isNaN(num)) throw new Error(`linha "${metric}" não encontrada em CONSTRAINTS.md`);
  return num;
}

// ---------- Piso ----------
const FLOOR_PATTERNS = [
  [/@ts-(ignore|expect-error|nocheck)/, "supressão do TypeScript"],
  [/eslint-disable/, "supressão do ESLint"],
  [/istanbul ignore|c8 ignore/, "exclusão de cobertura"],
  [/gitleaks:allow|nosemgrep/, "supressão de scanner de segurança"],
  [/throw new Error\(\s*["'`]Not implemented/i, "stub não implementado"],
  [/catch\s*(\([^)]*\))?\s*\{\s*\}/, "catch vazio"],
  [/\b(it|test|describe)\.(skip|only)\(|\bx(it|describe)\(/, "teste pulado/isolado"],
];
const FLOOR_DIRS = ["src", "scripts"];
const FLOOR_EXT = /\.(ts|tsx|js|jsx|mjs|cjs)$/;

function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : FLOOR_EXT.test(name) ? [full] : [];
  });
}

function floorScan() {
  const self = join(ROOT, "scripts", "check.mjs");
  const hits = [];
  for (const file of FLOOR_DIRS.flatMap((d) => walk(join(ROOT, d)))) {
    if (file === self) continue; // este arquivo contém os próprios padrões
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        for (const [re, label] of FLOOR_PATTERNS) {
          if (re.test(line)) hits.push(`${relative(ROOT, file)}:${i + 1} ${label}`);
        }
      });
  }
  return [hits.length === 0, hits.join("; ")];
}

function gitleaksBin() {
  if (run("gitleaks version").status === 0) return "gitleaks";
  // winget instala fora do PATH do shell atual até ele ser reiniciado.
  const pkgs = join(process.env.LOCALAPPDATA ?? "", "Microsoft", "WinGet", "Packages");
  const dir = existsSync(pkgs) && readdirSync(pkgs).find((d) => d.startsWith("Gitleaks.Gitleaks"));
  if (dir) return `"${join(pkgs, dir, "gitleaks.exe")}"`;
  throw new Error("gitleaks não instalado (winget install Gitleaks.Gitleaks)");
}

async function fast() {
  await check("Tipos (tsc --noEmit)", "block", () => {
    const r = run("npx tsc --noEmit");
    return [r.status === 0, r.status === 0 ? "" : tail(r.stdout)];
  });
  await check("Lint (eslint --max-warnings=0)", "block", () => {
    const r = run("npx eslint . --max-warnings=0");
    return [r.status === 0, r.status === 0 ? "" : tail(r.stdout)];
  });
  await check("Piso (supressões, stubs, testes pulados)", "block", floorScan);
  await check("Segredos (gitleaks --redact)", "block", () => {
    const report = join(REPORTS, "gitleaks.json");
    const r = run(
      `${gitleaksBin()} dir . --redact --no-banner --config .gitleaks.toml --report-format json --report-path "${report}" --exit-code 1`,
    );
    if (r.status === 0) return [true, ""];
    // --redact: só regra e local, nunca o valor.
    const findings = existsSync(report) ? JSON.parse(readFileSync(report, "utf8")) : [];
    const where = findings.map((f) => `${f.RuleID} em ${f.File}:${f.StartLine}`).join("; ");
    return [false, where || tail(r.stderr)];
  });
}

// ---------- Etapa de tarefa ----------
async function waitForServer(timeoutMs = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      if ((await fetch(URL)).ok) return;
    } catch {
      // ainda subindo
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`servidor não respondeu em ${URL}`);
}

async function task() {
  await fast();
  if (results.some((r) => r.level === "block" && !r.ok)) return; // não adianta medir um build quebrado

  await check("Build (next build --webpack)", "block", () => {
    const r = run("npx next build --webpack");
    return [r.status === 0, r.status === 0 ? "" : tail(r.stdout + r.stderr)];
  });
  if (results.some((r) => r.level === "block" && !r.ok)) return;

  await check("Dependências (npm audit --audit-level=high)", "warn", () => {
    const r = run("npm audit --omit=dev --audit-level=high --json");
    const v = JSON.parse(r.stdout || "{}").metadata?.vulnerabilities ?? {};
    const bad = (v.high ?? 0) + (v.critical ?? 0);
    return [bad === 0, bad ? `${v.high ?? 0} alta(s), ${v.critical ?? 0} crítica(s)` : ""];
  });

  await check("Bundle JS (size-limit, gzip)", "warn", () => {
    const r = run("npx size-limit --json");
    const [entry] = JSON.parse(r.stdout || "[]");
    if (!entry) return [false, tail(r.stderr || r.stdout)];
    const kb = entry.size / 1000;
    const max = baseline("JS total (gzip)") * 1.005; // tolerância de 0,5%
    return [kb <= max, `${kb.toFixed(1)} kB (base ${baseline("JS total (gzip)")} kB)`];
  });

  const server = spawn(process.execPath, [join(ROOT, "node_modules", "next", "dist", "bin", "next"), "start", "-p", String(PORT)], {
    cwd: ROOT,
    stdio: "ignore",
  });
  try {
    await waitForServer();

    await check("Acessibilidade (axe, WCAG 2.1 AA)", "warn", () => {
      const r = run(`npx axe ${URL} --tags wcag2a,wcag2aa,wcag21aa --dir "${REPORTS}" --save axe.json`);
      const file = join(REPORTS, "axe.json");
      if (!existsSync(file)) return [false, tail(r.stdout + r.stderr)];
      const violations = JSON.parse(readFileSync(file, "utf8")).flatMap((page) => page.violations ?? []);
      const severe = violations.filter((v) => v.impact === "critical" || v.impact === "serious");
      const minor = violations.length - severe.length;
      return [
        severe.length === 0,
        [severe.map((v) => `${v.impact}: ${v.id} (${v.nodes.length})`).join("; "), minor ? `${minor} moderada(s)/leve(s)` : ""]
          .filter(Boolean)
          .join(" · "),
      ];
    });

    const lhFile = join(REPORTS, "lighthouse.json");
    run(
      `npx lighthouse ${URL} --only-categories=performance --output=json --output-path="${lhFile}" --quiet --chrome-flags="--headless=new"`,
    );
    const lh = existsSync(lhFile) ? JSON.parse(readFileSync(lhFile, "utf8")) : null;

    await check("Performance: LCP ≤ 2500 ms, CLS ≤ 0,1 (Lighthouse mobile)", "warn", () => {
      if (!lh) return [false, "Lighthouse não gerou relatório"];
      const lcp = lh.audits["largest-contentful-paint"].numericValue;
      const cls = lh.audits["cumulative-layout-shift"].numericValue;
      return [lcp <= 2500 && cls <= 0.1, `LCP ${Math.round(lcp)} ms, CLS ${cls.toFixed(3)}`];
    });
    await check("Performance: score não cai (ratchet)", "warn", () => {
      if (!lh) return [false, "Lighthouse não gerou relatório"];
      const score = Math.round(lh.categories.performance.score * 100);
      const base = baseline("Lighthouse performance (mobile)");
      return [score >= base - 3, `${score} (base ${base}, tolerância 3)`];
    });
  } finally {
    server.kill();
  }
}

const t0 = Date.now();
if (STAGE === "fast") await fast();
else if (STAGE === "task" || STAGE === "full") await task();
else {
  console.error(`Etapa desconhecida: ${STAGE}. Use fast, task ou full.`);
  process.exit(2);
}

const blocked = results.filter((r) => r.level === "block" && !r.ok);
const warned = results.filter((r) => r.level === "warn" && !r.ok);
console.log(
  `\n${STAGE}: ${results.length - blocked.length - warned.length}/${results.length} ok, ` +
    `${blocked.length} bloqueante(s), ${warned.length} aviso(s) em ${((Date.now() - t0) / 1000).toFixed(0)}s`,
);
process.exit(blocked.length ? 1 : 0);
