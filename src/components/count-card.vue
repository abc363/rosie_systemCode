<template>
    <div class="product-dialog-wrap">
        <el-dialog title="添加冷启账号" :visible.sync="isVisible">
        <el-form :model="form" label-position="left">
            <el-row>
                <el-col :span="23">
                    <el-form-item label="名称" label-width="70px">
                        <el-input v-model="form.username" autocomplete="off" placeholder="请输入账号名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="23">
                    <el-form-item label="头像" label-width="70px">
                        <UploadFile :imageUrl="form.user_avatar" @handleUrl="handleUrl"
                         field="user_avatar" :pid="num" :visiable="isVisible"></UploadFile>
                    </el-form-item>
                </el-col>
                <el-col :span="23">
                    <el-form-item label="密码" label-width="70px">
                        <el-input v-model="form.password" autocomplete="off" placeholder="请输入密码" show-password></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="23">
                    <el-form-item label="确认密码" label-width="70px">
                        <el-input v-model="confirmPasswrod" autocomplete="off" placeholder="请输入确认密码" show-password></el-input>
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
        num:{
            type:Number,
            default:0,
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
    },
    data(){
        return{
            formLabelWidth:'100',
            isVisible:false,
            form:{},
            confirmPasswrod:'',
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
        newsForm(newVal){
            this.form = newVal;
        }
    },
    mounted(){
        this.form = this.newsForm;
    },
    methods:{
        onSure(bol,nid){
          if(this.form.password === this.confirmPasswrod){
            const sha256 = require("js-sha256").sha256;
            this.form.password = sha256(this.form.password);
            const obj = this.getInput(this.form);
            if(!obj.value){
              this.$error(`${obj.tips}`);
            }else{
               this.post('/userApplication/reg',this.form).then(res => {
               this.$success(`添加冷启账号成功`);
               if(bol){
                   this.$emit('changeCurrent');
               }
            }).catch(res=>{
                this.$error(`添加失败！${res.$message}`);
            }).finally(e=>{
                this.isVisible = false;
                this.$emit('showUser');
            })
            }
          }else{
            this.$error('你两次输入的密码不一致，请重新尝试！');
          }
            
        },
        handleUrl(url,name,fileName){
            this.form[name] = url;
        },
        
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
    //  .news-upload .upload-wrap .el-upload-list{
    //   display: none;
    // }
}
</style>