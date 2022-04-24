<template>
  <div class="bookedDetial">
    <div class="backButton">
      <!-- <el-button @click="handleBackClick">导出</el-button> -->

      <el-button @click="handleBackClick">返回</el-button>
    </div>

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
    <div class="listBox">
      <el-table :data="listData" border style="width: 100%">
        <el-table-column fixed prop="ledger" label="ledger"> </el-table-column>
        <el-table-column prop="currency" label="Currency"> </el-table-column>
        <el-table-column prop="accountingDate" label="Accounting Date">
        </el-table-column>
        <el-table-column prop="period" label="Period"> </el-table-column>
        <el-table-column prop="company" label="COMPANY"> </el-table-column>
        <el-table-column prop="costcenter" label="COSTCENTER">
        </el-table-column>
        <el-table-column prop="account" label="ACCOUNT"> </el-table-column>
        <el-table-column prop="subaccount" label="SUBACCOUNT">
        </el-table-column>
        <el-table-column prop="product" label="PRODUCT"> </el-table-column>
        <el-table-column prop="region" label="REGION"> </el-table-column>
        <el-table-column prop="channel" label="CHANNEL"> </el-table-column>
        <el-table-column prop="icp" label="ICP"> </el-table-column>
        <el-table-column prop="spare" label="SPARE"> </el-table-column>
        <el-table-column prop="debit" label="Debit">
          <template slot-scope="scope">
            <el-input v-model="scope.row.debit"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="credit" label="Credit">
          <template slot-scope="scope">
            <el-input v-model="scope.row.credit"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="batchName" label="Batch Name"> </el-table-column>
        <el-table-column prop="batchDescription" label="Batch Description">
        </el-table-column>
        <el-table-column prop="journalName" label="Journal Name">
        </el-table-column>
        <el-table-column prop="journalDescription" label="Journal Description">
        </el-table-column>
        <el-table-column prop="lineDescription" label="Line Description">
        </el-table-column>
      </el-table>
    </div>
    <!-- <fs-list-panel :columns="columns" :listData="listData"> </fs-list-panel> -->
    <div class="bookDetialButton">
      <el-button plain @click="handleCheck">确认入账</el-button>
      <el-button @click="handleEditClick">修改</el-button>
    </div>
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
          property: "accountingDate",
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
        },
        {
          property: "operation",
          title: "操作",
          // fixed: "right",
          width: 130,
          actions: [{ name: "handleEdit", permission: "", title: "编辑" }],
        },
      ],
      listData: [],
      btTitle: "编辑",
    };
  },
  methods: {
    init() {
      $http
        .post(api.ebsInfoQuery, {
          estimateKey: sessionStorage.getItem("estimateKey"),
          contractKey: sessionStorage.getItem("contractKey"),
          estimateMonth: sessionStorage.getItem("estimateMonth"),
          accountType: sessionStorage.getItem("accountType"),
        })
        .then((res) => {
          if (res.data.code === "0") {
            console.log(res, "res");
            this.EBSSummaryForm = res.data.data.ebsSummary;
            this.listData = res.data.data.ebsDetail;
          } else {
            console.log(res);
            this.$message.error(res.data.msg);
          }
        });
    },
    handleEditClick() {
      let ebsModifyList = [];
      this.listData.forEach((item) => {
        ebsModifyList.push({
          recId: item.recId,
          debit: item.debit,
          credit: item.credit,
        });
      });
      console.log(ebsModifyList, "ebsModifyListebsModifyListebsModifyList");
      $http
        .post(api.ebsInfoModify, {
          ebsModifyList: ebsModifyList,
        })
        .then((res) => {
          if (res.data.code === "0") {
            this.$message.success("修改成功");
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    handleBackClick() {
      this.$router.go(-1);
    },
    handleCheck() {
      $http
        .post(api.saveToFinance, {
          estimateKey: sessionStorage.getItem("estimateKey"),
          estimateMonth: sessionStorage.getItem("estimateMonth"),
          accountType: sessionStorage.getItem("accountType"),
        })
        .then((res) => {
          console.log(res);
        });
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.init());
  },
};
</script>

<style lang="scss">
.bookedDetial {
  .backButton {
    position: absolute;
    right: 5%;
  }
  .el-form-item {
    width: 600px;
  }
  .bookDetialButton {
    margin-top: 20px;
    margin-left: 45%;
  }
}
</style>
