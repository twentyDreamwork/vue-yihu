import Vue from 'vue'
let vm = new Vue()
const baseUrl = "http://192.168.1.2:8081/";


let Api = {
  baseUrl:baseUrl,
  _doPromise(url, params) {
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
  getTest(url) {
    return this._doPromise(baseUrl + 'getRenderList', {
      regionId: regionId,
      regionGrade: regionGrade
    })
  },


}

export default Api
