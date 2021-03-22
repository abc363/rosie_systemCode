<template>
    <div class="product-dialog-wrap">
        <el-dialog :title="titleName" :visible.sync="isVisible">
        <el-form :model="form" label-position="left">
            <el-row>
                <el-col :span="23">
                    <el-form-item label="标题" label-width="40px">
                        <el-input v-model="form.new_title" autocomplete="off" placeholder="请输入新闻名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="标签" label-width="40px">
                        <el-input v-model="form.news_tag" autocomplete="off" placeholder="请输入新闻标签"></el-input>
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
                    <el-form-item label="内容" label-width="40px">
                       <UploadFile class="news-upload" :isNewContentUpload="true" 
                       @insertQuillImage="insertQuillImage" :limit="100"></UploadFile>
                         <quill-editor
                            v-model="form.new_content"
                            :options="editorOption" 
                            ref="myQuillEditor" style="height:650px" >
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
import Vue from 'vue';
import UploadFile from './uploadFile';
import VueQuillEditor from 'vue-quill-editor';
Vue.use(VueQuillEditor);
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
const toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
    
      [{'header': 1}, {'header': 2}],               // custom button values
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
      [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
      [{'direction': 'rtl'}],                         // text direction
    
      [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
      [{'header': [1, 2, 3, 4, 5, 6, false]}],
    
      [{'color': []}, {'background': []}],          // dropdown with defaults from theme
      [{'font': []}],
      [{'align': []}],
      ['link', 'image', 'video'],
      ['clean']                                         // remove formatting button
    ]
export default {
    components: {
      UploadFile,
    },
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
            editorOption: {
                placeholder: '请输入新闻内容.....',
                modules: {
                toolbar: {
                    container: toolbarOptions,  // 工具栏
                    handlers: {
                      // 监听图片上传功能
                        'image': function (value) {
                            if (value) {
                                document.querySelector('.news-upload .el-upload__input').click()
                            } else {
                                this.quill.format('image', false);
                            }
                        }
                    }
                }
            }
            },
        }
    },
    computed:{
        titleName(){
            return this.newsName === ''? '添加新闻':`${this.newsName}新闻修改信息`;
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
           this.loading = this.$loading({
                lock: true,
                text: '拼命加载中...',//可以自定义文字
                spinner:'el-icon-loading',//自定义加载图标类名
                background: 'rgba(0, 0, 0, 0.7)'//遮罩层背景色
            });
            const url = bol ? `/news/add` : `/news/${nid}/change_info`;
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
                this.$emit('showNews');
                this.loading.close();
            })
        },
        handleUrl(url,name,fileName){
            this.form[name] = url;
        },
        insertQuillImage(path){
              console.log(this.$refs);
              console.log(this.$refs.myQuillEditor);
              let quill = this.$refs.myQuillEditor.quill
              // // 如果上传成功
                // 获取光标所在位置
                let length = quill.getSelection().index
                // 插入图片  dt.url为服务器返回的图片地址
                quill.insertEmbed(length, 'image', path)
                // 调整光标到最后
                quill.setSelection(length + 1)
              // loading加载隐藏
              // this.quillUpdateImg = false
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
    //  .news-upload .upload-wrap .el-upload-list{
    //   display: none;
    // }
}
</style>