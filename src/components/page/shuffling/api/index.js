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
      vm.$http.post(url, JSON.parse(JSON.stringify(data))).then(res => {
        resolve(res.data)
      }, res => {
        // error callback
        reject(res)
        console.log('error: ', res)
      })
    })
  },
  getShufflingGood(page,total) {
    return this._doGetPromise(baseUrl + '/carouselInfo/carouselInfoList', {
      page: page,
      total: total
    })
  },
  updateShufflingGood(data) {
    console.log(data);
    return this._doPostPromise(baseUrl + '/carouselInfo/updateCarouselInfo', data)
  },


}

export default Api
