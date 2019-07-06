<template>
  <div class="order-page">
    <p class="common-nav">充值列表</p>
    <div>
      <el-form :inline="true"
               @submit.native.prevent
               :model="searchForm"
               class="search-form"
               label-width="80px">
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="searchForm.startTime"
            :picker-options="startTimeOptions"
            type="date"
            placeholder="请选择开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            :picker-options="endTimeOptions"
            v-model="searchForm.endTime"
            type="date"
            placeholder="请选择结束时间">
          </el-date-picker>
        </el-form-item>
        <br>
        <el-form-item label="用户名">
          <el-input v-model="searchForm.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" placeholder="请选择订单状态">
            <el-option v-for="item in statusList"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="p-l-45">
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table
        class="p-t-10"
        :data="tableData"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="订单号"
          width="180">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="username"
          label="用户名"
          width="150">
        </el-table-column>
        <el-table-column
          prop="phone"
          label="用户手机号"
          width="150">
        </el-table-column>
        <el-table-column
          prop="money"
          label="金额/元"
          width="110">
        </el-table-column>
        <el-table-column
          prop="deposit_type"
          label="支付方式">
          <template slot-scope="scope">
            <span v-for="item in paymentList" v-if="item.value === scope.row.deposit_type">{{ item.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="90"
          prop="address"
          label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status===1" type="success">成功</el-tag>
            <el-tag v-if="scope.row.status===0" type="danger">失败</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          width="180px"
          prop="created_time"
          label="创建时间">
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          prop="remark"
          label="备注">
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
        loading: false,
        tableData: [],
        pageInfo: {
          total: 0,
          size: this.$store.state.defaultPageSize,
          page: 1
        },
        searchForm: {
          startTime: '',
          endTime: '',
          userName: '',
          status: ''
        },
        statusList: [
          {name: '全部',value: ''},
          {name: '成功',value: 1},
          {name: '失败',value: 0}
        ],
        paymentList: [
          {name: "支付宝扫码", value: 1},
          {name: "微信支付", value: 2}
        ]
      }
    },
    methods: {
      onSubmit () {
        this.getList()
      },
      handleCurrentChange (page) {
        this.pageInfo.page = page
        this.getList()
      },
      getList () {
        this.loading = true
        let start = this.searchForm.startTime ? this.format(this.searchForm.startTime) : ''
        let end = this.searchForm.endTime ? this.format(this.searchForm.endTime) : ''
        let username = this.searchForm.userName ? `&username=${this.searchForm.userName}`: ''
        let query = `?limit=${this.pageInfo.size}&offset=${this.pageInfo.size*(this.pageInfo.page-1)}${username}&status=${this.searchForm.status}&period_start=${start}&period_end=${end}`
        this.$axios.$get(`/deposit/list${query}`).then((res) => {
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
    computed:{
      startTimeOptions(){
        // 训练营开始时间
        return{
          disabledDate:(time)=>{
            //今天之前的时间不能作为起始时间
            let disabledDate = new Date(this.searchForm.endTime);
            return time.getTime() > disabledDate.getTime()
          }
        }
      },
      endTimeOptions(){
        // 训练营结束时间
        return{
          disabledDate:(time)=>{
            //今天之前的时间不能作为起始时间
            let disabledDate = new Date(this.searchForm.startTime);
            return time.getTime() < disabledDate.getTime();
          }
        }
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
