<template>
    <div class="awards-news-wrap">
    <h3>活动名称：{{activityData[0].activity_name}}</h3>
    <el-divider></el-divider>
    <el-table
    stripe
    v-loading="loading"
    :data="activityData"
    border class="awards-table-wrap"
    style="width: 100%">
    <el-table-column
      prop="aid"
      label="AID"
      width="100">
    </el-table-column>
    <el-table-column
      prop="activity_name"
      label="活动名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="startTime"
      label="活动生效时间"
      width="180">
    </el-table-column>
    <el-table-column
      prop="endTime"
      label="活动失效时间"
      width="220">
    </el-table-column>
     <el-table-column
      prop="awards"
      label="活动奖项设置"
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
    </el-table>
    <h3 class="h3-wrap">视频列表</h3><el-divider></el-divider>
    <el-table
    v-loading="loading"
    :data="tableData"
    stripe
    border class="awards-table-wrap"
    style="width: 100%">
    <el-table-column
      prop="nid"
      label="NID"
      width="100">
    </el-table-column>
    <el-table-column
      prop="news_title"
      label="新闻标题"
      width="180">
    </el-table-column>
    <el-table-column
      prop="uaid"
      label="用户ID"
      width="180">
    </el-table-column>
    <el-table-column
      prop="news_view"
      label="新闻点击量"
      width="220">
    </el-table-column>
     <el-table-column
      prop="news_praise"
      label="新闻点赞量"
      width="150">
    </el-table-column>
     <el-table-column
      prop="news_comment"
      label="新闻评论量"
      width="150">
    </el-table-column>
     <el-table-column
      prop="news_date"
      label="新闻发布时间"
      width="150">
    </el-table-column>
     <el-table-column
      prop="news_award"
      label="新闻奖项"
      width="150">
      <template slot-scope="scope">
        <span v-if="scope.row.news_award">{{scope.row.news_award}}</span>
        <el-tag v-else type="danger">待评奖</el-tag>
      </template>
    </el-table-column>
     <el-table-column
      prop="news_activitylog"
      label="奖项备注"
      width="150">
    </el-table-column>
     <el-table-column
      prop="edit"
      label="操作"
      min-width="250">
      <template slot-scope="scope">
        <el-popover
          placement="top-start"
          width="250"
          trigger="click">
         <el-select v-model="chooseAwards" placeholder="请选择">
            <el-option
              v-for="(item,index) in awards"
              :key="index"
              :label="item.name+'(剩余：'+(item.count-awardsCountArry[index])+')'"
              :value="item.name"
              :disabled="item.count===awardsCountArry[index]">
            </el-option>
         </el-select>
         <el-button type="primary"  size="small" @click="setAwards(scope.row)" style="margin-top:10px">确定</el-button>
          <el-button
          type="primary" icon="el-icon-edit"  size="small"
          slot="reference">评奖</el-button>
        </el-popover>
        <el-popover
          placement="top-start"
          width="250"
          trigger="click">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
            v-model="newsActivityLog">
          </el-input>
         <el-button type="primary"  size="small" @click="setRemarks(scope.row)"  style="margin-top:10px">确定</el-button>
         <el-button
          type="primary" icon="el-icon-edit"  size="small"
          slot="reference">备注</el-button>
        </el-popover>
       
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
      activityData:{
        type:Array,
        default:[],
      },
      activityName:{
        type:String,
        default:'',
      },
      drawerShow:{
        type:Boolean,
      }
    },
    data() {
      return {
        tableData: [],
        chooseAwards:'',
        num:0,
        awards:[],
        awardsArry:[],
        awardsCountArry:[],
        totalNum:0,
        activityForm:{
          activity_name:'',
          activity_rules:'',
          startTime:'',
          endTime:'',
          activity_state:'',
          awards:'',
        },
        anid:0,
        currentPage:1,
        isSearch:false,
        pageShow:true,
        newsActivityLog:'',
        loading:true,
        defaultTable:{
          pageSize:10,
          startPage:0,
        },
      }
    },
    watch:{
       drawerShow:{
          immediate:true,
          handler:function(newVal){
            console.log("321687")
            if(newVal==true){
              this.showPro();
            }
          }
       },
    },
    mounted(){
      this.awards = JSON.parse(this.activityData[0].awards);
      this.awardsArry = this.awards.map(obj => {return obj.name});
      this.awardsArry.forEach(e=>{
        this.awardsCountArry.push(0);
      })
    },
    methods:{
      setAwards(el){
        el.news_award = this.chooseAwards;
        this.post(`news/${el.nid}/change_info`,el).then(res=>{
          this.showPro();
          this.chooseAwards = '';
        }).catch(e=>{
          this.$error('评奖失败！');
        })
      },
      setRemarks(el){
        el.news_activitylog = this.newsActivityLog;
        this.post(`news/${el.nid}/change_info`,el).then(res=>{
          this.showPro();
        }).catch(e=>{
          this.$error('备注失败！');
        })
      },
        showPro(){
          this.anid = this.activityData[0].aid;
            this.get(`/news/${this.anid}/showNewsActivity`,this.defaultTable).then((res)=>{
                this.tableData = res;
                res.forEach(e=>{
                  if(e.news_award){
                    // 评奖数组中包含该奖项的下标
                      const index = this.awardsArry.indexOf(e.news_award);
                      // 对应的奖项评奖量+1
                      this.awardsCountArry[index]+=1;
                  }
                })
                this.totalNum = res.length;
            }).catch(e=>{
              this.$error(`展示出错，${e}`);
            }).finally(e=>{
              this.loading = false;
            });
        },
          changeCurrent(num,type){
              num = type ? num+1 : num-1;
              this.currentPage = Math.floor(num/(this.defaultTable.pageSize+1))+1;
          }
    }
}
</script>
<style lang="less">
 .el-drawer{
    width: 50% !important;
    padding:  0 20px;
     .h3-wrap{
      margin-top: 30px;
    }
  }
.product-wrap{
    width:100%;
   
    .table-head-wrap{
        background-color: #F0F0F0;
        height: 70px;
        padding: 15px;
        box-sizing: border-box;
        width: 100%;
        border-bottom: 1px solid #e6e6e6;
        display: flex;
    }
    .product-table-wrap{
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