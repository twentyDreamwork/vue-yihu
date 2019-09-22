<template>
  <div class="app-container">
    <div style="margin-bottom: 8px; width: auto; background-color: white; padding: 8px;">
      <el-form :inline="true" :model="param">
        <el-form-item label="商品名称">
          <el-input v-model="param.itemName"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="param.isShop" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="mini" @click="createData">查询</el-button>
          <el-button type="primary" size="mini" @click="handleAdd">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <lb-table v-loading="loading"
              :column="tableData.column"
              :data="tableData.data"
              pagination
              background
              height="400"
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
          <el-form-item label="商品名称">
            <el-input v-model="currentEdit.itemName" placeholder="请输入商品名称" />
          </el-form-item>
          <el-form-item label="商品内容">
            <el-input v-model="currentEdit.itemContent" type="textarea" placeholder="请输入内容描述"/>
          </el-form-item>
          <el-form-item label="兑换积分">
            <el-input v-model="currentEdit.point" />
          </el-form-item>
          <el-form-item label="库存">
            <el-input v-model="currentEdit.stockNum" />
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
          <el-form-item label="图片选择" prop="itemImg">
            <el-upload
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleAvatarSuccess"
              :action="fileUploadUrl"
              ref="upload"
              list-type="picture-card" :limit="1" :file-list="imgFilesList">
              <i class="el-icon-plus"/>
            </el-upload>
            <img :src="currentEdit.itemImg" width="100%" alt="" v-show="false">
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
              prop: 'itemImg',
              label: '商品图片',
              width: '100',
              render(h, scope){
                 return(<img src={ scope.row.itemImg } width='80' height='80'/>)
              }
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
              prop: 'itemName',
              label: '商品名称',
              align: 'center',
              width: '120',
            },
            {
              prop: 'itemContent',
              label: '商品内容',
              align: 'center',
              width: '180',
            },
            {
              prop: 'point',
              label: '所需积分',
              align: 'center',
              width: '120',
            },
            {
              prop: 'stockNum',
              label: '库存数',
              align: 'center',
              width: '120'
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
            width: '220',
            align: 'center',
            render: (h, scope) => {
              return (
                <div>
                  <el-button type={scope.row.isShop===0?"primary":"success"} size="mini" 
                    onClick={ () => {this.handleEditIsShop(scope.$index, scope.row)}}>{scope.row.isShop===0?'上架':'下架'}</el-button>
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
        pageSize: 10,
        total: 0,
        currentEdit: {
          id: '',
          itemImg: '',
          itemName: '',
          itemContent: '',
          point: '',
          stockNum: '',
          isShop: ''
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
        imgFilesList:[],
        param: {itemName:null,isShop:1}
      }
    },
    created () {
      this.createData(this.pageSize)
    },
    methods: {
      createData (length) {
        Api.getIntegralGoodsInfo(this.currentPage,this.pageSize, this.param)
          .then(data => {
            this.tableData.data = data.result.list;
            this.total = data.result.total;
          }).catch(err => {

        })
      },
      handleAdd() {
        // console.info("添加界面");
        this.imgUrl='';
        this.imgFilesList=[];
        this.currentEdit = {isShop:1};
        this.editdialogVisible = true;
        this.dialogVisible=false;
      },
      handleEdit(index,row) {
        // console.log("编辑界面");
        if (row.itemImg !=null){
          this.imgFilesList=[{
            "url": row.itemImg
          }];
        }else{
          this.imgFilesList=[];
        } 
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
        Api.delIntegralGoodsById(this.delData.id)
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
            this.currentEdit.itemImg = this.imgUrl;
        }
        Api.addIntegralGoodsInfo(this.dialogVisible,this.currentEdit)
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
      handleEditIsShop(index,row){
        if (row.isShop==0){
          this.currentEdit={id: row.id, isShop: 1};
        }else{
          this.currentEdit={id: row.id, isShop: 0};
        }
        Api.addIntegralGoodsInfo(true,this.currentEdit)
           .then(data => {
             this.loading = false;
              this.$message({
                showClose: true,
                message: '操作成功',
                type: 'success'
              });
              this.createData(this.pages, this.page);
            }).catch(err => {
              this.loading = false
              this.$message({
                showClose: true,
                message: '添加数据错误',
                type: 'error'
              });
            });
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
