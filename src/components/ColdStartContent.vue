<template>
    <div class="diversion-wrap">
       <div class="table-head-wrap">
         <div class="demo-form-inline">
          <el-form :model="searchForm" :inline="true" label-position="left">
            <el-form-item label="新闻名称" label-width="70px" style="margin-right:15px">
                <el-input v-model="searchForm.news_title" placeholder="请输入新闻名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
              <el-button type="info" @click="onReset">重置</el-button>
            </el-form-item>
          </el-form>
         </div>
        <div class="table-head-button">
          <el-button type="danger" @click="addNews" icon="el-icon-plus">添加新闻</el-button>
        </div>
    </div>
      <Table :tableData="tableData" :totalNum="totalNum" @toEidtDialog="toEidtDialog"></Table>
      <NewsCard :dialogFormVisible="dialogFormVisible" @showNews="showNews" :newsName="newsName" :isUpload="isUpload" :isAdd="isAdd"
      :newsForm="newsForm"></NewsCard>
    </div>
</template>
<script>
import Table from './table';
import NewsCard from './news-card';

export default {
    components:{
      Table,
      NewsCard,
    },
    data(){
      return{
        newsName:'',
        isUpload:true,
        newsForm:{},
        isAdd:false,
        searchForm:{
          pageSize:10,
          startPage:0,
        },
        tableData:[],
        dialogFormVisible:false,
        totalNum:0,
        loading:true,
        isShowCard:false,
        defaultTable:{
          pageSize:10,
          startPage:0,
        },
      }
    },
    mounted(){
      this.showNews();
    },
    methods:{
      toEidtDialog(obj){
        this.dialogFormVisible = true;
        this.isAdd = false;
        this.newsForm = obj;
      },
      showNews(){
        this.get("/news/show",this.defaultTable).then((res)=>{
          this.tableData = res.tableData;
          this.totalNum = res.totalNum;
        }).catch(e=>{
          this.$error(`展示出错，${e}`);
        }).finally(e=>{
          this.loading = false;
        });
      },
      onSearch(){
        this.post('/news/search',this.searchForm).then(res=>{
          this.tableData = res.data.tableData;
          this.totalNum = res.data.totalNum;
          this.showNews();
        }).catch(e=>{
          this.$error('查询失败！');
        })
      },
      onReset(){
        this.searchForm = {
          new_title:'',
          pageSize:10,
          startPage:0,
        };
        this.showNews();
      },
      addNews(){
        this.dialogFormVisible = true;
        this.isAdd = true;
      },
    }
    
}
</script>
<style lang="less">
.diversion-wrap{
  .table-head-wrap{
        background-color: #F0F0F0;
        height: 70px;
        padding: 15px;
        box-sizing: border-box;
        width: 100%;
        border-bottom: 1px solid #e6e6e6;
        display: flex;
        justify-content: space-between;
        .el-button{
          margin:0 5px;
        }
        
    }
}
 
</style>