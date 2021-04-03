<template>
    <div class="personal-wrap">
        <div class="personal-left">
            <div class="avatar-wrap">
                <div class="avatar_box">
                    <img src="../img/avatar.jpg" alt=""/>
                </div>
            </div>
             <p>用户名：{{ updateForm.username }}</p>
             <el-button type="primary" @click="isVisible = true">修改密码</el-button>
        </div>
        <div class="personal-right">
            <p>用户管理：</p>
              <el-table
              stripe
                :data="tableData"
                border class="product-table-wrap"
                style="width: 100%;margin-top:10px">
                 <el-table-column
                prop="uid"
                label="UID"
                width="100">
                </el-table-column>
                <el-table-column
                prop="username"
                label="用户名"
                width="150">
                </el-table-column>
                <el-table-column
                prop="createdTime"
                label="注册日期"
                width="200">
                </el-table-column>
                  <el-table-column
                prop="modifiedTime"
                label="最新操作日期"
                width="200">
                </el-table-column>
                <el-table-column
                label="操作"
                min-width="150">
                <template slot-scope="scope">
                    <el-button
                    type="danger" icon="el-icon-delete"  size="small"
                    @click="handleDelete(scope.row.uid)">删除</el-button>
                </template>
                </el-table-column>
                    </el-table>
        </div>
        <el-dialog title="修改密码" :visible.sync="isVisible" width="500px">
             <el-form :model="updateForm" label-position="left">
                <el-form-item label="原来密码" label-width="80px">
                    <el-input v-model="updateForm.oldPassword" autocomplete="off" placeholder="请输入原来密码" type="password"></el-input>
                </el-form-item>
                <el-form-item label="新密码" label-width="80px">
                    <el-input v-model="updateForm.newPassword" autocomplete="off" placeholder="请输入新密码" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" label-width="80px">
                    <el-input v-model="updateForm.confirmPassword" autocomplete="off" placeholder="请输入确认密码" type="password"></el-input>
                </el-form-item>
             </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="isVisible = false">取 消</el-button>
                <el-button type="primary" @click="changePassword">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            tableData:[],
            isVisible:false,
            updateForm:{
                username: window.sessionStorage.getItem('username'),
            },
        }
    },
    mounted(){
       this.showUser();
    },
    methods:{
        showUser(){
            this.get('/users/showUser').then(res=>{
                this.tableData = res;
            })
        },
        handleDelete(uid){
            this.$confirm('请问您确定删除该用户吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.post(`/users/${uid}/deleteUser`).then(res=>{
                     this.$success('删除成功');
                     this.showUser();
                }).catch(e=>{
                    this.$error(`删除失败，${e}`);
                })
            });
        },
        changePassword(){
            if(this.updateForm.newPassword !== this.updateForm.confirmPassword){
                return this.$error('您输入的确认密码不一致');
            }
            const sha256 = require("js-sha256").sha256;
            this.updateForm.newPassword = sha256(this.updateForm.newPassword);
            this.updateForm.oldPassword = sha256(this.updateForm.oldPassword);
            this.post('/users/change_password',this.updateForm).then(res=>{
                this.$success('提交成功');
            }).catch(e=>{
                this.$error(`提交失败，${e}`);
            })
        }
    }
}
</script>
<style lang="less">
.personal-wrap{
    height: 450px;
    margin: 20px;
    .personal-left{
        height: 100%;
        width: 25%;
        float: left;
        line-height: 20px;
        text-align: center;
        button{
            width: 50%;
            margin-top: 20px;
        }
        .avatar-wrap{
            width: 100%;
            height: 40%;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            margin-bottom: 20px;
            .avatar_box{
            width: 100px;
            height: 100px;
            border-radius: 50%;
            border: 1px solid #eee;
            padding: 8px;
            box-shadow: 0 0 10px #ddd;
            background: white;
                img{
                height: 100%;
                width: 100%;
                border-radius: 50%;
                background-color: #eee;
                }
            }
        }
       
    }
    .personal-right{
        height: 100%;
        float: left;
        width: 75%;
        p{
            font-size: 20px;
        }
    }
}
</style>