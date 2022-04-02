const CompressionPlugin = require('compression-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const ruleForJavaScript = {
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  use: { loader: 'babel-loader' },
}

const ruleForHtml = {
  test: /\.html$/,
  use: {
    loader: 'html-loader',
  },
}

const ruleForCss = {
  test: /\.(s*)css$/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
    },
    'css-loader',
    'postcss-loader',
    {
      loader: 'sass-loader',
    },
  ],
}

const ruleForFile = {
  test: /\.(png|gif|jpg|svg|jpeg)$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: 'assets/resources/[name].[ext]',
      },
    },
  ],
}

const rules = [ruleForJavaScript, ruleForHtml, ruleForCss, ruleForFile]

const plugins = (isProduction) => {
  return [
    isProduction ? () => {} : new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: 'assets/css/app.css',
    }),
    isProduction
      ? new CompressionPlugin({
          test: /\.js$|\.css$/,
          filename: '[path][base].gz',
        })
      : () => {},
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
  ]
}

const optimization = (isProduction) => {
  return {
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        vendors: {
          name: 'vendors',
          chunks: 'all',
          reuseExistingChunk: true,
          priority: 1,
          filename: 'assets/vendor.js',
          enforce: true,
          test: /[\\/]node_modules[\\/]/,
        },
      },
    },
    minimize: isProduction ? true : false,
    minimizer: isProduction ? [new TerserPlugin()] : [],
  }
}

module.exports = (env, argv) => {
  const { mode } = argv || 'development'
  const isProduction = mode === 'production'

  return {
    devtool: isProduction ? 'hidden-source-map' : 'source-map',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: isProduction
        ? 'assets/[name].[contenthash].js'
        : 'assets/[name].js',
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    optimization: optimization(isProduction),
    module: {
      rules,
    },
    plugins: plugins(isProduction),
    devServer: {
      open: true,
      compress: true,
      historyApiFallback: true,
      port: 3000,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
        progress: true,
      },
    },
  }
}
