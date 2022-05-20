<template>
  <div class="bookedDetial">
    <div class="backButton">
      <el-button @click="handleExport('bookDetialList', '明细')"
        >导出</el-button
      >
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
        <!-- <el-table-column fixed prop="ledger" label="ledger"> </el-table-column> -->
        <el-table-column prop="currency" label="Currency" width="90">
        </el-table-column>
        <el-table-column
          prop="accountingDate"
          label="Accounting Date"
          width="150"
        >
        </el-table-column>
        <el-table-column prop="period" label="Period"> </el-table-column>
        <!-- <el-table-column prop="company" label="COMPANY"> </el-table-column>
        <el-table-column prop="costcenter" label="COSTCENTER">
        </el-table-column> -->
        <el-table-column prop="account" label="ACCOUNT" width="100">
        </el-table-column>
        <el-table-column prop="subaccount" label="SUBACCOUNT" width="130">
        </el-table-column>
        <el-table-column prop="product" label="PRODUCT" width="100">
        </el-table-column>
        <el-table-column prop="region" label="REGION" width="100">
        </el-table-column>
        <el-table-column prop="channel" label="CHANNEL" width="100">
        </el-table-column>
        <el-table-column prop="icp" label="ICP"> </el-table-column>
        <!-- <el-table-column prop="spare" label="SPARE"> </el-table-column> -->
        <el-table-column prop="debit" label="Debit" width="200">
          <template slot-scope="scope">
            <span v-if="historyShow === '0'">{{ scope.row.debit }}</span>
            <el-input
              v-else
              v-model="scope.row.debit"
              :disabled="scope.row.updateFlag !== 'Y'"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="credit" label="Credit" width="200">
          <template slot-scope="scope">
            <span v-if="historyShow === '0'">{{ scope.row.credit }}</span>
            <el-input
              v-else
              v-model="scope.row.credit"
              :disabled="scope.row.updateFlag !== 'Y'"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="batchName" label="Batch Name" width="250">
        </el-table-column>
        <el-table-column
          prop="batchDescription"
          label="Batch Description"
          width="200"
        >
        </el-table-column>
        <el-table-column prop="journalName" label="Journal Name" width="250">
        </el-table-column>
        <el-table-column
          prop="journalDescription"
          label="Journal Description"
          width="500"
        >
        </el-table-column>
        <el-table-column
          prop="lineDescription"
          label="Line Description"
          width="400"
        >
        </el-table-column>
      </el-table>
      <el-table
        v-show="false"
        :data="listData"
        border
        style="width: 100%"
        ref="bookDetialList"
      >
        <el-table-column prop="ledger" label="ledger"> </el-table-column>
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
          <!-- <template slot-scope="scope">
            <el-input v-model="scope.row.debit"></el-input>
          </template> -->
        </el-table-column>
        <el-table-column prop="credit" label="Credit">
          <!-- <template slot-scope="scope">
            <el-input v-model="scope.row.credit"></el-input>
          </template> -->
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
    <div class="bookDetialButton" v-if="historyShow !== '0'">
      <el-button :loading="loading" plain @click="handleCheck"
        >确认入账</el-button
      >
      <el-button :loading="editLoading" @click="handleEditClick"
        >修改</el-button
      >
    </div>
  </div>
</template>

<script>
import { $http } from "@/utils/request";
import api from "@/utils/api";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";

export default {
  data() {
    return {
      historyShow: sessionStorage.getItem("bookDetialHistory"),

      loading: false,
      editLoading: false,
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
          estimateKey: sessionStorage.getItem("sepEstimateKey"),
          contractKey: sessionStorage.getItem("sepContractKey"),
          estimateMonth: sessionStorage.getItem("sepEstimateMonth"),
          accountType: "0",
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
      this.editLoading = true;
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
        })
        .finally(() => {
          this.editLoading = false;
        });
    },
    handleBackClick() {
      this.$router.go(-1);
    },
    handleCheck() {
      this.loading = true;
      let params = {
        estimateKey: sessionStorage.getItem("sepEstimateKey"),
        contractKey: sessionStorage.getItem("sepContractKey"),
        estimateMonth: sessionStorage.getItem("sepEstimateMonth"),
        accountType: "0",
      };

      $http
        .post(api.ebsInfoPush, params)
        .then((res) => {
          console.log(res);
          if (res.data.code === "0") {
            this.$message.success("成功");
            // this.$router.go(-1);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    exportBtn(refProp, fname) {
      // 获取表格元素
      const el = this.$refs[refProp].$el;
      // 文件名
      console.log(this.$refs[refProp], "elelele");
      const filename = fname + ".xlsx";
      /* generate workbook object from table */
      const wb = XLSX.utils.table_to_book(el);
      /* get binary string as output */
      const wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          filename
        );
      } catch (e) {
        console.log(e);
      }
      return wbout;
    },
    handleExport(data, filename) {
      this.exportBtn(data, filename);
      // console.log(this.$refs.exportTableRef1.$el);
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
