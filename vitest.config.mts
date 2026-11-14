import { defineConfig } from 'vitest/config';

// Vitest only runs the Convex backend tests (convex-test needs the edge runtime).
// Everything else runs on Jest.
export default defineConfig({
    test: {
        environment: 'edge-runtime',
        include: ['convex/**/*.test.ts'],
        server: { deps: { inline: ['convex-test'] } }
    }
});
