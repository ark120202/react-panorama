import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import prettier from 'rollup-plugin-prettier';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const BANNER = `/**
 * React Panorama (${pkg.repository})
 * @version ${pkg.version}
 * @license ${pkg.license}
 */`;

/** @returns {import('rollup').RollupOptions} */
const createConfig = (env, format) => ({
  input: 'src/index.ts',
  external: ['react', ...(format === 'esm' ? [/^panorama-polyfill/] : [])],
  plugins: [
    // https://github.com/rollup/plugins/issues/272
    typescript({ noEmitOnError: false }),
    replace({
      'process.env.BUILD_ENV': JSON.stringify(process.env.BUILD_ENV),
      // React is using it to choose between development/production builds
      // TODO: Remove once react would use conditional exports
      'process.env.NODE_ENV': JSON.stringify(env),
    }),

    // https://github.com/rollup/rollup/issues/3230
    replace({ "require('util').inspect": '{}' }),
    commonjs(),
    nodeResolve(),

    env === 'production' && terser(),
  ],
  output: {
    file: `dist/${format}/react-panorama.${env}.js`,
    format,
    sourcemap: process.env.BUILD_ENV === 'development' && env === 'development' && format === 'esm',
    name: 'ReactPanorama',
    globals: { react: 'React' },
    banner: BANNER,
  },
});

/** @type {import('rollup').RollupOptions} */
const dtsConfig = {
  input: 'src/index.ts',
  plugins: [
    dts(),

    // rollup-plugin-dts injects panorama-types reference
    replace({ delimiters: ['', ''], '/// <reference types="panorama-types" />\n': '' }),

    prettier({
      parser: 'typescript',
      tabWidth: 4,
      printWidth: 120,
      singleQuote: false,
    }),
  ],
  output: {
    file: 'dist/index.d.ts',
    outro: 'export as namespace ReactPanorama;',
  },
};

export default [
  createConfig('development', 'esm'),
  process.env.BUILD_ENV === 'production' && createConfig('production', 'esm'),
  process.env.BUILD_ENV === 'production' && createConfig('development', 'umd'),
  process.env.BUILD_ENV === 'production' && createConfig('production', 'umd'),
  dtsConfig,
].filter(Boolean);
