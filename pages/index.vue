<template>
  <div class="home-page">
    <div>
      <div class="f-df">
        <div style="width: 300px" class="m-r-15">
          <p class="entrance-border">快捷入口</p>
          <div class="f-df">
            <nuxt-link class="link-icon" to="/user/memberlist">
              <svg class="iconfont-icon" aria-hidden="true">
                <use xlink:href="#iconhuiyuan"></use>
              </svg>
              <p>会员列表</p>
            </nuxt-link>
            <nuxt-link class="link-icon" to="/goods/list">
              <svg class="iconfont-icon" aria-hidden="true">
                <use xlink:href="#iconshangpin"></use>
              </svg>
              <p>商品列表</p>
            </nuxt-link>
            <nuxt-link class="link-icon" to="/order/list">
              <svg class="iconfont-icon" aria-hidden="true">
                <use xlink:href="#icondingdan"></use>
              </svg>
              <p>订单列表</p>
            </nuxt-link>
            <nuxt-link class="link-icon" to="/recharge/list">
              <svg class="iconfont-icon" aria-hidden="true">
                <use xlink:href="#iconchongzhi"></use>
              </svg>
              <p>充值列表</p>
            </nuxt-link>
            <!--<i class="iconhuiyuan iconfont"></i>-->
            <!--<i class="iconshangpin iconfont"></i>-->
            <!--<i class="icondingdan iconfont"></i>-->
            <!--<i class="iconchongzhi iconfont"></i>-->
          </div>
        </div>
        <div style="flex: 1;" v-loading="infoLoading">
          <p class="entrance-border clearfix m-b-20">业绩统计</p>
          <div class="f-fl p-b-10 p-t-10" style="width: 25%">总计新增用户: {{ achievementInfo && achievementInfo.total_count }}</div>
          <div class="f-fl p-b-10 p-t-10" style="width: 25%">昨日新增用户: {{ achievementInfo && achievementInfo.last_day_count }} </div>
          <div class="f-fl p-b-10 p-t-10" style="width: 25%">本月新增用户: {{ achievementInfo && achievementInfo.month_count }}</div>
          <div class="f-fl p-b-10 p-t-10" style="width: 25%">上月新增用户: {{ achievementInfo && achievementInfo.last_month_count }}</div>
          <div class="f-fl p-b-10 p-t-10" style="width: 25%">总计充值金额: {{ achievementInfo && achievementInfo.total_money }}</div>
          <div class="f-fl p-b-10 p-t-10" style="width: 25%">昨日充值金额: {{ achievementInfo && achievementInfo.last_day_money }} </div>
          <div class="f-fl p-b-10 p-t-10" style="width: 25%">本月充值金额: {{ achievementInfo && achievementInfo.month_money }}</div>
          <div class="f-fl p-b-10 p-t-10" style="width: 25%">上月充值金额: {{ achievementInfo && achievementInfo.last_month_money }}</div>
        </div>
      </div>
      <p class="entrance-border p-t-20">最近订单</p>
      <el-table
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
        tableData: [],
        pageInfo: {
          total: 0,
          size: this.$store.state.defaultPageSize,
          page: 1
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
        ],
        infoLoading: false,
        achievementInfo: {}
      }
    },
    methods: {
      onSubmit () {

      },
      handleCurrentChange (page) {
        this.pageInfo.page = page
        this.getList()
      },
      getAchievementList () {
        this.infoLoading = true
        this.$axios.$get(`/user/achievement/detail`).then((res) => {
          this.infoLoading = false
          this.achievementInfo = res
        }).catch(() => {
          this.infoLoading = false
        })
      },
      getList () {
        this.loading = true
        let query = `?limit=${this.pageInfo.size}&offset=${this.pageInfo.size*(this.pageInfo.page-1)}`
        this.$axios.$get(`/order/list${query}`).then((res) => {
          this.loading = false
          this.tableData = res.items
          this.pageInfo.total = res.page.total_row || 0
        }).catch(() => {
          this.loading = false
        })
      }
    },
    mounted () {
      this.getAchievementList()
      this.getList()
    }
  }
</script>
<style lang="less">
  .home-page{
    .entrance-border {
      padding-left: 8px;
      padding-bottom: 15px;
      margin-bottom: 13px;
      border-bottom: 1px solid rgba(51,51,51,0.1);
    }
    .link-icon {
      display: inline-block;
      font-size: 40px;
      margin: 10px;
      svg{
        padding-left: 10px;
      }
      p{
        font-size: 12px;
        color: #333;
        text-align: center;
      }
    }
  }

</style>
