import { defineConfig, type Plugin } from 'vite';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';

/**
 * Generates the service worker at build time with a precache list of every
 * emitted file plus everything in public/, so the game can start offline
 * right after it has been installed.
 */
function serviceWorker(): Plugin {
  return {
    name: 'dagny-service-worker',
    apply: 'build',
    generateBundle(_options, bundle) {
      const files = new Set<string>(['./', 'index.html']);
      for (const name of Object.keys(bundle)) files.add(name);
      const publicDir = join(process.cwd(), 'public');
      const walk = (dir: string): void => {
        for (const entry of readdirSync(dir)) {
          const full = join(dir, entry);
          if (statSync(full).isDirectory()) walk(full);
          else if (entry !== 'sw-template.js') files.add(relative(publicDir, full).split('\\').join('/'));
        }
      };
      walk(publicDir);
      const list = [...files].sort();
      const version = createHash('sha1').update(list.join('|')).update(String(Date.now())).digest('hex').slice(0, 10);
      const template = readFileSync(join(process.cwd(), 'src', 'sw-template.js'), 'utf8');
      const source = template
        .replace('__VERSION__', version)
        .replace('__PRECACHE__', JSON.stringify(list, null, 2));
      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [serviceWorker()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 0,
  },
  server: {
    host: false,
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
} as Parameters<typeof defineConfig>[0]);
