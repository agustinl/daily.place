import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * E2E builds go to .next-e2e, and `next build` points next-env.d.ts (a tracked file) at that
 * folder. Point it back at .next so test runs leave the working tree clean.
 */
export default function globalTeardown() {
    const file = join(__dirname, '..', 'next-env.d.ts');
    const content = readFileSync(file, 'utf8');
    const restored = content.replace('./.next-e2e/', './.next/');

    if (restored !== content) writeFileSync(file, restored);
}
