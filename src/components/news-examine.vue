<template>
    <div class="news-examine-wrap">
    <div class="table-head-wrap">
        <el-form :model="searchForm" label-position="left" :inline="true">
          <el-form-item label="新闻名称" label-width="70px" style="margin-right:15px">
              <el-input v-model="searchForm.news_title" placeholder="请输入新闻名称"></el-input>
          </el-form-item>
          <el-form-item label="新闻标签" label-width="70px" style="margin-right:15px">
               <el-select v-model="searchForm.news_tag" placeholder="请选择新闻标签">
                <el-option :label="item" :value="item" v-for="(item,index) in typeList" :key="index"></el-option>
              </el-select>
            </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
            <el-button type="info" @click="onReset">重置</el-button>
          </el-form-item>
      </el-form>
    </div>
    <el-table
    stripe
    v-loading="loading"
    :data="tableData"
    border class="news-table-wrap"
    style="width: 100%">
    <el-table-column
      prop="nid"
      label="NID"
      width="80">
    </el-table-column>
    <el-table-column
      prop="news_title"
      label="新闻标题"
      width="220">
      <template slot-scope="scope">
        <span style="color:#409EFF;cursor:pointer" @click="showDrawer(scope.row)">{{scope.row.news_title}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="news_date"
      label="新闻日期"
      width="150">
      <template slot-scope="scope">
       <span>{{ scope.row.news_date }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="news_intro"
      label="新闻介绍"
      width="150">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <div style="max-width:300px;">
            <span>{{ scope.row.news_intro }}</span>
          </div>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">查看</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
     <el-table-column
      prop="news_image"
      label="新闻正图"
      width="150">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <div style="max-width:300px;">
            <img :src="scope.row.news_image" style="width:220px;height:140px"/></div>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">查看</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
     <el-table-column
      prop="news_tag"
      label="新闻标签"
      width="140">
    </el-table-column>
     <el-table-column
      label="新闻状态"
      width="150">
      <template slot-scope="scope">
       <span>{{ scope.row.news_isPass == 1?'已通过':(scope.row.news_isPass == 0?'未审核':'未通过')}}</span>
      </template>
    </el-table-column>
     <el-table-column
      prop="edit"
      label="操作"
      min-width="280">
      <template slot-scope="scope">
        <el-button
          type="primary"  size="small"
          @click="handleNews(1,scope.row)" :disabled="scope.row.news_isPass !== 0 ">审核通过</el-button>
        <el-button
          type="danger" size="small"
          @click="handleNews(0,scope.row)" :disabled="scope.row.news_isPass !== 0">审核拒绝</el-button>
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
      <el-dialog title="提示：审核拒绝" :visible.sync="isVisible">
        <el-input v-model="refuseForm.content" placeholder="请输入审核拒绝原因" type="textarea" class="dialog-input-wrap"></el-input>
        <el-button @click="postRefuse" type="primary">提交</el-button>
        <el-button @click="isVisible = false">取消</el-button>
      </el-dialog>
      <el-dialog
  title="查看新闻内容"
  :visible.sync="dialogVisible"
  width="40%"
  >
  <span v-html="htmlShow" class="html-wrap"></span>
  <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
import obj from '../main.js';

export default {
    data() {
      return {
        tableData: [],
        typeList:[],
        htmlShow:'',
        refuseForm:{
          content:'',
        },
        searchForm:{
            news_title:'',
            news_tag:'',
            pageSize:10,
            startPage:0,
        },
        isVisible:false,
        newsName:'',
        num:0,
        totalNum:0,
        newForm:{
         news_title: '',
         news_content: '',
         news_tag: '',
         news_image: '',
         news_intro: '',
         news_date: '',
        },
        isAdd:false,
        dialogVisible:false,
        isUpload:true,
        currentPage:1,
        isSearch:false,
        pageShow:true,
        loading:true,
        chooseObj:{},
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
        this.typeList = obj.tagList;
    },
    methods:{
        onReset(){
          this.searchForm = {
            news_title:'',
            news_tag:'',
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
        showDrawer(obj){
          this.dialogVisible=true;
          this.htmlShow = obj.news_content;
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
                // this.typeList = [];
                // this.tableData.forEach(item=>{
                //   !this.typeList.includes(item.news_tag) && this.typeList.push(item.news_tag);
                // })
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
          this.chooseObj.news_refuselog = this.refuseForm.content;
          this.chooseObj.news_isPass = -1;
          this.post(`/news/${this.chooseObj.nid}/change_info`,this.chooseObj).then(res=>{
            this.$success('审核拒绝成功');
            this.isVisible = false;
            this.showNews();
          }).catch(e=>{
            this.$error('审核失败，请重新尝试');
          })
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
        handleNews(num,obj){
          if(num === 0){
            this.isVisible = true;
            this.chooseObj = obj;
          }else{
            obj.news_isPass = 1;
            this.post(`/news/${obj.nid}/change_info`,obj).then(res=>{
              this.$success('审核通过成功');
              this.showNews();
            }).catch(e=>{
              this.$error('审核失败，请重新尝试');
            })
          }
        }
    }
}
</script>
<style lang="less">
.news-examine-wrap{
    width:100%;
    .html-wrap{
      img{
        width: 100%;
      }
    }
    .dialog-input-wrap{
        margin-bottom: 20px;
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