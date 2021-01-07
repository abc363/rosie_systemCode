<template>
    <div class="product-wrap">
    <div class="table-head-wrap">
        <el-form :model="searchForm" label-position="left">
           <el-row>
                <el-col :span="5">
                  <el-form-item label="名称" label-width="40px">
                      <el-input v-model="searchForm.pro_Name" placeholder="请输入名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="系列" label-width="40px" style="margin:0 12px">
                      <el-select v-model="searchForm.pro_Type" placeholder="请选择系列">
                        <el-option :label="item" :value="item" v-for="(item,index) in typeList" :key="index"></el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="状态" label-width="40px" style="margin-right:12px">
                      <el-select v-model="searchForm.pro_State" placeholder="请选择状态">
                      <el-option label="售卖中" value="1"></el-option>
                      <el-option label="未上线" value="0"></el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="margin-right:18px">
                  <el-form-item >
                      <el-button type="primary" icon="el-icon-search" @click="onSearch()">查询</el-button>
                  </el-form-item>
                  </el-col>
                   <el-col :span="2">
                  <el-form-item>
                      <el-button type="info" @click="onReset">重置</el-button>
                  </el-form-item>
                  </el-col>
                  <el-col :span="3">
                  <el-form-item>
                      <el-button type="danger" @click="addProduct" icon="el-icon-plus">添加产品</el-button>
                  </el-form-item>
                </el-col>
           </el-row>
        </el-form>
    </div>
        <el-table
    v-loading="loading"
    :data="tableData"
    border class="product-table-wrap"
    style="width: 100%">
    <el-table-column
      prop="pid"
      label="PID"
      width="100">
    </el-table-column>
    <el-table-column
      prop="pro_Name"
      label="产品名称"
      width="180">
       <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <div style="max-width:300px;">{{ scope.row.pro_info }}</div>
          <div slot="reference" class="name-wrapper">
            <span>{{ scope.row.pro_Name }}</span>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      prop="pro_Type"
      label="归属系列"
      width="180">
    </el-table-column>
    <el-table-column
      prop="pro_Type"
      label="产品图片"
      width="220">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <div style="max-width:300px;">
            <img :src="scope.row.pro_fontTiltOne" style="width:220px;height:140px"/></div>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">查看</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
     <el-table-column
      prop="pro_Num"
      label="商品库存"
      width="150">
    </el-table-column>
     <el-table-column
      prop="pro_State"
      label="销售状态"
      width="150">
      <template slot-scope="scope">
       <el-tag type="danger" effect="dark" v-if="scope.row.pro_State === '1'">售卖中</el-tag>
       <el-tag type="info" effect="dark" v-else>未上线</el-tag>
      </template>
    </el-table-column>
     <el-table-column
      prop="edit"
      label="操作"
      min-width="250">
      <template slot-scope="scope">
        <el-button
          type="primary" icon="el-icon-edit"  size="small"
          @click="handleEdit(scope.row.pid, scope.row)">修改信息</el-button>
        <el-button
          type="danger" icon="el-icon-delete"  size="small"
          @click="handleDelete(scope.row.pid, scope.row)">删除</el-button>
      </template>
    </el-table-column>
        </el-table>
         <el-pagination
         v-if="pageShow"
        :current-page.sync="currentPage"
        :page-size="defaultTable.pageSize"
        background
        class="paginate-wrap"
        layout="total, prev, pager, next, jumper"
        :total="totalNum">
        </el-pagination>
        <ProductDialog :dialogFormVisible="dialogFormVisible" :proName="proName" :isUpload="isUpload" @showProduct="showPro" :num="num"
        :proForm="productForm" :isAdd="isAdd" @changeVisiable="changeV" @changeCurrent="changeCurrent(totalNum,true)"></ProductDialog>
    </div>
</template>
<script>
  import ProductDialog from './product-card';

