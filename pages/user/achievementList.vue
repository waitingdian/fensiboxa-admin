<template>
  <div class="order-page">
    <p class="common-nav">业绩列表</p>
    <div>
      <el-table
        class="p-t-10 m-b-30"
        :data="tableData"
        v-loading="loading"
        style="width: 100%;min-heigh: 390px">
        <el-table-column
          prop="username"
          show-overflow-tooltip
          label="用户名"
          width="180">
        </el-table-column>
        <el-table-column
          label="用户角色"
          width="120">
          <template slot-scope="scope">
            <span v-for="item in typeList" v-if="item.value === scope.row.role">{{ item && item.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="last_day_count"
          label="昨天拉新人数"
          width="130">
        </el-table-column>
        <el-table-column
          prop="month_count"
          label="本月拉新人数">
        </el-table-column>
        <el-table-column
          prop="last_month_count"
          label="上月拉新人数">
        </el-table-column>
        <el-table-column
          prop="total_count"
          label="总拉新人数">
        </el-table-column>
        <el-table-column
          prop="last_day_money"
          label="昨天充值金额">
        </el-table-column>
        <el-table-column
          prop="month_money"
          label="本月充值金额">
        </el-table-column>
        <el-table-column
          prop="last_month_money"
          label="上月充值金额">
        </el-table-column>
        <el-table-column
          prop="total_money"
          label="总充值金额">
        </el-table-column>
      </el-table>
      <!--<el-pagination-->
        <!--class="f-tac p-t-25 p-b-20"-->
        <!--background-->
        <!--layout="prev, pager, next"-->
        <!--:total="pageInfo.total"-->
        <!--:page-size="pageInfo.size"-->
        <!--@current-change = "handleCurrentChange">-->
      <!--</el-pagination>-->
    </div>
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
        loading: false,
        tableData: [],
        typeList: [
          {name: '超级管理员', value: 1},
          {name: '管理员', value: 2},
          {name: '商务', value: 3}
        ]
        // pageInfo: {
        //   total: 0,
        //   size: this.$store.state.defaultPageSize,
        //   page: 1
        // }
      }
    },
    methods: {
      add () {
        this.dialogVisible = true
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
      // handleCurrentChange (page) {
      //   this.pageInfo.page = page
      //   this.getList()
      // },
      getList () {
        this.loading = true
        // let query = `?limit=${this.pageInfo.size}&offset=${this.pageInfo.size*(this.pageInfo.page-1)}`
        this.$axios.$get(`/user/achievement/list`).then((res) => {
          this.loading = false
          this.tableData = res
          // this.pageInfo.total = res.page.total_row || 0
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
</style>
