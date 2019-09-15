<template>
  <div class="app-container">
    <div style="margin-bottom: 8px; width: 100%; background-color: white; padding: 8px;">
      <el-button type="primary" size="mini" @click="handleAdd">添加</el-button>
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

    <!-- 添加与编辑 -->
    <el-dialog :visible.sync="editdialogVisible" title="添加与编辑" append-to-body>
      <div class="dialog-content">
        <el-form label-width="100px" :model="currentEdit">
          <el-form-item label="商品类型">
            <el-select
              v-model="currentEdit.classifyId"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in classAll"
                :key="item.id"
                :label="item.classifyName"
                :value="item.id">
              </el-option>
          </el-select>
        </el-form-item>
          <el-form-item label="商品名称">
            <el-input v-model="currentEdit.goodsName" placeholder="请输入商品名称" />
          </el-form-item>
          <el-form-item label="商品内容">
            <el-input v-model="currentEdit.goodsContent" type="textarea" placeholder="请输入内容描述"/>
          </el-form-item>
          <el-form-item label="商品链接">
            <el-input v-model="currentEdit.goodsUrl" type="textarea" placeholder="请输入商品链接"/>
          </el-form-item>
          <el-form-item label="原价">
            <el-input v-model="currentEdit.originalPrice" />
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="currentEdit.price" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="currentEdit.isShop" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="热门商品">
            <el-radio v-model="currentEdit.isHot" :label="0">否</el-radio>
            <el-radio v-model="currentEdit.isHot" :label="1">是</el-radio>
          </el-form-item>
          <el-form-item label="轮播商品">
            <el-radio v-model="currentEdit.isCarousel" :label="0">否</el-radio>
            <el-radio v-model="currentEdit.isCarousel" :label="1">是</el-radio>
          </el-form-item>
          <el-form-item label="推荐商品">
            <el-radio v-model="currentEdit.isRecommend" :label="0">否</el-radio>
            <el-radio v-model="currentEdit.isRecommend" :label="1">是</el-radio>
          </el-form-item>
          <el-form-item label="限时活动">
            <el-radio v-model="currentEdit.isTime" :label="0">否</el-radio>
            <el-radio v-model="currentEdit.isTime" :label="1">是</el-radio>
          </el-form-item>
          <el-form-item label="结束时间">
            <el-date-picker v-model="currentEdit.timeOver" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
          <el-form-item label="图片选择" prop="goodsImg">
            <el-upload
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleAvatarSuccess"
              :action="fileUploadUrl"
              ref="upload"
              list-type="picture-card" :limit="1">
              <i class="el-icon-plus"/>
            </el-upload>
            <img :src="currentEdit.goodsImg" width="100%" alt="" v-show="false">
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog title="提示" :visible.sync="delDialogVisible" width="30%">
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
              prop: 'goodsImg',
              label: '商品图片',
              width: '100',
              render(h, scope){
                 return(<img src={ scope.row.goodsImg } width='80' height='80'/>)
              }
            },
            {
              prop: 'goodsName',
              label: '商品名称',
              align: 'center',
              width: '120',
            },
            {
              prop: 'goodsContent',
              label: '商品内容',
              align: 'center',
              width: '180',
            },
            {
              prop: 'goodsUrl',
              label: '链接',
              align: 'center',
              width: '120',
            },
            {
              prop: 'classifyName',
              label: '类型',
              align: 'center',
              width: '120',
            },
            {
              prop: 'isCarousel',
              label: '是否轮播',
              align: 'center',
              width: '100',
              render: (h, scope) => {
                if (scope.row.isCarousel === 0) {
                  return(<el-tag type='success' >否</el-tag>)
                } else {
                  return(<el-tag type='primary' >是</el-tag>)
                }
              }
            },
            {
              prop: 'originalPrice',
              label: '原价',
              align: 'center',
              width: '100',
            },
            {
              prop: 'price',
              label: '价格',
              align: 'center',
              width: '100',
            },
            {
              prop: 'isHot',
              label: '热门商品',
              align: 'center',
              width: '100',
              render: (h, scope) => {
                if (scope.row.isHot === 0) {
                  return(<el-tag type='success' >否</el-tag>)
                } else {
                  return(<el-tag type='primary' >是</el-tag>)
                }
              }
            },
            {
              prop: 'isRecommend',
              label: '推荐商品',
              align: 'center',
              width: '100',
              render: (h, scope) => {
                if (scope.row.isRecommend === 0) {
                  return(<el-tag type='success' >否</el-tag>)
                } else {
                  return(<el-tag type='primary' >是</el-tag>)
                }
              }
            },
            {
              prop: 'isTime',
              label: '限时商品',
              align: 'center',
              width: '100',
              render: (h, scope) => {
                if (scope.row.isTime === 0) {
                  return(<el-tag type='success' >否</el-tag>)
                } else {
                  return(<el-tag type='primary' >是</el-tag>)
                }
              }
            },
            {
              prop: 'timeOver',
              label: '结束时间',
              width: '180',
              align: 'center',
            },
            {
              prop: 'isShop',
              label: '状态',
              align: 'center',
              width: '100',
              render: (h, scope) => {
                if (scope.row.isShop === 0) {
                  return(<el-tag type='success' >下架</el-tag>)
                } else {
                  return(<el-tag type='primary' >上架</el-tag>)
                }
              }
            },
            {
              prop: 'createdAt',
              label: '创建日期',
              width: '180',
              align: 'center',
              render: (h, scope) => {
                return (
                  <div align="left">
                    <i class="el-icon-time"></i>
                    <span style="margin-left: 10px">{ scope.row.createdAt }</span>
                  </div>
                )
              }
            },
            {
            label: '操作',
            fixed: 'right',
            width: '180',
            align: 'center',
            render: (h, scope) => {
              return (
                <div>
                  <el-button type="primary" size="mini"
                        onClick={ () => { this.handleEdit(scope.$index, scope.row) } }>编辑</el-button>
                  <el-button
                    size="mini" type="danger"
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
        pageSize: 5,
        total: 0,
        currentEdit: {
          id: '',
          goodsImg: '',
          goodsName: '',
          goodsContent: '',
          goodsUrl: '',
          isCarousel: '',
          originalPrice: '',
          price: '',
          isHot: '',
          isRecommend: '',
          isTime: '',
          timeOver: '',
          isShop: '',
          classifyId: ''
        },
        dialogVisible:false,
        editdialogVisible: false,
        delDialogVisible:false,
        fileUploadUrl: Api.baseUrl + '/upload/fileUpload',
        delData: [],
        options: [{
          value: 0,
          label: '下架'
        }, {
          value: 1,
          label: '上架'
        }],
        value: '',
        imgUrl: '',
        classAll: []
      }
    },
    created () {
      this.createData(this.pageSize)
    },
    methods: {
      createData (length) {
        Api.getGoodsInfo(this.currentPage,this.pageSize)
          .then(data => {
            this.tableData.data = data.result.list;
            this.total = data.result.total;
          }).catch(err => {

        })
      },
      handleAdd() {
        // console.info("添加界面");
        // 获取类型
        Api.getGoodsClass()
          .then(data =>{
            // console.info(data.result);
            this.classAll = data.result;
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: '请求数据错误',
              type: 'error'
            });
          })
        this.currentEdit = {};
        this.editdialogVisible = true;
      },
      handleEdit(index,row) {
        // console.log(row);
        // 获取类型
        Api.getGoodsClass()
          .then(data =>{
            console.info(data.result);
            this.classAll = data.result;
          })
          .catch(err => {
            this.$message({
              showClose: true,
              message: '请求数据错误',
              type: 'error'
            });
          })
        this.currentEdit = row;
        this.editdialogVisible = true;
        this.dialogVisible=true;
      },
      handleDelete(index, row) {
        // console.log(index, row);
        this.delDialogVisible=true;
        this.delData = row;
        // console.log("点击了删除")

      },
      delConfirm() {
        this.loading = true;
        Api.delGoodsById(this.delData.id)
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
        if (this.imgUrl != ''){
            this.currentEdit.goodsImg = this.imgUrl;
        }
        Api.addGoodsInfo(this.dialogVisible,this.currentEdit)
          .then(data => {
              this.loading = false;
              this.$message({
                showClose: true,
                message: '编辑成功',
                type: 'success'
              });
              this.editdialogVisible=false;
              this.createData(this.pages, this.page)
            }).catch(err => {
              this.loading = false
              this.$message({
                showClose: true,
                message: '添加数据错误',
                type: 'error'
              });
            })
      },
      handleSizeChange (val) {
        this.currentPage = 1
        this.pageSize = val
        this.createData(this.pageSize)
      },
      handleCurrentChange () {
        this.createData(this.pageSize)
      },
      handleRemove(file, fileList) {
        // console.log(file, fileList)
        this.imgUrl = '';
      },
      handlePictureCardPreview(file) {
        // console.log(file.url)
      },
      handleAvatarSuccess(res, file) {
        if (res.code == 200) {
          // this.currentEdit.goodsImg = res.result;
          this.imgUrl = res.result;
        }
      }
    }
  }
</script>

<style scoped>
</style>