export default {
   components: {
      ProductDialog,
    },
    data() {
      return {
        tableData: [],
        typeList:[],
        searchForm:{
            pro_State:'',
            pro_Name:'',
            pro_Type:'',
            pageSize:10,
            startPage:0,
        },
        dialogFormVisible:false,
        proName:'',
        num:0,
        totalNum:0,
        productForm:{
          pro_Name:'',
          pro_Type:'',
          pro_Num:'',
          pro_State:'',
          pro_fontTiltOne:'',
          pro_file:'',
          pro_fileName:'',
          pro_manualName:'',
          pro_manual:'',
          pro_info:'',
          pro_finger:'',
          pro_driver:'',
          pro_video:'',
          pro_fingerName:'',
          pro_driverName:'',
          pro_videoName:'',
          pro_fontTiltTwo:'',
          pro_backTiltOne:'',
          pro_backTiltTwo:'',
          pro_font:'',
          pro_back:'',
        },
        isAdd:false,
        isUpload:true,
        currentPage:1,
        isSearch:false,
        pageShow:true,
        loading:true,
        defaultTable:{
          pageSize:10,
          startPage:0,
        },
      }
    },
    watch:{
      currentPage(newVal){
        if(this.isSearch){
          this.searchForm.startPage = this.searchForm.pageSize*(newVal-1);
          this.onSearch();
        }else{
          this.defaultTable.startPage = this.defaultTable.pageSize*(newVal-1);
          this.showPro();
        }
        this.pageShow = false;
    　　this.$nextTick(() => {
    　　  this.pageShow = true;
    　　})
      }
    },
    mounted(){
        this.showPro();
    },
    methods:{
        onReset(){
          this.searchForm = {
            pro_State:'',
            pro_Name:'',
            pro_Type:'',
            pageSize:10,
            startPage:0,
          };
          this.isSearch = false;
          this.defaultTable.startPage = 0;
          if(this.currentPage == 1){
            this.showPro();
          }else{
            this.currentPage = 1;
          }
        },
        onSearch(){
          this.post('products/search',this.searchForm).then(res=>{
            this.tableData = res.data.tableData;
            this.totalNum = res.data.totalNum;
            this.isSearch = true;
          }).catch(e=>{
            this.$error('查询失败！');
          })
        },
        showPro(){
            this.get("/products/show",this.defaultTable).then((res)=>{
                this.tableData = res.tableData;
                this.totalNum = res.totalNum;
                this.typeList = [];
                this.tableData.forEach(item=>{
                  !this.typeList.includes(item.pro_Type) && this.typeList.push(item.pro_Type);
                })
            }).catch(e=>{
              this.$error(`展示出错，${e}`);
            }).finally(e=>{
              this.loading = false;
            });
        },
        changeV(res){
          this.dialogFormVisible = res;
        },
        handleEdit(pid,row){
          this.get(`/products/${pid}/showPro`).then(res => {
            this.isAdd = this.isUpload = false;
            this.productForm = res;
            this.proName = res.pro_Name;
            this.num = pid;
            this.dialogFormVisible = true;
          }).catch(e=>{
            this.$error(`获取信息失败，${e}`);
          })
        },
        handleDelete(id,row){
          this.$confirm(`请问您确定删除该产品${id}吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.post(`/products/${id}/delete`).then(res=>{
              this.$success("删除成功");
              this.changeCurrent(this.totalNum,false);
              this.showPro();
            }).catch(e=>{
              this.$error('删除失败');
            })
          });
          },
          addProduct(){
            this.productForm = {};
            this.isAdd = true;
            this.dialogFormVisible = true;
          },
          changeCurrent(num,type){
              num = type ? num+1 : num-1;
              this.currentPage = Math.floor(num/(this.defaultTable.pageSize+1))+1;
          }
    }
}
</script>
<style lang="less">
.product-wrap{
    width:100%;
    .table-head-wrap{
        background-color: #F0F0F0;
        height: 70px;
        padding: 15px;
        box-sizing: border-box;
        width: 100%;
        border-bottom: 1px solid #e6e6e6;
        display: flex;
    }
    .product-table-wrap{
         tr:hover>td{
        background-color: #F0F0F0 !important;
        }
        th{
            background-color: #F0F0F0;
            border-color: #e6e6e6;
        }
        td{
            box-sizing: border-box;
        }
    }
    .paginate-wrap{
      margin-top: 20px;
      display: flex;
      align-items: center;
      .btn-prev,.btn-next{
        height: 40px;
        line-height: 40px;
        min-width: 40px !important;
      }
      .el-pager li{
        padding: 0 18px;
        height:38px;
        line-height: 38px;
      }
    }
}
</style>