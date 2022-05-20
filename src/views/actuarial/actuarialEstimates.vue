<template>
  <div class="actuarialEstimates">
    <div class="searchBox">
      <div class="searchMain">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="合同类型">
            <el-select
              v-model="form.contractType"
              placeholder="请选择"
              clearable
            >
              <el-option label="比例合约" value="PROPTREATY "></el-option>
              <el-option label="非比例合约" value="NONPROPTREATY"></el-option>
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
      <el-table
        :data="currentPageData"
        border
        style="width: 100%"
        ref="listBox"
      >
        <el-table-column prop="contractNo" label="合同号"> </el-table-column>
        <el-table-column prop="sessionName" label="合同session">
        </el-table-column>
        <el-table-column prop="contractType" label="合同类型">
        </el-table-column>
        <el-table-column prop="planName" label="主险种"> </el-table-column>
        <el-table-column prop="productName" label="产品名称"> </el-table-column>
        <el-table-column prop="cedent" label="分入公司"> </el-table-column>
        <el-table-column prop="effectivePeriodBegin" label="开始日期">
        </el-table-column>
        <el-table-column prop="effectivePeriodEnd" label="结束日期">
        </el-table-column>
        <el-table-column prop="payType" label="缴费方式"> </el-table-column>
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
            <span>{{ toPercentData(scope.row.cedentRate) }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="estimateStatus" label="预估状态">
        </el-table-column> -->

        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              @click="handleFinancialClick(scope.row)"
              type="text"
              size="small"
              >预估计算</el-button
            >
            <el-button
              @click="handleHistoryClick(scope.row)"
              type="text"
              size="small"
              >历史预估</el-button
            >
            <el-button @click="handleBreak(scope.row)" type="text" size="small"
              >合同拆分</el-button
            >
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
          :page-size="this.pageSize"
          :page-sizes="[10, 20, 50, 100, 1000]"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <div class="calculateResult">
      <el-button plain @click="handleCalculate">结果汇算</el-button>
    </div>
    <el-dialog
      class="contractBreak"
      title="合同拆分"
      :visible.sync="contractBreak"
    >
      <el-button type="primary" plain @click="addNewRow">增加加一行</el-button>
      <el-table :data="contractBreakList" border style="width: 100%">
        <el-table-column prop="productCode" label="产品编码">
          <template slot-scope="scope">
            <el-select v-model="scope.row.productCode" placeholder="请选择">
              <el-option
                v-for="item in productList"
                :key="item.productCode"
                :label="item.productCode"
                :value="item.productCode"
              >
              </el-option>
            </el-select>
            <!-- <el-input
              placeholder="请输入内容"
              v-model="scope.row.productCode"
            ></el-input> -->
          </template>
        </el-table-column>
        <el-table-column prop="productName" label="产品名称">
          <template slot-scope="scope">
            <el-select v-model="scope.row.productName" placeholder="请选择">
              <el-option
                v-for="item in productList"
                :key="item.productName"
                :label="item.productName"
                :value="item.productName"
              >
              </el-option>
            </el-select>
          </template>
          ></el-table-column
        >
        <el-table-column prop="spiltPremium" label="拆分保费">
          <template slot-scope="scope">
            <el-input
              placeholder="请输入内容"
              v-model="scope.row.spiltPremium"
            ></el-input>
          </template> </el-table-column
      ></el-table>
      <el-button type="primary" @click="handleClick">确认</el-button>
    </el-dialog>
  </div>
</template>

<script>
import { $http } from "@/utils/request";
import { kiloSplit, toPercent } from "@/utils/utils";
import { getText } from "@/utils/dict.js";
import api from "@/utils/api";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";

// import { mapActions } from "vuex";

export default {
  data() {
    return {
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      totalPage: 1,
      form: {
        contractType: "",
        contractNoBegin: "",
        contractNoEnd: "",
        cedent: "",
        contractTimeBegin: "",
        contractTimeEnd: "",
      },
      currentPageData: [],
      tableData: [],
      companyList: [],
      productList: [],
      contractBreak: false,
      contractBreakList: [
        {
          productCode: "",
          productName: "",
          spiltPremium: "",
        },
      ],
    };
  },
  methods: {
    // ...mapActions('actuarial/actuarialEstimates', ['handleSearch']),
    init() {
      $http.post(api.productListQuery).then((res) => {
        this.productList = res.data.data.productList;
        console.log(
          this.productList,
          " this.productList this.productList this.productList this.productList"
        );
      });
      $http.get("/estimate/partnerQuery").then((res) => {
        this.companyList = res.data.data.partnerList;
        this.handleSearchClick();
      });
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
    handleSearchClick() {
      this.loading = true;

      // api.contractListQuery
      $http
        .post("/estimate/actuarial/contractListQuery", this.form)
        .then((res) => {
          // this.$message.success(res.data.msg);
          this.tableData = res.data.data.contractList;
          this.total = res.data.data.contractList.length;
          this.totalPage = Math.ceil(this.total / this.pageSize);
          this.totalPage = this.totalPage === 0 ? 1 : this.totalPage;
          this.setCurrentPageData();
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
        cedent: "",
        contractTimeBegin: "",
        contractTimeEnd: "",
      };
    },
    handleFinancialClick(row) {
      sessionStorage.removeItem("licl");
      console.log(row);
      if (row.payType === "annual") {
        sessionStorage.setItem("jsAnnualEstimateKey", row.estimateKey);
        sessionStorage.setItem("jsAnnualEstimateMonth", row.estimateMonth);
        sessionStorage.setItem("jsAnnualContractKey", row.contractKey);
        this.$router.push("/yearActuarial");
      } else {
        sessionStorage.setItem("jsMonthEstimateKey", row.estimateKey);
        sessionStorage.setItem("jsMonthEstimateMonth", row.estimateMonth);
        sessionStorage.setItem("jsMonthContractKey", row.contractKey);
        this.$router.push("/monthActuarial");
      }
    },
    handleHistoryClick(row) {
      if (row.payType === "annual") {
        sessionStorage.setItem("enterType", "jsyear");
        sessionStorage.setItem("jsNestimateKey", row.estimateKey);
        sessionStorage.setItem("jsNestimateMonth", row.estimateMonth);
        sessionStorage.setItem("jsNcontractKey", row.contractKey);
        this.$router.push({ path: "/viewHistory", query: { type: 3 } });
      } else {
        sessionStorage.setItem("enterType", "jsmonth");
        sessionStorage.setItem("jsYestimateKey", row.estimateKey);
        sessionStorage.setItem("jsYestimateMonth", row.estimateMonth);
        sessionStorage.setItem("jsYcontractKey", row.contractKey);
        this.$router.push({ path: "/viewHistory", query: { type: 4 } });
      }
    },
    // 合同拆分
    handleBreak(row) {
      sessionStorage.setItem("estimateKey", row.estimateKey);
      this.contractBreak = true;
    },
    // 假分页
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
    handleCurrentChange(page) {
      this.currentPage = page;
      this.setCurrentPageData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.setCurrentPageData();
    },
    handleCalculate() {
      this.$router.push("/calculationResult");
    },
    addNewRow() {
      this.contractBreakList.push({
        productCode: "",
        productName: "",
        spiltPremium: "",
      });
    },
    handleClick() {
      $http
        .post(api.premiumSplit, {
          estimateKey: sessionStorage.getItem("estimateKey"),
          splitDetail: this.contractBreakList,
        })
        .then((res) => {
          if (res.data.code === "0") {
            this.contractBreak = false;
            this.$message.success("成功");
          }
        })
        .finally(() => {
          this.contractBreakList = [
            {
              productCode: "",
              productName: "",
              spiltPremium: "",
            },
          ];
        });
    },
  },
  // mounted () {
  //   this.test()
  // },
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.init());
  },
};
</script>

<style lang="scss">
.actuarialEstimates {
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
  .calculateResult {
    margin-left: 45%;
    // margin-bottom: 20px;
    height: 50px;
  }
}
</style>
