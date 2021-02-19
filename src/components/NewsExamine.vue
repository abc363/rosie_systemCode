<template>
    <div class="newsExamine-wrap">
    <div class="table-head-wrap">
        <el-form :model="searchForm" label-position="left">
           <el-row>
                <el-col :span="5">
                  <el-form-item label="新闻标题" label-width="40px">
                      <el-input v-model="searchForm.news_title" placeholder="请输入新闻标题"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item label="审核状态" label-width="40px" style="margin:0 12px">
                      <el-select v-model="searchForm.news_isPass" placeholder="请选择审核状态">
                        <el-option :label="item" :value="item" v-for="(item,index) in typeList" :key="index"></el-option>
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
      label="NID"
      width="100">
    </el-table-column>
    <el-table-column
      prop="news_title"
      label="新闻标题"
      width="180">
    </el-table-column>
    <el-table-column
      prop="news_date"
      label="新闻日期"
      width="180">
    </el-table-column>
    <el-table-column
      prop="news_content"
      label="新闻内容"
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
      prop="news_tag"
      label="新闻标签"
      width="150">
    </el-table-column>
     <el-table-column
      prop="news_isPass"
      label="审核状态"
      width="150">
    </el-table-column>
     <el-table-column
      prop="edit"
      label="操作"
      min-width="250">
      <template slot-scope="scope">
        <el-button
          type="primary" icon="el-icon-edit"  size="small"
          @click="examinePass(scope.row.pid, scope.row)">审核通过</el-button>
        <el-button
          type="danger" icon="el-icon-delete"  size="small"
          @click="examineFail(scope.row.pid, scope.row)">审核不通过</el-button>
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
    </div>
</template>
<script>

export default {
    data() {
      return {
        tableData: [],
        typeList:[],
        searchForm:{
            news_isPass:'',
            news_title:'',
            pageSize:10,
            startPage:0,
        },
        num:0,
        totalNum:0,
        newsForm:{
          news_title:'',
          news_date:'',
          news_content:'',
          news_tag:'',
          news_praise:'',
          news_comment:'',
          news_isPass:'',
          news_view:'',
          news_share:'',
        },
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