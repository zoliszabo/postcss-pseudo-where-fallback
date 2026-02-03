import terser from '@rollup/plugin-terser';

const terserPlugin = terser({
  compress: false,
  mangle: false,
  format: {
    comments: false,
    beautify: true,
  },
});

export default {
  input: 'src/index.mjs',
  external: [
    'postcss',
    'postcss-selector-parser',
  ],
  output: [
    {
      file: 'dist/index.mjs',
      format: 'esm',
      plugins: [terserPlugin],
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      plugins: [terserPlugin],
      exports: 'default'
    }
  ]
};
