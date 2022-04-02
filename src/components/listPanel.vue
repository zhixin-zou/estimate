<template>
  <el-table :data="listData" border style="width: 100%">
    <el-table-column
      v-for="(item, index) in columns"
      :key="index"
      :prop="item.property"
      :label="item.title"
      :width="item.width || 0"
    >
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
export default {
  name: "fs-list-panel",
  props: {
    columns: Array,
    listData: Array
  },
  methods: {
    // handleClick(row) {
    //   console.log(row);
    // },
  },

  data() {
    return {
    };
  },
};
</script>
<style>
</style>