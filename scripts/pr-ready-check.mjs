#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

const runGit = (args) => {
  try {
    return execFileSync("git", args, {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trimEnd();
  } catch {
    return "";
  }
};

const normalizePath = (filePath) => filePath.replaceAll("\\", "/");

const parseStatus = (statusOutput) => {
  if (!statusOutput) return [];

  return statusOutput
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const status = line.slice(0, 2);
      const rawPath = line.slice(3);
      const renameParts = rawPath.split(" -> ");
      const filePath = normalizePath(renameParts.at(-1) ?? rawPath);

      return {
        status,
        path: filePath,
      };
    });
};

const isDeleted = (entry) => entry.status.includes("D") && !existsSync(path.join(repoRoot, entry.path));

const isTextReadable = (filePath) => {
  const absolutePath = path.join(repoRoot, filePath);
  if (!existsSync(absolutePath)) return false;

  const stats = statSync(absolutePath);
  if (!stats.isFile() || stats.size > 1024 * 1024) return false;

  const extension = path.extname(filePath).toLowerCase();
  const skippedExtensions = new Set([
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".ico",
    ".pdf",
    ".zip",
    ".gz",
    ".woff",
    ".woff2",
    ".ttf",
    ".eot",
    ".wasm",
  ]);

  return !skippedExtensions.has(extension);
};

const readTextFile = (filePath) => {
  try {
    return readFileSync(path.join(repoRoot, filePath), "utf8");
  } catch {
    return "";
  }
};

const safeSample = (value) => {
  if (!value) return "";
  const compact = value.replace(/\s+/g, " ").trim();
  if (compact.length <= 16) return "[redacted]";
  return `${compact.slice(0, 4)}...[redacted]...${compact.slice(-4)}`;
};

