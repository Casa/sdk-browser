import typescript from '@rollup/plugin-typescript'

import pkg from './package.json'

export default {
  input: 'lib/index.ts',
  external: ['@casainc/node'],
  output: [
    {
      file: pkg.module,
      format: 'es',
    },
    {
      file: pkg.main,
      format: 'cjs',
    },
  ],
  plugins: [typescript({ tsconfig: './tsconfig.json' })],
}
