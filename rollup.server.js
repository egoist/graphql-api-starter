import tsPlugin from 'rollup-plugin-typescript2'
import spawnPlugin from 'rollup-plugin-spawn'

export default {
  input: ['src/main.ts'],
  output: {
    dir: 'dist',
    format: 'cjs',
  },
  plugins: [
    tsPlugin({
      tsconfigOverride: {
        compilerOptions: {
          module: 'esnext',
        },
      },
    }),
    spawnPlugin({
      command: `npm run start`,
    }),
  ],
}
