<template>
    <div class="diversion-wrap">
       <div class="table-head-wrap">
         <div class="demo-form-inline">
          <el-form :model="searchForm" :inline="true" label-position="left">
            <el-form-item label="新闻名称" label-width="70px" style="margin-right:15px">
                <el-input v-model="searchForm.news_title" placeholder="请输入新闻名称"></el-input>
            </el-form-item>
             <el-form-item label="新闻标签" label-width="70px" style="margin-right:15px">
               <el-select v-model="searchForm.news_tag" placeholder="请选择新闻标签">
                <el-option :label="item" :value="item" v-for="(item,index) in tagList" :key="index"></el-option>
              </el-select>
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
      <Table :tableData="tableData" :totalNum="totalNum" 
      @toEidtDialog="toEidtDialog" @showPro="showPro"></Table>
      <NewsCard :dialogFormVisible="dialogFormVisible" @showNews="showNews" :newsName="newsName" :isUpload="isUpload" :isAdd="isAdd"
      :newsForm="newsForm" :isCold="isCold"></NewsCard>
    </div>
</template>
<script>
import Table from './table';
import NewsCard from './news-card';
import obj from '../main.js';

export default {
    components:{
      Table,
      NewsCard,
    },
    data(){
      return{
        newsName:'',
        isUpload:true,
        isCold:true,
        newsForm:{},
        isAdd:false,
        tagList:[],
        searchForm:{
          news_title:'',
          news_tag:'',
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
      this.tagList = obj.tagList;
    },
    methods:{
      toEidtDialog(obj){
        this.dialogFormVisible = true;
        this.isAdd = false;
        this.newsForm = obj;
      },
      showPro(data){
        this.defaultTable = data;
        this.showNews();
      },
      showNews(){
        this.get("/news/showByCold",this.defaultTable).then((res)=>{
          this.tableData = res.tableData;
          // this.tagList = [];
          // // 是冷启才展示
          // res.tableData.forEach(e=>{
          //   if(this.tagList.indexOf(e.news_tag)===-1){
          //     this.tagList.push(e.news_tag);
          //   }
          // })
          this.totalNum = res.totalNum;
        }).catch(e=>{
          this.$error(`展示出错，${e}`);
        }).finally(e=>{
          this.loading = false;
        });
      },
      onSearch(){
        this.post('/news/search',this.searchForm).then(res=>{
          res.tableData.forEach(e=>{
            if(e.news_isCold==1){
              this.tableData.push(e);
            }
          })
          this.totalNum = this.tableData.length;
        })
      },
      onReset(){
        this.searchForm = {
          news_title:'',
          news_tag:'',
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