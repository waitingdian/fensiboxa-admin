<template>
  <div class="order-page">
    <p class="common-nav">商务列表</p>
    <div class="f-tar p-r-50" v-if="userInfo && userInfo.role==1"><el-button class="m-r-50" type="primary" @click="add">添加管理员</el-button></div>
    <div class="f-tar p-r-50" v-if="userInfo && userInfo.role==2"><el-button class="m-r-50" type="primary" @click="add">添加商务</el-button></div>
    <div>
      <el-table
        class="p-t-10"
        :data="tableData"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="username"
          show-overflow-tooltip
          label="用户名"
          width="260">
        </el-table-column>
        <el-table-column
          label="用户角色"
          width="260">
          <template slot-scope="scope">
            <span v-for="item in typeList" v-if="item.value === scope.row.role">{{ item && item.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="inviteCode"
          label="邀请码"
          width="230">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <span class="edit-icon el-icon-edit-outline f-csp f-fs20" style="padding: 5px" @click="editUser(scope.row)" title="编辑"></span>
            <!--<el-button circle icon="iconfont icondrxx04" @click="dialogVisible=true" title="修改密码"></el-button>-->
            <!--<el-button type="text" @click="getDetailInfo(scope.row.id, 1)">查看</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="f-tac p-t-25 p-b-20"
        background
        layout="prev, pager, next"
        :total="pageInfo.total"
        :page-size="pageInfo.size"
        @current-change = "handleCurrentChange">
      </el-pagination>
    </div>
    <el-dialog
      :title="userInfo.role == 1 ? '新增管理员' : '新增商务'"
      :visible.sync="dialogVisible"
      @close="close"
      width="520px">
      <el-form :model="form"
               @submit.native.prevent
               :rules="rules"
               ref="form"
               label-width="100px"
               class="demo-form">
        <el-form-item :label="userInfo.role == 1 ? '管理员名称': '商务名称'" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="默认密码" class="m-b-0">
          <template>123456</template>
        </el-form-item>
        <el-form-item label="新增角色" class="m-b-0">
          <template>{{ userInfo.role == 1 ? '管理员' : '商务' }}</template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">新 增</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      v-loading="editLoading"
      width="520px">
      <el-form :model="userForm"
               @submit.native.prevent
               :rules="userRules"
               ref="userForm"
               label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username"></el-input>
        </el-form-item>
        <el-form-item v-if="userForm.role ==3" label="邀请码" prop="inviteCode">
          <el-input v-model="userForm.inviteCode"></el-input>
        </el-form-item>
        <el-form-item v-if="userInfo.role==1" label="是否启用" prop="enabled">
          <el-switch v-model="userForm.enabled"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="editLoading" @click="submitEditForm('userForm')">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import Header from '@/components/Header'
  import Aside from '@/components/Aside'
  export default {
    name: 'managelist',
    components: {
      Aside,
      Header
    },
    data() {
      return {
        dialogVisible: false,
        editDialogVisible: false,
        editLoading: false,
        loading: false,
        tableData: [],
        pageInfo: {
          total: 0,
          size: this.$store.state.defaultPageSize,
          page: 1
        },
        form: {
          name: ''
        },
        userForm: {
          username: '',
          role: '',
          inviteCode: '',
          enabled: false
        },
        typeList: [
          {name: '超级管理员', value: 1},
          {name: '管理员', value: 2},
          {name: '商务', value: 3}
        ],
        rules: {
          name: { required: true, message: '名称不能为空', trigger: 'blur'}
        },
        userRules: {
          username: { required: true, message: '用户名不能为空', trigger: 'blur'},
          inviteCode: [
            { required: true, message: '邀请码不能为空', trigger: 'blur'},
            { min: 6, max: 6, message: '邀请码长度必须为6位', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      editUser (item) {
        this.loading = true
        this.$axios.$get(`/user/detail/${item.id}`).then((res) => {
          this.loading = false
          this.userForm = res
          this.userForm.enabled = res.enabled == 1 ? true : false
          this.editDialogVisible = true
        }).catch(() => {
          this.loading = false
        })
      },
      add () {
        this.dialogVisible = true
      },
      submitEditForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.editUserAjax()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.addUserAjax()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm () {
        this.userForm.username = ''
        this.userForm.inviteCode = null
        this.userForm.enabled = true
      },
      editUserAjax (id) {
        this.editLoading = true
        let params = {
          username: this.userForm.username
        }
        if (this.userInfo && this.userInfo.role ==3) {
          params.inviteCode = this.userForm.inviteCode
        }
        if (this.userInfo && this.userInfo.role ==1) {
          params.enabled = this.userForm.enabled ? 1 : 0
        }
        this.$axios.$put(`/user/update/${this.userForm.id}`, params).then((res) => {
          this.editLoading = false
          this.editDialogVisible = false
          this.$message.success("编辑成功")
          this.getList()
        }).catch(() => {
          this.editLoading = false
        })
      },
      addUserAjax () {
        this.$axios.$post(`/user/add`, {
          username: this.form.name
        }).then((res) => {
          this.loading = false
          this.dialogVisible = false
          this.$message.success("添加成功")
          this.getList()
        }).catch(() => {
          this.loading = false
        })
      },
      handleCurrentChange (page) {
        this.pageInfo.page = page
        this.getList()
      },
      getList () {
        this.loading = true
        let query = `?limit=${this.pageInfo.size}&offset=${this.pageInfo.size*(this.pageInfo.page-1)}`
        this.$axios.$get(`/user/userList${query}`).then((res) => {
          this.loading = false
          this.tableData = res.items
          this.pageInfo.total = res.page.total_row || 0
        }).catch(() => {
          this.loading = false
        })
      },
      close () {
        this.form.name = ''
      }
    },
    mounted () {
      this.getList()
    },
    computed: {
      userInfo () {
        return this.$store.state.userInfo
      }
    }
  }
</script>
<style lang="less">
  .order-page{
    .edit-icon {
      &:hover{
        color: #409eff !important;
      }
    }
  }
</style>
