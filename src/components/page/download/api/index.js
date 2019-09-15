import Util from '../../../../utils/requestService'
//下载接口
let Api = {
  baseUrl:Util.baseUrl,
  getChannelInfo(page,total) {
    return Util._doGetPromise(Util.baseUrl + '/channelInfo/channelInfoList', {
      page: page,
      total: total
    })
  },
  updateChannelInfo(data) {
    return Util._doPostPromise(Util.baseUrl + '/channelInfo/updateChannelInfo', data)
  },
  delChannelInfo(data) {
    return Util._doDelPromise(Util.baseUrl + '/channelInfo/delChannelInfo/'+data)
  },
  addShufflingGood(data) {
    return Util._doPostPromise(Util.baseUrl + '/channelInfo/createChannelInfo',data)
  },


}

export default Api
