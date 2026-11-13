import { execFileSync } from 'node:child_process';

/**
 * `next build` (run by the Playwright webServer) regenerates the PWA service
 * worker files, which are still versioned. Restore them after every e2e run so
 * the working tree stays clean.
 */
export default function globalTeardown() {
    try {
        // Restore tracked files to their committed version
        execFileSync('git', ['checkout', '--', 'public/sw.js', 'public/workbox-*.js'], {
            stdio: 'ignore'
        });
        // Remove new untracked workbox chunks (a new hash produces a new file name)
        execFileSync('git', ['clean', '-f', '--', 'public/workbox-*.js', 'public/*.js.map'], {
            stdio: 'ignore'
        });
    } catch {
        // Not a git checkout (or git unavailable): nothing to restore
    }
}
