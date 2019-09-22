import Vue from 'vue'
import Util from '../../../../utils/requestService'
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

  getIntegralGoodsInfo(page, total, param){
    return Util._doGetPromise(Util.baseUrl + '/itemPoint/itemPointList', {
      page: page,
      limit: total,
      isShop: param.isShop,
      itemName: param.itemName
      
    })
  },
  delIntegralGoodsById(data) {
    return Util._doDelPromise(Util.baseUrl + '/itemPoint/delItemPoint/'+data)
  },

  addIntegralGoodsInfo(result,data){
    if(result){
      return Util._doPostPromise(Util.baseUrl + '/itemPoint/updateItemPoint',data)
    }else{
      return Util._doPostPromise(Util.baseUrl + '/itemPoint/createItemPoint',data)
    } 
  },

}

export default Api
