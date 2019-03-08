'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')
const fs = require('fs')
const zlib = require('zlib')

const targetBackend = 'https://olymp.bmstu.ru/'

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api/*': {
        target: targetBackend,
        changeOrigin: true,
        pathRewrite: {},
        secure: false
      },
      '/old': {
        target: targetBackend,
        changeOrigin: true,
        pathRewrite: {},
        secure: false,
        onProxyRes: (proxyRes, req, res) => {
          let originalBody = Buffer.from([])
          Object.keys(proxyRes.headers).forEach(function (key) {
            res.append(key, proxyRes.headers[key])
          })
          proxyRes.on('data', data => {
            originalBody = Buffer.concat([originalBody, data])
          })

          proxyRes.on('end', () => {
            if (
              proxyRes.headers['content-encoding'] === 'gzip'
            ) {
              res.set({
                'content-encoding': ''
              })
              res.write(zlib.gunzipSync(originalBody).toString('utf8'))
              res.end()
            } else {
              res.write(originalBody)
              res.end()
            }
          })
        },
        selfHandleResponse: true
      }
    },

    // Various Dev Server settings
    host: 'local.olymp.bmstu.ru', // can be overwritten by process.env.HOST
    port: 443, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './cert/server.key')).toString(),
      cert: fs.readFileSync(path.resolve(__dirname, './cert/local.olymp.bmstu.ru.crt')).toString()
    },
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
