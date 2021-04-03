<template>
  <div class="table-class">
    <el-table
    stripe
    v-loading="loading"
    :data="data"
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
      prop="createdTime"
      label="新建日期"
      width="220">
    </el-table-column>
     <el-table-column
      prop="edit"
      label="操作"
      min-width="250">
      <template slot-scope="scope">
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
      default(){
        return [];
      }
    },
    totalNum:{
      type:Number,
      default:0,
    }
  },
  watch:{
    tableData(newVal){
      this.data = newVal;
    }
  },
  data(){
    return{
        data:[],
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
    handleDelete(obj){
      this.$alert(`是否要删除这个账号${obj.uaid}`, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.get(`/userApplication/${obj.uaid}/deleteUser`).then((res)=>{
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




