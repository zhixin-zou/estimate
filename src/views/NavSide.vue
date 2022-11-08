<template>
  <div class="nav">
    <el-col>
      <el-menu
        default-active="2"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        router
      >
        <el-submenu index="/test">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>财务预估</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/financialForecasts">财务分入预估</el-menu-item>
            <el-menu-item index="/separateEstimates">财务分出预估</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>精算预估</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/actuarialEstimates">预估查询</el-menu-item>
            <el-menu-item index="/trialSearchView">试算查询</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>账务查看</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/ebsDetailSearch" @click="handlecheanPQ"
              >明细查寻</el-menu-item
            >
            <el-menu-item index="/financialSearch">账务查寻</el-menu-item>
            <el-menu-item index="/auditLog">审计查询</el-menu-item>
            <el-menu-item index="/estimateDuring">预估期间</el-menu-item>
            <el-menu-item index="/uyReport">UY Report</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>i7</span>
          </template>
          <el-menu-item-group>
            <!-- <el-menu-item index="/uyReport">UY Report</el-menu-item> -->
            <el-menu-item index="/contractSearch">合同查询</el-menu-item>
            <el-menu-item index="/groupInfo">分组信息</el-menu-item>
            <el-menu-item index="/journalProjectQuery">凭证查询</el-menu-item>
            <el-menu-item index="/projectListQuery">项目查询</el-menu-item>
            <el-menu-item index="/contractGroupQuery">合同组查询</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-col>
  </div>
</template>

<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handlecheanPQ() {
      sessionStorage.removeItem("projectIdJournal");
    },
  },
};
</script>

<style scoped>
.nav {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  background-color: #545c64;
  box-shadow: 2px 0 3px rgba(0, 21, 41, 0.35);
}
</style>
