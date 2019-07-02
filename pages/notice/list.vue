<template>
  <div class="order-page">
    <p class="common-nav">公告列表</p>
    <div class="f-tar p-r-50" v-if="userInfo && userInfo.role == 1"><el-button class="m-r-50" type="primary" @click="addNotice">添加公告</el-button></div>
    <div>
      <el-table
        class="p-t-10"
        :data="tableData"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="标题"
          show-overflow-tooltip
          width="320">
        </el-table-column>
        <el-table-column
          prop="created_time"
          label="创建时间"
          width="280">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="getDetailInfo(scope.row.id, 1)">查看</el-button>
            <el-button type="text" v-if="userInfo && userInfo.role == 1" @click="getDetailInfo(scope.row.id, 2)">编辑</el-button>
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
      title="提示"
      :visible.sync="dialogVisible"
      v-loading="loading"
      @close="close"
      width="520px">
      <el-form :model="noticeForm" :rules="rules" ref="noticeForm" label-width="100px" class="demo-noticeForm">
        <el-form-item label="公告标题" prop="title">
          <template v-if="type ==1">{{ detailInfo.title }}</template>
          <el-input v-else v-model="noticeForm.title"
                    maxlength="100"
                    show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <div v-if="type==1">{{ detailInfo.content }}</div>
          <el-input v-else type="textarea"
                    v-model="noticeForm.content"
                    maxlength="200"
                    rows="5"
                    show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('noticeForm')">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import Header from '@/components/Header'
  import Aside from '@/components/Aside'
  export default {
    name: '',
    components: {
      Aside,
      Header
    },
    data() {
      return {
        dialogVisible: false,
        loading: false,
        tableData: [],
        pageInfo: {
          total: 0,
          size: this.$store.state.defaultPageSize,
          page: 1
        },
        noticeForm: {
          title: '',
          content: ''
        },
        rules: {
          title: {required: true, message: '公告标题不能为空', trigger: "blur" },
          content: {required: true, message: '公告内容不能为空', trigger: "blur" }
        },
        type: 0,  // 0新增 1 查看 2 编辑
        noticeId: ""
      }
    },
    methods: {
      close () {
        this.type = 0
        this.noticeId = ""
        this.detailInfo = ""
      },
      addNotice () {
        this.dialogVisible = true
        this.type = 0
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.type == 2) {
              this.updateNoticeAjax()
            } else {
              this.addNoticeAjax()
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      getDetailInfo (id, type) {
        this.$axios.$get(`/announcement/detail/${id}`).then((res) => {
          this.loading = false
          this.type = type
          this.dialogVisible = true
          this.detailInfo = res
        }).catch(() => {
          this.loading = false
        })
      },
      addNoticeAjax () {
        this.loading = true
        this.$axios.$post(`/announcement/add`, {
          title: this.noticeForm.title,
          content: this.noticeForm.content
        }).then((res) => {
          this.loading = false
          this.dialogVisible = false
          this.$message.success("添加成功")
          this.getList()
        }).catch(() => {
          this.loading = false
        })
      },
      updateNoticeAjax () {
        this.loading = true
        this.$axios.$post(`/product/discount/update`, {
          id: this.noticeId,
          title: this.noticeForm.title,
          content: this.noticeForm.content
        }).then((res) => {
          this.loading = false
          this.dialogVisible = false
          this.$message.success("修改成功")
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
        this.$axios.$get(`/announcement/list${query}`).then((res) => {
          this.loading = false
          this.tableData = res.items
          this.pageInfo.total = res.page.total_row || 0
        }).catch(() => {
          this.loading = false
        })
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
  .search-form{
    .el-input{
      width: 220px;
    }
  }
</style>
