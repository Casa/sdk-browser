import typescript from '@rollup/plugin-typescript'

import pkg from './package.json'

export default {
  input: 'lib/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'es',
    },
    {
      file: pkg.main,
      format: 'umd',
      name: 'Casa',
    },
  ],
  plugins: [typescript({ tsconfig: './tsconfig.json' })],
}
