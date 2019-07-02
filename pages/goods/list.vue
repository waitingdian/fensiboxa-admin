<template>
  <div class="goods-page">
    <p class="common-nav">商品列表</p>
    <div>
      <el-form :inline="true" :model="searchForm" class="search-form" label-width="80px">
        <el-row style="height: 45px;">
          <el-col :span="10">
            <el-form-item label="商品名称">
              <el-input v-model="searchForm.name" placeholder="请输入商品名称">
                <el-button @click="getList" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="14">
            <el-form-item class="p-l-45">
              <el-button type="primary" v-if="userInfo && userInfo.role==1" @click="syncProduct">同步商品</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        class="p-t-10"
        :data="tableData"
        v-loading="loading"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="商品编号"
          width="200">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="商品名称"
          width="200">
        </el-table-column>
        <el-table-column
          prop="price"
          show-overflow-tooltip
          label="商品价格">
        </el-table-column>
        <el-table-column
          prop="member_price"
          show-overflow-tooltip
          label="会员价格">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="userInfo && userInfo.role==1"
                       type="text"
                       @click="setPrice(scope.row.id, scope.row.price, scope.row)">
              设置价格
            </el-button>
            <el-button v-if="userInfo && userInfo.role==1"
                       type="text"
                       @click="setMemberPrice(scope.row.id, scope.row.price, scope.row)">
              设置会员价格
            </el-button>
            <el-button type="text" @click="getDetailInfo(scope.row.id, 0)">查看</el-button>
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
      :title="editType == 1 ? '修改价格': '修改会员价格'"
      :visible.sync="dialogVisible"
      v-loading="loading"
      class="dialog-visible"
      @close="close"
      width="420px">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-form">
        <el-form-item label="商品编号" class="m-b-0">
          <template>{{ proInfo.id }}</template>
        </el-form-item>
        <el-form-item label="商品名称" class="m-b-0">
          <template>{{ proInfo.name }}</template>
        </el-form-item>
        <el-form-item :label="editType == 1 ? '当前价格': '当前会员价'" class="m-b-0">
          <template>{{ editType == 1 ? price : member_price }}</template>
        </el-form-item>
        <el-form-item :label="editType == 1? '设置价格': '设置会员价'" prop="discount">
          <el-input v-model.trim="form.discount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="商品详情"
      class="pro-dialog"
      v-loading="loading"
      :visible.sync="orderDialogVisible"
      width="480px">
      <div v-loading="loading">
        <p><span class="label">商品编号:</span> {{ detailInfo.id }}</p>
        <p><span class="label">商品名称:</span> {{ detailInfo.pName }}</p>
        <p class="cover"><span class="label" v-if="detailInfo.image">商品图片:</span> <img :src="detailInfo.image" alt=""></p>
        <p><span class="label">最小下单数:</span> {{ detailInfo.limitMin }}</p>
        <p><span class="label">最大下单数:</span> {{ detailInfo.limitMax }}</p>
        <p><span class="label">下单倍数:</span> {{ detailInfo.rate }}</p>
        <p><span class="label">商品价格:</span> {{ detailInfo.price }}</p>
        <p><span class="label" v-if="detailInfo.pDesc">商品描述:</span></p>
        <p style="padding: 10px 15px" v-html="detailInfo.pDesc"></p>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import Header from '@/components/Header'
  import Aside from '@/components/Aside'
  export default {
    name: 'goodslist',
    components: {
      Aside,
      Header
    },
    data() {
      return {
        loading: false,
        dialogVisible: false,
        orderDialogVisible: false,
        tableData: [],
        pageInfo: {
          total: 0,
          size: this.$store.state.defaultPageSize,
          page: 1
        },
        searchForm: {
          name: ''
        },
        form: {
          discount: ''
        },
        rules: {
          discount: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
        },
        detailInfo: {},
        price: "",
        member_price: '',
        editType: 0,
        orderId: '',
        proInfo: {}
      }
    },
    methods: {
      setPrice (id, price, item) {
        this.editType = 1
        this.orderId = id
        this.price = price
        this.member_price = item.member_price
        this.proInfo = item
        this.dialogVisible = true
      },
      setMemberPrice (id, price, item) {
        this.editType = 0
        this.orderId = id
        this.price = price
        this.member_price = item.member_price
        this.proInfo = item
        this.dialogVisible = true
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.updatePrice()
          } else {
            return false;
          }
        });
      },
      // updateDiscount () {
      //   this.loading = true
      //   this.$axios.$post(`/product/discount/update`, {
      //     discount: Number(this.form.discount)
      //   }).then((res) => {
      //     this.loading = false
      //     this.dialogVisible = false
      //     this.$message.success("修改成功")
      //   }).catch(() => {
      //     this.loading = false
      //   })
      // },
      updatePrice () {
        this.loading = true
        let url = ''
        let message = ''
        if (this.editType == 1) {
          url = '/product/price/update'
          message = '更新价格成功'
        } else {
          url = '/product/member/update'
          message = '更新会员价格成功'
        }
        this.$axios.$post(url, {
          price: Number(this.form.discount),
          id: this.orderId
        }).then((res) => {
          this.loading = false
          this.dialogVisible = false
          this.$message.success(message)
          this.getList()
        }).catch(() => {
          this.loading = false
        })
      },
      getDetailInfo (id, type) {
        this.$axios.$get(`/product/detail/${id}`).then((res) => {
          this.orderDialogVisible = true
          this.detailInfo = res
        }).catch(() => {
          this.loading = false
        })
      },
      close () {
        this.editType = 0
        this.price = ""
        this.form.discount = ""
        this.orderId = ''
      },
      handleCurrentChange (page) {
        this.pageInfo.page = page
        this.getList()
      },
      getList () {
        this.loading = true
        this.$axios.$get(`/product/list?limit=${this.pageInfo.size}&offset=${this.pageInfo.size*(this.pageInfo.page-1)}&name=${this.searchForm.name}`).then((res) => {
          this.loading = false
          this.tableData = res.items
          this.pageInfo.total = res.page.total_row || 0
        }).catch(() => {
          this.loading = false
        })
      },
      syncProduct () {
        this.loading = true
        this.$axios.$get(`/product/sync`).then((res) => {
          this.$messge.success("同步成功")
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
  .goods-page{
    .search-form{
      .el-input{
        width: 220px;
      }
    }
    .dialog-visible{
      .el-dialog__body{
        padding: 15px 20px;
      }
    }
    .pro-dialog{
      p{
        line-height: 1.5;
        padding: 5px 10px;
        .label{
          display: inline-block;
          width: 90px;
          text-align: right;
          padding-right: 12px;
        }
      }
      .cover{
        display: flex;
        align-items: center;
      }
      img{
        width: 130px;
        max-height: 200px;
      }
    }
  }
</style>
