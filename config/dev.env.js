'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://39.108.143.92:8081"'
  // BASE_API: '"http://192.168.0.108:8081"'

})
