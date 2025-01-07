import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: [
    '../../bdchapril.js',
    '../../sw.js',
    '../../lib/comicgen.js',
    '../../styles/bdchapril.css',
    '../../styles/chapril-banner.css'
  ],
  bundle: true,
  loader: {
    '.png': 'dataurl',
    '.ico': 'dataurl',
    '.eot': 'dataurl',
    '.woff': 'dataurl',
    '.ttf': 'dataurl',
    '.svg': 'text'
  },
  minify: true,
  sourcemap: 'linked',
  write: true,
  outdir: '../../dist'
});
