// PostToolUse hook (Edit|Write): format the touched file with the project's Prettier.
// Reads the hook payload from stdin. Never fails the tool call: formatting is best-effort.
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { relative, resolve, isAbsolute } from 'node:path'

const projectDir = resolve(process.env.CLAUDE_PROJECT_DIR ?? process.cwd())

let raw = ''
for await (const chunk of process.stdin) raw += chunk

let payload
try {
  payload = JSON.parse(raw)
} catch {
  process.exit(0)
}

const file = payload?.tool_response?.filePath ?? payload?.tool_input?.file_path
if (typeof file !== 'string' || file === '') process.exit(0)

const absolute = resolve(projectDir, file)
const rel = relative(projectDir, absolute)
// Only touch files inside the project.
if (rel.startsWith('..') || isAbsolute(rel) || !existsSync(absolute)) process.exit(0)

const prettier = resolve(projectDir, 'node_modules', 'prettier', 'bin', 'prettier.cjs')
if (!existsSync(prettier)) process.exit(0)

// --ignore-unknown skips file types Prettier has no parser for; .prettierignore is honored by default.
spawnSync(
  process.execPath,
  [prettier, '--write', '--ignore-unknown', '--log-level', 'silent', absolute],
  {
    cwd: projectDir,
    stdio: 'ignore',
  },
)
process.exit(0)
