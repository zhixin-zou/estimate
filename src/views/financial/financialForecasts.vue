<template>
  <div class="financial">
    <div class="searchBox">
      <div class="searchMain">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="合同类型">
            <el-select
              v-model="form.contractType"
              placeholder="请选择"
              clearable
            >
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
          <el-form-item label="预估月份">
            <el-date-picker
              v-model="form.estimateMonth"
              type="month"
              placeholder="选择月"
              style="width: 100%"
            >
            </el-date-picker
          ></el-form-item>

          <el-form-item label="预估状态">
            <el-select
              v-model="form.estimateStatus"
              placeholder="请选择"
              clearable
            >
              <el-option label="待预估" value="0"></el-option>
              <el-option label="已入账" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="获取非0EPI记录" style="margin-left: 20px">
            <el-switch
              v-model="form.ifNotZero"
              active-color="#ff4949"
              inactive-color="#13ce66"
              active-value="N"
              inactive-value="Y"
            >
            </el-switch
          ></el-form-item>
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
        <el-table-column prop="contractNo" label="合同号"> </el-table-column>
        <el-table-column prop="sessionName" label="合同session">
        </el-table-column>
        <el-table-column prop="contractType" label="合同类型">
        </el-table-column>
        <el-table-column prop="planName" label="主险种"> </el-table-column>
        <el-table-column prop="productName" label="产品名称"> </el-table-column>
        <el-table-column prop="cedentName" label="分入公司"> </el-table-column>
        <el-table-column prop="effectivePeriodBegin" label="开始日期">
        </el-table-column>
        <el-table-column prop="effectivePeriodEnd" label="结束日期">
        </el-table-column>
        <el-table-column prop="payType" label="缴费方式">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.payType"
              @change="handleTypeChange(scope)"
              :disabled="scope.row.payType !== ''"
            >
              <el-option value="annual">annual</el-option>
              <el-option value="monthly">monthly</el-option>
            </el-select>
          </template>
        </el-table-column>
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
            <span>{{ toPercentData(scope.row.brokerageRate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cedentRate" label="分出比例">
          <template slot-scope="scope">
            <span>{{ toPercentData(scope.row.cedentRate) }}</span>
          </template></el-table-column
        >
        <el-table-column prop="estimateStatus" label="预估状态">
          <template slot-scope="scope">
            <span>{{ getDictData(scope.row.estimateStatus) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="estimateMonth" label="预估月份">
          <template slot-scope="scope">
            <span>{{ scope.row.estimateMonth }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              @click="handleFinancialClick(scope.row)"
              type="text"
              size="small"
              v-show="scope.row.payType !== ''"
              >预估计算</el-button
            >
            <el-button
              @click="handleHistoryClick(scope.row)"
              type="text"
              size="small"
              >历史预估</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-show="false"
        :data="currentPageData"
        border
        style="width: 100%"
        ref="listBox"
      >
        <el-table-column prop="contractNo" label="合同号"> </el-table-column>
        <el-table-column prop="estimateKey" label="合同预估id">
        </el-table-column>
        <el-table-column prop="sessionName" label="合同session">
        </el-table-column>
        <el-table-column prop="contractType" label="合同类型">
        </el-table-column>
        <el-table-column prop="planName" label="主险种"> </el-table-column>
        <el-table-column prop="productName" label="产品名称"> </el-table-column>
        <el-table-column prop="cedentName" label="分入公司"> </el-table-column>
        <el-table-column prop="effectivePeriodBegin" label="开始日期">
        </el-table-column>
        <el-table-column prop="effectivePeriodEnd" label="结束日期">
        </el-table-column>
        <el-table-column prop="payType" label="缴费方式">
          <!-- <template slot-scope="scope">
            <el-select
              v-model="scope.row.payType"
              @change="handleTypeChange(scope)"
              :disabled="scope.row.payType !== ''"
            >
              <el-option value="annual">annual</el-option>
              <el-option value="monthly">monthly</el-option>
            </el-select>
          </template> -->
        </el-table-column>
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
            <span>{{ toPercentData(scope.row.brokerageRate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cedentRate" label="分出比例">
          <template slot-scope="scope">
            <span>{{ toPercentData(scope.row.cedentRate) }}</span>
          </template></el-table-column
        >
        <el-table-column prop="estimateStatus" label="预估状态">
          <template slot-scope="scope">
            <span>{{ getDictData(scope.row.estimateStatus) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="estimateMonth" label="预估月份">
          <template slot-scope="scope">
            <span>{{ scope.row.estimateMonth }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              @click="handleFinancialClick(scope.row)"
              type="text"
              size="small"
              v-show="scope.row.payType !== ''"
              >预估计算</el-button
            >
            <el-button
              @click="handleHistoryClick(scope.row)"
              type="text"
              size="small"
              >历史预估</el-button
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
      <div class="uploadmodel">
        <span>数据填充：</span>
        <!-- <el-date-picker
          v-model="dataMonth"
          type="month"
          placeholder="选择月"
          style="width: 150px"
        >
        </el-date-picker> -->
        <el-button
          type="primary"
          :loading="importing"
          plain
          @click="handleUpload"
          >预估数据一键导入</el-button
        >
        <a
          href="javascript:;"
          style="color: #409eff; padding-left: 10px"
          @click="downloadFromBase64"
          >下载导数模板</a
        >
      </div>
      <div class="listPagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @prev-click="prevPage"
          @next-click="nextPage"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
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
    <input ref="file" type="file" class="hide" @change="fileChange" />
  </div>
</template>

<script>
import { $http } from "@/utils/request";
import api from "@/utils/api";
import { kiloSplit, toPercent, getYearMonthDate } from "@/utils/utils";
import { getText } from "@/utils/dict.js";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";

export default {
  data() {
    return {
      form: {
        contractType: "",
        contractNoBegin: "",
        contractNoEnd: "",
        cedent: "",
        contractTimeBegin: "",
        contractTimeEnd: "",
        estimateMonth: "",
        ifNotZero: "Y",
        estimateStatus: "",
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
      dataMonth: "",
      importing: false,
    };
  },
  methods: {
    init() {
      $http.get("/estimate/partnerQuery").then((res) => {
        console.log(res, "queryCompany");
        this.companyList = res.data.data.partnerList;
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
      this.loading = true;
      this.currentPage = 1;
      let params = {
        contractType: this.form.contractType,
        contractNoBegin: this.form.contractNoBegin,
        contractNoEnd: this.form.contractNoEnd,
        cedent: this.form.cedent,
        contractTimeBegin: this.form.contractTimeBegin,
        contractTimeEnd: this.form.contractTimeEnd,
        estimateMonth:
          this.form.estimateMonth === "" || null
            ? ""
            : getYearMonthDate(this.form.estimateMonth),
        ifNotZero: this.form.ifNotZero,
        estimateStatus: this.form.estimateStatus,
      };
      if (this.form.estimateMonth !== "") {
        params.estimateMonth = getYearMonthDate(this.form.estimateMonth);
      }
      if (this.form.estimateMonth === null) {
        params.estimateMonth = "";
      }
      console.log(this.form.estimateMonth, "this.form.estimateMonth", "");

      console.log(this.form, "form");
      $http
        .post("/estimate/finance/contractListQuery", params)
        .then((res) => {
          // this.$message.success(res.data.msg);
          if (res.data.code === "0") {
            this.tableData = res.data.data.contractList;
            // console.log(this.tableData, "tableData");
            // this.tableData.forEach((item) => {
            //   item.epi = kiloSplit(item.epi);
            //   // item.commissionRate = toPercent(item.commissionRate)
            //   // item.brokerageRate = toPercent(item.brokerageRate)
            //   // item.cedentRate = toPercent(item.cedentRate)
            // });
            this.total = res.data.data.contractList.length;
            this.totalPage = Math.ceil(this.total / this.pageSize);
            this.totalPage = this.totalPage === 0 ? 1 : this.totalPage;
            console.log(this.totalPage, "this.totalPage");
            console.log(this.currentPage, "this.currentPage");

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
    handleTypeChange(scope) {
      $http
        .post(api.contractPayModeAdjust, {
          contractKey: scope.row.contractKey,
          payType: scope.row.payType,
        })
        .then((res) => {
          if (res.data.code === "0") {
            this.$message.success("缴费类型更改成功");
          } else {
            this.$message.error("缴费类型更改失败");
          }
        });
      console.log(scope);
    },
    handleFinancialClick(row) {
      console.log(row.payType, "row.payTyperow.payTyperow.payType");
      localStorage.setItem("cwHistoryGoto", "financialForecasts");
      sessionStorage.removeItem("licl");
      // sessionStorage.setItem("estimateKey", row.estimateKey);
      // sessionStorage.setItem("estimateMonth", row.estimateMonth);
      // sessionStorage.setItem("contractKey", row.contractKey);
      console.log(row);
      if (row.payType === "annual") {
        if (row.estimateStatus === "3") {
          sessionStorage.setItem("licl", "1");
        } else {
          sessionStorage.removeItem("licl");
        }

        sessionStorage.setItem("finEstimateKey", row.estimateKey);
        sessionStorage.setItem("finEstimateMonth", row.estimateMonth);
        sessionStorage.setItem("finContractKey", row.contractKey);
        this.$router.push("/annualEstimates");
      } else if (row.payType === "monthly") {
        if (row.estimateStatus === "3") {
          sessionStorage.setItem("licl", "2");
        } else {
          sessionStorage.removeItem("licl");
        }

        sessionStorage.setItem("finEstimateKey", row.estimateKey);
        sessionStorage.setItem("finEstimateMonth", row.estimateMonth);
        sessionStorage.setItem("finContractKey", row.contractKey);
        this.$router.push("/monthContractDetail");
      }
    },
    handleHistoryClick(row) {
      sessionStorage.setItem("enterType", "in");
      sessionStorage.setItem("finHistoryEstimateKey", row.estimateKey);
      sessionStorage.setItem("finHistoryEstimateMonth", row.estimateMonth);
      sessionStorage.setItem("finHistoryContractKey", row.contractKey);
      // if (row.payType === "annual") {
      this.$router.push({ path: "/viewHistory" });
      // } else {
      //   this.$router.push("/monthHistory");
      // }
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
        contractType: "",
        contractNoBegin: "",
        contractNoEnd: "",
        cedent: "",
        contractTimeBegin: "",
        contractTimeEnd: "",
        estimateMonth: "",
        ifNotZero: "",
        estimateStatus: "",
      };
    },
    // handleDownload() {
    //   window.location = "./static/EPI导入模板.xlsx"; // 在项目中的文件地址
    // },
    handleUpload() {
      this.$refs["file"].click();
    },
    fileChange(e) {
      var target = e.target;
      if (target.files && target.files.length) {
        var data = new FormData();
        data.append("file", target.files[0]);
        this.importing = true;
        $http
          .post(api.saveEpi, data)
          .then((res) => {
            console.log(res);
            if (res.data.code === "0") {
              this.$message.success("导入成功");
            } else {
              if (res.data.msg !== "") {
                this.$message.error(res.data.msg);
              } else {
                this.$message.error("导入失败");
              }
            }
          })
          .finally(() => {
            this.importing = false;
            this.$refs.file.value = "";
          });
      }
    },
    b64toBlob(b64Data, contentType = "", sliceSize = 512) {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    },
    downloadFromBase64() {
      let b64Data =
        "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";
      let contentType = "application/octet-stream";
      const blob = this.b64toBlob(b64Data, contentType);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "EPI导入模板.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
    .uploadmodel {
      margin-top: 5px;
      float: left;
    }
    .listPagination {
      // position: absolute;
      margin-top: 10px;
      float: right;
    }
  }
}
</style>

<!-- <style scoped lang="scss">
::v-deep .el-icon-arrow-right:before {
  // content: "+";
  color: #1890ff;
  font-size: 20px;
  font-weight: 700px;
}
::v-deep .el-table__expand-icon .el-icon-arrow-right:before {
  content: "+";
}
::v-deep [class*="el-table__row--level"] .el-table__expand-icon {
  transform: rotate(0);
}
::v-deep .el-table__expand-icon--expanded .el-icon-arrow-right:before {
  content: "-";
}
::v-deep .el-table__placeholder::before {
  margin-left: 20px;
}
</style> -->
