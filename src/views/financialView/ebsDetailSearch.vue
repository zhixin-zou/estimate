<template>
  <div class="bookedDetial">
    <div class="backButton">
      <el-button
        class="dbtn"
        style="margin-right: 5px"
        @click="handleExport('bookDetialList', '明细')"
        >导出</el-button
      >
      <el-button
        v-if="showBtn"
        class="dbtn"
        style="margin-right: 5px"
        @click="handleBack()"
        >返回</el-button
      >
    </div>
    <div class="collapseSearch">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="预估查询条件" name="1">
          <div class="searchBox">
            <div class="searchMain">
              <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="合同类型">
                  <el-select v-model="form.contractType" placeholder="请选择" clearable>
                    <el-option label="比例合约" value="PROPTTY"></el-option>
                    <el-option label="非比例合约" value="NONPROPTTY"></el-option>
                    <el-option label="比例临分" value="PROPFAC"></el-option>
                    <el-option label="非比例临分" value="NONPROPFAC"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="合同号开始">
                  <el-input v-model="form.contractNoBegin"></el-input>
                </el-form-item>
                <el-form-item label="合同号结束">
                  <el-input v-model="form.contractNoEnd"></el-input>
                </el-form-item>
                <el-form-item label="账务类型">
                  <el-select v-model="form.accountType" placeholder="请选择" clearable>
                    <el-option label="财务" value="0"></el-option>
                    <el-option label="精算" value="1"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="合同类别">
                  <el-select v-model="form.contractClass" placeholder="请选择">
                    <el-option label="分入" value="AB"></el-option>
                    <el-option label="分出" value="opr"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="分入公司">
                  <el-select v-model="form.cedent" placeholder="请选择" clearable>
                    <el-option
                      v-for="(item, index) in companyList"
                      :key="index"
                      :label="item.partnerName"
                      :value="item.partnerCode"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="合同开始时间">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="form.contractTimeBegin"
                    style="width: 100%"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="合同结束时间">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="form.contractTimeEnd"
                    style="width: 100%"
                  ></el-date-picker>
                </el-form-item>
                <!-- <el-form-item label="预估月份">
                  <el-date-picker
                    v-model="form.estimateMonth"
                    type="month"
                    placeholder="选择月"
                    style="width: 100%"
                  >
                  </el-date-picker
                ></el-form-item> -->
              </el-form>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="" name="2">
          <div class="searchBox">
            <div class="searchMain">
              <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="做账期间">
                  <el-date-picker
                    v-model="form.estimateMonth"
                    type="month"
                    placeholder="选择月"
                    style="width: 100%"
                  >
                  </el-date-picker
                ></el-form-item>
                <el-form-item label="凭证类型">
                  <el-select v-model="form.accountClass" placeholder="请选择" clearable>
                    <el-option label="预估账" value="Estimation"></el-option>
                    <el-option label="技术账单" value="SICS Technical"></el-option>
                    <el-option label="结算账单" value="SICS Settlement"></el-option>
                    <el-option label="资金账单" value="SICS Remittance"></el-option>
                    <el-option label="ifrs17账务" value="I17 sub-ledger"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="是否反冲">
                  <el-select v-model="form.reverseFlag" placeholder="请选择" clearable>
                    <el-option label="是" value="Y"></el-option>
                    <el-option label="否" value="N"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="账务日期">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="form.accountDate"
                    value-format="yyyy-MM-dd"
                    style="width: 100%"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="做账批次">
                  <el-input v-model="form.accountBatch"></el-input>
                </el-form-item>
                <el-form-item label="凭证描述">
                  <el-input v-model="form.journalDescription"></el-input>
                </el-form-item>
                <el-form-item label="科目">
                  <el-input v-model="form.accountCode"></el-input>
                </el-form-item>
                <el-form-item label="产品">
                  <el-input v-model="form.productCode"></el-input>
                </el-form-item>
                <el-form-item label="是否过账">
                  <el-select v-model="form.postFlag" placeholder="请选择" clearable>
                    <el-option label="是" value="Y"></el-option>
                    <el-option label="否" value="N"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="ifrs17项目ID">
                  <el-input v-model="form.projectId"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div slot="footer" style="float: right; margin-top: 10px" class="searchFoot">
        <div class="searchButton">
          <el-button
            :loading="loading"
            size="mini"
            type="primary"
            @click="handleSearchClick"
            style="margin-left: 5px"
            >查询</el-button
          >
          <el-button size="mini" @click="handleResetClick">重置</el-button>
        </div>
      </div>
    </div>
    <div class="formInfo" style="background-color: #fff; padding: 20px">
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
    </div>
    <div class="listBox">
      <el-table
        :data="listData"
        border
        style="width: 100%"
        v-horizontal-scroll="'always'"
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column fixed prop="ledger" label="ledger"> </el-table-column> -->
        <el-table-column type="selection" width="55" :selectable="selectable">
        </el-table-column>
        <el-table-column prop="currency" label="Currency" width="90"> </el-table-column>
        <el-table-column prop="accountingDate" label="Accounting Date" width="150">
        </el-table-column>
        <el-table-column prop="period" label="Period"> </el-table-column>
        <!-- <el-table-column prop="company" label="COMPANY"> </el-table-column>
        <el-table-column prop="costcenter" label="COSTCENTER">
        </el-table-column> -->
        <el-table-column prop="account" label="ACCOUNT" width="100"> </el-table-column>
        <el-table-column prop="subaccount" label="SUBACCOUNT" width="130">
        </el-table-column>
        <el-table-column prop="product" label="PRODUCT" width="100"> </el-table-column>
        <el-table-column prop="region" label="REGION" width="100"> </el-table-column>
        <el-table-column prop="channel" label="CHANNEL" width="100"> </el-table-column>
        <el-table-column prop="icp" label="ICP"> </el-table-column>
        <!-- <el-table-column prop="spare" label="SPARE"> </el-table-column> -->
        <el-table-column prop="debit" label="Debit" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.debit"
              :disabled="scope.row.updateFlag !== 'Y'"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="credit" label="Credit" width="150" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.credit"
              :disabled="scope.row.updateFlag !== 'Y'"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="batchName"
          label="Batch Name"
          width="120"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="batchDescription"
          label="Batch Description"
          width="150"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="journalName"
          label="Journal Name"
          width="150"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="journalDescription"
          label="Journal Description"
          width="200"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="lineDescription"
          label="Line Description"
          width="150"
          show-overflow-tooltip
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
        <el-table-column prop="accountingDate" label="Accounting Date"> </el-table-column>
        <el-table-column prop="period" label="Period"> </el-table-column>
        <el-table-column prop="company" label="COMPANY"> </el-table-column>
        <el-table-column prop="costcenter" label="COSTCENTER"> </el-table-column>
        <el-table-column prop="account" label="ACCOUNT"> </el-table-column>
        <el-table-column prop="subaccount" label="SUBACCOUNT"> </el-table-column>
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
        <el-table-column prop="journalName" label="Journal Name"> </el-table-column>
        <el-table-column prop="journalDescription" label="Journal Description">
        </el-table-column>
        <el-table-column prop="lineDescription" label="Line Description">
        </el-table-column>
      </el-table>
    </div>
    <!-- <fs-list-panel :columns="columns" :listData="listData"> </fs-list-panel> -->
    <div class="bookDetialButton">
      <el-button
        :loading="editLoading"
        @click="handleEditClick"
        :disabled="canEdit"
        v-if="hasFeaturePermission"
        >账务修改</el-button
      >
      <el-button
        :loading="loading"
        plain
        @click="handleCheck"
        :disabled="canEdit"
        v-if="hasFeaturePermission"
        >账务下发</el-button
      >
    </div>
  </div>
