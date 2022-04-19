<template>
  <div class="financialSearch">
    <div class="searchBox">
      <div class="searchMain">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="合同类型">
            <el-select v-model="form.contractType" placeholder="请选择">
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
            <el-select v-model="form.cedent" placeholder="请选择">
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
          <el-form-item label="合同类别">
            <el-select v-model="form.contractClass" placeholder="请选择">
              <el-option label="分入" value="AB"></el-option>
              <el-option label="分出" value="opr"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="做账时间">
            <el-input v-model="form.estimateMonth"></el-input>
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
          <el-button
            :loading="loading"
            size="mini"
            type="primary"
            @click="handleSearchAll"
            style="margin-left: 5px"
            >预估账务总览查询</el-button
          >
          <el-button size="mini" @click="handleResetClick">重置</el-button>
        </div>
      </div>
    </div>
    <div class="listBox">
      <el-table :data="currentPageData" border style="width: 100%">
        <el-table-column fixed prop="contractNo" label="合同号">
        </el-table-column>
        <el-table-column prop="contractType" label="合同类型">
        </el-table-column>
        <el-table-column prop="planName" label="主险种"> </el-table-column>
        <el-table-column prop="cedentName" label="分入公司"> </el-table-column>
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
            <span>{{ toPercentData(scope.row.brokerageRate) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cedentRate" label="分出比例">
          <template slot-scope="scope">
            <span>{{ toPercentData(scope.row.cedentRate) }}</span>
          </template></el-table-column
        >
        <!-- <el-table-column prop="estimateStatus" label="预估状态">
        </el-table-column> -->

        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              @click="handleFinancialAccounting(scope.row)"
              type="text"
              size="small"
              >财务入账</el-button
            >
            <el-button
              @click="handleCalculateAccounting(scope.row)"
              type="text"
              size="small"
              >精算入账</el-button
            >
            <el-button
              @click="historyAccounting(scope.row)"
              type="text"
              size="small"
              >历史账务</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="listPagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          @prev-click="prevPage"
          @next-click="nextPage"
          @current-change="handleCurrentChange"
          :page-size="2"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { $http } from "@/utils/request";
import api from "@/utils/api";
import { kiloSplit, toPercent } from "@/utils/utils";

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
        estimateMonth: "",
        contractClass: "",
      },
      currentPageData: [],
      tableData: [],
      companyList: [],
    };
  },
  methods: {
    // ...mapActions('actuarial/actuarialEstimates', ['handleSearch']),
    init() {
      $http.get("/estimate/partnerQuery").then((res) => {
        console.log(res, "queryCompany");
        this.companyList = res.data.data.partnerList;
      });
      // $http
      //   .get("http://yapi.smart-xwork.cn/mock/134845/estimate/partnerQuery")
      //   .then((res) => {
      //     console.log(res, "queryCompany");
      //     this.companyList = res.data.data.partnerList;
      //   });
    },
    toPercentData(data) {
      return toPercent(data);
    },
    kiloSplitData(data) {
      return kiloSplit(data);
    },
    handleSearchClick() {
      if (this.form.estimateMonth === "") {
        $http.post(api.contractAccountListQuery, this.form).then((res) => {
          // this.$message.success('');
          if (res.data.code === "0") {
            this.tableData = res.data.data.contractList;
            this.total = res.data.data.contractList.length;
            this.totalPage = Math.ceil(this.total / this.pageSize);
            this.totalPage = this.totalPage === 0 ? 1 : this.totalPage;
            this.setCurrentPageData();
          } else {
            this.$message.error(res.data.msg);
          }
        });
      } else {
        this.$message.warning("请去除做账月份");
      }
    },
    handleSearchAll() {
      if (this.form.estimateMonth !== "") {
        $http
          .post(api.contractAccountListQuery, {
            estimateMonth: this.form.estimateMonth,
          })
          .then((res) => {
            // this.$message.success('');
            if (res.data.code === "0") {
              this.tableData = res.data.data.contractList;
              this.total = res.data.data.contractList.length;
              this.totalPage = Math.ceil(this.total / this.pageSize);
              this.totalPage = this.totalPage === 0 ? 1 : this.totalPage;
              this.setCurrentPageData();
            } else {
              this.$message.error(res.data.msg);
            }
          });
      } else {
        this.$message.warning("请输入做账月份");
      }
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
    handleFinancialAccounting(row) {
      sessionStorage.setItem("estimateKey", row.estimateKey);
      sessionStorage.setItem("estimateMonth", this.form.estimateMonth);
      sessionStorage.setItem("contractKey", row.contractKey);
      sessionStorage.setItem("accountType", "0");
      this.$router.push("/bookedDetial");
    },
    handleCalculateAccounting(row) {
      sessionStorage.setItem("estimateKey", row.estimateKey);
      sessionStorage.setItem("estimateMonth", this.form.estimateMonth);
      sessionStorage.setItem("contractKey", row.contractKey);
      sessionStorage.setItem("accountType", "1");
      this.$router.push("/bookedDetial");
    },
    historyAccounting(row) {
      sessionStorage.setItem("estimateKey", row.estimateKey);
      sessionStorage.setItem("estimateMonth", this.form.estimateMonth);
      sessionStorage.setItem("contractKey", row.contractKey);
      sessionStorage.setItem("accountType", "");
      this.$router.push("/bookedDetial");
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
.financialSearch {
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

    padding: 50px 20px;
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
