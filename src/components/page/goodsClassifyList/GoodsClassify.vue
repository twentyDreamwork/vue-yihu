<template>
  <div>
    <div style="margin-bottom: 8px; width: 100%; background-color: white; padding: 8px;">
      <el-button type="primary" size="mini" @click="handleAdd">添加</el-button>
    </div>
    <lb-table :column="tableData.column"
              :data="tableData.data"
              border
              row-key="id"
              :tree-props="{children: 'childs', hasChildren: false}">
    </lb-table>


    <el-dialog :visible.sync="dialogVisible"
               :title="operationRecord=='edit'?'编辑列表':'添加列表'"
               append-to-body width="570px">
      <el-form ref="form" :model="operationData" label-width="80px" >
        <el-form-item label="图标选择" prop="goodsImg">
          <el-upload
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :action="fileUploadUrl"
            list-type="picture-card"
            :limit="1"
            :file-list="imgFilesList"
          >
            <i class="el-icon-plus"/>
          </el-upload>
          <img :src="operationData.icons" width="100%" alt="" v-show="false">
        </el-form-item>

        <el-form-item label="分类名称" prop="classifyName">
          <el-input v-model="operationData.classifyName"/>
        </el-form-item>
        <el-form-item label="上级分类">
          <el-cascader
            :options="classifyOptions"
            v-model="classifyModel"
            :props="{ checkStrictly: true }"
            clearable  @change="handleChange" :show-all-levels="false">
          </el-cascader>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-input v-model="operationData.priority"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="dialogVisible=false">取消</el-button>
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
    name: 'goodsClassify',
    components: {
      LbTable
    },
    data () {
      return {
        tableData: {
          column: [
            {
              prop: 'classifyName',
              label: '分类名称',
              align:'center',
              width:'200'
            },
            {
              prop: 'icons',
              label: '图标',
              align:'center',
              width:'120',
              render: (h, scope) => {
                return(<img src={ scope.row.icons } width='80' height='80'/>)
              }
            },
            {
              prop: 'priority',
              label: '优先级',
              align:'center',
              width:'200',

            },
            {
              label: '操作',
              width:'180',
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
        classifyModel:[],
        fileUploadUrl: Api.baseUrl + '/upload/fileUpload',
        operationRecord:"edit",//操作记录
        dialogVisible: false,
        delDialogVisible:false,
        operationData: {
          classifyName: "",
          icons: "",
          parentId:0,
          priority:0
        },
        delData: [],
        imgFilesList:[],
        classifyOptions: [
          {
            value: '0',
            label: '一级分类',
            children: []
          }
        ]

      }
    },
    created() {
      this.createData()
    },
    methods: {
      handleAdd(){
        this.classifyModel=null
        this.dialogVisible=true
        this.operationRecord="add"
        this.operationData.parentId="0"
        this.imgFilesList=[]
        this.operationData={
          classifyName: "",
          icons: "",
          parentId:0
        }
      },
      createData() {
        this.loading = true;
        Api.getGoodsClassifyList()
          .then(data => {
            this.loading = false
            // console.log(data.result);
            this.tableData.data = data.result
            this.classifyOptions[0].children=[]
            this.classifyToModel(this.tableData.data);

            console.log(data);
          }).catch(err => {
          //console.log(err);
          this.loading = false
          this.$message({
            showClose: true,
            message: '请求数据错误',
            type: 'error'
          });

        })
      },
      confirm() {
        this.loading = true;
          Api.updateGoodsClassify(this.operationData,this.operationRecord)
            .then(data => {
              this.loading = false
              this.$message({
                showClose: true,
                message: '操作成功',
                type: 'success'
              });
              this.dialogVisible = false
              this.createData()
            }).catch(err => {
            // console.log(err);
            this.loading = false
            this.$message({
              showClose: true,
              message: '操作错误',
              type: 'error'
            });

          })

      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handleAvatarSuccess(res, file) {
        if (res.code == 200) {
          this.operationData.icons = res.result
        }
      },
      handlePictureCardPreview(file) {
        // console.log(file.url)

      },
      handleEdit (index, row) {
        this.dialogVisible=true
        this.operationRecord="edit"
        this.operationData = row
        this.imgFilesList[0]={
          "url":row.icons
        }
        // console.log(index, row)


      },
      handleDelete (index, row) {
        // console.log(index, row)
        this.delDialogVisible = true
        this.delData = row;
      },
      delConfirm() {
        this.loading = true;
        Api.delGoodsClassify(this.delData.id)
          .then(data => {
            this.loading = false
            this.$message({
              showClose: true,
              message: '数据删除成功',
              type: 'success'
            });
            this.delDialogVisible = false
            this.createData()

          }).catch(err => {
          // console.log(err);
          this.loading = false
          this.$message({
            showClose: true,
            message: '请求数据错误',
            type: 'error'
          });

        })
      },
      handleChange(value){
        this.operationData.parentId = value[value.length-1]
      },
      classifyToModel(data){
        for(var val of data){
          var object ={
            value:0,
            label:"",
            children:[]
          }
          object.value=val.id
          object.label=val.classifyName
          if(val.childs!=null){
            for(var child of val.childs){
              var children ={
                value:0,
                label:"",
                children:[]
              }
              children.value=child.id
              children.label=child.classifyName
              object.children.push(children)
              if(child.childs!=null){
                for(var nextChild of child.childs){
                  var nextChildren ={
                    value:0,
                    label:"",
                    children:[]
                  }
                  nextChildren.value=nextChild.id
                  nextChildren.label=nextChild.classifyName
                  children.children.push(nextChildren)

                }
              }
            }
          }
          this.classifyOptions[0].children.push(object);

        }
      }


    }
  }
</script>

<style scoped>


</style>
