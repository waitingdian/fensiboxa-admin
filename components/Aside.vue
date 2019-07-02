<template>
  <div class="aside-comp">
    <el-menu
      :default-active="$route.path"
      class="el-menu-aside"
      router>
      <el-submenu index="/" class="home-page-aside" :class="{'active': $route.path == '/'}">
        <template slot="title">
          <div @click="$router.push('/')">
            <i class="iconfont icon51"></i>
            <span>首页</span>
          </div>
        </template>
      </el-submenu>
      <el-submenu v-for="(item) in meunList" :index="item.path" :key="item.path">
        <template slot="title">
          <i class="iconfont" :class="item.iconfont"></i>
          <span>{{ item.name }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="childItem in item.children"
                        :key="childItem.path"
                        :index="childItem.path">
            {{ childItem.name }}
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
  export default {
    name: 'aside-left',
    components: {
    },
    data() {
      return {
        meunList: [
          // {
          //   name: '首页',
          //   path: '/',
          //   iconfont: 'icon51',
          //   children: [
          //   ]
          // },
          {
            name: '用户管理',
            path: '/user/managelist',
            iconfont: 'iconyonghu',
            children: [
              {
                name: '会员列表',
                path: '/user/memberlist'
              },
              {
                name: '业绩列表',
                path: '/user/achievementList'
              }
            ]
          },
          {
            name: '商品管理',
            path: '/goods/list',
            iconfont: 'iconshangpin',
            children: [
              {
                name: '商品列表',
                path: '/goods/list'
              }
            ]
          },
          {
            name: '订单管理',
            path: '/order/list',
            iconfont: 'icondingdan',
            children: [
              {
                name: '订单列表',
                path: '/order/list'
              }
            ]
          },
          {
            name: '充值管理',
            path: '/recharge/list',
            iconfont: 'iconchongzhi',
            children: [
              {
                name: '充值列表',
                path: '/recharge/list'
              }
            ]
          },
          {
            name: '公告管理',
            path: '/notice/list',
            iconfont: 'icongonggao',
            children: [
              {
                name: '公告列表',
                path: '/notice/list'
              }
            ]
          }
        ]
      }
    },
    computed: {
      userInfo () {
        return this.$store.state.userInfo
      }
    },
    methods: {
      editAside () {
        if (this.userInfo) {
          if (this.userInfo.role == 1) {
            this.meunList[0].children = [
              { name: '管理员列表', path: '/user/managelist' },
              { name: '会员列表', path: '/user/memberlist' },
              { name: '业绩列表', path: '/user/achievementList' }
            ]
          } else if (this.userInfo.role == 2) {
            this.meunList[0].children = [
              { name: '商务列表', path: '/user/managelist' },
              { name: '会员列表', path: '/user/memberlist' },
              { name: '业绩列表', path: '/user/achievementList'}
            ]
          } else if (this.userInfo.role == 3){
            this.meunList[0].children = [
              { name: '会员列表', path: '/user/memberlist' },
              { name: '业绩列表', path: '/user/achievementList' }
            ]
          }
        }
      }
    },
    mounted () {
      if (this.userInfo && !this.userInfo.id) {
        this.$store.dispatch('getUserInfo')
      }
    },
    watch: {
      'userInfo'(value) {
        if (value) {
          this.editAside()
        }
      }
    }
  }
</script>
<style lang="less">
  .aside-comp{
    width: 260px;
    .el-menu-aside{
      height: 100%;
      min-height: 500px;
    }
    .home-page-aside{
      .el-submenu__icon-arrow{
        display: none;
      }
    }
    .active{
      .el-submenu__title{
        color: #409eff !important;
      }
      .el-submenu__title i{
        color: #409eff !important;
      }
    }
  }
</style>
