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
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small"
              >修改</el-button
            >
            <el-button @click="handleDelete(scope.row)" type="text" size="small"
              >删除</el-button
            >
          </template>
        </el-table-column>
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
    <el-dialog title="编辑" :visible.sync="showEditForm">
      <el-form ref="editForm" :model="editForm" style="overflow: auto">
        <el-form-item label="IFRS17 methodology flag (e.g. GMM, PAA)">
          <el-input v-model="editForm.methodologyFlag" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="Level of Aggregation (IFRS 17 group tagging)">
          <el-input v-model="editForm.levelOfAggregation" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="IFRS17 group tagging - Inception date">
          <el-input v-model="editForm.inceptionDate" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="IFRS17 group tagging - Expiry date">
          <el-input v-model="editForm.expiryDate" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="IFRS17 group tagging - Currency">
          <el-input v-model="editForm.currency" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="IFRS17 group tagging - Onerosity">
          <el-input v-model="editForm.onerosity" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="IFRS17 group tagging - Portfolio">
          <el-input v-model="editForm.portfolio" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="Type of contract">
          <el-input v-model="editForm.typeOfContract" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="Total Premium Written (EPI)">
          <el-input v-model="editForm.epi" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="	Commission type">
          <el-input v-model="editForm.commissionType" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="Actual Premium Received for Current & Future Service">
          <el-input
            v-model="editForm.actualPremiumReceived"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="Paid Claims and ALAE">
          <el-input v-model="editForm.paidClaimsAndALAE" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="Actual commissions paid">
          <el-input
            v-model="editForm.actualCommissionsPaid"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="Paid acquisition and maintenance expenses">
          <el-input
            v-model="editForm.paidAcquisitionAndMaintenanceExpenses"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="Attributable/non-attributable classification">
          <el-input
            v-model="editForm.attributableClassification"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="Acquisition/maintenance classification ">
          <el-input
            v-model="editForm.acquisitionClassification"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="Loss ratio (LRC)">
          <el-input v-model="editForm.lossRatioLRC" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="Loss ratio (LIC)">
          <el-input v-model="editForm.lossRatioLIC" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="Coverage Units">
          <el-input v-model="editForm.coverageUnits" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="Current period discount rates">
          <el-input
            v-model="editForm.currentPeriodDiscountRates"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="Risk adjustment ratios (GMM)">
          <el-input
            v-model="editForm.riskAdjustmentRatios"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="Locked-in Rate">
          <el-input v-model="editForm.lockedInRate" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="P&L Rates curves">
          <el-input v-model="editForm.plRatesCurves" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="Maximum sliding scale commission ratio">
          <el-input
            v-model="editForm.maximumSlidingScaleCommissionRatio"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="Provisional sliding scale commission ratio">
          <el-input
            v-model="editForm.provisionalSlidingScaleCommissionRatio"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="Sliding scale commission ratio correponding to the incurred loss ratio"
        >
          <el-input
            v-model="editForm.slidingScaleCommissionRatio"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="Maximum profit commission ratio">
          <el-input
            v-model="editForm.maximumProfitCommissionRatio"
            style="width: 200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="父级合同组">
          <el-input v-model="editForm.parentGroup" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="合同组名称">
          <el-input v-model="editForm.groupName" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="合同分组主键">
          <el-input v-model="editForm.groupId" style="width: 200px"></el-input>
        </el-form-item>
      </el-form>
      <div class="dialogFoot" style="text-align: right">
        <el-button type="primary" size="mini" @click="handleCancel">取消</el-button>
        <el-button type="primary" size="mini" @click="handleClick">确认</el-button>
      </div>
    </el-dialog>
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
      contractGroupList: [],
      editForm: {
        methodologyFlag: "",
        levelOfAggregation: "",
        inceptionDate: "",
        expiryDate: "",
        currency: "",
        onerosity: "",
        portfolio: "",
        typeOfContract: "",
        epi: "",
        commissionType: "",
        actualPremiumReceived: "",
        paidClaimsAndALAE: "",
        actualCommissionsPaid: "",
        paidAcquisitionAndMaintenanceExpenses: "",
        attributableClassification: "",
        acquisitionClassification: "",
        lossRatioLRC: "",
        lossRatioLIC: "",
        coverageUnits: "",
        currentPeriodDiscountRates: "",
        riskAdjustmentRatios: "",
        plRatesCurves: "",
        maximumSlidingScaleCommissionRatio: "",
        provisionalSlidingScaleCommissionRatio: "",
        slidingScaleCommissionRatio: "",
        maximumProfitCommissionRatio: "",
        parentGroup: "",
        groupName: "",
        groupId: "",
      },
      showEditForm: false,
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
    handleSelectionChange(val) {
      console.log(val, "val");
      this.contractGroupList = val;
    },
    handleEdit(row) {
      this.showEditForm = true;
      this.editForm = {
        methodologyFlag: row.methodologyFlag,
        levelOfAggregation: row.levelOfAggregation,
        inceptionDate: row.inceptionDate,
        expiryDate: row.expiryDate,
        currency: row.currency,
        onerosity: row.onerosity,
        portfolio: row.portfolio,
        typeOfContract: row.typeOfContract,
        epi: row.epi,
        commissionType: row.commissionType,
        actualPremiumReceived: row.actualPremiumReceived,
        paidClaimsAndALAE: row.paidClaimsAndALAE,
        actualCommissionsPaid: row.actualCommissionsPaid,
        paidAcquisitionAndMaintenanceExpenses: row.paidAcquisitionAndMaintenanceExpenses,
        attributableClassification: row.attributableClassification,
        acquisitionClassification: row.acquisitionClassification,
        lossRatioLRC: row.lossRatioLRC,
        lossRatioLIC: row.lossRatioLIC,
        coverageUnits: row.coverageUnits,
        currentPeriodDiscountRates: row.currentPeriodDiscountRates,
        riskAdjustmentRatios: row.riskAdjustmentRatios,
        plRatesCurves: row.plRatesCurves,
        maximumSlidingScaleCommissionRatio: row.maximumSlidingScaleCommissionRatio,
        provisionalSlidingScaleCommissionRatio:
          row.provisionalSlidingScaleCommissionRatio,
        slidingScaleCommissionRatio: row.slidingScaleCommissionRatio,
        maximumProfitCommissionRatio: row.maximumProfitCommissionRatio,
        parentGroup: row.parentGroup,
        groupName: row.groupName,
        groupId: row.groupId,
      };
    },
    handleCancel() {
      this.showEditForm = false;
    },
    handleClick() {
      $http
        .post(api.groupModify, this.editForm)
        .then((res) => {
          if (res.data.code === "0") {
            this.$message.success("修改成功");
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .finally(() => {
          this.showEditForm = false;
        });
      this.showEditForm = false;
    },
    handleDelete(row) {
      $http
        .post(api.groupDelete, {
          groupId: row.groupId,
        })
        .then((res) => {
          if (res.data.code === "0") {
            this.$message.success("删除成功");
            this.init();
          } else {
            this.$message.error(res.data.msg);
          }
        });
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
<style lang="scss" scoped>
.financialSearch {
  .el-form-item {
    // float: left;
    width: 660px;
    float: left;
  }
}
</style>
