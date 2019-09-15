<template>
  <div>
    <div style="margin-bottom: 8px; width: 100%; background-color: white; padding: 8px;">
      <el-button type="primary" size="mini" @click="handleAdd">添加</el-button>
    </div>
    <lb-table v-loading="loading"
               :column="tableData.column"
               :data="tableData.data"
               pagination
               background
               border
               layout="total, sizes, prev, pager, next, jumper"
               :page-sizes="[10, 20, 50, 100]"
               :current-page.sync="currentPage"
               :page-size="pageSize"
               @size-change="handleSizeChange"
               @p-current-change="handleCurrentChange">
  </lb-table>

    <el-dialog :visible.sync="addDialogVisible"
               :title="operationRecord=='edit'?'编辑列表':'添加列表'"
               append-to-body width="570px">
      <el-form ref="form" :model="operationData" label-width="80px" >
        <el-form-item label="图标选择" prop="goodsImg">
          <el-upload
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :action="fileUploadUrl"
            list-type="picture-card" :limit="1">
            <i class="el-icon-plus"/>
          </el-upload>
          <img :src="operationData.img" width="100%" alt="" v-show="false">
        </el-form-item>
        <el-form-item label="上传APP" prop="goodsImg">
          <el-upload
            class="upload-demo"
            :action="fileUploadUrl"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleFileSuccess"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            >
            <el-button size="small" type="primary" >点击上传</el-button>
          </el-upload>
        </el-form-item>

        <el-form-item label="APP名称" prop="channelName">
          <el-input v-model="operationData.channelName"/>
        </el-form-item>
        <el-form-item label="APP描述" prop="channelDescribe">
          <el-input v-model="operationData.channelDescribe"/>
        </el-form-item>
        <el-form-item label="单次积分" prop="channelOnepoint">
          <el-input v-model="operationData.channelOnepoint"/>
        </el-form-item>
        <el-form-item label="渠道平台">
          <el-select
            v-model="operationData.channelPlatform"
            clearable
            placeholder="请选择">
            <el-option
              v-for="item in channelPlatformList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否主推">
          <el-select
            v-model="operationData.channelPriRecommend"
            clearable
            placeholder="请选择">
            <el-option
              v-for="item in channelPriRecommendList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务类型">
          <el-select
            v-model="operationData.channelType"
            clearable
            placeholder="请选择">
            <el-option
              v-for="item in channelTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="APP包名" prop="packageName">
          <el-input v-model="operationData.packageName"/>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="addDialogVisible=false">取消</el-button>
        <el-button :loading="loading" type="primary" @click="confirm">确认</el-button>
      </div>

    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="delDialogVisible"
      width="30%">
      <span>确认删除？</span>
      <span slot="footer" class="dialog-footer">
       <el-button @click="delDialogVisible = false">取 消</el-button>
       <el-button type="primary" @click="delConfirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import LbTable from '../module/lb-table/lb-table'
  import Api from './api'
  export default {
    name: 'appUpload',
    components: {
      LbTable
    },
    data () {
      return {
        tableData: {
          column: [
            {
              prop: 'channelName',
              label: 'APP名称',
              align:'center',
              width:'120',

            },
            {
              prop: 'img',
              label: '图标',
              align:'center',
              width:'120',
              render: (h, scope) => {
                return(<img src={ scope.row.img } width='80' height='80'/>)
              }
            },
            {
              prop: 'channelDescribe',
              label: '描述',
              align:'center',
              width:'150',
            },
            {
              prop: 'url',
              label: '下载地址',
              align:'center',
              width:'150',
            },

            {
              prop: 'channelOnepoint',
              label: '单次积分',
              align:'center'
            },

            {
              prop: 'channelPlatform',
              label: '渠道平台',
              align:'center',
              render: (h, scope) => {
                return(
                  <el-tag size="medium"><span>{ scope.row.channelPlatform == 1 ? "安卓" : "iOS" }  </span></el-tag>
               )
              }
            },
            {
              prop: 'channelPriRecommend',
              label: '是否主推',
              align:'center',
              render: (h, scope) => {
                return(
                  <el-tag size="medium"><span>{ scope.row.channelPriRecommend == 1 ? "是" : "否" }  </span></el-tag>
              )
              }
            },
            {
              prop: 'channelType',
              label: '任务类型',
              align:'center',
              render: (h, scope) => {
                return(
                  <el-tag size="medium"><span>{ scope.row.channelType == 1 ? "游戏" : "软件" }  </span></el-tag>
              )
              }
            },
            {
              prop: 'channelUsing',
              label: '是否启用',
              align:'center',
              render: (h, scope) => {
                return(
                  <el-tag size="medium"><span>{ scope.row.channelUsing == 1 ? "是" : "否" }  </span></el-tag>
              )
              }
            },
            {
              prop: 'packageName',
              label: '包名',
              align:'center',
              width:'150',
            },
            {
              label: '操作',
              width:'180',
              fixed: 'right',
              render: (h, scope) => {
                return (
                  <div>
                  <el-button
                type="primary"
                size="mini"
                onClick={ () => { this.handleEdit(scope.$index, scope.row) } }>编辑</el-button>
                <el-button
                size="mini"
                type="danger"
                onClick={ () => { this.handleDelete(scope.$index, scope.row) } }>删除</el-button>
                </div>
              )
              }
            }
          ],
          data: []
        },
        loading: false,
        currentPage: 1,
        pageSize: 10,
        total:10,
        addDialogVisible:false,
        fileUploadUrl: Api.baseUrl + '/upload/fileUpload',
        operationData: {
          channelName: "",
          img: "",
          channelDescribe: "",
          url: "",
          channelOnepoint: "",
          channelPlatform: "",
          channelPriRecommend: "1",
          channelType: "1",
          channelUsing: "1",
          packageName: ""
        },
        channelPlatformList: [{
          value: '1',
          label: '安卓'
        }, {
          value: '2',
          label: 'iOS'
        }],
        channelPriRecommendList: [{
          value: '1',
          label: '是'
        }, {
          value: '0',
          label: '不是'
        }],
        channelTypeList: [{
          value: '1',
          label: '游戏'
        }, {
          value: '2',
          label: '软件'
        }],
        operationRecord:"edit",//操作记录
        delDialogVisible: false,
        delData: []


      }
    },
    created() {
      this.createData(this.currentPage, this.pageSize)
    },
    methods: {
      createData(pageSize, total) {
        this.loading = true;
        Api.getChannelInfo(pageSize, total)
          .then(data => {
            this.loading = false
            console.log(data.result);
            this.tableData.data = data.result.list
            this.tableData.total = data.result.total
            console.log(data);
          }).catch(err => {
          console.log(err);
          this.loading = false
          this.$message({
            showClose: true,
            message: '请求数据错误',
            type: 'error'
          });

        })
      },
      handleSizeChange (val) {
        this.currentPage = 1
        this.pageSize = val
        this.createData(this.currentPage, this.pageSize)

      },
      handleCurrentChange (val) {
        this.pageSize = val;
        this.createData(this.currentPage, this.pageSize)
      },
      handleEdit (index, row) {
        console.log(index, row)
        this.operationData = row
        this.operationRecord = "edit"
        this.addDialogVisible = true
        console.log(this.operationData )

      },
      handleDelete (index, row) {
        console.log(index, row)
        this.delDialogVisible = true
        this.delData = row;

      },
      handleAdd() {
        this.addDialogVisible = true
        this.operationRecord="add"
        this.operationData={
          channelName: "",
          img: "",
          channelDescribe: "",
          url: "",
          channelOnepoint: "",
          channelPlatform: "1",
          channelPriRecommend: "1",
          channelType: "1",
          channelUsing: "1",
          packageName: ""
        }
      },
      confirm() {
          this.loading = true;
          if(this.operationRecord=="edit"){
            Api.updateChannelInfo(this.operationData)
              .then(data => {
                this.loading = false
                this.$message({
                  showClose: true,
                  message: '数据更新成功',
                  type: 'success'
                });
                this.addDialogVisible = false
                this.createData(this.currentPage, this.pageSize)

              }).catch(err => {
              console.log(err);
              this.loading = false
              this.$message({
                showClose: true,
                message: '更新数据错误',
                type: 'error'
              });

            })
          }else{
            Api.addShufflingGood(this.operationData)
              .then(data => {
                this.loading = false
                this.$message({
                  showClose: true,
                  message: '数据添加成功',
                  type: 'success'
                });
                this.addDialogVisible = false
                this.createData(this.currentPage, this.pageSize)

              }).catch(err => {
              console.log(err);
              this.loading = false
              this.$message({
                showClose: true,
                message: '添加数据错误',
                type: 'error'
              });

            })
          }


      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePictureCardPreview(file) {
        console.log(file.url)

      },
      handleAvatarSuccess(res, file) {
        if (res.code == 200) {
          this.operationData.img = res.result
        }
      },
      handleFileSuccess(res, file) {
        if (res.code == 200) {
          this.operationData.url = res.result
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`请删除再重新上传`);
      },
      handlePreview(file) {
        console.log(file);
      },
      delConfirm() {
        this.loading = true;
        Api.delChannelInfo(this.delData.id)
          .then(data => {
            this.loading = false
            this.$message({
              showClose: true,
              message: '数据删除成功',
              type: 'success'
            });
            this.delDialogVisible = false
            this.createData(this.currentPage, this.pageSize)

          }).catch(err => {
          console.log(err);
          this.loading = false
          this.$message({
            showClose: true,
            message: '请求数据错误',
            type: 'error'
          });

        })
      }

    }
  }
</script>
<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
