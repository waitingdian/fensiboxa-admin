<template>
  <div class="header-comp clearfix">
    <h1 class="p-l-35 f-fs18 f-fl f-csp" @click="$router.push('/')">粉丝盒后台管理系统</h1>
    <div class="right">
      <span class="p-r-10">用户名:
        <span>{{ userInfo.username }}</span>
      </span>
      <span class="p-r-10">角色:
        <span v-if="userInfo.role==1">超级管理员</span>
        <span v-if="userInfo.role==2">管理员</span>
        <span v-if="userInfo.role==3">商务</span>
      </span>
      <el-button circle icon="iconfont icondrxx04" @click="dialogVisible=true" title="修改密码"></el-button>
      <el-button circle icon="icontuichu1 iconfont" @click="signOut" title="退出"></el-button>
    </div>
    <el-dialog
      title="修改密码"
      class="edit-pass-dialog"
      :visible.sync="dialogVisible"
      v-loading="loading"
      @close="close"
      width="520px;">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
        <el-form-item label="用户名" prop="name">
          <template>{{ userInfo.username }}</template>
        </el-form-item>
        <el-form-item label="旧密码" prop="oldPass">
          <el-input type="password" v-model="form.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="form.pass" autocomplete="off"></el-input>
        </el-form-item>
        <!--required-->
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="form.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import Nav from '@/components/Nav'
  export default {
    name: 'login',
    components: {
      Nav
    },
    data() {
      var validateOldPass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.form.checkPass !== '') {
            this.$refs.form.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        title: '',
        loading: false,
        dialogVisible: false,
        form: {
          oldPass: '',
          pass: '',
          checkPass: ''
        },
        rules: {
          oldPass: [
            { validator: validateOldPass, trigger: 'blur' },
            { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' },
            { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' },
            { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      close () {
        this.form.pass = ''
        this.form.checkPass = ''
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.editPwd()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      editPwd () {
        this.loading = true
        this.$axios.$post(`/user/editPwd`, {
          password: this.form.oldPass,
          new_password: this.form.checkPass
        }).then((res) => {
          this.loading = false
          this.dialogVisible = false
          this.$message.success('修改成功')
          sessionStorage.removeItem('adminToken')
          this.$store.commit('clearUserInfo')
          setTimeout(() => {
            location.replace('/login')
          }, 500)
        }).catch(() => {
          this.loading = false
        })
      },
      signOut () {
        sessionStorage.removeItem('adminToken')
        this.$store.commit('clearUserInfo')
        this.$message.success("退出成功")
        setTimeout(() => {
          location.replace('/login')
        }, 500)
      },
    },
    mounted () {
      if (this.userInfo && !this.userInfo.id) {
        this.$store.dispatch('getUserInfo')
      }
    },
    computed: {
      userInfo () {
        return this.$store.state.userInfo
      }
    }
  }
</script>
<style lang="less">
  .header-comp{
    background-color: #fff;
    height: 80px;
    line-height: 80px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    margin-bottom: 10px;
    padding: 0 45px;
    h1{
      width: 300px;
      box-sizing: border-box;
    }
    .right{
      margin-left: 300px;
      text-align: right;
    }
    .edit-pass-dialog{
      line-height: 1;
      .el-dialog__body{
        padding: 15px 20px;
      }
    }
  }
</style>
