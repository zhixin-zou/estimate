<template>
  <div></div>
</template>

<script>
import { $http } from "@/utils/request";
import api from "@/utils/api";

export default {
  data() {
    return {};
  },
  mounted() {
    console.log(111111111);
    // $http.post(api.getUserInfo).then((res) => {
    //   console.log(res);
    // });
    const DEV_LOGIN_USER_ACCOUNT = "v_linzlzhao";

    const SYSTEM_ID = "ops"; // 当前系统在权限系统中的系统标识
    let    params = {
            account: DEV_LOGIN_USER_ACCOUNT,
            systemId: SYSTEM_ID
          }
    $http.post(api.getUserInfo, params).then((data) => {
      if (data.result && data.result.id) {
        console.log(data.result.id, 'data.result.id');
      }
    });
  },
};
</script>

<style>
</style>