const placeholderPattern =
  /^(|["']?["']?|<[^>]+>|your[-_ ]|example|placeholder|changeme|change-me|dummy|test|xxx|xxxx|todo|not-set|unset|null|undefined)/i;

const secretKeyPattern =
  /(api[_-]?key|secret|token|password|private[_-]?key|service[_-]?role|database[_-]?url|postgres(?:ql)?[_-]?url|supabase.*(?:key|secret|url)|next_public_supabase_(?:url|anon_key))/i;

const assignmentPattern =
  /^\s*(?:export\s+)?([A-Z0-9_./-]*(?:API[_-]?KEY|SECRET|TOKEN|PASSWORD|PRIVATE[_-]?KEY|SERVICE[_-]?ROLE|DATABASE[_-]?URL|POSTGRES(?:QL)?[_-]?URL|SUPABASE[A-Z0-9_./-]*(?:KEY|SECRET|URL)|NEXT_PUBLIC_SUPABASE_(?:URL|ANON_KEY))[A-Z0-9_./-]*)\s*[:=]\s*["']?(.+?)["']?\s*[,;]?\s*$/i;

const jwtLikePattern = /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\b/g;

const classifySecretLine = (line) => {
  const assignment = line.match(assignmentPattern);
  if (assignment) {
    const key = assignment[1];
    const value = assignment[2].trim();
    if (secretKeyPattern.test(key) && !placeholderPattern.test(value)) {
      return {
        kind: /SERVICE[_-]?ROLE/i.test(key) ? "service-role-assignment" : "secret-like-assignment",
        sample: safeSample(value),
      };
    }
  }

  const jwtMatches = line.match(jwtLikePattern) ?? [];
  if (jwtMatches.length > 0) {
    return {
      kind: /service[_-]?role/i.test(line) ? "service-role-jwt" : "jwt-like-secret",
      sample: safeSample(jwtMatches[0]),
    };
  }

  return null;
};

const conflictMarkerPattern = /^(<<<<<<<|=======|>>>>>>>)(?:\s|$)/;

const highRiskPathPattern =
  /(^|\/)(supabase|migrations)(\/|$)|(^|\/)middleware\.(ts|js)$|(^|\/)app\/api\/|(^|\/)lib\/supabase\/|auth|rls|row-level|policy|policies|security|\.sql$|(^|\/)\.env(?:$|\.)|(^|\/)env(?:$|\.)|vercel\.json/i;

const mediumRiskPathPattern =
  /(^|\/)(app|components|lib|scripts)(\/|$)|package\.json|package-lock\.json|next\.config\.|tsconfig\.json|eslint\.config\./i;

const unsafeFilePattern =
  /(^|\/)\.env($|\.local$|\.production$|\.development$|\.preview$)|(^|\/).*service[_-]?role.*|(^|\/).*\.(pem|p12|pfx|key)$|(^|\/)id_rsa($|\.)/i;

const docsOnlyPattern = /^(docs\/.+\.md|AGENTS\.md|README\.md)$/i;

const statusOutput = runGit(["status", "--porcelain=v1", "--untracked-files=all"]);
const branch = runGit(["branch", "--show-current"]) || "(detached)";
const upstreamStatus = runGit(["status", "--short", "--branch"]).split(/\r?\n/)[0] ?? "";
const entries = parseStatus(statusOutput);
const changedFiles = entries.map((entry) => entry.path);
const readableEntries = entries.filter((entry) => !isDeleted(entry) && isTextReadable(entry.path));

const conflictFindings = [];
const secretFindings = [];

for (const entry of readableEntries) {
  const content = readTextFile(entry.path);
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    if (conflictMarkerPattern.test(line)) {
      conflictFindings.push({
        file: entry.path,
        line: index + 1,
        marker: line.slice(0, 7),
      });
    }

    const secret = classifySecretLine(line);
    if (secret) {
      secretFindings.push({
        file: entry.path,
        line: index + 1,
        kind: secret.kind,
        sample: secret.sample,
      });
    }
  });
}

const unsafeFileChanges = changedFiles.filter((filePath) => unsafeFilePattern.test(filePath));
const highRiskFiles = changedFiles.filter((filePath) => highRiskPathPattern.test(filePath));
const mediumRiskFiles = changedFiles.filter(
  (filePath) => !highRiskPathPattern.test(filePath) && mediumRiskPathPattern.test(filePath),
);
const docsOnlySmallChange =
  changedFiles.length > 0 && changedFiles.every((filePath) => docsOnlyPattern.test(filePath));

const blockers = [
  ...conflictFindings.map((finding) => ({
    type: "conflict-marker",
    detail: `${finding.file}:${finding.line} (${finding.marker})`,
  })),
  ...secretFindings.map((finding) => ({
    type: finding.kind,
    detail: `${finding.file}:${finding.line} (${finding.sample})`,
  })),
  ...unsafeFileChanges.map((filePath) => ({
    type: "unsafe-file-change",
    detail: filePath,
  })),
];

const risk =
  blockers.length > 0 || highRiskFiles.length > 0
    ? "High"
    : docsOnlySmallChange
      ? "Low"
      : changedFiles.length > 0
        ? "Medium"
        : "Low";

const reviewGateRequired = changedFiles.length > 0;
const reviewGateReasons = [];
if (reviewGateRequired) reviewGateReasons.push("changed files present");
if (highRiskFiles.length > 0) reviewGateReasons.push("high-risk area changed");
if (blockers.length > 0) reviewGateReasons.push("blocker requires fix before approval");
if (docsOnlySmallChange) reviewGateReasons.push("docs-only small change");

const unique = (items) => [...new Set(items)];
const formatList = (items, limit = 12) => {
  const uniqueItems = unique(items);
  if (uniqueItems.length === 0) return "  - none";

  const visible = uniqueItems.slice(0, limit).map((item) => `  - ${item}`);
  const hidden = uniqueItems.length - visible.length;
  if (hidden > 0) visible.push(`  - ...and ${hidden} more`);

  return visible.join("\n");
};

const formatFindings = (items) => {
  if (items.length === 0) return "  - none";
  return items.map((item) => `  - ${item.type}: ${item.detail}`).join("\n");
};

const summary = [
  `branch=${branch}`,
  `files=${changedFiles.length}`,
  `risk=${risk}`,
  `blockers=${blockers.length}`,
  `reviewGate=${reviewGateRequired ? "required" : "not-required"}`,
].join(" ");

console.log("PR Readiness Check");
console.log("==================");
console.log(`Branch: ${branch}`);
if (upstreamStatus) console.log(`Git: ${upstreamStatus}`);
console.log(`Changed files: ${changedFiles.length}`);
console.log(`Risk: ${risk}`);
console.log(`Review Gate: ${reviewGateRequired ? "Required" : "Not required"}`);
if (reviewGateReasons.length > 0) {
  console.log(`Review Gate reasons: ${unique(reviewGateReasons).join(", ")}`);
}
console.log("");

console.log("Changed Files");
console.log(formatList(changedFiles));
console.log("");

console.log("High-risk Files");
console.log(formatList(highRiskFiles));
console.log("");

console.log("Medium-risk Files");
console.log(formatList(mediumRiskFiles));
console.log("");

console.log("Blockers");
console.log(formatFindings(blockers));
console.log("");

console.log("Required Before PR / Review Gate");
console.log("  - fix blockers if any");
console.log("  - run npm run verify when the change is ready for full verification");
console.log("  - run npm run pr-ready again after fixes or verification");
console.log("");

console.log("Short Summary");
console.log(`  ${summary}`);

process.exitCode = blockers.length > 0 ? 1 : 0;
