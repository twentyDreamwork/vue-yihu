import Vue from 'vue'
import Util from '../../../../utils/requestService'
//商品分类
let Api = {
  baseUrl:Util.baseUrl,
  getGoodsClassifyList(page,total) {
    return Util._doGetPromise(Util.baseUrl + '/goodsInfo/goodsClassifyTree', {
      page: page,
      total: total,
      sidx:"priority",
      order:"desc"
    })
  },
  updateGoodsClassify(data,isEdit) {
    if(isEdit=="edit"){
      return Util._doPostPromise(Util.baseUrl + '/goodsInfo/updateGoodsClassify', data)
    }else{
      return Util._doPostPromise(Util.baseUrl + '/goodsInfo/createGoodsClassify',data)

    }
  },
  delGoodsClassify(data) {
    return Util._doDelPromise(Util.baseUrl + '/goodsInfo/delGoodsClassify/'+data)
  },


}

export default Api
