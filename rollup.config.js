const {nodeResolve} = require("@rollup/plugin-node-resolve")
const commonjs = require("@rollup/plugin-commonjs")
const terser = require("@rollup/plugin-terser")
const typescript = require("@rollup/plugin-typescript")

const plugins = [
	nodeResolve(),
	commonjs(),
	typescript()
]

// 打包后就可以舍弃node_modules了
module.exports = [
	{
		input: "./src/index.ts",
		output: {
			file: "./dist/index.js",
			format: "es",
			exports: "auto",
			sourcemap: false
		},
		plugins: [
			...plugins
		]
	}
]
