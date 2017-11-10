// var resolve = require('rollup-plugin-node-resolve')
var commonjs = require('rollup-plugin-commonjs')
var babel = require('rollup-plugin-babel')

module.exports = {
  input: 'index.js',
  output: {
    file: 'dist/vue-pin.js',
    name: 'vue-pin',
    format: 'umd',
    sourcemap: true
  },
  plugins: [
    // resolve({
    //   jsnext: true,
    //   main: true,
    //   browser: true,
    // }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    })
  ]
}