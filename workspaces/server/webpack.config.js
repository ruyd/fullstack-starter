console.log(`SERVER WEBPACK (${process.env.NODE_ENV})`)
const fs = require('fs')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const GeneratePackageJsonPlugin = require('generate-package-json-webpack-plugin')
const Dotenv = require('dotenv-webpack')

const createEnvironmentHash = require('../../tools/createEnvironmentHash')
const getClientEnvironment = require('../../tools/env')
const paths = require('../../tools/paths')
const packageJson = require('./package.json')
const webpack = require('webpack')
const env = getClientEnvironment(paths.publicUrlOrPath.slice(0, -1))
const mode = process.env.NODE_ENV || 'production'
const isDevelopment = mode === 'development'
const outputPath = isDevelopment ? path.resolve(__dirname, 'dist') : path.resolve(__dirname, 'dist')

module.exports = {
  mode,
  entry: {
    index: './src/index.ts',
  },
  target: 'node',
  devtool: isDevelopment ? 'source-map' : false,
  output: {
    path: outputPath,
    filename: '[name].js',
    chunkFilename: '[name].[contenthash].js',
  },
  externalsPresets: { node: true },
  externals: [
    nodeExternals({
      additionalModuleDirs: [path.resolve(__dirname, '../../node_modules')],
      allowlist: ['ieee754'],
    }),
  ],
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new NodePolyfillPlugin(),
    new GeneratePackageJsonPlugin({ ...packageJson, main: 'index.js' }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        ...process.env,
        NODE_ENV: mode,
        POST: process.env.PORT,
      }),
    }),
    isDevelopment && new Dotenv({ systemvars: true }),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            projectReferences: true,
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    roots: [path.resolve(__dirname, 'src')],
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({})],
  },
  cache: {
    type: 'filesystem',
    version: createEnvironmentHash(env.raw),
    cacheDirectory: paths.appWebpackCache,
    store: 'pack',
    buildDependencies: {
      defaultWebpack: ['webpack/lib/'],
      config: [__filename],
      tsconfig: [paths.appTsConfig, paths.appJsConfig].filter(f => fs.existsSync(f)),
    },
  },
}
