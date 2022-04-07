<template>
  <el-table :data="listData" border style="width: 100%">
    <el-table-column
      v-for="(col, index) in columns"
      :key="index"
      :prop="col.property"
      :label="col.title"
      :width="col.width || 0"
    >
      <template slot-scope="scope">
        {{ getCellValue(scope.row, col) }}
        <span></span>
      </template>
    </el-table-column>
    <!-- <el-table-column fixed="right" label="操作">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small"
          >查看</el-button
        >
        <el-button type="text" size="small">编辑</el-button>
      </template>
    </el-table-column> -->
  </el-table>
</template>

<script>
import { getText } from '@/utils/dict.js'

export default {
  name: "fs-list-panel",
  props: {
    columns: Array,
    listData: Array,
  },
  methods: {
    // handleClick(row) {
    //   console.log(row);
    // },
    getCellValue(row, col) {
      if (col.formatter === "dict" && col.dictName) {
        // 本地字典
        return getText(col.dictName, row[col.property]);
      } else {
        return row[col.property];
      }
    },
  },

  data() {
    return {};
  },
};
</script>
<style></style>
