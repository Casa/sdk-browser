import typescript from '@rollup/plugin-typescript'

import pkg from './package.json'

export default {
  input: 'lib/index.ts',
  external: ['@casainc/node'],
  output: [
    {
      file: `dist/${pkg.module}`,
      format: 'es',
    },
    {
      file: `dist/${pkg.main}`,
      format: 'cjs',
    },
  ],
  plugins: [typescript({ tsconfig: './tsconfig.json' })],
}
