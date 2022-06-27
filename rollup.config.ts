import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import nodePolyfills from 'rollup-plugin-polyfill-node'

import pkg from './package.json'

export default {
  input: 'lib/index.ts',
  output: [
    {
      file: `dist/${pkg.module}`,
      format: 'es',
    },
    {
      file: `dist/${pkg.main}`,
      format: 'umd',
      name: 'Casa',
    },
  ],
  plugins: [
    json(),
    nodePolyfills({
      sourceMap: true,
    }),
    nodeResolve({
      preferBuiltins: true,
    }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
  ],
}
