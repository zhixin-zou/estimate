<template>
  <div class="calculationResult">
    <div class="searchHeader">
      <span>请选择汇算产品</span>
      <el-select v-model="value" placeholder="请选择" style="padding: 0 20px">
        <!-- v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value" -->
        <el-option>1</el-option>
        <el-option>2</el-option>
      </el-select>
      <el-button type="primary" round>确认</el-button>
    </div>
    <div class="sectionResult">
        
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
