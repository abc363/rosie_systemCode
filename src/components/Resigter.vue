<template>
<div class="resigter-wrap">
  <el-header class="login-header">
        <div style="width:240px">
          <img src="../img/logo.jpg"/><div class="title-wrap">微风科技</div><div class="url-wrap">- windiiot.com -</div>
        </div>
      </el-header>
  <div class="resigter-container">
      <div class="resigter-img">
        <img src="../img/resigter.png" class="resImg" />
      </div>
      <div class="resigter-content">
        <h3 style="margin-bottom:20px">用户注册</h3>
        <el-form ref="resigterFormRef" class="resigter-form" :model="resigterForm" 
        :rules="resigterFormRules" label-position="left" label-width="80px">
            <el-form-item prop="username" label="用户名">
                <el-input placeholder="请输入用户名" v-model="resigterForm.username"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码">
                <el-input placeholder="请输入密码" v-model="resigterForm.password" type="password"></el-input>
            </el-form-item>
             <el-form-item prop="confirmPassword" label="确认密码">
                <el-input placeholder="请确认密码" v-model="resigterForm.confirmPassword" type="password"></el-input>
            </el-form-item>
            <el-form-item class="btns">
                <el-button type="primary" @click="resigter">注册</el-button>
                <el-button type="info" @click="resetresigterForm">重置</el-button>
            </el-form-item>
            <p class="to-resigter">已有账号？立即<span @click="toLogin">登录</span></p>
      </el-form>
      </div>
  </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      // 这是登录表单绑定的对象
      resigterForm:{
        username:'',
        password:'',
        confirmPassword:'',
      },
        // confirmPassword:'',
      resigterFormRules:{
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
        password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        confirmPassword:[
            { required: true, message: '请确认密码', trigger: 'blur' },
        ]
      }
    }
  },
  methods:{
    resetresigterForm(){
      // 拿到表单的实例对象用resetFields方法进行清除
      this.$refs.resigterFormRef.resetFields()
    },
    // 注册按钮预验证
    resigter(){
      this.$refs.resigterFormRef.validate(async valid => {
        if(!valid)return;
        const sha256 = require("js-sha256").sha256;
        if(this.resigterForm.confirmPassword !== this.resigterForm.password){
            return this.$error("两次输入密码不一致");
        }
        this.resigterForm.password = sha256(this.resigterForm.password);
        this.post('/users/reg',this.resigterForm).then(res=>{
          this.$success("注册成功！")
          this.$router.push("/login")
        }).catch(e=>{
          this.$error("注册失败！请重新尝试");
        })
        
      })
    },
    toLogin(){
      this.$router.push("/login");
    }
  }
}
</script>
<style lang="less">
.resigter-wrap{
   .login-header{
   height:80px !important;
   img{
     width: 100px;
     height: 60px;
     float: left;
   }
   .title-wrap{
     height:60px;
     line-height:85px;
     width:140px;
     float: left;
     font-weight: 600;
     font-size: 24px;
     color:#00416d;
   }
   .url-wrap{
     float: left;
     text-align: center;
     width: 100%;
     color:#00416d;
     font-weight: 600;
     font-size: 18px;
     letter-spacing: 2px;
   }
  
  }
  .resigter-container{
  width: 60%;
  height: 400px;
  position: absolute;
  left: 50%;
  top:50%;
  transform: translate(-50%,-50%);
  box-shadow: 1px 1px 20px #63686e;
  border-radius: 15px;
  border: 1px solid #eee;
  .resigter-img{
      float: left;
      width: 40%;
      height: 100%;
      .resImg{
          width: 100%;
          height: 100%;
      }
  }
  .resigter-content{
      padding: 30px;
      float: left;
      width: 60%;
      height: 100%;
      box-sizing: border-box;
    .to-resigter{
        float: right;
        span{
            cursor: pointer;
            color: #2980B9;
        }
    }

  }
}
}



</style>
