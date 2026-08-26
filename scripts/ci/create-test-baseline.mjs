import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const [, , logPath, timePath, outputDirectory] = process.argv;

if (!logPath || !timePath || !outputDirectory) {
  throw new Error(
    "Uso: node create-test-baseline.mjs <vitest.log> <time.log> <salida>",
  );
}

const stripAnsi = (text) => text.replace(/\u001b\[[0-9;]*m/g, "");
const toMilliseconds = (value, unit) =>
  Number(value) * (unit.toLowerCase() === "s" ? 1000 : 1);
const readOptional = async (file) => {
  try {
    return await readFile(file, "utf8");
  } catch {
    return "";
  }
};

const log = stripAnsi(await readOptional(logPath));
const timeLog = stripAnsi(await readOptional(timePath));

const testFiles = [...log.matchAll(
  /^\s*[✓✗]\s+(.+?\.test\.[cm]?[jt]sx?)\s+\(\d+\s+tests?\)\s+([\d.]+)(ms|s)\s*$/gim,
)].map((match) => ({
  file: match[1].trim(),
  durationMs: Math.round(toMilliseconds(match[2], match[3])),
}));

const slowestTests = testFiles
  .sort((left, right) => right.durationMs - left.durationMs)
  .slice(0, 10);

const durationMatch = log.match(
  /Duration\s+([\d.]+)(ms|s)\s+\(([^\r\n]+)\)/i,
);
const phases = {};
if (durationMatch) {
  for (const match of durationMatch[3].matchAll(
    /(transform|setup|collect|tests|environment|prepare)\s+([\d.]+)(ms|s)/gi,
  )) {
    phases[match[1].toLowerCase()] = Math.round(
      toMilliseconds(match[2], match[3]),
    );
  }
}

const coverageMatch = log.match(
  /^All files\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)\s*\|\s*([\d.]+)/im,
);
const coverage = coverageMatch
  ? {
      statements: Number(coverageMatch[1]),
      branches: Number(coverageMatch[2]),
      functions: Number(coverageMatch[3]),
      lines: Number(coverageMatch[4]),
    }
  : null;

const memoryMatch = timeLog.match(
  /Maximum resident set size \(kbytes\):\s*(\d+)/i,
);
const maxMemoryKb = memoryMatch ? Number(memoryMatch[1]) : null;
const baseline = {
  generatedAt: new Date().toISOString(),
  repository: process.env.GITHUB_REPOSITORY ?? null,
  commit: process.env.GITHUB_SHA ?? null,
  runId: process.env.GITHUB_RUN_ID ?? null,
  runAttempt: process.env.GITHUB_RUN_ATTEMPT ?? null,
  node: process.version,
  vitest: {
    totalDurationMs: durationMatch
      ? Math.round(toMilliseconds(durationMatch[1], durationMatch[2]))
      : null,
    phasesMs: phases,
    slowestTestFiles: slowestTests,
  },
  coverage,
  memory: {
    maxResidentSetKb: maxMemoryKb,
    maxResidentSetMb:
      maxMemoryKb === null ? null : Number((maxMemoryKb / 1024).toFixed(2)),
  },
};

const formatDuration = (milliseconds) =>
  milliseconds === null || milliseconds === undefined
    ? "No disponible"
    : `${(milliseconds / 1000).toFixed(2)} s`;
const formatCoverage = (value) =>
  value === null || value === undefined ? "N/D" : `${value.toFixed(2)} %`;

const phaseRows = Object.entries(phases)
  .map(([phase, duration]) => `| ${phase} | ${formatDuration(duration)} |`)
  .join("\n");
const slowRows = slowestTests
  .map(
    (test, index) =>
      `| ${index + 1} | \`${test.file}\` | ${formatDuration(test.durationMs)} |`,
  )
  .join("\n");

const markdown = `# Línea base de pruebas

- Commit: \`${baseline.commit ?? "local"}\`
- Node.js: \`${baseline.node}\`
- Duración total de Vitest: **${formatDuration(baseline.vitest.totalDurationMs)}**
- Memoria residente máxima: **${baseline.memory.maxResidentSetMb ?? "N/D"} MB**

## Fases de Vitest

| Fase | Duración |
|---|---:|
${phaseRows || "| Sin información | N/D |"}

## Diez archivos de prueba más lentos

| # | Archivo | Duración |
|---:|---|---:|
${slowRows || "| - | Sin información | N/D |"}

## Cobertura

| Sentencias | Ramas | Funciones | Líneas |
|---:|---:|---:|---:|
| ${formatCoverage(coverage?.statements)} | ${formatCoverage(coverage?.branches)} | ${formatCoverage(coverage?.functions)} | ${formatCoverage(coverage?.lines)} |
`;

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(
    path.join(outputDirectory, "test-baseline.json"),
    `${JSON.stringify(baseline, null, 2)}\n`,
  ),
  writeFile(path.join(outputDirectory, "test-baseline.md"), markdown),
]);

process.stdout.write(markdown);
