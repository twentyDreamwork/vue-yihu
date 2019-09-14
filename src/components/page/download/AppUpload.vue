<template id="news">
  <div class="">

    <el-form :inline="true"
             :model="formInline"
             class="demo-form-inline">
      <el-button type="primary"
                 size="medium">添加</el-button>
      <el-form-item label="渠道名称:"
                    label-width="80px">
        <el-input v-model="formInline.channelName"
                  placeholder="渠道名称"
                  style="width:150px"></el-input>
      </el-form-item>
      <el-form-item label="渠道类型:"
                    label-width="80px">
        <el-select v-model="formInline.channelType"
                   placeholder="渠道类型"
                   style="width:120px">
          <el-option label="软件"
                     value="1"></el-option>
          <el-option label="游戏"
                     value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="平台:"
                    label-width="80px">
        <el-select v-model="formInline.platform"
                   placeholder="平台"
                   style="width:120px">
          <el-option label="安卓"
                     value="1"></el-option>
          <el-option label="iOS"
                     value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="推广类型:"
                    label-width="80px">
        <el-select v-model="formInline.promotionType"
                   placeholder="推广类型"
                   style="width:120px">
          <el-option label="点击"
                     value="1"></el-option>
          <el-option label="安装"
                     value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"
                   @click="onSubmit"
                   icon="el-icon-search"
                   size="medium">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData"
              border
              style="width: 100%">
      <el-table-column fixed
                       prop="date"
                       label="日期"
                       width="150">
      </el-table-column>
      <el-table-column prop="name"
                       label="姓名"
                       width="120">
      </el-table-column>
      <el-table-column prop="province"
                       label="省份"
                       width="120">
      </el-table-column>
      <el-table-column prop="city"
                       label="市区"
                       width="120">
      </el-table-column>
      <el-table-column prop="address"
                       label="地址"
                       width="300">
      </el-table-column>
      <el-table-column prop="zip"
                       label="邮编"
                       width="120">
      </el-table-column>
      <el-table-column fixed="right"
                       label="操作"
                       width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)"
                     type="text"
                     size="small">查看</el-button>
          <el-button type="text"
                     size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
// import { mapGetters, mapActions } from 'vuex/types'
export default {
  data () {
    return {
      formInline: {
        user: '',
        region: ''
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1517 弄',
        zip: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1519 弄',
        zip: 200333
      }, {
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1516 弄',
        zip: 200333
      }]
    }
  },
  methods: {
    onSubmit () {
      alert('submit!');
    },
    handleClick (row) {
      console.log(row);
    }
  }
}
</script>

<style>
</style>
