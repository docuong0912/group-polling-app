const fs = require("node:fs");
const path = require("node:path");

const sourceExtension = /\.(?:[cm]?[jt]sx?)$/i;
const sourceExtensionInText = /\.(?:[cm]?[jt]sx?)\b/i;
const workspaceRoot = path.resolve(__dirname, "../..");

function isSourcePath(value) {
  return (
    typeof value === "string" &&
    sourceExtension.test(value) &&
    !/(?:^|[/\\])(?:node_modules|\.next)(?:[/\\]|$)/.test(value)
  );
}

function collectFilePaths(value, key = "") {
  if (typeof value === "string") {
    if (/(?:file|path|uri|target|destination|filename)/i.test(key)) {
      return [value];
    }

    const patchPaths = [...value.matchAll(/^\*\*\* (?:Add|Update|Delete) File: (.+)$/gm)];
    return patchPaths.map((match) => match[1]);
  }

  if (Array.isArray(value)) {
    return value.flatMap((item) => collectFilePaths(item, key));
  }

  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([childKey, childValue]) =>
      collectFilePaths(childValue, childKey),
    );
  }

  return [];
}

function isCodeWritingTool(event, serializedArgs) {
  const toolName = String(event.toolName ?? event.tool_name ?? "").toLowerCase();
  const args = serializedArgs.toLowerCase();

  if (/\b(?:test|vitest|jest)\b/.test(toolName) || /\bnpm\s+(?:run\s+)?test\b/.test(args)) {
    return false;
  }

  if (/(?:edit|write|create|patch|replace|insert|delete|modify)/.test(toolName)) {
    return true;
  }

  const isTerminalTool = /(?:terminal|shell|command)/.test(toolName);
  const hasWriteOperation =
    /\bapply_patch\b|\bgit\s+apply\b|\btee\b|(?:^|\s)>{1,2}|(?:^|\s)sed\b.*\s-i\b|--write\b|--fix\b/.test(
      args,
    );

  return isTerminalTool && hasWriteOperation;
}

function emitContext(message) {
  process.stdout.write(`${JSON.stringify({ additionalContext: message })}\n`);
}

let event;
try {
  event = JSON.parse(fs.readFileSync(0, "utf8"));
} catch (error) {
  console.error(`Could not parse the PostToolUse event: ${error.message}`);
  process.exit(1);
}

const toolArgs = event.toolArgs ?? event.tool_args ?? {};
const serializedArgs = typeof toolArgs === "string" ? toolArgs : JSON.stringify(toolArgs);
const referencedPaths = collectFilePaths(toolArgs);
const toolName = String(event.toolName ?? event.tool_name ?? "").toLowerCase();
const isTerminalTool = /(?:terminal|shell|command)/.test(toolName);
const referencesSource =
  referencedPaths.some(isSourcePath) ||
  (isTerminalTool && sourceExtensionInText.test(serializedArgs));

if (
  !referencesSource ||
  !isCodeWritingTool(event, serializedArgs)
) {
  process.stdout.write("{}\n");
  process.exit(0);
}

emitContext(
  "Source files changed. Do not run repository-controlled tests automatically; review the test script and test code, then ask the user before running npm test in poll-creator-app-main.",
);
