<template>
    <div class="product-dialog-wrap">
        <el-dialog :title="titleName" :visible.sync="isVisible">
        <el-form :model="form" label-position="left">
            <el-row>
                <el-col :span="11">
                    <el-form-item label="名称" label-width="40px">
                        <el-input v-model="form.pro_Name" autocomplete="off" placeholder="请输入名称"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11" style="margin-left:20px">
                    <el-form-item label="系列" label-width="40px">
                        <el-input v-model="form.pro_Type" autocomplete="off" placeholder="请输入系列"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11">
                    <el-form-item label="库存" label-width="40px">
                        <el-input v-model="form.pro_Num" autocomplete="off" placeholder="请输入库存"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="11" style="margin-left:20px">
                    <el-form-item label="状态" label-width="40px">
                        <el-select v-model="form.pro_State" placeholder="请选择状态">
                            <el-option label="售卖中" value="1"></el-option>
                            <el-option label="未上线" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="23">
                    <el-form-item label="描述" label-width="40px">
                        <el-input v-model="form.pro_info" placeholder="请输入产品描述" type="textarea" 
                        size="medium"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="23">
                    <el-form-item label="文件参考手册" label-width="110px">
                        <UploadFile :fileName="form.pro_fileName" @handleUrl="handleUrl" :imageUrl="form.pro_file"
                         isPicture="text" field="pro_file" :pid="num" :visiable="isVisible"></UploadFile>
                    </el-form-item>
                </el-col>
                 <el-col :span="23">
                    <el-form-item label="入门指南文件" label-width="110px">
                        <UploadFile :fileName="form.pro_fingerName" @handleUrl="handleUrl" :imageUrl="form.pro_finger"
                         isPicture="text" field="pro_finger" :pid="num" :visiable="isVisible"></UploadFile>
                    </el-form-item>
                </el-col>
                 <el-col :span="23">
                    <el-form-item label="上位机配置工具" label-width="110px">
                        <UploadFile :fileName="form.pro_driverName" @handleUrl="handleUrl" :imageUrl="form.pro_driver"
                          isPicture="text" field="pro_driver" :pid="num" :visiable="isVisible"></UploadFile>
                    </el-form-item>
                </el-col>
                 <el-col :span="23">
                    <el-form-item label="演示视频" label-width="110px">
                        <UploadFile :fileName="form.pro_videoName" @handleUrl="handleUrl" :imageUrl="form.pro_video"
                         isPicture="text" field="pro_video" :pid="num" :visiable="isVisible"></UploadFile>
                    </el-form-item>
                </el-col>
                 <el-col :span="23">
                    <el-form-item label="正斜1图" label-width="110px">
                        <UploadFile :imageUrl="form.pro_fontTiltOne" @handleUrl="handleUrl"
                         field="pro_fontTiltOne" :pid="num" :visiable="isVisible"></UploadFile>
                    </el-form-item>
                </el-col>
                 <el-col :span="23">
                    <el-form-item label="正斜2图" label-width="110px">
                        <UploadFile :imageUrl="form.pro_fontTiltTwo" @handleUrl="handleUrl"
                         field="pro_fontTiltTwo" :pid="num" :visiable="isVisible"></UploadFile>
                    </el-form-item>
                </el-col>
                 <el-col :span="23">
                    <el-form-item label="背斜1图" label-width="110px">
                        <UploadFile :imageUrl="form.pro_backTiltOne" @handleUrl="handleUrl"
                         field="pro_backTiltOne" :pid="num" :visiable="isVisible"></UploadFile>
                    </el-form-item>
                </el-col>
                <el-col :span="23">
                    <el-form-item label="背斜2图" label-width="110px">
                        <UploadFile :imageUrl="form.pro_backTiltTwo" @handleUrl="handleUrl"
                         field="pro_backTiltTwo" :pid="num" :visiable="isVisible"></UploadFile>
                    </el-form-item>
                </el-col>
                <el-col :span="23">
                    <el-form-item label="正面图" label-width="110px">
                        <UploadFile :imageUrl="form.pro_font" @handleUrl="handleUrl"
                         field="pro_font" :pid="num" :visiable="isVisible"></UploadFile>
                    </el-form-item>
                </el-col>
                <el-col :span="23">
                    <el-form-item label="背面图" label-width="110px">
                        <UploadFile :imageUrl="form.pro_back" @handleUrl="handleUrl"
                         field="pro_back" :pid="num" :visiable="isVisible"></UploadFile>
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
        }
    },
    computed:{
        titleName(){
            return this.proName === ''? '添加产品':`${this.proName}产品修改信息`;
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
            const url = bol ? `/products/add` : `/products/${pid}/change_info`;
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