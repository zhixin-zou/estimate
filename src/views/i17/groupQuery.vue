<template>
  <div class="financialSearch">
    <div class="searchBox">
      <div class="searchMain">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="合同组id">
            <el-input v-model="form.groupId"></el-input>
          </el-form-item>
          <el-form-item label="合同组名称">
            <el-input v-model="form.groupName"></el-input>
          </el-form-item>
          <el-form-item label="父级合同组">
            <el-input v-model="form.parentGroup"></el-input>
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
      <!-- <el-popover ref="config" placement="bottom" width="200" trigger="click">
            <el-checkbox
              class="table-col"
              v-for="col in columns"
              :key="col.property"
              v-model="col.show"
              >{{ col.title }}</el-checkbox
            >
          </el-popover> -->
      <!-- <el-button
              v-popover:config
              class="exportButton"
              style="margin-right: 10px"
              >自定义列</el-button
            > -->
      <!-- @selection-change="handleSelectionChange" -->
      <el-table
        :data="currentPageData"
        border
        style="width: 100%"
        ref="listBox"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          width="150"
          prop="methodologyFlag"
          label="IFRS17 methodology flag (e.g. GMM, PAA)"
        >
        </el-table-column>
        <el-table-column
          width="150"
          prop="levelOfAggregation"
          label="Level of Aggregation (IFRS 17 group tagging)"
        >
        </el-table-column>
        <el-table-column
          width="150"
          prop="inceptionDate"
          label="IFRS17 group tagging - Inception date"
        >
        </el-table-column>
        <el-table-column
          width="150"
          prop="expiryDate"
          label="IFRS17 group tagging - Expiry date"
        >
        </el-table-column>
        <el-table-column
          width="150"
          prop="currency"
          label="IFRS17 group tagging - Currency"
        >
        </el-table-column>
        <el-table-column
          width="150"
          prop="onerosity"
          label="IFRS17 group tagging - Onerosity"
        >
        </el-table-column>
        <el-table-column
          width="150"
          prop="portfolio"
          label="IFRS17 group tagging - Portfolio"
        >
        </el-table-column>
        <el-table-column width="150" prop="typeOfContract" label="Type of contract ">
        </el-table-column>
        <el-table-column width="150" prop="epi" label="Total Premium Written (EPI)">
        </el-table-column>
        <el-table-column width="150" prop="commissionType" label="Commission type ">
        </el-table-column>
        <el-table-column
          width="150"
          prop="actualPremiumReceived"
          label="Actual Premium Received for Current & Future Service"
        >
        </el-table-column>
        <el-table-column
          width="150"
          prop="paidClaimsAndALAE"
          label="Paid Claims and ALAE"
        >
        </el-table-column>
        <el-table-column
          width="150"
          prop="actualCommissionsPaid"
          label="Actual commissions paid"
        >
        </el-table-column>
        <el-table-column
          width="150"
          prop="paidAcquisitionAndMaintenanceExpenses"
          label="Paid acquisition and maintenance expenses"
        >
        </el-table-column>
        <el-table-column
          width="150"
          prop="attributableClassification"
          label="Attributable/non-attributable classification"
        >
        </el-table-column>
        <el-table-column
          width="150"
          prop="acquisitionClassification"
          label="Acquisition/maintenance classification"
        >
        </el-table-column>
        <el-table-column width="150" prop="lossRatioLRC" label="Loss ratio (LRC)">
        </el-table-column>
        <el-table-column width="150" prop="lossRatioLIC" label="Loss ratio (LIC)">
        </el-table-column>
        <el-table-column prop="coverageUnits" label="Coverage Units"> </el-table-column>
        <el-table-column
          width="150"
          prop="currentPeriodDiscountRates"
          label="Current period discount rates"
        >
        </el-table-column>
        <el-table-column
          width="150"
          prop="riskAdjustmentRatios	"
          label="Risk adjustment ratios (GMM)"
        >
        </el-table-column>
        <el-table-column width="150" prop="lockedInRate" label="Locked-in Rate">
        </el-table-column>
        <el-table-column prop="plRatesCurves" label="P&L Rates curves"> </el-table-column>
        <el-table-column
          width="150"
          prop="maximumSlidingScaleCommissionRatio"
          label="Maximum sliding scale commission ratio"
        >
        </el-table-column>
        <el-table-column
          width="150"
          prop="provisionalSlidingScaleCommissionRatio"
          label="Provisional sliding scale commission ratio"
        >
        </el-table-column>
        <el-table-column
          width="150"
          prop="slidingScaleCommissionRatio"
          label="Sliding scale commission ratio correponding to the incurred loss ratio"
        >
        </el-table-column>
        <el-table-column
          width="150"
          prop="maximumProfitCommissionRatio"
          label="Maximum profit commission ratio"
        >
        </el-table-column>
        <el-table-column width="150" prop="parentGroup" label="父级合同组">
        </el-table-column>
        <el-table-column width="150" prop="groupName" label="合同组名称">
        </el-table-column>
        <el-table-column width="150" prop="groupId" label="合同组id"> </el-table-column>
        <!-- <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="handleProjectJournal(scope.row)" type="text" size="small"
                >moodys子账</el-button
              >
              <el-button
                @click="handleProjectJournalPushRow(scope.row)"
                type="text"
                size="small"
                >生成ebs凭证</el-button
              >
              <el-button @click="handleJectJournal(scope.row)" type="text" size="small"
                >查看凭证信息</el-button
              >
            </template>
          </el-table-column> -->
      </el-table>
      <!-- @size-change="handleSizeChange" -->
      <div class="listPagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          @prev-click="prevPage"
          @next-click="nextPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100, 1000]"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <div class="checkGroup">
      <el-button @click="handleAddGroup">新增合同分组</el-button>
    </div>
  </div>
