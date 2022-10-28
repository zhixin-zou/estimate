<template>
  <div id="app">
    <!-- <el-aside class="aside" width="230px" style="background-color: rgb(238, 241, 246)">
      <NavSide />
    </el-aside>
    <test-api /> -->
    <el-container class="container">
      <NavSide v-show="isLocal" class="aside" />
      <el-container>
        <el-header height="50px" class="header">
          <!-- <i
            class="aside-switcher iconfont icon-menu"
            @click="handleSwitcherClick"
          ></i> -->
          <!-- <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right" class>
              <el-breadcrumb-item
                v-for="route in routes"
                :key="route.path"
                :to="route"
                >{{ route.title }}</el-breadcrumb-item
              >
            </el-breadcrumb>
          </div> -->
          <!-- <div class="user-info">
            <span class="name">{{ name }}</span>
            <a :href="logoutLink">登出</a>
          </div> -->
        </el-header>
        <el-main class="main">
          <!-- <financial-forecasts /> -->
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import NavSide from "./views/NavSide.vue";
// import FinancialForecasts from "./views/financial/financialForecasts.vue";
// import TestApi from './views/test/testApi.vue'

// import { findRouteAncestors } from '@/router'

export default {
  name: "App",
  computed: {
    isLocal() {
      return window.location.href.includes(":300");
    },
    // routes () {
    //   return findRouteAncestors(this.$route)
    // },
    // routeResolving () {
    //   return this.$route.matched.length === 0
    // },
    // layout () {
    //   return this.$route.meta.layout
    // },
    // name () {
    //   return this.$store.state.login.userInfo.name
    // },
    // logoutLink () {
    //   return api.logout
    // }
  },
  components: {
    NavSide,
    // FinancialForecasts
    // TestApi
  },
};
</script>

<style>
@import url("./styles/style.css");
#app {
  width: 100%;
  height: 100%;
}
#app .aside {
  height: 100%;
}
</style>
<style>
@import url("./styles/style.css");
#app {
  width: 100%;
  height: 100%;
}
#app .aside {
  height: 100%;
  width: 200px;
  min-width: 200px;
  overflow-x: hidden;
}
#app .container {
  position: relative;
  width: 100%;
  height: 100%;
}
.header {
  z-index: 1;
  line-height: 50px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.aside-switcher {
  vertical-align: middle;
  color: #409eff;
  font-size: 20px;
  cursor: pointer;
}
.breadcrumb {
  display: inline-block;
  margin-left: 18px;
  vertical-align: middle;
}
.user-info {
  float: right;
}
.name {
  margin-right: 15px;
}
.main {
  background-color: #f0f2f5;
  width: 100%;
  height: 100%;
  padding: 15px;
  overflow: auto;
}
.route-resolving {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100px;
  height: 100px;
  margin-left: -50px;
  margin-top: -50px;
  text-align: center;
  font-size: 24px;
}
</style>

<style>
body .el-table th.gutter {
  display: table-cell !important;
}

body .el-table colgroup.gutter {
  display: table-cell !important;
}
.el-col-24 {
  width: 101% !important;
}
</style>
