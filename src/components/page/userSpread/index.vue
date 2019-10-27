<template>
  <div class="app-container">
    <div style="margin-bottom: 8px; width: auto; background-color: white; padding: 8px;">
      <el-form :inline="true" :model="param">
        <el-form-item label="账号名称">
          <el-input v-model="param.userName"/>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="mini" @click="createData">查询</el-button>
        </el-form-item>
      </el-form>
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
            },
            {
                prop: 'oneLevelNum',
                label: '一级'
            },
            {
                prop: 'secondLevelNum',
                label: '二级'

            },
            {
                //prop: 'userId',
                label: '操作',
                render: (h, scope) => {
                 return(<el-button type="success" size="mini" onClick={ () => { this.findSecondsByUserId(scope.$index, scope.row) }}>推广详细</el-button>)
              }
            }
          ],
          data: []
        },
        loading: false,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        param: {userName:null}
      }
    },
    created () {
      this.createData(this.pageSize)
    },
    methods: {
      createData (length) {
        Api.getUserSpread(this.currentPage,this.pageSize,this.param)
          .then(data => {
            this.tableData.data = data.result.list;
            this.total = data.result.total;
          }).catch(err => {

        })
      },
      findSecondsByUserId(index, val){
          //console.info(val.userId);
          this.$router.push({path:"/second", query: {id: val.userId}});
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
