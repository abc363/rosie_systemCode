<template>
  <div class="table-class">
    <el-table
    stripe
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
      prop="news_title"
      label="新闻标题"
      width="250">
    </el-table-column>
    <el-table-column
      prop="news_date"
      label="新闻日期"
      width="150">
    </el-table-column>
    <el-table-column
      prop="news_tag"
      label="新闻标签"
      width="140">
    </el-table-column>
    <el-table-column
      prop="news_intro"
      label="新闻介绍"
      width="140">
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
      width="140">
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
      label="新闻状态"
      width="160">
      <template slot-scope="scope">
        <el-tag type="success" v-if="scope.row.news_isPass == 1">已通过</el-tag>
        <el-tag v-else-if="scope.row.news_isPass == 0">未审核</el-tag>
        <el-tag type="danger" v-else>未通过</el-tag>
      </template>
    </el-table-column>
     <el-table-column
      prop="edit"
      label="操作"
      min-width="250">
      <template slot-scope="scope">
        <el-button
          type="primary" icon="el-icon-edit"  size="small"
          @click="handleEdit(scope.row)" :disabled="scope.row.news_isPass!==0">修改信息</el-button>
        <el-button
          type="danger" icon="el-icon-delete"  size="small"
          @click="handleDelete(scope.row)">删除</el-button>
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
  props:{
    tableData:{
      type:Array,
      default:[],
    },
    totalNum:{
      type:Number,
      default:0,
    }
  },
  data(){
    return{
        pageShow:true,
        loading:false,
        currentPage:1,
        defaultTable:{
          pageSize:10,
          startPage:0,
        },
    }
  },
  watch:{
      currentPage(newVal){
        this.defaultTable.startPage = this.defaultTable.pageSize*(newVal-1);
        this.$emit('showPro',this.defaultTable);
      }
    },
  methods:{
    handleEdit(obj){
      this.$emit('toEidtDialog',obj);
    },
    handleDelete(obj){
      this.$alert(`是否要删除这个新闻${obj.nid}`, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.get(`/news/${obj.nid}/delete`).then((res)=>{
            this.$emit('showPro',this.defaultTable);
              this.$success('删除成功！');
            }).catch(e=>{
              this.$error(`删除出错，${e}`);
            });
          }
        });
    },
  }
}
</script>
<style lang="less">
.table-class{
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
      display: flex;
      justify-content: flex-end;
      margin:10px 0;
    }
}
</style>