</template>

<script>
import { $http } from "@/utils/request";
import api from "@/utils/api";
import { kiloSplit, toPercent } from "@/utils/utils";
// import * as XLSX from "xlsx";
// import FileSaver from "file-saver";
// import { mapActions } from "vuex";

export default {
  data() {
    return {
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      totalPage: 1,
      showGroupDialog: false,
      groupValue: "",
      form: {
        groupId: "",
        groupName: "",
        parentGroup: "",
      },
      currentPageData: [],
      tableData: [],
      companyList: [],
      groupList: [],
      projectJournalList: [],
    };
  },
  methods: {
    // ...mapActions('actuarial/actuarialEstimates', ['handleSearch']),
    init() {
      this.handleSearchClick();
    },
    handleookedDetail() {},
    toPercentData(data) {
      return toPercent(data);
    },
    kiloSplitData(data) {
      return kiloSplit(data);
    },
    handleSearchClick() {
      this.currentPage = 1;
      this.loading = true;

      $http
        .post(api.groupQuery, this.form)
        // .post("http://yapi.smart-xwork.cn/mock/134845/ifrs17/groupInfoListQuery", this.form)
        .then((res) => {
          // this.$message.success('');
          if (res.data.code === "0") {
            this.tableData = res.data.data.groupInfoList;
            this.total = res.data.data.groupInfoList.length;
            this.totalPage = Math.ceil(this.total / this.pageSize);
            this.totalPage = this.totalPage === 0 ? 1 : this.totalPage;
            this.setCurrentPageData();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleResetClick() {
      this.form = {
        groupId: "",
        groupName: "",
        parentGroup: "",
      };
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.setCurrentPageData();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.setCurrentPageData();
    },
    handleAddGroup() {
      this.$router.push("/groupInfo");
    },
    // 导出方法
    // exportBtn(refProp, fname) {
    //   // 获取表格元素
    //   const el = this.$refs[refProp].$el;
    //   // 文件名
    //   console.log(this.$refs[refProp], "elelele");
    //   const filename = fname + ".xlsx";
    //   /* generate workbook object from table */
    //   const wb = XLSX.utils.table_to_book(el);
    //   /* get binary string as output */
    //   const wbout = XLSX.write(wb, {
    //     bookType: "xlsx",
    //     bookSST: true,
    //     type: "array",
    //   });
    //   try {
    //     FileSaver.saveAs(
    //       new Blob([wbout], { type: "application/octet-stream" }),
    //       filename
    //     );
    //   } catch (e) {
    //     console.log(e);
    //   }
    //   return wbout;
    // },
    // handleExport(data, filename) {
    //   this.exportBtn(data, filename);
    //   // console.log(this.$refs.exportTableRef1.$el);
    // },
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

    padding: 20px 20px 50px 20px;
    .exportButton,
    .selfButton {
      float: right;
      margin-bottom: 10px;
    }
    .listPagination {
      // position: absolute;
      margin-top: 10px;
      float: right;
    }
  }
  .checkGroup {
    text-align: center;
    padding-bottom: 20px;
  }
  .groupDialog {
    .dialogBody {
    }
    .dialogFoot {
      margin-top: 10px;
    }
  }
  .calculateResult {
    margin-left: 45%;
    // margin-bottom: 20px;
    height: 50px;
  }
}
</style>
