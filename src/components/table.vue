<template>
  <div class="table-class">
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
  methods:{
    handleEdit(nid,row){
    },
    handleDelete(id,row){
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




