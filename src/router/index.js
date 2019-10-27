import Vue from 'vue';
import Router from 'vue-router';
import { resolve } from 'path';

Vue.use(Router);

export default new Router({
  routes: [{
      path: '/',
      redirect: '/release'
    },
    {
      path: '/',
      component: resolve => require(['../components/common/Home.vue'], resolve),
      meta: {
        title: '自述文件'
      },
      children: [{
          path: '/release',
          component: resolve => require(['../components/page/Release.vue'], resolve),
          meta: {
            title: '发布管理'
          }
        },
        {
          path: '/appUpload',
          component: resolve => require(['../components/page/download/AppUpload.vue'], resolve),
          meta: {
            title: 'app上传'
          }
        },
        {
          path: '/taobaoGoods',
          component: resolve => require(['../components/page/taobao/index.vue'], resolve),
          meta: {
            title: '淘宝商品'
          }
        },
        {
          path: '/IntegralGoods',
          component: resolve => require(['../components/page/integral/IntegralGoods.vue'], resolve),
          meta: {
            title: '积分商品'
          }
        },
        {
          path: '/shufflingGoods',
          component: resolve => require(['../components/page/shuffling/ShufflingGoods.vue'], resolve),
          meta: {
            title: '轮播商品'
          }
        },
        {
          path: '/goodsClassify',
          component: resolve => require(['../components/page/goodsClassifyList/GoodsClassify.vue'], resolve),
          meta: {
            title: '商品分类'
          }
        },
        {
          path: '/userManagement',
          component: resolve => require(['../components/page/users/index.vue'], resolve),
          meta: {
            title: '用户管理'
          }
        },
        {
          path: '/userSpread',
          component: resolve => require(['../components/page/userSpread/index.vue'], resolve),
          meta: {
            title: '用户推广'
          }
        },
        {
          path: '/second',
          component: resolve => require(['../components/page/userSpread/second.vue'], resolve),
          meta: {
            title: '用户推广详情'
          }
        },
        {
          path: '/staffManagement',
          component: resolve => require(['../components/page/StaffManagement.vue'], resolve),
          meta: {
            title: '员工管理'
          }
        },
        {
          path: '/channelManagement',
          component: resolve => require(['../components/page/ChannelManagement.vue'], resolve),
          meta: {
            title: '渠道管理'
          }
        },
        {
          path: '/integralStatistics',
          component: resolve => require(['../components/page/IntegralStatistics.vue'], resolve),
          meta: {
            title: '积分统计'
          }
        },
        {
          path: '/cashManagement',
          component: resolve => require(['../components/page/CashManagement.vue'], resolve),
          meta: {
            title: '提现管理'
          }
        },
        {
          path: '/comprehensiveSet',
          component: resolve => require(['../components/page/ComprehensiveSet.vue'], resolve),
          meta: {
            title: '综合设置'
          }
        },
        // {
        //     // 权限页面
        //     path: '/permission',
        //     component: resolve => require(['../components/page/Permission.vue'], resolve),
        //     meta: { title: '权限测试', permission: false }
        // },
        {
          path: '/404',
          component: resolve => require(['../components/page/404.vue'], resolve),
          meta: {
            title: '404'
          }
        },
        {
          path: '/403',
          component: resolve => require(['../components/page/403.vue'], resolve),
          meta: {
            title: '403'
          }
        }
      ]
    },
    {
      path: '/login',
      component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
