<template>
  <div class="financial">
    <div class="searchBox">
      <div class="searchMain">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="操作人">
            <el-input v-model="form.userId"></el-input>
          </el-form-item>
          <el-form-item label="操作开始时间">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.operationDateBegin"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="操作结束时间">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.operationDateEnd"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="操作类别">
            <!-- <el-input v-model="form.operationTypeCode"></el-input> -->
            <el-select
              v-model="form.operationTypeCode"
              placeholder="请选择"
              clearable
              ><el-option
                v-for="item in this.operateList"
                :key="item.operationTypeCode"
                :label="item.operationTypeName"
                :value="item.operationTypeCode"
              >
              </el-option
            ></el-select>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" style="float: right" class="searchFoot">
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
    <div class="listBox">
      <el-button
        class="exportButton"
        type="primary"
        plain
        @click="handleExport('listBox', '导出信息')"
        >导出</el-button
      >
      <el-table :data="currentPageData" border style="width: 100%">
        <el-table-column prop="operationTime" label="操作时间">
        </el-table-column>
        <el-table-column prop="contractNo" label="操作合同号">
        </el-table-column>
        <el-table-column prop="contractTitle" label="操作合同标题">
        </el-table-column>
        <el-table-column prop="userId" label="操作人"> </el-table-column>
        <el-table-column prop="operationTypeName" label="操作方法">
        </el-table-column>

        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              @click="handleBeforeOperate(scope.row)"
              type="text"
              size="small"
              v-show="scope.row.detailFlag !== 'N'"
              >操作前明细</el-button
            >
            <el-button
              @click="handleAfterOperate(scope.row)"
              type="text"
              size="small"
              v-show="scope.row.detailFlag !== 'N'"
              >操作后明细</el-button
            >
            <!-- <el-button
              @click="handleAdjustType(scope.row)"
              type="text"
              size="small"
              >调整缴费方式</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
      <div class="listPagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @prev-click="prevPage"
          @next-click="nextPage"
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100, 1000]"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- <el-dialog title="选择修改" :visible.sync="showTypeDialog" width="500px">
      <el-select v-model="payTypeInfo" placeholder="请选择">
        <el-option label="年缴" value="annual"> </el-option>
        <el-option label="月缴" value="monthly"> </el-option>
      </el-select>
    </el-dialog> -->
  </div>
</template>

<script>
import { $http } from "@/utils/request";
// import { mapState, mapMutations } from "vuex";

import api from "@/utils/api";
import { kiloSplit, toPercent, getYearMonthDayDate } from "@/utils/utils";
import { getText } from "@/utils/dict.js";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";

