<template>
    <div class="publish-account-wrap">
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
    </div>
     <div class="table-class">
    <el-table
    stripe
    v-loading="loading"
    :data="tableData"
    border class="news-table-wrap"
    style="width: 100%">
    <el-table-column
      prop="uaid"
      label="UAID"
      width="100">
    </el-table-column>
    <el-table-column
      prop="username"
      label="账号名称"
      width="180">
    </el-table-column>
     <el-table-column
      prop="user_avatar"
      label="账号头像"
      width="220">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <div style="max-width:300px;">
            <img :src="scope.row.user_avatar" style="width:220px;height:140px"/></div>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">查看</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
     <el-table-column
      prop="news_isPublish"
      label="新闻发布权限"
      width="220">
       <template slot-scope="scope">
         <span>{{scope.row.news_isPublish === 0 ? '否':'是'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="news_isNow"
      label="新闻直播权限"
      width="220">
       <template slot-scope="scope">
         <span>{{scope.row.news_isNow === 0 ? '否':'是'}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="createdTime"
      label="创建时间"
      width="250">
    </el-table-column>
     <el-table-column
      prop="edit"
      label="操作"
      min-width="250">
      <template slot-scope="scope">
        <el-button
          type="primary" icon="el-icon-edit"  size="small"
          @click="handleEdit(scope.row)">编辑</el-button>
      </template>
    </el-table-column>
        </el-table>
  </div>
  <el-dialog :visible.sync="dialogVisible" title="修改信息">
    <el-form  label-width="80px" :model="editForm">
  <el-form-item label="用户UAID">
    <el-input v-model="editForm.uaid" disabled></el-input>
  </el-form-item>
  <el-form-item label="发布权限">
     <el-select v-model="editForm.news_isPublish" placeholder="请选择">
    <el-option
      label="是"
    :value="1">
    </el-option>
     <el-option
      label="否"
      :value="0">
    </el-option>
  </el-select>
  </el-form-item>
  <el-form-item label="直播权限">
     <el-select v-model="editForm.news_isNow" placeholder="请选择">
    <el-option
      label="是"
      :value="1">
    </el-option>
     <el-option
      label="否"
      :value="0">
    </el-option>
  </el-select>
  </el-form-item>
    </el-form>
      <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSure(isAdd,num)">确 定</el-button>
        </div>
  </el-dialog>
    </div>
</template>
<script>
import CountTable from './count-table';

export default {
    components:{
      CountTable,
    },
    data(){
      return{
        editForm:{},
        dialogVisible:false,
        newsName:'',
        isUpload:true,
        searchForm:{
          username:'',
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
      this.showUser();
    },
    methods:{
      showUser(){
        this.get("/userApplication/showUser",this.defaultTable).then((res)=>{
          this.tableData = res;
          this.totalNum = res.totalNum;
        }).catch(e=>{
          this.$error(`展示出错，${e}`);
        }).finally(e=>{
          this.loading = false;
        });
      },
      onSearch(){
        this.post('/userApplication/search',this.searchForm).then(res=>{
          this.tableData = res.data.tableData;
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
    handleEdit(obj){
      this.dialogVisible = true;
      this.editForm = obj;
    },
    onSure(){
this.post('/userApplication/changeUser',this.editForm).then(res=>{
          this.tableData = res;
          this.totalNum = this.totalNum;
          this.dialogVisible = false;
          this.showUser();
        }).catch(e=>{
          this.$error('更新失败！');
        })
    },
    }
    
}
</script>
<style lang="less">
.publish-account-wrap{
  .el-select{
    width: 100%;
  }
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