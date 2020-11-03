<template>
  <div class="login-container">
    <el-container>
      <el-header class="login-header">
        <div style="width:240px">
          <img src="../img/logo.jpg"/><div class="title-wrap">微风科技</div><div class="url-wrap">- modeth.com -</div>
        </div>
      </el-header>
      <el-main class="login-body">
        <div class="body-wrap"></div>
          <div class="body-front-wrap">
              <div class="font-wrap">
                <p class="animate" data-ani="bounceInLeft">微风科技后台管理系统 - modeth.com -</p><p class="animate" data-ani="bounceInRight">让科技，改变生活。</p>
              </div>
              <div class="login-wrap">
                <div class="login-body-wrap">
                  <div class="avatar_box">
                    <img src="../img/avatar.jpg" alt=""/>
                  </div>
                  <el-form ref="loginFormRef" class="login-form" :model="loginForm" :rules="loginFormRules">
                    <!-- 用户名 -->
                    <el-form-item prop="username">
                      <el-input placeholder="请输入用户名"
                prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item prop="password">
                      <el-input placeholder="请输入密码"
                prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
                    </el-form-item>
                    <!-- 按钮 -->
                    <el-form-item class="btns">
                      <el-button type="primary" @click="login">登录</el-button>
                      <el-button type="info" @click="resetLoginForm">重置</el-button>
                    </el-form-item>
                    <p>还没有账号？立即<span @click="toResigter">注册</span></p>
                  </el-form>
                </div>
              </div>
            </div>
      </el-main>
      <el-footer class="login-footer">Copyright 2019-2020 modeth.com 版权所有 佛山市微风科技有限公司</el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  data(){
    return{
      // 这是登录表单绑定的对象
      loginForm:{
        username:'',
        password:''
      },
      loginFormRules:{
        username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
        password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
        ]
      }
    }
  },
  methods:{
    resetLoginForm:function(){
      // 拿到表单的实例对象用resetFields方法进行清除
      this.$refs.loginFormRef.resetFields()
    },
    // 登录按钮预验证
    login(){
      this.$refs.loginFormRef.validate(async valid => {
        if(!valid)return;
        const sha256 = require("js-sha256").sha256;
        this.loginForm.password = sha256(this.loginForm.password);
        this.post('/users/login',this.loginForm).then(res=>{
          this.$success("登录成功！");
          // 将token存放在会话存储机制中（在当前网站打开期间生效）
          // window.sessionStorage.setItem("token",res.data.token);
          window.sessionStorage.setItem("username",res.data.username);
          // loading.close();
          this.$router.push("/index");
        }).catch(e=>{
          this.$error("登录失败！请重新尝试");
        })
      })
    },
    toResigter(){
      this.$router.push("/resigter");
    }
  }
}
</script>
<style lang="less">
.login-container{
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
  .login-body{
    width: 100%;
    background-size: 100% auto; 
    background-image: url("../img/background.jpg");
    background-repeat: no-repeat;
    margin-top: 10px;
    padding: 0 !important;
    .body-wrap{
      width: 100%;
      height: 35vw;
      background-color: #4c4c4c;
      opacity: 0.2;
    }
    .body-front-wrap{
        position: absolute;
        color: #f6f6f6;
        z-index: 1;
        top:90px;
        width: 100%;
        height: 35vw;
        .font-wrap{
          margin-left: 20%;
          float: left;
          width: 29%;
          height: 100%;
          text-align: center;
          padding-top: 12vw;
          p{
            margin-bottom: 20px;
            font-weight: 600;
            font-size: 2.5vw;
            letter-spacing: 4px;
          }
        }
        .login-wrap{
          width: 30%;
          height: 100%;
          margin-left: 20%;
          float: left;
          position: relative;
          .login-body-wrap{
            width: 100%;
            height: 50%;
            margin-top: 9.5vw;
             .avatar_box{
              width: 100px;
              height: 100px;
              border-radius: 50%;
              border: 1px solid #eee;
              padding: 8px;
              box-shadow: 0 0 10px #ddd;
              position:absolute;
              left:50%;
              background: white;
              transform: translate(-50%,-50%);
              img{
                height: 100%;
                width: 100%;
                border-radius: 50%;
                background-color: #eee;
              }
            }
            .login-form{
              position: absolute;
              top: 14vw;
              width: 100%;
              margin-bottom: 20px;
              padding: 0 40px;
              box-sizing: border-box;
              text-align: center;
              p{
                  float: right;
                  color: gray;
                  span{
                      color: #2980B9;
                      cursor: pointer;
                  }
              }
            }
          }
         
        }
      }
   
  }
  .login-footer{
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

</style>