export default {
  data() {
    return {
      form: {
        userId: "",
        operationDateBegin: "",
        operationDateEnd: "",
        operationTypeCode: "",
      },
      currentPageData: [],
      tableData: [],

      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      totalPage: 1,
      companyList: [],
      showTypeDialog: false,
      payTypeInfo: "",
      operateList: [],
    };
  },
  computed: {
    // ...mapState("financialView/audit", ["auditLogId"]),
  },
  methods: {
    // ...mapMutations("financialView/audit", ["SET_AUDITID"]),
    init() {
      $http.post(api.operationTypeQuery).then((res) => {
        this.operateList = res.data.data.operationTypeList;
      });
      this.handleSearchClick();
    },
    onSubmit() {
      console.log("submit!");
    },
    handleClick(row) {
      console.log(row);
    },
    handleSearchClick() {
      this.currentPage = 1;
      this.loading = true;
      console.log(this.form, "form");
      let params = {
        userId: this.form.userId,
        operationDateBegin: this.form.operationDateBegin,
        operationDateEnd: this.form.operationDateEnd,
        operationTypeCode: this.form.operationTypeCode,
        contractTimeBegin: this.form.contractTimeBegin,
      };
      if (this.form.operationDateBegin != "") {
        params.operationDateBegin = getYearMonthDayDate(
          this.form.operationDateBegin
        );
      }
      if (this.form.operationDateBegin === null) {
        params.operationDateBegin = "";
      }
      if (this.form.operationDateEnd != "") {
        params.operationDateEnd = getYearMonthDayDate(
          this.form.operationDateEnd
        );
      }
      if (this.form.operationDateEnd === null) {
        params.operationDateEnd = "";
      }
      $http
        .post(api.auditListQuery, params)
        .then((res) => {
          if (res.data.code === "0") {
            this.tableData = res.data.data.auditList;
            this.total = res.data.data.auditList.length;
            this.totalPage = Math.ceil(this.total / this.pageSize);
            this.totalPage = this.totalPage === 0 ? 1 : this.totalPage;
            console.log(this.totalPage, "this.totalPage");
            this.setCurrentPageData();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .finally(() => {
          this.loading = false;
        });
      this.setCurrentPageData();
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
    setCurrentPageData() {
      let begin = (this.currentPage - 1) * this.pageSize;
      let end = this.currentPage * this.pageSize;
      this.currentPageData = this.tableData.slice(begin, end);
    },
    prevPage() {
      console.log(this.currentPage);
      if (this.currentPage == 1) return;

      this.currentPage--;
      this.setCurrentPageData();
    },
    nextPage() {
      if (this.currentPage === this.totalPage) return;
      this.currentPage++;
      console.log(this.currentPage, "this.currentPage");
      this.setCurrentPageData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.setCurrentPageData();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.setCurrentPageData();
    },
    // 导出方法
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
    handleBeforeOperate(row) {
      // this.SET_AUDITID(row);
      sessionStorage.setItem("auditLogId", row.auditLogId);
      sessionStorage.setItem("opreatAudit", "before");
      sessionStorage.setItem('yahistoryShow', 'Y')
      if (row.operationTypeCode === "/estimate/actuarial/yearFeeRateAdjust") {
        this.$router.push("/auditLog/yearAudit");
      } else if (
        row.operationTypeCode === "/estimate/actuarial/monthFeeRateAdjust"
      ) {
        this.$router.push("/auditLog/monthAudit");
      } else if (
        row.operationTypeCode === "/estimate/finance/yearTotalEPIAdjust" ||
        row.operationTypeCode === "/estimate/finance/yearRateAdjust" ||
        row.operationTypeCode === "/estimate/finance/yearDetailEPIAdjust"
      ) {
        this.$router.push("/auditLog/annualEstimatesAudit");
      } else if (
        row.operationTypeCode === "/estimate/finance/monthTotalEPIAdjust" ||
        row.operationTypeCode === "/estimate/finance/monthDetailEPIAdjust" ||
        row.operationTypeCode === "/estimate/finance/monthRateAdjust"
      ) {
        this.$router.push("/auditLog/monthContractDetailAudit");
      }
    },
    handleAfterOperate(row) {
      sessionStorage.setItem("auditLogId", row.auditLogId);
      sessionStorage.setItem("opreatAudit", "after");
      if (row.operationTypeCode === "/estimate/actuarial/yearFeeRateAdjust") {
        this.$router.push("/auditLog/yearAudit");
      } else if (
        row.operationTypeCode === "/estimate/actuarial/monthFeeRateAdjust"
      ) {
        this.$router.push("/auditLog/monthAudit");
      } else if (
        row.operationTypeCode === "/estimate/finance/yearTotalEPIAdjust" ||
        row.operationTypeCode === "/estimate/finance/yearRateAdjust" ||
        row.operationTypeCode === "/estimate/finance/yearDetailEPIAdjust"
      ) {
        this.$router.push("/auditLog/annualEstimatesAudit");
      } else if (
        row.operationTypeCode === "/estimate/finance/monthTotalEPIAdjust" ||
        row.operationTypeCode === "/estimate/finance/monthDetailEPIAdjust" ||
        row.operationTypeCode === "/estimate/finance/monthRateAdjust"
      ) {
        this.$router.push("/auditLog/monthContractDetailAudit");
      }
    },
    handleAdjustType(row) {
      this.showTypeDialog = true;
      this.$http(api.contractPayModeAdjust, {
        contractKey: row.contractKey,
        payType: this.payTypeInfo,
      }).then((res) => {
        if (res.data.data.code === "0") {
          this.$message.success("修改成功");
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    handleResetClick() {
      this.form = {
        userId: "",
        operationDateBegin: "",
        operationDateEnd: "",
        operationTypeCode: "",
      };
    },
  },
  mounted() {},
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.init());
  },
};
</script>

<style lang="scss">
.financial {
  position: relative;
  background-color: #fff;
  .searchBox {
    position: relative;
    display: flex;
    flex-flow: column;
    width: 100%;
    height: auto;
    // height: 200px;
    border: 1px solid #ccc;
    border-top: 3px solid #ccc;
    padding: 10px;
    // .el-form {
    //   .el-form-item {
    //     width: 250px;
    //     float: left;
    //     margin-left: 20px;
    //     .el-form-item__label {
    //       // width: ;
    //     }
    //     .el-form-item__content {
    //     .el-input {}
    //     }
    //   }
    // }
    .el-form {
      .el-form-item {
        display: inline-flex;
        width: 250px;
        .el-form-item__content {
          margin-left: 0 !important;
        }
        // .require-date {
        //   span {
        //     margin-left: 2px;
        //     margin-right: 2px;
        //   }
        //   .el-date-editor.el-input {
        //     width: 225px;
        //   }
        // }
        // .amount-range {
        //   span {
        //     margin-left: 2px;
        //     margin-right: 2px;
        //   }
        //   .el-input.el-input--small.el-input--suffix {
        //     width: 80px;
        //   }
        // }
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
  .listBox {
    border-top: 3px solid #ccc;
    position: relative;

    padding: 20px 20px 50px 20px;
    .exportButton {
      float: right;
      margin-bottom: 10px;
    }
    .listPagination {
      // position: absolute;
      margin-top: 10px;
      float: right;
    }
  }
}
</style>
