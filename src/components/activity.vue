<template>
    <div class="awards-wrap">
    <div class="table-head-wrap">
      <div class="table-head-form">
        <el-form :model="searchForm" label-position="left" :inline="true">
          <el-form-item label="活动名称" label-width="70px">
              <el-input v-model="searchForm.activity_name" placeholder="请输入活动名称"></el-input>
          </el-form-item>
          <el-form-item label="活动状态" label-width="70px" style="margin:0 12px">
              <el-select v-model="searchForm.activity_state" placeholder="请选择活动状态">
                <el-option label="未上架" value="0">未上架</el-option>
                <el-option label="已上架" value="1">已上架</el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSearch">查询</el-button>
            <el-button type="info" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-button-wrap">
        <el-button type="danger" @click="addActivity" icon="el-icon-plus">添加活动</el-button>
      </div>
    </div>
        <el-table
        stripe
    v-loading="loading"
    :data="tableData"
    border class="awards-table-wrap"
    style="width: 100%">
    <el-table-column
      prop="aid"
      label="AID"
      width="100">
    </el-table-column>
    <el-table-column
      prop="activity_name"
      label="活动名称">
      <template slot-scope="scope">
        <span class="activity-click" @click="activityToName(scope.row)">{{ scope.row.activity_name }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="awards"
      label="奖项设置"
      width="150">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
         <el-table
          :data="JSON.parse(scope.row.awards)"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="奖项"
            width="80">
          </el-table-column>
          <el-table-column
            prop="count"
            label="数量"
            width="80">
          </el-table-column>
          <el-table-column
            prop="money"
            label="金额"
            width="80">
          </el-table-column>
        </el-table>
        <div slot="reference" class="name-wrapper">
            <el-tag size="medium">查看</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
    <el-table-column
      prop="startTime"
      label="活动开始时间"
      width="150">
    </el-table-column>
     <el-table-column
      prop="endTime"
      label="活动结束时间"
      width="150">
    </el-table-column>
     <el-table-column
      prop="activity_rules"
      label="活动规则"
      width="150">
      <template slot-scope="scope">
        <el-popover trigger="hover" placement="top">
          <div style="max-width:300px;">
            <img :src="scope.row.activity_rules" style="width:220px;height:140px"/></div>
          <div slot="reference" class="name-wrapper">
            <el-tag size="medium">查看</el-tag>
          </div>
        </el-popover>
      </template>
    </el-table-column>
     <el-table-column
      prop="activity_state"
      label="活动状态"
      width="150">
      <template slot-scope="scope">
        <el-tag v-if="scope.row.activity_state" type="success">已上架</el-tag>
        <el-tag v-else type="danger">未上架</el-tag>
      </template>
    </el-table-column>
     <el-table-column
      prop="edit"
      label="操作"
      min-width="250">
      <template slot-scope="scope">
          <el-button v-if="!scope.row.activity_state"
            type="success" icon="el-icon-check"  size="small"
            @click="setActivityState(scope.row)">上架</el-button>
          <el-button v-if="!scope.row.activity_state"
            type="primary" icon="el-icon-edit"  size="small"
            @click="editActivity(scope.row)">修改</el-button>
        <el-button
          type="danger" icon="el-icon-delete"  size="small"
          @click="deleteActivity(scope.row)">删除</el-button>
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
        <ActivityCard :dialogFormVisible="dialogFormVisible" :isUpload="isUpload" :isAdd="isAdd"
        :newsForm="newsForm" @changeCurrent="changeCurrent" :activityTime="activityTime" @changeVisiable="changeVisiable"></ActivityCard>
        <el-drawer
          :visible.sync="drawerShow"
          direction="rtl">
          <ActivityDrawer :activityData="activityData" :drawerShow="drawerShow"></ActivityDrawer>
        </el-drawer>
    </div>
</template>
<script>
import ActivityCard from './activity-card';
import ActivityDrawer from './activity-drawer';

export default {
  components:{
      ActivityCard,
      ActivityDrawer,
  },
    data() {
      return {
        tableData: [],
        activityData:[],
        isUpload:true,
        newsForm:{},
        searchForm:{
            activity_state:'',
            activity_name:'',
            pageSize:10,
            startPage:0,
        },
        num:0,
        totalNum:0,
        drawerTitle:'',
        drawerShow:false,
        activityForm:{
          activity_name:'',
          activity_rules:'',
          startTime:'',
          endTime:'',
          activity_state:'',
          awards:'',
        },
        isAdd:false,
        currentPage:1,
        isSearch:false,
        pageShow:true,
        loading:true,
        dialogFormVisible:false,
        defaultTable:{
          pageSize:10,
          startPage:0,
        },
        activityTime:[],
      }
    },
    watch:{
      currentPage(newVal){
        if(this.isSearch){
          this.searchForm.startPage = this.searchForm.pageSize*(newVal-1);
          // this.onSearch();
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
      changeVisiable(newVal){
        this.dialogFormVisible = newVal;
      },
        setActivityState(obj){
          obj.activity_state = '1';
          this.post(`/activity/${obj.aid}/change_info`,obj).then(res=>{
            this.$success("上架成功！");
            this.showPro();
          }).catch(e=>{
            this.$error('上架失败！');
          })
        },
        editActivity(obj){
          // console.log(obj.awards);
          obj.awards = JSON.parse(obj.awards);
          // console.log(obj.awards);
          this.newsForm = {};
          this.$nextTick(()=>{
            this.newsForm = obj;
          })
          console.log(this.newsForm);
          this.activityTime.push(obj.startTime);
          this.activityTime.push(obj.endTime);
          this.dialogFormVisible = false;
          this.$nextTick(()=>{
           this.dialogFormVisible = true;

          })
        },
        deleteActivity(obj){
           this.$alert('你确定要删除该活动吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          callback: action => {
             this.post(`/activity/${obj.aid}/delete`).then(res=>{
            this.$success("删除活动成功！");
            this.showPro();
          }).catch(e=>{
            this.$error('删除活动失败！');
          })
          }
        });
        },
        onReset(){
          this.searchForm = {
            activity_state:'',
            activity_name:'',
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
          this.post('/activity/search',this.searchForm).then(res=>{
            this.tableData = res.data.tableData;
            this.totalNum = res.data.totalNum;
            this.isSearch = true;
          }).catch(e=>{
            this.$error('查询失败！');
          })
        },
        showPro(){
            this.get("/activity/show",this.defaultTable).then((res)=>{
                this.tableData = res.tableData;
                this.totalNum = res.totalNum;
            }).catch(e=>{
              this.$error(`展示出错，${e}`);
            }).finally(e=>{
              this.loading = false;
            });
        },
        activityToName(obj){
          this.activityData = [];
          this.activityData.push(obj);
          this.drawerShow = true;
        },
        changeCurrent(num,type){
            num = type ? num+1 : num-1;
            this.currentPage = Math.floor(num/(this.defaultTable.pageSize+1))+1;
            this.showPro();
        },
        addActivity(){
          this.isAdd = true;
          this.dialogFormVisible = true;
        }
    }
}
</script>
<style lang="less">
.awards-wrap{
    width:100%;
    .activity-click{
      cursor: pointer;
      color: #409EFF;
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
    .awards-table-wrap{
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