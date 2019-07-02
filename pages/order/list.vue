<template>
  <div class="order-page">
    <p class="common-nav">订单列表</p>
    <div>
      <el-form :inline="true" :model="searchForm" class="search-form" label-width="80px">
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
        <el-form-item label="充值状态">
          <el-select v-model="searchForm.status" placeholder="请选择订单状态">
            <el-option v-for="item in typeList"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="p-l-45">
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button type="primary"
                     :disabled="disabledBtn"
                     class="m-l-30"
                     @click="syncOrder">同步订单
          </el-button>
        </el-form-item>
      </el-form>
      <el-table
        class="p-t-10"
        :data="tableData"
        v-loading="loading">
        <el-table-column
          prop="oid"
          label="订单号"
          width="90">
        </el-table-column>
        <el-table-column
          prop="gname"
          show-overflow-tooltip
          label="商品名称"
          width="150">
        </el-table-column>
        <el-table-column
          prop="username"
          show-overflow-tooltip
          label="用户名"
          width="110">
        </el-table-column>
        <el-table-column
          label="订单状态"
          width="80">
          <template slot-scope="scope">
            <span v-for="item in typeList" v-if="item.value === scope.row.status">{{ item.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="num"
          label="下单数量">
        </el-table-column>
        <el-table-column
          prop="nowNum"
          label="当前数量">
        </el-table-column>
        <el-table-column
          prop="startNum"
          label="初始数量">
        </el-table-column>
        <el-table-column
          prop="tnum"
          label="退单数量">
        </el-table-column>
        <el-table-column
          width="170px"
          prop="orderPrice"
          label="下单金额">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="下单时间"
          width="160">
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
        disabledBtn: false,
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
        typeList: [
          {name: '全部',value: ''},
          {name: '待处理',value: 0},
          {name: '处理中',value: 1},
          {name: '退单中',value: 2},
          {name: '有异常',value: 3},
          {name: '补单中',value: 4},
          {name: '已更新',value: 5},
          {name: '已完成',value: 90},
          {name: '已退单',value: 91},
          {name: '已退款',value: 92}
        ]
      }
    },
    methods: {
      syncOrder () {
        this.disabledBtn = true
        this.$axios.$post(`/order/syncOrder`).then((res) => {
          this.disabledBtn = false
          this.$message.success("同步成功")
        }).catch(() => {
          this.disabledBtn = false
        })
      },
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
        this.$axios.$get(`/order/list${query}`).then((res) => {
          this.loading = false
          this.tableData = res.items
          this.pageInfo.total = res.page.total_row || 0
        }).catch(() => {
          this.loading = false
        })
      },
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