</template>

<script>
import { $http } from "@/utils/request";
import api from "@/utils/api";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { getYearMonthDate } from "@/utils/utils";

export default {
  data() {
    return {
      // flag: 0,
      form: {
        contractType: "",
        contractNoBegin: "",
        contractNoEnd: "",
        contractClass: "",
        cedent: "",
        contractTimeBegin: "",
        contractTimeEnd: "",
        estimateMonth: "",
        accountType: "",
        reverseFlag: "",
        accountDate: "",
        accountBatch: "",
        journalDescription: "",
        accountCode: "",
        productCode: "",
        accountClass: "",
        postFlag: "",
        projectId: "",
      },
      companyList: [],
      loading: false,
      editLoading: false,
      EBSSummaryForm: {
        balanceType: "",
        category: "",
        source: "",
        chartOfAccounts: "",
      },
      initEBSSummaryForm: {
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
      canEdit: true,
      activeNames: ["2"],
      ebsModifyList: [],
      canEditflag: 0,
      // selectable: false
      showBtn: sessionStorage.getItem("projectIdJournal"),
    };
  },
  computed: {
    hasFeaturePermission() {
      return JSON.parse(localStorage.getItem("localpermissionList")).find(
        (x) => x.permissionValue === "finance:business:financialSearch"
      );
    },
  },
  methods: {
    init() {
      $http.get("/estimate/partnerQuery").then((res) => {
        this.companyList = res.data.data.partnerList;
      });
      if (sessionStorage.getItem("projectIdJournal")) {
        this.form.accountClass = "I17 sub-ledger";
        this.form.projectId = sessionStorage.getItem("projectIdJournal");
        this.handleSearchProjectClick();
      }
    },

    selectable(row) {
      if (row.updateFlag !== "Y") {
        return false;
      } else {
        return true;
      }
    },
    handleSearchClick() {
      let params = {};
      params = {
        contractType: this.form.contractType,
        contractNoBegin: this.form.contractNoBegin,
        contractNoEnd: this.form.contractNoEnd,
        contractClass: this.form.contractClass,
        cedent: this.form.cedent,
        contractTimeBegin: this.form.contractTimeBegin,
        contractTimeEnd: this.form.contractTimeEnd,
        estimateMonth:
          this.form.estimateMonth === "" ? "" : getYearMonthDate(this.form.estimateMonth),
        accountType: this.form.accountType,
        reverseFlag: this.form.reverseFlag,
        accountDate: this.form.accountDate,
        accountBatch: this.form.accountBatch,
        journalDescription: this.form.journalDescription,
        accountCode: this.form.accountCode,
        productCode: this.form.productCode,
        accountClass: this.form.accountClass,
        postFlag: this.form.postFlag,
        projectId: this.form.projectId,
      };
      params.estimateMonth =
        params.estimateMonth === "197001" ? "" : params.estimateMonth;
      this.loading = true;
      this.canEdit = true;
      console.log(params, "params");
      $http
        .post(api.ebsInfoQuery, params)
        .then((res) => {
          if (res.data.code === "0") {
            // console.log(res, "res");
            this.listData = res.data.data.ebsDetail || [];
            this.EBSSummaryForm = res.data.data.ebsSummary || this.initEBSSummaryForm;
            this.listData.forEach((item) => {
              // console.log(item);
              if (item.updateFlag == "Y") {
                this.canEdit = false;
              }
            });
          } else {
            console.log(res);
            this.$message.error(res.data.msg);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleSearchProjectClick() {
      let params = {
        accountClass: "I17 sub-ledger",
        projectId: sessionStorage.getItem("projectIdJournal"),
      };
      this.loading = true;
      this.canEdit = true;
      $http
        .post(api.ebsInfoQuery, params)
        .then((res) => {
          if (res.data.code === "0") {
            console.log(res, "res");
            this.listData = res.data.data.ebsDetail || [];
            this.EBSSummaryForm = res.data.data.ebsSummary || this.initEBSSummaryForm;
            this.listData.forEach((item) => {
              // console.log(item);
              if (item.updateFlag == "Y") {
                this.canEdit = false;
              }
            });
          } else {
            console.log(res);
            this.$message.error(res.data.msg);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleResetClick() {
      this.form = {
        contractType: "",
        contractNoBegin: "",
        contractNoEnd: "",
        contractClass: "",
        cedent: "",
        contractTimeBegin: "",
        contractTimeEnd: "",
        estimateMonth: "",
        accountType: "",
        reverseFlag: "",
        accountDate: "",
        accountBatch: "",
        journalDescription: "",
        accountCode: "",
        productCode: "",
        accountClass: "",
        postFlag: "",
        productId: "",
      };
    },
    handleSelectionChange(val) {
      console.log(val, "val");
      this.ebsModifyList = val;
    },
    handleEditClick() {
      let paramsList = [];
      this.ebsModifyList.forEach((item) => {
        paramsList.push({
          recId: item.recId,
          debit: item.debit,
          credit: item.credit,
        });
      });
      console.log(paramsList, "ebsModifyListebsModifyListebsModifyList");
      this.editLoading = true;
      $http
        .post(api.ebsInfoModify, {
          ebsModifyList: paramsList,
        })
        .then((res) => {
          if (res.data.code === "0") {
            this.$message.success("修改成功");
            this.handleSearchClick();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .finally(() => {
          this.editLoading = false;
        });
    },
    handleCheck() {
      this.loading = true;
      let ebsPushList = [];
      this.ebsModifyList.forEach((item) => {
        ebsPushList.push({
          recId: item.recId,
        });
      });
      console.log(ebsPushList, "ebsPushList");
      $http
        .post(api.ebsInfoPush, {
          ebsPushList: ebsPushList,
        })
        .then((res) => {
          console.log(res);
          if (res.data.code === "0") {
            this.$message.success("成功");
            this.handleSearchClick();
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
    handleBack() {
      this.$router.push("/projectListQuery");
    },
    handleChange(val) {
      console.log(val);
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
    height: 35px;
    margin-right: 10px;
    margin-bottom: 10px;
    .dbtn {
      float: right;
    }
  }
  .collapseSearch {
    padding: 10px;
    background-color: #fff;
    .searchBox {
      position: relative;
      display: flex;
      flex-flow: column;
      width: 100%;
      height: auto;
      // height: 200px;
      // border: 1px solid #ccc;
      // border-top: 3px solid #ccc;
      padding: 10px;
      .el-form {
        .el-form-item {
          display: inline-flex;
          width: 250px;
          .el-form-item__content {
            margin-left: 0 !important;
          }
        }
        .el-form-item.el-form-item--small.month-range {
          width: 550px;
          .el-form-item__content .el-date-editor {
            width: 220px;
          }
        }
        // .el-form-item--small {
        //   width: 271px;
        // }
        .el-form-item__label {
          font-size: 12px;
        }
        .el-form-item__content {
          flex: 1;
          .el-cascader {
            width: 100%;
          }
          .el-date-editor {
            width: 100%;
            padding-left: 5px;
            padding-right: 5px;
          }
        }
      }
      .searchFoot {
        .searchButton {
          float: right;
        }
      }
    }
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
