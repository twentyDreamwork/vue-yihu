<template>
  <div class="app-container">
    <div style="margin-bottom: 8px; width: auto; background-color: white; padding: 8px;">
      <el-button type="primary" @click="$router.push('/userSpread')"> 返回</el-button>
    </div>
    <lb-table v-loading="loading"
              :column="tableData.column"
              :data="tableData.data"
              pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              border
              :page-sizes="[10, 20, 50, 100]"
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
            // {
            //   prop: 'parentUserAvatar',
            //   label: '推广人头像',
            //   render(h, scope){
            //      return(<img src={ scope.row.parentUserAvatar } width='80' height='80'/>)
            //   }
            // },
            // {
            //   prop: 'parentUserName',
            //   label: '推广人账号'
            // },
            // {
            //   prop: 'parentUserPoints',
            //   label: '推广人积分'
            // },
            {
              prop: 'userAvatar',
              label: '用户头像',
              render(h, scope){
                 return(<img src={ scope.row.userAvatar } width='20' height='20'/>)
              }
            },
            {
              prop: 'userName',
              label: '用户账号'
              
            },
            {
              prop: 'userPoints',
              label: '积分'
            }
            // {
            //   label: '返回',
            //   align: 'center',
            // }
          ],
          data: []
        },
        loading: false,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        userId: ''
      }
    },
    created () {
      this.createData(this.pageSize);
      //this.userId=;
      //console.info("......"+this.userId);
    },
    methods: {
      createData (length) {
        Api.getUsers(this.currentPage,this.pageSize, this.$route.query.id)
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
