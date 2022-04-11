<template>
  <div class="viewHistory">
    <el-table :data="historyDate" border style="width: 100%">
      <el-table-column fixed prop="contractNo" label="合同号">
      </el-table-column>
      <el-table-column prop="contractType" label="合同类型"> </el-table-column>
      <el-table-column prop="planCode" label="主险种"> </el-table-column>
      <el-table-column prop="cedent" label="分入公司"> </el-table-column>
      <el-table-column prop="effectivePeriodBegin" label="开始日期">
      </el-table-column>
      <el-table-column prop="effectivePeriodEnd" label="结束日期">
      </el-table-column>
      <el-table-column prop="payType" label="缴费方式"> </el-table-column>
      <el-table-column prop="epi" label="预估保费"> </el-table-column>
      <el-table-column prop="commissionRate" label="手续费比例">
      </el-table-column>
      <el-table-column prop="brokerageRate" label="经纪费比例">
      </el-table-column>
      <el-table-column prop="cedentRate" label="分出比例"> </el-table-column>
      <el-table-column prop="estimateStatus" label="预估状态">
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

export default {
  data() {
    return {
      historyDate: [],
    };
  },

  methods: {
    init() {
      $http
        .post(api.estimateHistoryQuery, {
          contractKey: sessionStorage.getItem("contractKey"),
        })
        .then((res) => {
          console.log(res, "res");
          this.historyDate = res.data.data.contractList;
        });
    },
    handleDetial(row) {
      console.log(row);
      if (row.payType === "annual") {
        this.$router.push("/annualEstimates");
      } else {
        this.$router.push("/monthContractDetail");
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.init());
  },
};
</script>

<style></style>
