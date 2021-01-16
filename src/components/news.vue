<template>
    <div class="news-wrap">
    <div class="table-head-wrap">
        <el-form :model="searchForm" label-position="left">
           <el-row>
                <el-col :span="8">
                  <el-form-item label="新闻名称" label-width="70px" style="margin-right:15px">
                      <el-input v-model="searchForm.pro_Name" placeholder="请输入新闻名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="新闻系列" label-width="70px" style="margin-right:15px">
                      <el-select v-model="searchForm.pro_State" placeholder="请选择系列">
                      <el-option label="公司新闻" value="1"></el-option>
                      <el-option label="行业状态" value="0"></el-option>
                      </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="2" style="margin-right:20px">
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
                      <el-button type="danger" @click="addNews" icon="el-icon-plus">添加新闻</el-button>
                  </el-form-item>
                </el-col>
           </el-row>
        </el-form>
    </div>
        <!-- <el-table
    v-loading="loading"
    :data="tableData"
    border class="news-table-wrap"
    style="width: 100%">
    <el-table-column
      prop="nid"
      label="NID"
      width="100">
    </el-table-column>
    <el-table-column
      prop="new_title"
      label="新闻名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="new_intro"
      label="新闻介绍"
      width="220">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <div style="max-width:300px;">
            <span>{{ scope.row.new_intro }}</span>
          </div>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">查看</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
     <el-table-column
      prop="new_type"
      label="新闻系列"
      width="150">
      <template slot-scope="scope">
       <el-tag type="danger" effect="dark" v-if="scope.row.new_type === '1'">公司新闻</el-tag>
       <el-tag type="info" effect="dark" v-else>行业状态</el-tag>
      </template>
    </el-table-column>
     <el-table-column
      prop="edit"
      label="操作"
      min-width="250">
      <template slot-scope="scope">
        <el-button
          type="primary" icon="el-icon-edit"  size="small"
          @click="handleEdit(scope.row.nid, scope.row)">修改信息</el-button>
        <el-button
          type="danger" icon="el-icon-delete"  size="small"
          @click="handleDelete(scope.row.nid, scope.row)">删除</el-button>
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
        </el-pagination> -->
        <NewsDialog :dialogFormVisible="dialogFormVisible" :proName="proName" :isUpload="isUpload" @showProduct="showPro" :num="num"
        :proForm="newForm" :isAdd="isAdd" @changeVisiable="changeV" @changeCurrent="changeCurrent(totalNum,true)"></NewsDialog>
    </div>
</template>
<script>
  import NewsDialog from './news-card';

export default {
   components: {
      NewsDialog,
    },
    data() {
      return {
        tableData: [],
        typeList:[],
        searchForm:{
            new_title:'',
            new_type:'',
            pageSize:10,
            startPage:0,
        },
        dialogFormVisible:false,
        proName:'',
        num:0,
        totalNum:0,
        newForm:{
         new_title: '',
         new_content: '',
         new_type: '',
         new_image: '',
         new_type: '',
         new_date: '',
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
            new_title:'',
            new_type:'',
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
        //   this.post('products/search',this.searchForm).then(res=>{
        //     this.tableData = res.data.tableData;
        //     this.totalNum = res.data.totalNum;
        //     this.isSearch = true;
        //   }).catch(e=>{
        //     this.$error('查询失败！');
        //   })
        },
        showPro(){
            // this.get("/products/show",this.defaultTable).then((res)=>{
            //     this.tableData = res.tableData;
            //     this.totalNum = res.totalNum;
            //     this.typeList = [];
            //     this.tableData.forEach(item=>{
            //       !this.typeList.includes(item.pro_Type) && this.typeList.push(item.pro_Type);
            //     })
            // }).catch(e=>{
            //   this.$error(`展示出错，${e}`);
            // }).finally(e=>{
            //   this.loading = false;
            // });
        },
        changeV(res){
          this.dialogFormVisible = res;
        },
        handleEdit(pid,row){
        //   this.get(`/products/${pid}/showPro`).then(res => {
        //     this.isAdd = this.isUpload = false;
        //     this.productForm = res;
        //     this.proName = res.pro_Name;
        //     this.num = pid;
        //     this.dialogFormVisible = true;
        //   }).catch(e=>{
        //     this.$error(`获取信息失败，${e}`);
        //   })
        },
        handleDelete(id,row){
        //   this.$confirm(`请问您确定删除该产品${id}吗？`, '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        //   }).then(() => {
        //     this.post(`/products/${id}/delete`).then(res=>{
        //       this.$success("删除成功");
        //       this.changeCurrent(this.totalNum,false);
        //       this.showPro();
        //     }).catch(e=>{
        //       this.$error('删除失败');
        //     })
        //   });
          },
          addNews(){
            this.newForm = {};
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
.news-wrap{
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
    .news-table-wrap{
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