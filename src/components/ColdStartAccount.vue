<template>
    <div class="diversion-account-wrap">
       <div class="table-head-wrap">
         <div class="table-head-form">
          <el-form :model="searchForm" label-position="left" :inline="true">
            <el-form-item label="账号名称" label-width="70px" style="margin-right:15px">
              <el-input v-model="searchForm.username" placeholder="请输入账号名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
              <el-button type="info" @click="onReset">重置</el-button>
            </el-form-item>
          </el-form>
         </div>
        <div class="table-head-button">
          <el-button type="danger" @click="addNews" icon="el-icon-plus">添加冷启账号</el-button>
        </div>
    </div>
      <CountTable :tableData="tableData" :totalNum="totalNum"></CountTable>
      <CountCard :dialogFormVisible="dialogFormVisible" :newsName="newsName" :isUpload="isUpload" @showUser="showUser"></CountCard>
    </div>
</template>
<script>
import CountTable from './count-table';
import CountCard from './count-card';

export default {
    components:{
      CountTable,
      CountCard,
    },
    data(){
      return{
        newsName:'',
        isUpload:true,
        searchForm:{
          username:'',
          pageSize:10,
          startPage:0,
        },
        tableData:[],
        dialogFormVisible:false,
        totalNum:4,
        loading:true,
        isShowCard:false,
        defaultTable:{
          pageSize:10,
          startPage:0,
        },
      }
    },
    mounted(){
      this.showUser();
    },
    methods:{
      showUser(){
        this.get("/userApplication/showUser",this.defaultTable).then((res)=>{
          this.tableData = res;
        }).catch(e=>{
          this.$error(`展示出错，${e}`);
        }).finally(e=>{
          this.loading = false;
        });
      },
      onSearch(){
        this.post('/userApplication/search',this.searchForm).then(res=>{
          this.tableData = res;
          this.totalNum = this.totalNum;
        }).catch(e=>{
          this.$error('查询失败！');
        })
      },
      onReset(){
        this.searchForm={
          username:'',
          pageSize:10,
          startPage:0,
        }
        this.showUser();
      },
      addNews(){
        this.dialogFormVisible = true;
      },
    }
    
}
</script>
<style lang="less">
.diversion-account-wrap{
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
        .table-head-form{

        }
    }
}
 
</style>