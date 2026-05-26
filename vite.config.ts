import { spawn } from 'node:child_process';
import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Dev-only API: POST /api/generate?type=technical|za
 * Spawns `claude -p "/gen-tech"` (or "/gen-za") as a subprocess. The slash command
 * is defined in .claude/commands/, which writes a new JSON file under src/exams/.
 * Vite picks the new file up; the client reloads to surface it.
 *
 * Only available in dev. Production builds will not serve this route.
 */
function examGeneratorPlugin(): PluginOption {
  return {
    name: 'ztp-exam-generator',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/generate', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed; use POST.' }));
          return;
        }

        const url = new URL(req.url ?? '', 'http://localhost');
        const type = url.searchParams.get('type');
        if (type !== 'technical' && type !== 'za') {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'type must be "technical" or "za"' }));
          return;
        }
        const slashCmd = type === 'technical' ? '/gen-tech' : '/gen-za';

        // claude -p runs in print (non-interactive) mode.
        // --dangerously-skip-permissions auto-accepts file writes — safe here because
        // the slash command is scoped to writing under src/exams/.
        const child = spawn(
          'claude',
          ['-p', slashCmd, '--dangerously-skip-permissions'],
          {
            cwd: process.cwd(),
            stdio: ['ignore', 'pipe', 'pipe'],
          },
        );

        let stdout = '';
        let stderr = '';
        const started = Date.now();

        child.stdout.on('data', (chunk: Buffer) => {
          stdout += chunk.toString('utf8');
        });
        child.stderr.on('data', (chunk: Buffer) => {
          stderr += chunk.toString('utf8');
        });

        child.on('error', (err) => {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              error: `Failed to spawn 'claude' CLI: ${err.message}. Is Claude Code installed and on PATH?`,
            }),
          );
        });

        child.on('close', (code) => {
          const durationSec = Math.round((Date.now() - started) / 1000);
          if (code === 0) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                ok: true,
                durationSec,
                stdout: stdout.slice(-4000), // tail only — full log is long
              }),
            );
          } else {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                ok: false,
                exitCode: code,
                durationSec,
                stderr: stderr.slice(-4000),
                stdout: stdout.slice(-2000),
              }),
            );
          }
        });

        // Abort the child if the client disconnects.
        req.on('close', () => {
          if (child.exitCode === null) child.kill('SIGTERM');
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), examGeneratorPlugin()],
  server: {
    port: 5173,
    open: true,
  },
});
