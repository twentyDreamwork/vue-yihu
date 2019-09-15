import Vue from 'vue'
import Util from '../../../../utils/requestService'

let Api = {
  baseUrl:Util.baseUrl,
  getShufflingGood(page,total) {
    return Util._doGetPromise(Util.baseUrl + '/carouselInfo/carouselInfoList', {
      page: page,
      total: total
    })
  },
  updateShufflingGood(data) {
    return Util._doPostPromise(Util.baseUrl + '/carouselInfo/updateCarouselInfo', data)
  },
  delShufflingGood(data) {
    return Util._doDelPromise(Util.baseUrl + '/carouselInfo/delCarouselInfo/'+data)
  },
  addShufflingGood(data) {
    return Util._doPostPromise(Util.baseUrl + '/carouselInfo/createCarouselInfo',data)
  },


}

export default Api
