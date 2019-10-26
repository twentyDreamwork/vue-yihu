<template>
  <div class="app-container">
    <lb-table v-loading="loading"
              :column="tableData.column"
              :data="tableData.data"
              pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              border
              :page-sizes="[5, 10, 20, 30]"
              :pager-count="5"
              :current-page.sync="currentPage"
              :total="total"
              :page-size="pageSize"
              @size-change="handleSizeChange"
              @p-current-change="handleCurrentChange">
    </lb-table>
  </div>
</template>

<script>
  import LbTable from '../module/lb-table/lb-table'
  import Api from './api/index'


  export default {
    components: {
      LbTable
    },
    data () {
      return {
        tableData: {
          column: [
            {
              type: 'index',
              align: 'center'
            },
            {
              prop: 'avatar',
              label: '头像',
              render(h, scope){
                 return(<img src={ scope.row.avatar } width='80' height='80'/>)
              }
            },
            {
              prop: 'accountName',
              label: '账号名称'
            },
            {
              prop: 'userName',
              label: '用户名称'
            },
            {
              prop: 'nickName',
              label: '昵称'
            },
            {
              prop: 'points',
              label: '积分',

            },
            {
              prop: 'email',
              label: '邮箱号'
            },
            {
              prop: 'platforms',
              label: '平台',
              render: (h, scope) => {
                if (scope.row.platforms === 1) {
                  return(<el-tag type='success' >安卓</el-tag>)
                } else {
                  return(<el-tag type='primary' >苹果</el-tag>)
                }
              }
            },
            {
              prop: 'invite',
              label: '邀请码'
            },
            {
              prop: 'status',
              label: '状态',
              render: (h, scope) => {
                if (scope.row.status === 0) {
                  return(<el-tag type='success' >正常</el-tag>)
                } else {
                  return(<el-tag type='primary' >黑名单</el-tag>)
                }
              }
            },
            {
              prop: 'createdAt',
              label: '创建日期',
              render: (h, scope) => {
                return (
                  <div align="left">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{ scope.row.createdAt }</span>
                  </div>
                )
              }
            }
          ],
          data: []
        },
        loading: false,
        currentPage: 1,
        pageSize: 5,
        total: 0,
      }
    },
    created () {
      this.createData(this.pageSize)
    },
    methods: {
      createData (length) {
        Api.getUsers(this.currentPage,this.pageSize)
          .then(data => {
            this.tableData.data = data.result.list;
            this.total = data.result.total;
          }).catch(err => {

        })
      },
      handleSizeChange (val) {
        this.currentPage = 1
        this.pageSize = val
        this.createData(this.pageSize)
      },
      handleCurrentChange () {
        this.createData(this.pageSize)
      }
    }
  }
</script>

<style scoped>
</style>
