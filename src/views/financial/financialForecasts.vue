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
            <!-- <el-button
              @click="handleAdjustType(scope.row)"
              type="text"
              size="small"
              >调整缴费方式</el-button
            > -->
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
        <el-table-column prop="estimateKey" label="estimateKey">
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
            if (res.code == 0) {
              this.$message.success("导入成功");
            } else {
              if (res.data.msg) {
                this.$message.error(res.data.msg);
              } else {
                this.$message.error(res.data.msg);
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
      let b64Data = "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"; // xlsx 文件的 base64 编码
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
