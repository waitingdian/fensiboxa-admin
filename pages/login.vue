<template>
  <div class="login-page bg-white">
    <el-form :model="loginForm"
             status-icon
             :rules="rules"
             ref="loginForm"
             label-width="80px"
             v-loading="loading"
             class="login-form box-shadow">
      <p class="f-tac f-fs24 text-black p-b-50">粉丝盒后台管理系统</p>
      <el-form-item label="用户名" prop="username">
        <el-input v-model.number="loginForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input @keyup.enter.native="submitForm('loginForm')" type="password" v-model="loginForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item class="f-tar">
        <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  export default {
    layout (context) {
      return 'noCommon'
    },
    name: 'login',
    components: {
      // Nav
    },
    data() {
      var validateUserName = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入用户名'));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      return {
        loginForm: {
          username: '',
          pass: ''
        },
        rules: {
          username: [
            { validator: validateUserName, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ]
        },
        loading: false
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = {
              username: this.loginForm.username,
              password: this.loginForm.pass,
            }
            this.submitLogin(params)
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitLogin (params) {
        this.loading = true
        this.$axios.$post(`/login `, params).then((res) => {
          this.loading = false
          location.replace('/')
        }).catch(() => {
          this.loading = false
        })
      }
    },
    mounted () {
    }
  }
</script>
<style lang="less">
  .login-page{
    position: absolute;
    width: 100%;
    height: 100%;
    .login-form{
      width: 560px;
      padding: 35px;
      margin: 60px auto;
      box-sizing: border-box;
      .el-input{
        width: 100%;
      }
    }
  }
</style>
