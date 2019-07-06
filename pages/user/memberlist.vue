<template>
  <div class="member-page">
    <p class="common-nav">会员列表</p>
    <el-form v-if="userInfo && userInfo.role == 3"
             @submit.native.prevent :inline="true"
             :model="searchForm"
             class="search-form"
             label-width="80px">
      <el-row style="height: 45px;">
        <el-col :span="8">
          <el-form-item label="邀请码">
            <el-input disabled v-model="userInfo.inviteCode" placeholder="邀请码">
            </el-input>
            <el-button type="primary" @click="copyUrl(userInfo.inviteCode)">复制</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item class="p-l-45">
            <template>通过您的邀请码注册来的用户, 您将得到丰厚的提成</template>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <p class="p-l-25">当前拉新人数:
      <span style="color: #ff0000">{{ pageInfo.total }}</span>人
    </p>
    <div>
      <el-table
        class="p-t-10 p-l-15 p-r-15"
        :data="tableData"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="username"
          show-overflow-tooltip
          label="用户名"
          width="220">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          width="200">
        </el-table-column>
        <el-table-column
          label="用户角色">
          <template slot-scope="scope">
            <span v-if="scope.row.role == 0">普通用户</span>
            <span v-if="scope.row.role == 1">会员</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="inviteCode"
          label="邀请码"
          width="140">
        </el-table-column>
        <el-table-column
          prop="credit"
          label="会员积分"
          width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.credit }}</span>
            <span v-if="userInfo==1"
                  class="edit-icon el-icon-edit-outline f-csp f-fs20"
                  style="padding: 5px"
                  @click="editCredit(scope.row)" title="编辑积分">
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="注册时间">
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
      title="修改积分"
      :visible.sync="dialogVisible"
      v-loading="editLoading"
      class="dialog-visible"
      width="420px">
      <el-form :model="form"
               @submit.native.prevent
               :rules="rules"
               ref="form"
               label-width="100px">
        <el-form-item label="用户名称" class="m-b-0">
          <template>{{ originForm.username }}</template>
        </el-form-item>
        <el-form-item label="原积分" class="m-b-0">
          <template>{{ originForm.credit }}</template>
        </el-form-item>
        <el-form-item label="修改积分" prop="integral">
          <el-input :placeholder="`原积分${originForm.credit}`" v-model.trim="form.integral"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :disabled="editLoading" @click="submitForm('form')">确 定</el-button>
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
        editLoading: false,
        loading: false,
        tableData: [],
        pageInfo: {
          total: 0,
          size: this.$store.state.defaultPageSize,
          page: 1
        },
        searchForm: {
          name: ''
        },
        typeList: [
          {name: '超级管理员', value: 1},
          {name: '管理员', value: 2},
          {name: '商务', value: 3}
        ],
        rules: {
          name: { required: true, message: '名称不能为空', trigger: 'blur'}
        },
        form: {
          integral: ''
        },
        originForm: {}
      }
    },
    methods: {
      editCredit (item) {
        this.originForm = item
        this.dialogVisible = true
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.editCreditAjax()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      editCreditAjax () {
        this.editLoading = true
        this.$axios.$put(`/update/${this.originForm.id}`, {
            credit: this.form.integral
          }).then((res) => {
          this.editLoading = false
          this.$message.success("修改成功")
        }).catch(() => {
          this.editLoading = false
        })
      },
      handleCurrentChange (page) {
        this.pageInfo.page = page
        this.getList()
      },
      getList () {
        this.loading = true
        let query = `?limit=${this.pageInfo.size}&offset=${this.pageInfo.size*(this.pageInfo.page-1)}`
        this.$axios.$get(`/user/memberList${query}`).then((res) => {
          this.loading = false
          this.tableData = res.items
          this.pageInfo.total = res.page.total_row || 0
        }).catch(() => {
          this.loading = false
        })
      },
      copyUrl (url) {
        if (!url) {
          this.$message.error('无可复制内容')
          return false
        }
        var text = url;
        var textareaEle = document.createElement('input');
        textareaEle.style.fontSize = '12pt';
        textareaEle.style.border = '0';
        textareaEle.style.padding = '0';
        textareaEle.style.margin = '0';
        textareaEle.style.position = 'absolute';
        textareaEle.style['right'] = '-9999px';
        var yPosition = window.pageYOffset || document.documentElement.scrollTop;
        textareaEle.style.top = yPosition + 'px';
        textareaEle.setAttribute('readonly', '');
        textareaEle.value = text;
        document.body.appendChild(textareaEle);
        textareaEle.select();
        textareaEle.setSelectionRange(0, textareaEle.value.length);
        var succeeded = document.execCommand('copy');
        if (succeeded) {
          this.$message({
            type: 'success',
            message: '复制成功!'
          });
        } else {
          this.$message({
            type: 'info',
            message: '复制失败，请手动输入以上网址'
          });
        }
        document.body.removeChild(textareaEle);
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
  .member-page{
    .el-input{
      width: 220px;
    }
    .edit-icon {
      &:hover{
        color: #409eff !important;
      }
    }
  }
</style>
