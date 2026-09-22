import { build } from 'esbuild';

await Promise.all([
  build({
    entryPoints: ['src/choices.jsx'],
    bundle: true,
    outfile: 'dist/assets/choices.js',
    format: 'esm',
    target: ['es2020'],
    minify: true,
    define: { 'process.env.NODE_ENV': '"production"' },
    legalComments: 'linked',
  }),
  build({
    entryPoints: ['src/title-effect.tsx'],
    bundle: true,
    outfile: 'dist/assets/title-effect.js',
    format: 'esm',
    target: ['es2020'],
    alias: {
      '@': '.',
    },
    minify: true,
    define: { 'process.env.NODE_ENV': '"production"' },
    legalComments: 'linked',
  }),
]);

console.log('Built React components into dist/assets/');
