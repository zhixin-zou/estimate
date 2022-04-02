<template>
  <div class="yearAdjustDetail">
    <div class="section" v-for="(item, index) in yearAdjustList" :key="index">
      <h2>{{item.adjustMonth}}</h2>
      <fs-list-panel
        :columns="columns"
        :listData="item.epiSplitList"
      ></fs-list-panel>
    </div>
  </div>
</template>

<script>
import { $http } from "@/utils/request";
import api from "@/utils/api";

export default {
  data() {
    return {
      columns: [
        {
          title: "计算月份",
          property: "calculatMonth",
        },
        {
          title: "计算后EPI",
          property: "calculatedEPI",
        },
        {
          title: "原始EPI",
          property: "originEPI",
        },
        {
          title: "EPI调整",
          property: "manualAdjustEPI",
        },
        {
          title: "实际账单调整",
          property: "workSheetAdjustEPI",
        },
        {
          title: "预估+实际",
          property: "totalPremium",
        },
      ],
      yearAdjustList: [],
    };
  },
  methods: {
    init() {
      $http
        .post(api.yearAdjustDetail, {
          estimateKey: sessionStorage.getItem("estimateKey"),
        })
        .then((res) => {
          this.yearAdjustList = res.data.data.yearAdjustDetail;
          console.log(this.yearAdjustList, "???");
        });
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.init());
  },
};
</script>

<style></style>
