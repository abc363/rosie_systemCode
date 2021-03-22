<template>
    <div class="news-examine-wrap">
    <div class="table-head-wrap">
        <el-form :model="searchForm" label-position="left">
          <el-row>
          <el-col :span="23">
            <el-form-item label="新闻名称" label-width="70px" style="margin-right:15px">
                <el-input v-model="searchForm.new_title" placeholder="请输入新闻名称"></el-input>
            </el-form-item>
          </el-col>
          </el-row>
      </el-form>
      <div>
        <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
        <el-button type="info" @click="onReset">重置</el-button>
      </div>
    </div>
    <el-table
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
      label="新闻标题"
      width="180">
    </el-table-column>
    <el-table-column
      prop="new_date"
      label="新闻日期"
      width="220">
      <template slot-scope="scope">
       <span>{{ scope.row.new_date.split('T')[0] }}</span>
      </template>
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
      prop="new_image"
      label="新闻正图"
      width="220">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <div style="max-width:300px;">
            <img :src="scope.row.new_image" style="width:220px;height:140px"/></div>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">查看</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
     <el-table-column
      prop="edit"
      label="操作"
      min-width="250">
      <template slot-scope="scope">
        <el-button
          type="primary" icon="el-icon-edit"  size="small"
          @click="handleNewsPass(scope.row.nid, scope.row)">审核通过</el-button>
        <el-button
          type="danger" icon="el-icon-delete"  size="small"
          @click="handleNewsRefuse(scope.row.nid, scope.row)">审核拒绝</el-button>
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
      <el-dialog title="审核拒绝" :visible.sync="isVisible">
        <el-form>
          <el-row>
            <el-col :span="23">
              <el-form-item>
                <el-input v-model="refuseForm.content" placeholder="请输入备注" type="textarea"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-button @click="postRefuse">提交</el-button>
      </el-dialog>
    </div>
</template>
<script>

export default {
    data() {
      return {
        tableData: [],
        typeList:[],
        refuseForm:{
          content:'',
        },
        searchForm:{
            new_title:'',
            new_type:'',
            pageSize:10,
            startPage:0,
        },
        isVisible:false,
        newsName:'',
        num:0,
        totalNum:0,
        newForm:{
         new_title: '',
         new_content: '',
         new_type: '',
         new_image: '',
         new_intro: '',
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
          this.showNews();
        }
        this.pageShow = false;
    　　this.$nextTick(() => {
    　　  this.pageShow = true;
    　　})
      }
    },
    mounted(){
        this.showNews();
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
            this.showNews();
          }else{
            this.currentPage = 1;
          }
        },
        onSearch(){
          this.post('news/search',this.searchForm).then(res=>{
            this.tableData = res.data.tableData;
            this.totalNum = res.data.totalNum;
            this.isSearch = true;
          }).catch(e=>{
            this.$error('查询失败！');
          })
        },
        showNews(){
            this.get("/news/show",this.defaultTable).then((res)=>{
                this.tableData = res.tableData;
                this.totalNum = res.totalNum;
                this.typeList = [];
                this.tableData.forEach(item=>{
                  !this.typeList.includes(item.new_type) && this.typeList.push(item.new_type);
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
        postRefuse(){

        },
        addNews(){
          this.newForm = {};
          this.isAdd = true;
          this.dialogFormVisible = true;
        },
        changeCurrent(num,type){
            num = type ? num+1 : num-1;
            this.currentPage = Math.floor(num/(this.defaultTable.pageSize+1))+1;
        },
        handleNewsRefuse(){
          this.isVisible = true;
        },
        handleNewsPass(){
          this.post(`/users/logout`).then(res=>{
            location.href="./index.html";
            this.$success('审核通过成功');
          }).catch(e=>{
            this.$error('审核失败，请重新尝试');
          })
        }
    }
}
</script>
<style lang="less">
.news-examine-wrap{
    width:100%;
    .table-head-wrap{
        background-color: #F0F0F0;
        height: 70px;
        padding: 15px;
        box-sizing: border-box;
        width: 100%;
        border-bottom: 1px solid #e6e6e6;
        display: flex;
        justify-content: space-between;
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
      justify-content: flex-end;
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