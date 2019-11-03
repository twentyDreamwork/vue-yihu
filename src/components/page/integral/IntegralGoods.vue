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


    <el-dialog :visible.sync="editdialogVisible"
               title="编辑"
               append-to-body :before-close="handleClose">
      <div class="dialog-content">
        <el-form  label-width="100px">
          <el-form-item label="商品名称">
            <el-input v-model="value.itemName" placeholder="请输入商品名称"/>
          </el-form-item>
          <el-form-item label="商品状态">
            <el-select v-model="value.isShop" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品优先级">
            <el-input v-model="value.orderNum" placeholder="请输入优先级"/>
          </el-form-item>
          <el-form-item label="属性类型：">
            <el-card shadow="never" class="cardBg">

              <el-tag
                :key="tag"
                v-for="tag in dynamicTags"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)">
                {{tag}}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              >
              </el-input>
              <el-button class="button-new-tag" size="small" @click="showInput" type="info" plain>添加属性</el-button>
              <el-button class="littleMarginLeft" @click="generateProductAttrType()" v-show="dynamicTags.length>0"
                         type="success" plain>生成规格
              </el-button>
            </el-card>


          </el-form-item>

          <el-form-item label="商品规格：">

            <el-card shadow="never" class="cardBg">
              <div v-for="(productAttr,idx) in selectProductAttr">
                {{productAttr.name}}：

                <el-checkbox-group v-model="selectProductAttr[idx].values">
                  <div v-for="(item,index) in selectProductAttr[idx].options" style="display: inline-block"
                       class="littleMarginLeft">
                    <el-checkbox :label="item" :key="index"></el-checkbox>
                    <el-button type="text" class="littleMarginLeft" @click="handleRemoveProductAttrValue(idx,index)">删除
                    </el-button>
                  </div>
                </el-checkbox-group>
                <el-input v-model="addProductAttrValue[idx]" style="width: 160px;margin-left: 10px"
                          clearable></el-input>
                <el-button class="littleMarginLeft" @click="handleAddProductAttrValue(idx)">增加</el-button>
              </div>
            </el-card>
            <el-table style="width: 100%;margin-top: 20px"
                      :data="value.sku"
                      border>
              <el-table-column
                v-for="(item,index) in selectProductAttr"
                :label="item.name"
                :key="index"
                align="center">
                <template slot-scope="scope">
                  {{getProductSkuSp(scope.row,index)}}
                </template>
              </el-table-column>

              <el-table-column
                label="所需积分"
                width="150"
                align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.point"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="商品库存"
                width="100"
                align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.stockNum"></el-input>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="80"
                align="center">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    @click="handleRemoveProductSku(scope.$index, scope.row)">删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button
              type="primary"
              style="margin-top: 20px"
              @click="handleRefreshProductSkuList">刷新列表
            </el-button>

          </el-form-item>
          <el-form-item label="主图：">
            <el-upload
              :on-preview="handlePictureCardPreviewList"
              :on-remove="handleRemoveList"
              :on-success="handleAvatarSuccessList"
              :action="fileUploadUrl"
              ref="upload"
              :file-list="fileList"
              list-type="picture-card"
              :limit="1">
              <i class="el-icon-plus"/>
            </el-upload>
          </el-form-item>
          <el-form-item label="轮播图：">
            <el-tabs type="card">
              <el-upload
                :on-preview="handlePictureCardPreviewCarousel"
                :on-remove="handleRemoveCarousel"
                :on-success="handleAvatarSuccessCarousel"
                :action="fileUploadUrl"
                ref="upload"
                multiple
                :file-list="carouselList"
                list-type="picture-card" :limit="5">
                <i class="el-icon-plus"/>
              </el-upload>
            </el-tabs>
          </el-form-item>
          <el-form-item label="属性图：" v-if="hasAttrPic">
            <el-card shadow="never" class="cardBg">
              <div v-for="(item,index) in selectProductAttrPics">
                <span>{{item.name}}:</span>
                <el-upload
                  :on-preview="handlePictureCardPreviewAttr"
                  :on-remove="function(res,file){return handleRemoveAttr(res,file,index)}"
                  :on-success="function(res,file){return handleAvatarSuccessAttr(res,file,index)}"
                  :action="fileUploadUrl"
                  ref="upload"
                  :file-list="item.value"

                  list-type="picture-card" :limit="1">
                  <i class="el-icon-plus"/>
                </el-upload>
              </div>
            </el-card>
          </el-form-item>



          <el-form-item label="详情图：">
            <el-tabs type="card">
              <el-upload
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handleAvatarSuccess"
                :action="fileUploadUrl"
                ref="upload"
                multiple
                :file-list="detailsList"
                list-type="picture-card" :limit="10">
                <i class="el-icon-plus"/>
              </el-upload>
            </el-tabs>
          </el-form-item>
          <el-form-item style="text-align: center">
            <el-button type="primary" size="medium" @click="handleNext">确定生成</el-button>
          </el-form-item>
        </el-form>
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
  import Api from './api'
  import LbTable from '../module/lb-table/lb-table'
  export default {
    components: {
      LbTable
    },
    data() {
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
              prop: 'itemName',
              label: '商品名称',
              align: 'center',
              width: '120',
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
              prop: 'point',
              label: '积分',
              align: 'center',
              width: '150',
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
              width: '240',
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
        editdialogVisible: false,
        isEdit:false,
        fileList: [],//列表图片
        detailsList: [],//详情图片
        carouselList: [],//轮播图片
        options: [{
          value: 0,
          label: '下架'
        }, {
          value: 1,
          label: '上架'
        }],
        fileUploadUrl: Api.baseUrl + '/upload/fileUpload',
        //编辑模式时是否初始化成功
        hasEditCreated: false,
        //商品属性分类下拉选项
        productAttributeCategoryOptions: [],
        //选中的商品属性
        selectProductAttr: [],
        //选中的商品参数
        selectProductParam: [],
        //选中的商品属性图片
        selectProductAttrPics: [],
        //可手动添加的商品属性
        addProductAttrValue: [],
        value: {
          itemName:"",
          isShop:1,
          orderNum:1
        },
        list: [
          {
            id: 1,
            name: "服装-T恤",
            attributeCount: 2,
            paramCount: 5
          }
        ],
        productAttributeCategoryList: [],
        productAttrTypeValue: "",
        dynamicTags: [],
        inputVisible: false,
        inputValue: '',
        attrImg: [],
        param: {itemName: "", isShop: 1},
        sku:[],
        delDialogVisible:false,
        delData: []


      }
    },
    computed: {
      //是否有商品属性图片
      hasAttrPic() {
        if (this.selectProductAttrPics.length < 1) {
          return false;
        }
        return true;
      },
      //商品的编号
      productId() {
        return this.value.id;
      },
    },
    created() {
      this.getProductAttrCateList();
      this.createData(this.pageSize)
    },
    watch: {},
    methods: {
      createData (length) {
        Api.getIntegralGoodsInfo(this.currentPage,this.pageSize, this.param)
          .then(data => {
            // console.info(data);
            this.tableData.data = data.result.list;
            this.total = data.result.total;
          }).catch(err => {

        })
      },
      getProductAttrCateList() {

        this.productAttributeCategoryOptions = [];
        // for (let i = 0; i < this.list.length; i++) {
        //   this.productAttributeCategoryOptions.push({label: this.list[i].name, value: this.list[i].id});
        // }

      },
      getProductAttrList(type, cid) {
        this.selectProductAttr = [];
        for (let i = 0; i < this.dynamicTags.length; i++) {
          this.selectProductAttr.push({
            id: i,
            name: this.dynamicTags[i],
            inputList: "",
            values: [],
            options: []
          });
        }
        console.log(this.selectProductAttr)
      },
      //获取设置的可手动添加属性值
      getEditAttrOptions(id) {
        let options = [];
        for (let i = 0; i < this.value.productAttributeValueList.length; i++) {
          let attrValue = this.value.productAttributeValueList[i];
          if (attrValue.productAttributeId === id) {
            let strArr = attrValue.value.split(',');
            for (let j = 0; j < strArr.length; j++) {
              options.push(strArr[j]);
            }
            break;
          }
        }
        return options;
      },
      //获取选中的属性值
      getEditAttrValues(index) {
        let values = [];
        if (index === 0) {
          for (let i = 0; i < this.value.sku.length; i++) {
            let sku = this.value.sku[i];
            if (sku.sp1 != null && values.indexOf(sku.sp1) === -1) {
              values.push(sku.sp1);
            }
          }
        } else if (index === 1) {
          for (let i = 0; i < this.value.sku.length; i++) {
            let sku = this.value.sku[i];
            if (sku.sp2 != null && values.indexOf(sku.sp2) === -1) {
              values.push(sku.sp2);
            }
          }
        } else {
          for (let i = 0; i < this.value.sku.length; i++) {
            let sku = this.value.sku[i];
            if (sku.sp3 != null && values.indexOf(sku.sp3) === -1) {
              values.push(sku.sp3);
            }
          }
        }
        return values;
      },
      handleProductAttrChange(value) {
        this.getProductAttrList(0, value);
        this.getProductAttrList(1, value);
      },
      getInputListArr(inputList) {
        return inputList.split(',');
      },
      handleAddProductAttrValue(idx) {
        let options = this.selectProductAttr[idx].options;
        if (this.addProductAttrValue == null || this.addProductAttrValue == '') {
          this.$message.error('属性值不能为空');
          return
        }
        if (options.indexOf(this.addProductAttrValue) !== -1) {
          this.$message.error('属性值不能重复');

          return;
        }
        this.selectProductAttr[idx].options.push(
          this.addProductAttrValue[idx]
        );

      },
      handleRemoveProductAttrValue(idx, index) {
        this.selectProductAttr[idx].options.splice(index, 1);
      },
      getProductSkuSp(row, index) {
        if (index === 0) {
        return row.sp1;
        } else if (index === 1) {
          return row.sp2;
        } else {
          return row.sp3;
        }

      },
      handleRefreshProductSkuList() {
        this.$confirm('是否要刷新', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.refreshProductAttrPics();
          this.refreshProductSkuList();

          console.log(this.value.sku);
          console.log(this.selectProductAttr)
        });

      },
      refreshProductSkuList() {
        this.value.sku = [];
        let skuList = this.value.sku;
        //只有一个属性时
        if (this.selectProductAttr.length === 1) {
          let values = this.selectProductAttr[0].values;
          for (let i = 0; i < values.length; i++) {
            skuList.push({
              sp1: values[i]
            });
          }
        } else if (this.selectProductAttr.length === 2) {
          let values0 = this.selectProductAttr[0].values;
          let values1 = this.selectProductAttr[1].values;
          for (let i = 0; i < values0.length; i++) {
            if (values1.length === 0) {
              skuList.push({
                sp1: values0[i]
              });
              continue;
            }
            for (let j = 0; j < values1.length; j++) {
              skuList.push({
                sp1: values0[i],
                sp2: values1[j]
              });
            }
          }
        } else {
          let values0 = this.selectProductAttr[0].values;
          let values1 = this.selectProductAttr[1].values;
          let values2 = this.selectProductAttr[2].values;
          for (let i = 0; i < values0.length; i++) {
            if (values1.length === 0) {
              skuList.push({
                sp1: values0[i]
              });
              continue;
            }
            for (let j = 0; j < values1.length; j++) {
              if (values2.length === 0) {
                skuList.push({
                  sp1: values0[i],
                  sp2: values1[j]
                });
                continue;
              }
              for (let k = 0; k < values2.length; k++) {
                skuList.push({
                  sp1: values0[i],
                  sp2: values1[j],
                  sp3: values2[k]
                });
              }
            }
          }
        }

      },
      refreshProductAttrPics() {
        this.selectProductAttrPics = []
        if (this.selectProductAttr.length >= 1) {
          let values = this.selectProductAttr[0].values;
          for (let i = 0; i < values.length; i++) {
            let pic = null;
            this.selectProductAttrPics.push({name: values[i], url: pic})
          }
        }
      },
      //获取商品相关属性的图片
      getProductSkuPic(name) {
        for (let i = 0; i < this.value.sku.length; i++) {
          if (name === this.value.sku[i].sp1) {
            return this.value.sku[i].pic;
          }
        }
        return null;
      },
      //合并商品属性图片
      mergeProductAttrPics() {
        let pointArray = [];
        for (let i = 0; i < this.attrImg.length; i++) {
          for (let j = 0; j < this.value.sku.length; j++) {
            if (this.value.sku[j].sp1 === this.attrImg[i].name) {
              this.value.sku[j].pic = this.attrImg[i].url;
            }

          }
        }
        this.value.stockNum=0;
        for (let i = 0; i < this.value.sku.length; i++) {
          pointArray.push(this.value.sku[i].point);
          this.value.sku[i].skuCode = (new Date()).valueOf() + i;
          this.value.stockNum+= parseInt(this.value.sku[i].stockNum);
        }
        this.value.point = Math.min(...pointArray);
        this.value.sp = this.selectProductAttr;
        this.value.attr=this.attrImg;
        console.log(this.attrImg)
        console.log(JSON.stringify(this.value));


      },
      handleRemoveProductSku(index, row) {
        let list = this.value.sku;
        if (list.length === 1) {
          list.pop();
        } else {
          list.splice(index, 1);
        }
      },
      handleNext() {
        if (this.value.sku == undefined) {
          this.$message.error('请检查添加数据');
        } else {
          let isSuccess = true;
          for (let i = 0; i < this.value.sku.length; i++) {
            if (this.value.sku[i].point == undefined || this.value.sku[i].stockNum == undefined) {
              isSuccess = false;
            }
          }
          if (isSuccess) {
            this.mergeProductAttrPics();
            console.log(this.value)
            Api.addIntegralGoodsInfo(this.isEdit,this.value)
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
          } else {
            this.$message.error('请检查添加数据');

          }
        }


      },
      generateProductAttrType() {
        this.getProductAttrList();
      },
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.dynamicTags.push(inputValue);
        }

        this.inputVisible = false;
        this.inputValue = '';

      },
      handlePictureCardPreview(file) {
        console.log(file.url)
      },
      handleRemove(file, fileList) {
        this.value.itemContent.splice(this.value.itemContent.findIndex(item => item === file.response.result), 1)
      },
      handleAvatarSuccess(res, fileList) {
        if (this.value.itemContent == undefined) {
          this.value.itemContent = [];
        }
        if (res.code == 200) {
          this.value.itemContent.push(res.result)
        }

      },
      handlePictureCardPreviewAttr(file) {
        console.log(file.url)

      },
      handleRemoveAttr(file, fileList, index) {
        console.log(file, fileList)
        this.attrImg[index] = [];
      },
      handleAvatarSuccessAttr(res, file, index) {
        if (res.code == 200) {
          this.attrImg[index] = {
            url: res.result,
            name: this.selectProductAttrPics[index].name
          };
        }
      },
      handlePictureCardPreviewList(file) {
        console.log(file.url)

      },
      handleRemoveList(file, fileList, index) {
        console.log(file, fileList)
        this.attrImg[index] = [];

      },
      handleAvatarSuccessList(res, file, index) {
        for(let key of this.fileList){
          this.value.itemImg=key.url
        }
        if(this.value.itemImg==undefined){
          this.value.itemImg=[];
        }
        if (res.code == 200) {
          this.value.itemImg=res.result;
        }

      },
      handlePictureCardPreviewCarousel(file) {
        console.log(file.url)
      },
      handleRemoveCarousel(file, fileList) {
        if(file.response!=undefined){
          this.value.carouselImg.splice(this.value.carouselImg.findIndex(item => item === file.response.result), 1)
        }else{
          this.value.carouselImg.splice(this.value.carouselImg.findIndex(item => item === file.url), 1)

        }
      },
      handleAvatarSuccessCarousel(res, fileList) {
        if (this.value.carouselImg == undefined) {
          this.value.carouselImg = [];
        }
        if (res.code == 200) {
          this.value.carouselImg.push(res.result)

        }

      },
      handleSizeChange (val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.createData(this.pageSize)
      },
      handleCurrentChange () {
        this.createData(this.pageSize)
      },
      handleEdit(index,row) {
        this.editdialogVisible = true;
        this.isEdit=true;
        this.fileList=[]//列表图片
        this.detailsList=[]//详情图片
        this.carouselList=[]//轮播图片
        this.dynamicTags=[]
        Api.getItemPointInfo(row.id)
          .then(data => {
            for(let key in data.result){
              this.value[key] = data.result[key];
            }
            for(let i=0;i<data.result.sp.length;i++){
              this.dynamicTags.push(data.result.sp[i].name)
            }
            this.selectProductAttr=[];
            this.selectProductAttr=data.result.sp;
            this.refreshProductSkuList();
            // this.refreshProductAttrPics();
            for(let i=0;i<data.result.sku.length;i++){
              this.value.sku[i].stockNum=data.result.sku[i].stockNum;
              this.value.sku[i].point=data.result.sku[i].point;
            }
            this.selectProductAttrPics=[]
            for(let i=0;i<data.result.attr.length;i++){
              let object={
                name:"",
                value:[]
              }
              object.name=data.result.attr[i].name;
              object.value.push(data.result.attr[i]);
              this.selectProductAttrPics.push(object)
            }

            this.fileList=[{
              "url":data.result.itemImg //主图片
            }];

            for(let key of data.result.itemContent){
              this.detailsList.push({
                "url":key//详情图片
              })
            }
            for(let key of data.result.carouselImg){
              this.carouselList.push({
                "url":key//轮播图片
              })
            }

          }).catch(err => {

        })
      },
      handleAdd() {
        this.editdialogVisible = true;
        this.fileList=[]//列表图片
        this.detailsList=[]//详情图片
        this.carouselList=[]//轮播图片
        this.dynamicTags=[];
        this.value={};
        this.isEdit=false;
        this.selectProductAttrPics=[];
        this.selectProductAttr=[];
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
      handleEditIsShop(index,row){
        console.log(row)

        let editData = {
          "id":row.id,
          "isShop":row.isShop==0?1:0
        }
        Api.updateItemPointInfoReq(editData)
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
            message: '修改数据错误',
            type: 'error'
          });
        });
      },
      handleClose(done){
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
        }

    }
  }
</script>

<style scoped>
  .littleMarginLeft {
    margin-left: 10px;
  }

  .littleMarginTop {
    margin-top: 10px;
  }

  .paramInput {
    width: 250px;
  }

  .paramInputLabel {
    display: inline-block;
    width: 100px;
    text-align: right;
    padding-right: 10px
  }

  .cardBg {
    background: #F8F9FC;
  }

  .el-tag + .el-tag {
    margin-left: 10px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
