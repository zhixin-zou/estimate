<template>
  <div class="bookedDetial">
    <el-form
      :model="EBSSummaryForm"
      disabled
      status-icon
      ref="EBSSummaryForm"
      label-width="200px"
      class="demo-EBSSummaryForm"
      size="mini"
    >
      <el-form-item label="Balance Type" prop="balanceType">
        <el-input v-model="EBSSummaryForm.balanceType"></el-input>
      </el-form-item>
      <el-form-item label="Category" prop="category">
        <el-input v-model="EBSSummaryForm.category"></el-input>
      </el-form-item>
      <el-form-item label="Source" prop="source">
        <el-input v-model="EBSSummaryForm.source"></el-input>
      </el-form-item>
      <el-form-item label="Chart Of Accounts" prop="chartOfAccounts">
        <el-input v-model="EBSSummaryForm.chartOfAccounts"></el-input>
      </el-form-item>
    </el-form>
    <fs-list-panel :columns="columns" :listData="listData"></fs-list-panel>
    <el-button plain class="bookDetialButton" @click="handleCheck">确认入账</el-button>
  </div>
</template>

<script>
import { $http } from "@/utils/request";
import api from "@/utils/api";
export default {
  data() {
    return {
      EBSSummaryForm: {
        balanceType: "",
        category: "",
        source: "",
        chartOfAccounts: "",
      },
      columns: [
        {
          title: "ledger",
          property: "ledger",
        },
        {
          title: "Currency",
          property: "currency",
        },
        {
          title: "Accounting Date",
          property: "conversionDate",
        },
        {
          title: "Period",
          property: "period",
        },
        {
          title: "COMPANY",
          property: "company",
        },
        {
          title: "COSTCENTER",
          property: "costcenter",
        },
        {
          title: "ACCOUNT",
          property: "account",
        },
        {
          title: "SUBACCOUNT",
          property: "subaccount",
        },
        {
          title: "PRODUCT",
          property: "product",
        },
        {
          title: "REGION",
          property: "region",
        },
        {
          title: "CHANNEL",
          property: "channel",
        },
        {
          title: "ICP",
          property: "icp",
        },
        {
          title: "SPARE",
          property: "spare",
        },
        {
          title: "Debit",
          property: "debit",
        },
        {
          title: "Credit",
          property: "credit",
        },
        {
          title: "Batch Name",
          property: "batchName",
        },
        {
          title: "Batch Description",
          property: "batchDescription",
        },
        {
          title: "Journal Name",
          property: "journalName",
        },
        {
          title: "Journal Description",
          property: "journalDescription",
        },
        {
          title: "Line Description",
          property: "lineDescription",
        }
      ],
      listData: [],
    };
  },
  methods: {
    init() {
      $http
        .post(api.EBSInfoQuery, {
          estimateKey: sessionStorage.getItem("estimateKey"),
          estimateMonth: sessionStorage.getItem("estimateMonth"),
          accountType: "0",
        })
        .then((res) => {
          console.log(res, "res");
          this.EBSSummaryForm = res.data.data.EBSSummary;
          this.listData = res.data.data.EBSDetail
        });
    },
    handleCheck () {
        
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.init());
  },
};
</script>

<style lang="scss">
.bookedDetial {
  .el-form-item {
    width: 600px;
  }
  .bookDetialButton {
      margin-top: 20px;
      margin-left: 45%;
  }
}
</style>
