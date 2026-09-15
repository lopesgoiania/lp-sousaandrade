import { build } from 'esbuild';
await build({
  entryPoints: ['src/choices.jsx'],
  bundle: true,
  outfile: 'dist/assets/choices.js',
  format: 'esm',
  target: ['es2020'],
  minify: true,
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'linked',
});
console.log('Built React BorderBeam enhancement into dist/assets/choices.js');
