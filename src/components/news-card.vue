<template>
    <div class="product-dialog-wrap">
        <el-dialog :title="titleName" :visible.sync="isVisible">
        <el-form :model="form" label-position="left">
            <el-row>
                <el-col :span="23">
                    <el-form-item label="名称" label-width="40px">
                        <el-input v-model="form.new_title" autocomplete="off" placeholder="请输入新闻名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="系列" label-width="40px">
                        <el-select v-model="form.new_type" placeholder="请选择系列">
                            <el-option label="公司新闻" value="1"></el-option>
                            <el-option label="行业状态" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="11" style="margin-left:30px">
                    <el-form-item label="时间" label-width="40px">
                        <div class="block">
                            <el-date-picker
                            v-model="form.new_date"
                            type="date"
                            placeholder="选择日期">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                </el-col>
                 <el-col :span="23">
                    <el-form-item label="介绍" label-width="40px">
                        <el-input v-model="form.new_intro" placeholder="请输入新闻介绍" type="textarea" 
                        size="medium" maxlength="180" show-word-limit></el-input>
                    </el-form-item>
                </el-col>
                  <el-col :span="23">
                    <el-form-item label="正图" label-width="40px">
                        <UploadFile :imageUrl="form.new_image" @handleUrl="handleUrl"
                         field="new_image" :pid="num" :visiable="isVisible"></UploadFile>
                    </el-form-item>
                </el-col>
                 <el-col :span="23">
                    <el-form-item label="新闻内容" label-width="40px">
                         <quill-editor
                            v-model="form.new_content"
                            :options="editorOption" 
                            ref="myQuillEditor" style="height:630px" >
                        </quill-editor>
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
import UploadFile from './uploadFile';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
export default {
    components: {
      UploadFile,
    },
    props:{
        dialogFormVisible:{
            type:Boolean,
            default:false,
        },
        proName:{
            type:String,
            default:'',
        },
        num:{
            type:Number,
            default:0,
        },
        proForm:{
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
            editorOption: {
                placeholder: '请输入新闻内容.....',
            },
        }
    },
    computed:{
        titleName(){
            return this.proName === ''? '添加新闻':`${this.proName}新闻修改信息`;
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
        proForm(newVal){
            this.form = newVal;
        }
    },
    mounted(){
        this.form = this.proForm;
    },
    methods:{
        onSure(bol,pid){
            const url = bol ? `/news/add` : `/news/${pid}/change_info`;
            const text = bol ? '添加' : '修改';
            this.post(url,this.form).then(res => {
               this.$success(`${text}成功`);
               if(bol){
                   this.$emit('changeCurrent');
               }
            }).catch(res=>{
                  return this.$error(`请求失败！${res.$message}`);
            }).finally(e=>{
                this.isVisible = false;
                this.$emit('showProduct');
            })
        },
        handleUrl(url,name,fileName){
            this.form[name] = url;
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
}
</style>