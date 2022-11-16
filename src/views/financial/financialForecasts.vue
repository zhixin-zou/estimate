<template>
  <div class="financial">
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
            <el-select v-model="form.estimateStatus" placeholder="请选择" clearable>
              <el-option label="待预估" value="0"></el-option>
              <el-option label="已入账" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="缴费方式">
            <el-select v-model="form.payType" placeholder="请选择" clearable>
              <el-option value="annual">annual</el-option>
              <el-option value="monthly">monthly</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同session">
            <el-input v-model="form.sessionName"></el-input>
          </el-form-item>
          <el-form-item label="获取非0EPI记录" style="margin-left: 20px; width: 230px">
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
        <el-table-column prop="sessionName" label="合同session"> </el-table-column>
        <el-table-column prop="contractType" label="合同类型"> </el-table-column>
        <el-table-column prop="planName" label="主险种"> </el-table-column>
        <el-table-column prop="productName" label="产品名称"> </el-table-column>
        <el-table-column prop="cedentName" label="分入公司"> </el-table-column>
        <el-table-column prop="effectivePeriodBegin" label="开始日期"> </el-table-column>
        <el-table-column prop="effectivePeriodEnd" label="结束日期"> </el-table-column>
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
            <el-button @click="handleHistoryClick(scope.row)" type="text" size="small"
              >历史预估</el-button
            >
            <el-button
              @click="handleAddFinance(scope.row)"
              type="text"
              size="small"
              style="margin-left: 0"
              >新增预估</el-button
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
        <el-table-column prop="estimateKey" label="合同预估id"> </el-table-column>
        <el-table-column prop="sessionName" label="合同session"> </el-table-column>
        <el-table-column prop="contractType" label="合同类型"> </el-table-column>
        <el-table-column prop="planName" label="主险种"> </el-table-column>
        <el-table-column prop="productName" label="产品名称"> </el-table-column>
        <el-table-column prop="cedentName" label="分入公司"> </el-table-column>
        <el-table-column prop="effectivePeriodBegin" label="开始日期"> </el-table-column>
        <el-table-column prop="effectivePeriodEnd" label="结束日期"> </el-table-column>
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
            <el-button @click="handleHistoryClick(scope.row)" type="text" size="small"
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
        <el-button type="primary" :loading="importing" plain @click="handleUpload"
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
    <el-dialog title="新增预估" :visible.sync="showAddFinance" width="690px">
      <el-form ref="addForm" :model="addForm" style="overflow: hidden">
        <el-form-item
          label="合同号"
          style="float: left; width: 300px"
          label-width="100px"
        >
          <el-input v-model="addForm.contractNo" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item
          label="合同session"
          style="float: left; width: 300px"
          label-width="100px"
        >
          <el-input v-model="addForm.sessionName" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item
          label="合同类型"
          style="float: left; width: 300px"
          label-width="100px"
        >
          <el-select
            v-model="addForm.contractType"
            placeholder="请选择"
            clearable
            style="width: 200px"
          >
            <el-option label="比例合约" value="PROPTTY"></el-option>
            <el-option label="非比例合约" value="NONPROPTTY"></el-option>
            <el-option label="比例临分" value="PROPFAC"></el-option>
            <el-option label="非比例临分" value="NONPROPFAC"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="主险种"
          style="float: left; width: 300px"
          label-width="100px"
        >
          <el-input v-model="addForm.planCode" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item
          label="险种名称"
          style="float: left; width: 300px"
          label-width="100px"
        >
          <el-input v-model="addForm.planName" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item
          label="产品名称"
          style="float: left; width: 300px"
          label-width="100px"
        >
          <el-input v-model="addForm.productName" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item
          label="分入公司"
          style="float: left; width: 300px"
          label-width="100px"
        >
          <el-select v-model="addForm.cedent" placeholder="请选择" clearable>
            <el-option
              v-for="(item, index) in companyList"
              :key="index"
              :label="item.partnerName"
              :value="item.partnerCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="开始日期"
          style="float: left; width: 300px"
          label-width="100px"
        >
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="addForm.effectivePeriodBegin"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            style="width: 200px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="结束日期"
          style="float: left; width: 300px"
          label-width="100px"
        >
          <el-date-picker
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            v-model="addForm.effectivePeriodEnd"
            style="width: 200px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          label="缴费方式"
          style="float: left; width: 300px"
          label-width="100px"
        >
          <el-select
            v-model="addForm.payType"
            placeholder="请选择"
            clearable
            style="width: 200px"
          >
            <el-option value="annual">annual</el-option>
            <el-option value="monthly">monthly</el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="预估保费"
          style="float: left; width: 300px"
          label-width="100px"
        >
          <el-input v-model="addForm.epi" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item
          label="手续费比例"
          style="float: left; width: 300px"
          label-width="100px"
        >
          <el-input v-model="addForm.commissionRate" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item
          label="经纪费比例"
          style="float: left; width: 300px"
          label-width="100px"
        >
          <el-input v-model="addForm.brokerageRate" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item
          label="分出比例"
          style="float: left; width: 300px"
          label-width="100px"
        >
          <el-input v-model="addForm.cedentRate" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item
          label="预估状态"
          style="float: left; width: 300px"
          label-width="100px"
        >
          <el-select
            v-model="addForm.estimateStatus"
            placeholder="请选择"
            clearable
            style="width: 200px"
          >
            <el-option label="待预估" value="0"></el-option>
            <el-option label="已入账" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="预估月份"
          style="float: left; width: 300px"
          label-width="100px"
        >
          <el-date-picker
            v-model="addForm.estimateMonth"
            value-format="yyyyMM"
            type="month"
            placeholder="选择月"
            style="width: 200px"
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="dialogFoot" style="text-align: right">
        <el-button type="primary" size="mini" @click="handleCancel">取消</el-button>
        <el-button type="primary" size="mini" @click="handleClick">确认</el-button>
      </div>
    </el-dialog>
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
        payType: "",
        sessionName: "",
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
      showAddFinance: false,
      addForm: {
        contractNo: "",
        sessionName: "",
        contractType: "",
        planName: "",
        planCode: "",
        productName: "",
        reinsurer: "",
        broker: "",
        effectivePeriodBegin: "",
        effectivePeriodEnd: "",
        payType: "",
        epi: "",
        commissionRate: "",
        brokerageRate: "",
        cedentRate: "",
        commRate: "",
        provCommRate: "",
        profitCommRate: "",
        estimateMonth: "",
        estimateStatus: "",
        cedent: "",
        estimateKey: "",
        contractKey: "",
      },
    };
  },
  methods: {
    init() {
      $http.get("/estimate/partnerQuery").then((res) => {
        console.log(res, "queryCompany");
        this.companyList = res.data.data.partnerList;
      });
      if (sessionStorage.getItem("contractNoStart")) {
        this.form.contractNoBegin = sessionStorage.getItem("contractNoStart");
        this.form.contractNoEnd = sessionStorage.getItem("contractNoEnd");
      }
      this.handleSearchClick();
      sessionStorage.removeItem("contractNoStart");
      sessionStorage.removeItem("contractNoEnd");
    },
    onSubmit() {
      console.log("submit!");
    },
    handleClick() {
      console.log(this.addForm, "addform");
      $http.post(api.addContractEstimate, this.addForm).then((res) => {
        console.log(res, "res");
        if (res.data.code === "0") {
          this.$message.success("新增成功");
        } else {
          this.$message.error("新增失败");
        }
      });
      this.showAddFinance = false;
    },
    handleCancel() {
      this.showAddFinance = false;
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
        payType: this.form.payType,
        sessionName: this.form.sessionName,
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
    handleAddFinance(row) {
      console.log(row);
      (this.addForm.contractNo = row.contractNo || ""),
        (this.addForm.sessionName = row.sessionName || ""),
        (this.addForm.contractType = row.contractType || ""),
        (this.addForm.planName = row.planName || ""),
        (this.addForm.planCode = row.planCode || ""),
        (this.addForm.productName = row.productName || ""),
        (this.addForm.reinsurer = row.reinsurer || ""),
        (this.addForm.broker = row.broker || ""),
        (this.addForm.effectivePeriodBegin = row.effectivePeriodBegin || ""),
        (this.addForm.effectivePeriodEnd = row.effectivePeriodEnd || ""),
        (this.addForm.payType = row.payType || ""),
        (this.addForm.epi = row.epi || ""),
        (this.addForm.commissionRate = row.commissionRate || ""),
        (this.addForm.brokerageRate = row.brokerageRate || ""),
        (this.addForm.cedentRate = row.cedentRate || ""),
        (this.addForm.commRate = row.commRate || ""),
        (this.addForm.provCommRate = row.provCommRate || ""),
        (this.addForm.profitCommRate = row.profitCommRate || ""),
        (this.addForm.estimateMonth = row.estimateMonth || ""),
        (this.addForm.estimateStatus = row.estimateStatus || ""),
        (this.addForm.cedent = row.cedent || ""),
        (this.addForm.estimateKey = row.estimateKey || ""),
        (this.addForm.contractKey = row.contractKey || ""),
        (this.showAddFinance = true);
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
        payType: "",
        sessionName: "",
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

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
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
