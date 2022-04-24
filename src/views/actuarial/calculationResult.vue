<template>
  <div class="calculationResult">
    <div class="searchHeader">
      <span>请选择汇算产品</span>
      <el-select v-model="value" placeholder="请选择" style="padding: 0 20px">
        <el-option
          v-for="(item, index) in productList"
          :key="index"
          :label="item.productName"
          :value="item.productCode"
        ></el-option>
      </el-select>
      <el-button type="primary" round @click="handleClick">确认</el-button>
    </div>
    <div class="sectionResult"></div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  data() {
    return {
      value: ''
      // productList: [],
    };
  },
  computed: {
    ...mapState("actuarial/actuarialEstimates", ["productList"]),
  },
  methods: {
    ...mapActions("actuarial/actuarialEstimates", ["getProductList"]),
    init() {
      this.getProductList();
    },
    handleClick () {}
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.init());
  },
};
</script>

<style></style>
