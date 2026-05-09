import Beasties from 'beasties';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';

/**
 * Vite plugin that extracts critical above-the-fold CSS and inlines it
 * in the HTML <head>. Remaining CSS is loaded asynchronously via the
 * media="print" onload="this.media='all'" pattern.
 *
 * This runs after the build output is written to disk so that CSS files
 * are available for beasties to analyse.
 */
export function criticalCssPlugin() {
  let outDir;
  let root;

  return {
    name: 'vite-plugin-critical-css',
    apply: 'build',
    enforce: 'post',

    configResolved(config) {
      root = config.root;
      outDir = resolve(config.root, config.build.outDir);
    },

    async closeBundle() {
      const htmlPath = join(outDir, 'index.html');

      let html;
      try {
        html = readFileSync(htmlPath, 'utf-8');
      } catch (err) {
        console.warn('[critical-css] Could not read index.html:', err.message);
        return;
      }

      const beasties = new Beasties({
        // Path where CSS files are located (the build output directory)
        path: outDir,
        // Use media="print" onload pattern for non-critical CSS
        preload: 'media',
        // Inline critical CSS in a <style> tag
        reduceInlineStyles: true,
        // Don't inline font declarations (they're preloaded separately)
        inlineFonts: false,
        // Compress the inlined CSS
        compress: true,
        // Log level
        logLevel: 'warn',
      });

      try {
        const result = await beasties.process(html);
        writeFileSync(htmlPath, result, 'utf-8');
        console.log('[critical-css] Successfully inlined critical CSS');
      } catch (err) {
        console.warn('[critical-css] Failed to extract critical CSS:', err.message);
      }
    },
  };
}
