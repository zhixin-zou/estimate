<template>
  <div class="groupInfo">
    <div class="searchBox">
      分组名称： <el-input v-model="groupName"></el-input>
    </div>
    <div class="mainBox">
      分组信息填充：
      <div class="fillInfo">
        <table>
          <tr>
            <th>Company</th>
            <th>Contact</th>
            <th>Country</th>
            <th>Country</th>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      groupName: "",
    };
  },
};
</script>

<style></style>
