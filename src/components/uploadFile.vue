<template>
<div class="uploadFile-wrap">
    <el-upload
        class="upload-demo"
        ref="uploadAdd"
        :action="url"
        :limit="limit"
        :on-error="onError"
        :on-preview="onPreview"
        :on-progress="onProgress"
        :before-remove="beforeRemove"
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :on-exceed="onExceed"
        :list-type="isPicture"
        :on-remove="handleRemove"
        :file-list="fileList">
        <div class="upload-wrap"><i class="el-icon-folder-add" style="margin:0 5px"></i>点击上传</div>
    </el-upload>
   
</div>
</template>
<script>
export default {
    props:{
        fileName:{
            type:String,
            default:'',
        },
        imageUrl:{
            type:String,
            default:'',
        },
        isPicture:{
            type:String,
            default:'picture',
        },
        field:{
            type:String,
            default:'',
        },
        pid:{
            type:Number,
        },
        visiable:{
            type:Boolean,
            default:false,
        },
        isNewContentUpload:{
            type:Boolean,
            default:false,
        },
        limit:{
           type:Number,
           default:1,
        },
    },
    data(){
        return{
            fileList:[],
            uploadUrl:'',
            // baseUrl:"http://backend.windiiot.com/",
            baseUrl:"http://120.55.95.122:8080/",
            // url:"http://backend.windiiot.com/products/uploadFile",
            url:"http://120.55.95.122:8080/products/uploadFile",
            delForm:{
                filePath:'',
                pid:this.pid,
                fileName:this.field,
            },
            isLt2M:false,
            loading:'',
            signature:"http://windiiot.oss-cn-beijing.aliyuncs.com/",
        }
    },
    watch:{
        visiable:{
            immediate:true,
            handler:function(newVal){
                 this.fileList = [];
                if(this.imageUrl){
                    const str = this.imageUrl.substring(this.imageUrl.lastIndexOf("/")+1);
                    this.fileList.push({
                        name:str,
                        url:this.imageUrl
                    });
                    this.delForm.filePath = this.imageUrl.split(this.signature)[1];
                }
            }           
        }
    },
    methods:{
        onProgress(event, file, fileList){
            this.loading = this.$loading({
                lock: true,
                text: '拼命加载中...',//可以自定义文字
                spinner:'el-icon-loading',//自定义加载图标类名
                background: 'rgba(0, 0, 0, 0.7)'//遮罩层背景色
            });
        },
        handleSuccess(response, file, fileList){
            this.loading.close();
            const path = response.data.path;
            this.delForm.filePath = path.split(this.$domain)[1];
            this.uploadUrl = path;
            this.$emit('handleUrl',path,this.field,file.name);
            this.$success("上传成功!");
            if(this.isNewContentUpload){
              this.$emit('insertQuillImage',path);
            }
        },
        onExceed(){
            this.$error("抱歉，最多只能上传一个文件");
        },
        onError(){
            this.$error("上传失败");
        },
        beforeUpload(file,fileList){
            this.isLt2M = file.size / 1024 / 1024 > 200;
            if(this.isLt2M){
                this.$error("上传文件大小不能超过200MB！请点击确认删除！");
            }
            return !this.isLt2M;
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`请问您确定移除 ${ file.name }？`);
        },
        handleRemove(){
             this.post('/products/deleteFile',this.delForm).then(res=>{
                    this.$success('删除成功！');
                    this.$emit('handleUrl','',this.field,'');
                }).catch(e=>{
                    this.$error(`删除失败！${e}`);
                })
        },
        onPreview(){
            window.open(this.uploadUrl);
        }
    }
}
</script>
<style lang="less">
.uploadFile-wrap{
    .upload-demo{
        .el-upload{
            display: block !important;
        }
        .upload-wrap{
            height: 40px;
            line-height: 40px;
            border: 1px solid #DCDFE6;
            border-radius: 2px;
            // width: 200px;
        }
    }
    .file-wrap{
        border-bottom: 1px solid #DCDFE6;
        display: flex;
        justify-content: space-between;
    }
}


</style>