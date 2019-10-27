import Vue from 'vue'
const path = require('path')
const baseUrl = process.env.BASE_API
let vm = new Vue()


let Api = {
  baseUrl:baseUrl,

  _doGetPromise(url, params) {
    return new Promise((resolve, reject) => {
      vm.$http.get(url, {
        params: params
      }).then(res => {
        resolve(res.data)
      }, res => {
        // error callback
        reject(res)
        console.log('error: ', res)
      })
    })
  },
  _doPostPromise(url, data) {
    return new Promise((resolve, reject) => {
      vm.$http.post(url, {
        data: data
      }).then(res => {
        resolve(res.data)
      }, res => {
        // error callback
        reject(res)
        console.log('error: ', res)
      })
    })
  },

  getUsers(page, total, userId){
    return this._doGetPromise(baseUrl + '/userInfo/userSpreadList', {
      page: page,
      limit: total,
      parendId: userId
    })
  },

  getUserSpread(page, total,param){
    return this._doGetPromise(baseUrl + '/userInfo/userSpreadInfoList', {
      page: page,
      limit: total,
      userName: param.userName
    })
  }


}

export default Api
