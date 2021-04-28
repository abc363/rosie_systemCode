<template>
    <div class="product-dialog-wrap">
        <el-dialog :title="titleName" :visible.sync="isVisible">
        <el-form :model="form" label-position="left">
            <el-row>
                <el-col :span="23">
                    <el-form-item label="活动名称" label-width="70px">
                        <el-input v-model="form.activity_name" placeholder="请输入活动名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="23">
                    <el-form-item label="奖项设置" label-width="70px">
                        <el-form>
                          <el-row v-for="(item,index) in awards" :key="item.name" style="margin-bottom:10px">
                            <el-col :span="6" style="margin-right:8px">
                              <el-form-item>
                                <el-input v-model="item.name" placeholder="奖项名称"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="6" style="margin-right:8px">
                              <el-form-item>
                                <el-input v-model="item.count" placeholder="奖项个数"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="6" style="margin-right:8px">
                              <el-form-item>
                                <el-input v-model="item.money" placeholder="奖项金额"></el-input>
                              </el-form-item>
                            </el-col>
                            <el-col :span="3">
                              <el-form-item>
                                <el-button type="danger" @click="deleteActivity(index)">删除</el-button>
                              </el-form-item>
                            </el-col>
                          </el-row>
                        </el-form>
                        <el-button type="primary" icon="el-icon-plus" class="add-activity-btn" @click="addActivity">添加奖项</el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="23">
                    <el-form-item label="起止时间" label-width="70px">
                         <el-date-picker
                          v-model="activityTime"
                          type="daterange"
                          :picker-options="pickerOptions"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                  <el-col :span="23">
                    <el-form-item label="活动规则" label-width="70px">
                        <UploadFile :imageUrl="form.activity_rules" @handleUrl="handleUrl"
                         field="activity_rules" :pid="num" :visiable="isVisible"></UploadFile>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="isVisible = false">取 消</el-button>
            <el-button type="primary" @click="onSure(isAdd,num)">确 定</el-button>
        </div>
        </el-dialog>
    </div>
</template>
<script>
import Vue from 'vue';
import UploadFile from './uploadFile';
import {mixins} from '../mixins.js';

export default {
    components: {
      UploadFile,
    },
    mixins:[mixins],
    props:{
        dialogFormVisible:{
            type:Boolean,
            default:false,
        },
        newsName:{
            type:String,
            default:'',
        },
        newsForm:{
            type:Object,
            default(){
                return {};
            }
        },
        isAdd:{
            type:Boolean,
            default:false,
        },
        activityTime:{
          type:Array,
          default:[],
        }
    },
    data(){
        return{
            formLabelWidth:'100',
            isVisible:false,
            form:{},
            pickerOptions: { 
              disabledDate(time) {
                  return time.getTime() < Date.now();//如果没有后面的-8.64e7就是不可以选择今天的 
              },
            },
            num:0,
            awards:[
              {
                name:'',
                count:'',
                money:'',
              }
            ]
        }
    },
    computed:{
        titleName(){
            return this.newsName === ''? '添加活动':`${this.newsName}新闻修改活动`;
        }
    },
    watch:{
        dialogFormVisible(newVal){
            this.isVisible = newVal;
        },
        isVisible(newVal){
            newVal === false && (this.form = {});
            this.$emit('changeVisiable',newVal);
        },
        newsForm:{
          immediate:true,
          handler:function(newVal){
             this.form = newVal;
             console.log(this.form)
            this.num = newVal.aid;
            this.awards = newVal.awards;
          }
        },
        // newsForm(newVal){
        //     this.form = newVal;
        //     this.num = newVal.aid;
        //     this.awards = newVal.awards;
        // }
    },
    // mounted(){
    //     this.form = this .newsForm;
    // },
    methods:{
        onSure(bol,nid){
          const url = bol ? `/activity/add` : `/activity/${nid}/change_info`;
            const text = bol ? '添加' : '修改';
            this.form.awards = JSON.stringify(this.awards);
            this.form.startTime = this.activityTime[0];
            this.form.endTime = this.activityTime[1];
            const obj = this.getInput(this.form);
           if(!obj.value){
              this.$error(`${obj.tips}`);
            }else{
           this.loading = this.$loading({
                lock: true,
                text: '拼命加载中...',//可以自定义文字
                spinner:'el-icon-loading',//自定义加载图标类名
                background: 'rgba(0, 0, 0, 0.7)'//遮罩层背景色
            });
              this.post(url,this.form).then(res => {
                this.$success(`${text}成功`);
                if(bol){
                    this.$emit('changeCurrent');
                }
              }).finally(e=>{
                  this.isVisible = false;
              })
            }
            this.loading.close();
        },
        handleUrl(url,name){
            this.form[name] = url;
        },
        addActivity(){
          this.awards.push({
            name:'',
            count:'',
            money:''
          })
        },
        deleteActivity(index){
          this.awards.splice(index,1);
        }
    }
}
</script>
<style lang="less">
.product-dialog-wrap{
    .el-select{
        width: 100%;
    }
    .el-textarea__inner{
        height: 100px;
    }
    .quill-editor{
      display: inline-block;
    }
    .el-date-editor{
      width: 100%;
    }
    .ivu-upload {
      display: none;
    }
    .news-upload{
      display: none;
    }
    .add-activity-btn{
      width: 100%;
    }
    //  .news-upload .upload-wrap .el-upload-list{
    //   display: none;
    // }
}
</style>