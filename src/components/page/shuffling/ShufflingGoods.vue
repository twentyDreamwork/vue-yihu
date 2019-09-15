<template>
  <div>
    <div style="margin-bottom: 8px; width: 100%; background-color: white; padding: 8px;">
      <el-button type="primary" size="mini" @click="handleAdd">添加</el-button>
    </div>

    <el-table
      :data="tableData.list"
      border
      style="width: 100%">
      <el-table-column
        label="创建日期"
        width="200" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.createdAt }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="imgPath"
        label="图片路径"
        width="300" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.goodsImg" alt="" style="width: 256px;height: 102px">
        </template>
      </el-table-column>
      <el-table-column
        label="淘宝地址"
        width="350" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.contents }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="tag"
        label="商品状态"
        width="100" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.type === '1' ? 'primary' : 'success'"
            disable-transitions>{{scope.row.type| goodsTypeFilter}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="描述"
        width="350" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right"
                       label="操作"
                       width="180" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary" size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <div class="block" style="margin-top:15px;">
      <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="tableData.pages" :page-sizes="[10,20,50,100]" :page-size="tableData.page"
                     layout="total, sizes, prev, pager, next, jumper" :total="tableData.total">
      </el-pagination>
    </div>
    <el-dialog :visible.sync="editDialogVisible"
               title="编辑"
               append-to-body>
      <div class="dialog-content">
        <el-form v-if="currentEdit"
                 label-width="100px">

          <el-form-item label="淘宝地址">
            <el-input v-model="currentEdit.contents"
                      placeholder="请输入淘宝地址">
            </el-input>
          </el-form-item>

          <el-form-item label="描述">
            <el-input v-model="currentEdit.remark"
                      type="textarea"
                      placeholder="请输入描述">
            </el-input>
          </el-form-item>
          <el-form-item label="修改状态">
            <el-select
              v-model="stateValue"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="editDialogVisible  = false">取 消</el-button>
        <el-button type="primary"
                   @click="editConfirm">确 定
        </el-button>
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

    <el-dialog :visible.sync="addDialogVisible"
               title="添加轮播信息"
               append-to-body width="570px">
      <el-form ref="form" :model="uploadData" label-width="80px">
        <el-form-item label="图片选择" prop="goodsImg">
          <el-upload
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :action="fileUploadUrl"
            list-type="picture-card" :limit="1">
            <i class="el-icon-plus"/>
          </el-upload>
          <img :src="uploadData.goodsImg" width="100%" alt="" v-show="false">
        </el-form-item>
        <el-form-item label="淘宝链接" prop="contents">
          <el-input v-model="uploadData.contents"/>
        </el-form-item>
        <el-form-item label="商品描述" prop="remark">
          <el-input v-model="uploadData.remark"/>
        </el-form-item>
        <el-form-item label="商品状态">
          <el-select
            v-model="uploadData.type"
            clearable
            placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="addDialogVisible=false">取消</el-button>
        <el-button :loading="loading" type="primary" @click="addConfirm">确认</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  import Api from './api'

  export default {
    data() {
      return {
        tableData: {
          data: [],
          pages: 1, // 当前页码
          total: 20, // 总条数
          page: 1 // 每页的数据条数
        },
        currentEdit: null,
        editDialogVisible: false,
        addDialogVisible: false,
        delDialogVisible: false,
        options: [{
          value: '0',
          label: '下架'
        }, {
          value: '1',
          label: '上架'
        }],
        stateValue: [],
        delData: [],
        fileUploadUrl: Api.baseUrl + '/upload/fileUpload',
        uploadData: {
          contents: "",
          remark: "",
          goodsImg: "",
          type: ""
        }
      }
    },
    created() {
      this.createData(this.pageSize, this.total)
    },
    methods: {
      createData(pageSize, total) {
        this.loading = true;
        Api.getShufflingGood(pageSize, total)
          .then(data => {
            this.loading = false
            this.tableData = data.result;
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
      handleAdd() {
        this.addDialogVisible = true
        this.uploadData={
          contents: "",
          remark: "",
          goodsImg: "",
          type: ""
        }
      },
      handleEdit(index, row) {
        console.log(index, row);
        this.currentEdit = row
        this.editDialogVisible = true
        console.log("点击了编辑")
      },
      handleDelete(index, row) {
        console.log(index, row);
        this.delDialogVisible = true
        this.delData = row;
        console.log("点击了删除")

      },
      handleSizeChange(val) {
        this.pages = 1;
        this.page = val;
        this.createData(this.pages, this.page)
      },
      handleCurrentChange(val) {
        this.pages = val;
        this.createData(this.pages, this.page)
      },
      editConfirm() {
        this.currentEdit.type = this.stateValue;
        this.loading = true;
        Api.updateShufflingGood(this.currentEdit)
          .then(data => {
            this.loading = false
            this.$message({
              showClose: true,
              message: '数据更新成功',
              type: 'success'
            });
            this.editDialogVisible = false

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
      delConfirm() {
        this.loading = true;
        Api.delShufflingGood(this.delData.id)
          .then(data => {
            this.loading = false
            this.$message({
              showClose: true,
              message: '数据删除成功',
              type: 'success'
            });
            this.delDialogVisible = false
            this.createData(this.pages, this.page)

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
      addConfirm() {
        if (this.uploadData.type == "") {
          this.$message({
            showClose: true,
            message: '请选择商品状态',
            type: 'warning'
          });
        } else {
          this.loading = true;
          Api.addShufflingGood(this.uploadData)
            .then(data => {
              this.loading = false
              this.$message({
                showClose: true,
                message: '数据添加成功',
                type: 'success'
              });
              this.addDialogVisible = false
              this.createData(this.pages, this.page)

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
      handleAvatarSuccess(res) {
        console.log(res)

      },
      handleRemove(file, fileList) {
        console.log(file, fileList)
      },
      handlePictureCardPreview(file) {
        console.log(file.url)
        // this.imageUrl = file.url
        // this.dialogVisible = true
      },
      handleAvatarSuccess(res, file) {
        if (res.code == 200) {
          this.uploadData.goodsImg = res.result
        }
      }
    }
  }
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
