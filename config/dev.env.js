'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://39.108.143.92:8081"'
  // BASE_API: '"http://192.168.1.2:8081"'

})
