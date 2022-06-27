<template>
  <div class="viewHistory">
    <div class="viewHistoryHeader">
      <el-button size="medium" @click="handleBack">返回</el-button>
    </div>
    <el-table :data="historyDate" border style="width: 100%">
      <el-table-column fixed prop="contractNo" label="合同号">
      </el-table-column>
      <el-table-column prop="sessionName" label="合同session">
      </el-table-column>
      <el-table-column prop="contractType" label="合同类型"> </el-table-column>
      <el-table-column prop="planName" label="主险种"> </el-table-column>
      <el-table-column prop="cedent" label="分入公司"> </el-table-column>
      <el-table-column prop="effectivePeriodBegin" label="开始日期">
      </el-table-column>
      <el-table-column prop="effectivePeriodEnd" label="结束日期">
      </el-table-column>
      <el-table-column prop="payType" label="缴费方式"> </el-table-column>
      <el-table-column prop="estimateMonth" label="预估月份"> </el-table-column>
      <el-table-column prop="epi" label="预估保费">
        <template slot-scope="scope">
          <span>{{ kiloSplitData(scope.row.epi) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="commissionRate" label="手续费比例">
        <template slot-scope="scope">
          <span>{{ toPercentData(scope.row.commissionRate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="brokerageRate" label="经纪费比例">
        <template slot-scope="scope">
          <span>{{ toPercentData(scope.row.commissionRate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="cedentRate" label="分出比例">
        <template slot-scope="scope">
          <span>{{ toPercentData(scope.row.commissionRate) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="estimateStatus" label="预估状态"
        ><template slot-scope="scope">
          <span>{{ getDictData(scope.row.estimateStatus) }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="150">
        <template slot-scope="scope">
          <el-button @click="handleDetial(scope.row)" type="text" size="small"
            >查看明细</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { $http } from "@/utils/request";
import api from "@/utils/api";
import { kiloSplit, toPercent } from "@/utils/utils";
import { getText } from "@/utils/dict.js";
export default {
  data() {
    return {
      historyDate: [],
    };
  },

  methods: {
    init() {
      console.log(
        this.$route.query.type,
        "this.$route.query.typethis.$route.query.type"
      );
      let params = "";
      // if (this.$route.query.type == 1) {
      //   params = sessionStorage.getItem("finHistoryContractKey");
      // } else if (this.$route.query.type == 2) {
      //   params = sessionStorage.getItem("sepHistoryContractKey");
      // }else if (this.$route.query.type == 3) {
      //   params = sessionStorage.getItem("jsNcontractKey");
      // }else if (this.$route.query.type == 4) {
      //   params = sessionStorage.getItem("jsYcontractKey");
      // }
      params = sessionStorage.getItem("jsNcontractKey");

      $http
        .post(api.actuarialHistoryQuery, {
          contractKey: params,
        })
        .then((res) => {
          console.log(res, "res");
          this.historyDate = res.data.data.contractList;
        });
    },
    toPercentData(data) {
      return toPercent(data);
    },
    kiloSplitData(data) {
      return kiloSplit(data);
    },
    getDictData(data) {
      return getText("estimateStatus", data);
    },
    handleDetial(row) {
      localStorage.setItem("ActuarialGoto", "jsnViewHistory");
      console.log(row);
      // if (sessionStorage.getItem("enterType") === "in") {
      //   if (row.payType === "annual") {
      //     sessionStorage.setItem("finAnnualEstimateKey", row.estimateKey);
      //     this.$router.push("/annualEstimates");
      //     sessionStorage.setItem("licl", "1");
      //   } else {
      //     sessionStorage.setItem("finMonthEstimateKey", row.estimateKey);
      //     this.$router.push("/monthContractDetail");
      //     sessionStorage.setItem("licl", "2");
      //   }
      // } else if (sessionStorage.getItem("enterType") === "out") {
      //   this.$router.push("/separateEstimateDetial");
      // } else if (sessionStorage.getItem("enterType") === "jsyear") {
      sessionStorage.setItem("jsAnnualEstimateKey", row.estimateKey);
      this.$router.push("/yearActuarial");
      sessionStorage.setItem("licl", "4");
      // } else if (sessionStorage.getItem("enterType") === "jsmonth") {
      //   this.$router.push("/monthActuarial");
      //   sessionStorage.setItem("licl", "5");
      // }
    },
    handleBack() {
      // this.$router.go(-1);
      this.$router.push("/actuarialEstimates");
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.init());
  },
};
</script>

<style lang="scss" scoped>
.viewHistory {
  .viewHistoryHeader {
    float: right;
    margin-bottom: 10px;
  }
}
</style>
