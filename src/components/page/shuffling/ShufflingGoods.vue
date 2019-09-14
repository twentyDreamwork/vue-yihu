<template>
  <div class="app-container">
    <!--表格渲染-->
    <el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <img :src="scope.row.goodsImg" width="128" height="51">
        </template>
      </el-table-column>
      <el-table-column prop="goodsUrl" label="商品链接"/>
      <el-table-column prop="user" label="上传用户"/>
       <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <div v-for="item in dicts" :key="item.id">
            <el-tag v-if="scope.row.enabled.toString() === item.value" :type="scope.row.enabled ? '' : 'info'">{{ item.label }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" prop="createtime" label="创建日期">
        <template slot-scope="scope">
          <span>1111</span>
        </template>
      </el-table-column>
      <el-table-column prop="note" label="备注"/>
      <el-table-column label="操作" width="125" align="center">
        <template slot-scope="scope">
          <el-popover
            :ref="scope.row.id"
            placement="top"
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
    <!-- </el-col>
  </el-row> -->
  </div>
</template>

<script>
  import initData from '@/mixins/initData'
  import Api from './api'
  export default {
    mixins: [initData],
    data() {
      return {
        height: document.documentElement.clientHeight - 180 + 'px;',
        delLoading: false, sup_this: this, deptName: '', depts: [], deptId: null,
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    mounted: function() {
      const that = this
      window.onresize = function temp() {
        that.height = document.documentElement.clientHeight - 180 + 'px;'
      }
    },
    methods: {
      beforeInit() {
        this.url = Api.baseUrl+"carouselInfo/carouselInfoList"
        const query = this.query
        const type = query.type
        const value = query.value
        const enabled = query.enabled
        this.params = { page: this.page, total: this.size}
        if (type && value) { this.params[type] = value }
        if (enabled !== '' && enabled !== null) { this.params['enabled'] = enabled }
        return true
      },
      subDelete(id) {
        this.delLoading = true
        del(id).then(res => {
          this.delLoading = false
          this.$refs[id].doClose()
          this.init()
          this.$notify({
            title: '删除成功',
            type: 'success',
            duration: 2500
          })
        }).catch(err => {
          this.delLoading = false
          this.$refs[id].doClose()
          console.log(err.response.data.message)
        })
      },
      getDeptDatas() {
        const sort = 'id,desc'
        const params = { sort: sort }
        if (this.deptName) { params['name'] = this.deptName }
        getDepts(params).then(res => {
          this.depts = res.content
        })
      },
      handleNodeClick(data) {
        if (data.pid === 0) {
          this.deptId = null
        } else {
          this.deptId = data.id
        }
        this.init()
      }
    }
  }
</script>

<style scoped>
</style>
