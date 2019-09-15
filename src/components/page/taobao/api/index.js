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

  getGoodsInfo(page, total){
    return Util._doGetPromise(Util.baseUrl + '/goodsInfo/goodsInfoList', {
      page: page,
      total: total
    })
  },
  delGoodsById(data) {
    return Util._doDelPromise(Util.baseUrl + '/goodsInfo/delGoodsInfo/'+data)
  },

  addGoodsInfo(result,data){
    if(result){
      return Util._doPostPromise(Util.baseUrl + '/goodsInfo/updateGoodsInfo',data)
    }else{
      return Util._doPostPromise(Util.baseUrl + '/goodsInfo/createGoodslInfo',data)
    } 
  },
  getGoodsClass(){
    return Util._doGetPromise(Util.baseUrl + '/goodsInfo/goodsClassifyTree')
  }

}

export default Api
