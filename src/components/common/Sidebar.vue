<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu"
             :default-active="onRoutes"
             :collapse="collapse"
             background-color="#324157"
             text-color="#bfcbd9"
             active-text-color="#20a0ff"
             unique-opened
             router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index"
                      :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs"
                          :index="subItem.index"
                          :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem,i) in subItem.subs"
                              :key="i"
                              :index="threeItem.index">
                  {{ threeItem.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else
                            :index="subItem.index"
                            :key="subItem.index">
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index"
                        :key="item.index">
            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from '../common/bus';
export default {
  data () {
    return {
      collapse: false,
      items: [
        {
          icon: 'el-icon-document',
          index: 'release',
          title: '发布管理',
          subs: [
            {
              index: 'shufflingGoods',
              title: '轮播商品'
            },
            {
              index: 'taobaoGoods',
              title: '淘宝商品'
            },
            {
              index: 'IntegralGoods',
              title: '积分商品'
            },
            {
              index: 'appUpload',
              title: 'APP上传'
            }
          ]
        },
        {
          icon: 'el-icon-document',
          index: 'adminManagement',
          title: '人员管理',
          subs: [
            {
              index: 'userManagement',
              title: '用户管理'
            },
            {
              index: 'staffManagement',
              title: '员工管理'
            },
            {
              index: 'channelManagement',
              title: '渠道管理'
            }
          ]
        },
        {
          icon: 'el-icon-document',
          index: 'integralStatistics',
          title: '积分统计'
        },
        {
          icon: 'el-icon-document',
          index: 'cashManagement',
          title: '提现管理'
        },
        {
          icon: 'el-icon-document',
          index: 'comprehensiveSet',
          title: '综合设置'
        }
        // ,
        // {
        //     icon: 'el-icon-document',
        //     index: '7',
        //     title: '错误处理',
        //     subs: [
        //         {
        //             index: '404',
        //             title: '404页面'
        //         }
        //     ]
        // }
      ]
    }
  },
  computed: {
    onRoutes () {
      return this.$route.path.replace('/', '');
    }
  },
  created () {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg;
    })
  }
}
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
