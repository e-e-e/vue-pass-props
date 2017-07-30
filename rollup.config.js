import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'index.js',
  format: 'cjs',
  plugins: [
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    commonjs({
      include: 'node_modules/**'
    })
  ],
  external: ['lodash'],
  dest: 'index.common.js'
}
