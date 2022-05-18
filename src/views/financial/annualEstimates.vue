<template>
  <div class="annualEstimates">
    <div class="monthHeader">
      <el-button @click="handleExport('cwYearContract', '合同信息')"
        >导出</el-button
      >
      <el-button @click="handleBack">返回</el-button>
    </div>
    <div class="separateInfo">
      <h2>合同信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :ref="'cwYearContract'"
        :columns="columns"
        :listData="contractInfoList"
      ></fs-list-panel>
    </div>
    <div class="monthHeader">
      <el-button @click="handleExport('cwYearCendent', '分出信息')"
        >导出</el-button
      >
    </div>
    <div class="separateInfo">
      <h2>分出信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :ref="'cwYearCendent'"
        :columns="cedentColumns"
        :listData="cedentList"
      ></fs-list-panel>
    </div>
    <div class="monthHeader">
      <el-button @click="handleExport('cwWorkSheet', '分入账单信息')"
        >导出</el-button
      >
    </div>
    <div class="separateInfo">
      <h2>分入账单信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :ref="'cwWorkSheet'"
        :columns="workSheetColumns"
        :listData="workSheetList"
      ></fs-list-panel>
    </div>
    <div class="separateInfo">
      <h2>EPI拆分</h2>
      <el-divider></el-divider>
      <div class="adjustHeader">
        <div class="adjustBox" v-if="historyShow !== '1'">
          <div class="adjustName"><span>总EPI：</span></div>
          <div class="input"><el-input v-model="totalEPI"></el-input></div>
        </div>
        <el-button
          v-if="historyShow !== '1'"
          type="primary"
          :loading="adjustLoading"
          round
          class="adjustButton"
          @click="handleTotalEPI"
          >调整</el-button
        >
        <el-button
          type="primary"
          plain
          class="historyQuery"
          @click="handleHistoryQuery"
          >查看历史</el-button
        >
        <el-button class="historyQuery" @click="handleExport('epiData', 'epi')"
          >导出</el-button
        >
      </div>
      <el-table
        ref="epiData"
        :data="EPIData"
        border
        :summary-method="getSummaries"
        show-summary
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="calculatMonth" label="计算月份" width="180">
        </el-table-column>
        <el-table-column prop="calculatedEPI" label="计算后EPI">
          <template slot-scope="scope">
            <span> {{ kiloSplitData(scope.row.calculatedEPI) }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="originEPI" label="原始EPI">
          <template slot-scope="scope">
            <span> {{ kiloSplitData(scope.row.originEPI) }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="manualAdjustEPI" label="EPI调整">
          <template slot-scope="scope">
            <span v-if="historyShow === '1'">
              {{ scope.row.manualAdjustEPI }}</span
            >
            <el-input
              v-else
              placeholder="请输入内容"
              v-model="scope.row.manualAdjustEPI"
              :disabled="Number(scope.row.calculatMonth) < estimateMonth"
            ></el-input>
            <!-- {{ scope.row + '++++++++++++++++'}} -->
            <!-- <span v-show="!scope.row.show">{{scope.row.tab1}}</span> -->
          </template>
        </el-table-column>
        <el-table-column prop="workSheetAmount" label="实际账单金额">
        </el-table-column>
        <el-table-column prop="workSheetAdjustEPI" label="实际账单调整">
        </el-table-column>
        <el-table-column prop="sumAmount" label="合计">
          <template slot-scope="scope">
            <span> {{ kiloSplitData(scope.row.sumAmount) }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="cumulativeAmount" label="累计">
          <template slot-scope="scope">
            <span> {{ kiloSplitData(scope.row.cumulativeAmount) }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="totalPremium" label="预估+实际">
          <template slot-scope="scope">
            <span> {{ kiloSplitData(scope.row.totalPremium) }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="actuarialAmount" label="精算计算金额">
          <template slot-scope="scope">
            <span> {{ kiloSplitData(scope.row.actuarialAmount) }} </span>
          </template>
        </el-table-column>
      </el-table>
      <span
        >温馨提示：每月6号前调整的可调整上月EPI，每月6号后只能调整本月EPI</span
      >
      <br />
      <el-button
        v-if="historyShow !== '1'"
        class="EPIbutton"
        @click="handleAdjustEPI"
        :loading="saveLoading"
        >保存调整后的EPI</el-button
      >
    </div>
    <div class="separateInfo">
      <h2>计算后预估费用明细</h2>
      <el-divider></el-divider>
      <div class="adjustHeader">
        <div class="adjustBox" v-if="historyShow !== '1'">
          <div class="adjustName"><span>分入浮动因子：</span></div>
          <div class="input">
            <el-input v-model="iabSlidingScaleAdjustRate"></el-input>
          </div>
          <div class="adjustName"><span>分出浮动因子：</span></div>
          <div class="input">
            <el-input v-model="orpSlidingScaleAdjustRate"></el-input>
          </div>
        </div>
        <el-button
          v-if="historyShow !== '1'"
          type="primary"
          :loading="checkLoading"
          round
          class="adjustButton"
          @click="handleFloatAdjust"
          >确定</el-button
        >
        <el-button
          style="float: right"
          @click="handleExport('adjustForm', '计算后预估费用明细')"
          >导出</el-button
        >
      </div>
      <!-- {{ this.lastList }} -->
      <el-table :data="lastList" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="company" label="公司" width="200" fixed="left">
        </el-table-column>
        <el-table-column prop="calculatItem" label="计算项目" width="220" fixed="left">
        </el-table-column>
        <el-table-column prop="currencyCode" label="币种"> </el-table-column>
        <el-table-column
          width="200"
          v-for="(item, index) in calculatedFeeList"
          :key="index"
          :prop="item.calculatMonth"
          :label="item.calculatMonth"
        >
          <template slot-scope="scope">
            <span>{{ kiloSplitData(scope.row[item.calculatMonth]) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        ref="adjustForm"
        :data="lastList"
        border
        style="width: 100%; margin-top: 20px"
        v-show="false"
      >
        <el-table-column prop="company" label="公司" width="200">
        </el-table-column>
        <el-table-column prop="calculatItem" label="计算项目" width="220">
        </el-table-column>
        <el-table-column prop="currencyCode" label="币种"> </el-table-column>
        <el-table-column
          width="200"
          v-for="(item, index) in calculatedFeeList"
          :key="index"
          :prop="item.calculatMonth"
          :label="item.calculatMonth"
        >
          <template slot-scope="scope">
            <span>{{ kiloSplitData(scope.row[item.calculatMonth]) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button plain class="checkDetial" @click="handleDetial"
      >查看入账明细</el-button
    >
  </div>
</template>

<script>
import { $http } from "@/utils/request";
import api from "@/utils/api";
import { kiloSplit } from "@/utils/utils";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
// import exportButton from "@/components/exportButton.vue";

export default {
  // components: {
  //   exportButton,
  // },
  data() {
    return {
      estimateMonth: sessionStorage.getItem("estimateMonth"),
      historyShow: sessionStorage.getItem("licl"),

      adjustLoading: false,
      saveLoading: false,
      checkLoading: false,
      totalEPI: "0",
      separateForm: {},
      columns: [
        {
          title: "合同号",
          property: "contractNo",
        },
        {
          title: "合同session",
          property: "sessionName",
        },
        {
          title: "合同类型",
          property: "contractType",
        },
        {
          title: "主险种",
          property: "planName",
        },
        {
          title: "分入公司",
          property: "cedentName",
        },
        {
          title: "再保公司",
          property: "reinsurerName",
        },
        {
          title: "经纪人",
          property: "broker",
        },
        {
          title: "经纪费比例",
          property: "brokerageRate",
          formatter: "toPercent",
        },
        {
          title: "合同有效期开始",
          property: "effectivePeriodBegin",
        },
        {
          title: "合同有效期结束",
          property: "effectivePeriodEnd",
        },
        {
          title: "缴费方式",
          property: "payType",
        },
        {
          title: "预估保费",
          property: "epi",
          formatter: "kiloSplit",
        },
        {
          title: "手续费比例",
          property: "commissionRate",
          formatter: "toPercent",
        },
        {
          title: "分出比例",
          property: "cedentRate",
          formatter: "toPercent",
        },
        {
          title: "预估状态",
          property: "estimateStatus",
          formatter: "dict",
          dictName: "estimateStatus",
        },
        // {
        //   title: "预估维度键值",
        //   property: "estimateKey",
        // },
        {
          title: "分入浮动因子",
          property: "iabSlidingScaleAdjustRate",
          formatter: "toPercent",
        },
        {
          title: "分出浮动因子",
          property: "orpSlidingScaleAdjustRate",
          formatter: "toPercent",
        },
        {
          title: "预估月份",
          property: "estimateMonth",
        },
      ],
      contractInfoList: [],
      cedentColumns: [
        {
          title: "转分合同",
          property: "occContractNo",
        },
        {
          title: "分出合同号",
          property: "orpContractNo",
        },
        {
          title: "分出公司编码",
          property: "orpPartnerCode",
        },
        {
          title: "分出公司名称",
          property: "orpPartnerName",
        },
        {
          title: "分出公司比例",
          property: "orpRate",
          formatter: "toPercent",
        },
      ],
      cedentList: [],
      workSheetColumns: [
        {
          title: "账单号",
          property: "workSheetNo",
        },
        {
          title: "账单日期",
          property: "workSheetDate",
        },
        {
          title: "账单险种",
          property: "planDetailCode",
        },
        {
          title: "账单类型编码",
          property: "entryCode",
        },
        {
          title: "账单类型名称",
          property: "entryName",
        },
        {
          title: "帐单币种",
          property: "currencyCode",
        },
        {
          title: "账单金额",
          property: "amount",
        },
        {
          title: "账单开始时间",
          property: "acStartDate",
        },
        {
          title: "账单结束时间",
          property: "acEndDate",
        },
        {
          title: "账单状态",
          property: "workSheetStatus",
        },
      ],
      workSheetList: [],

      EPIData: [],
      calculatedFeeList: [],
      calculatedFeeList2: [],
      testList: [],
      lastList: [],
      calculatData: [],
      iabSlidingScaleAdjustRate: "",
      orpSlidingScaleAdjustRate: "",
    };
  },

  methods: {
    init() {
      let params = sessionStorage.getItem("finAnnualEstimateKey");
      $http
        .post(api.yearContractDetailQuery, {
          estimateKey: params,
        })
        .then((res) => {
          if (res.data.code === "0") {
            console.log(res, "reseres");
            this.contractInfoList.push(res.data.data.contractInfo);
            this.cedentList = res.data.data.cedentList;
            this.workSheetList = res.data.data.workSheetList;
            this.totalEPI = res.data.data.epiSplitInfo.totalEPI;
            this.EPIData = res.data.data.epiSplitInfo.epiSplitList;
            this.calculatedFeeList = res.data.data.calculatedFeeList;
            this.calculatedFeeList2 = res.data.data.calculatedFeeList;

            this.iabSlidingScaleAdjustRate =
              res.data.data.contractInfo.iabSlidingScaleAdjustRate;
            this.orpSlidingScaleAdjustRate =
              res.data.data.contractInfo.orpSlidingScaleAdjustRate;
            this.handleFloatChange();
            // console.log(this.lastList, "lastListaaaa");
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    kiloSplitData(data) {
      return kiloSplit(data);
    },
    handleExport(data, filename) {
      this.exportBtn(data, filename);
      // console.log(this.$refs.exportTableRef1.$el);
    },
    handleBack() {
      // this.$router.go(-1);
      this.$router.push('/financialForecasts')
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          // console.log(sums[index], "sums[index]");
          sums[index] = kiloSplit(sums[index].toFixed(2)) + " 元";
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    handleHistoryQuery() {
      console.log("调整历史");
      this.$router.push("/yearAdjustDetail");
    },
    handleTotalEPI() {
      if (this.totalEPI === "") {
        this.$message.warning("请输入需要调整的总EPI");
        return;
      }
      this.adjustLoading = true;
      $http
        .post(api.yearTotalEPIAdjust, {
          totalEPI: this.totalEPI,
          estimateKey: sessionStorage.getItem("finAnnualEstimateKey"),
          estimateMonth: sessionStorage.getItem("finAnnualEstimateMonth"),
        })
        .then((res) => {
          if (res.data.code === "0") {
            this.contractInfoList = [];
            this.contractInfoList.push(res.data.data.contractInfo);
            this.cedentList = res.data.data.cedentList;
            this.workSheetList = res.data.data.workSheetList;
            this.totalEPI = res.data.data.epiSplitInfo.totalEPI;
            this.EPIData = res.data.data.epiSplitInfo.epiSplitList;
            this.calculatedFeeList = res.data.data.calculatedFeeList;
            this.calculatedFeeList2 = res.data.data.calculatedFeeList;
            this.iabSlidingScaleAdjustRate =
              res.data.data.contractInfo.iabSlidingScaleAdjustRate;
            this.orpSlidingScaleAdjustRate =
              res.data.data.contractInfo.orpSlidingScaleAdjustRate;
            this.handleFloatChange();
            this.$message.success("修改成功");
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .finally(() => {
          this.adjustLoading = false;
        });
    },
    handleAdjustEPI() {
      // console.log(this.EPIData, "EPIData");
      this.saveLoading = true;
      $http
        .post(api.yearDetailEPIAdjust, {
          yearEpiSplitList: this.EPIData,
          estimateKey: sessionStorage.getItem("finAnnualEstimateKey"),
          // estimateMonth: sessionStorage.getItem("estimateMonth"),
        })
        .then((res) => {
          if (res.data.code === "0") {
            this.contractInfoList = [];
            this.contractInfoList.push(res.data.data.contractInfo);
            this.cedentList = res.data.data.cedentList;
            this.workSheetList = res.data.data.workSheetList;
            this.totalEPI = res.data.data.epiSplitInfo.totalEPI;
            this.EPIData = res.data.data.epiSplitInfo.epiSplitList;
            this.calculatedFeeList = res.data.data.calculatedFeeList;
            this.calculatedFeeList2 = res.data.data.calculatedFeeList;
            this.iabSlidingScaleAdjustRate =
              res.data.data.contractInfo.iabSlidingScaleAdjustRate;
            this.orpSlidingScaleAdjustRate =
              res.data.data.contractInfo.orpSlidingScaleAdjustRate;
            this.handleFloatChange();
            this.$message.success("修改成功");
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .finally(() => {
          this.saveLoading = false;
        });
    },
    handleFloatChange() {
      this.lastList = [];
      // console.log(this.calculatedFeeList, "this.calculatedFeeList");
      var obj = {};
      this.calculatedFeeList = this.calculatedFeeList.reduce(function (
        item,
        next
      ) {
        obj[next.calculatMonth]
          ? ""
          : (obj[next.calculatMonth] = true && item.push(next));
        return item;
      },
      []);
      var obj2 = {};
      var calculatObj = {};
      this.testList = this.calculatedFeeList2.reduce(function (item, next) {
        obj2[next.company]
          ? ""
          : (obj2[next.company] = true && item.push(next));
        return item;
      }, []);
      let calculatItemList = this.calculatedFeeList2.reduce(function (
        item,
        next
      ) {
        calculatObj[next.calculatItem]
          ? ""
          : (calculatObj[next.calculatItem] = true && item.push(next));
        return item;
      },
      []);

      var result = [];
      var obj3 = {};
      console.log(
        calculatItemList,
        this.calculatedFeeList2,
        "this.calculatedFeeList2this.calculatedFeeList2this.calculatedFeeList2"
      );
      var obj4 = {};
      calculatItemList.forEach((item) => {
        obj4[item.calculatItem] = true;
      });
      console.log(obj4, "obj4obj4obj4obj4obj4");
      this.testList.forEach((e) => {
        this.calculatedFeeList2.forEach((i) => {
          if (e.company === i.company && obj4[i.calculatItem]) {
            result.push(i);
            obj3[i.calculatItem] = true;
            // console.log(obj3, "obj3");
          } else {
            console.log(i.company, "i.companyi.companyi.company");
          }
        });
      });
      for (var i = 0; i < result.length; i++) {
        //遍历原数组
        for (var j = i + 1; j < result.length; j++) {
          if (
            result[i].company === result[j].company &&
            result[i].calculatItem === result[j].calculatItem &&
            result[i].currencyCode === result[j].currencyCode
          ) {
            //数组中i下标后的j上有重复值，则用splice方法(可改变原数组)删除
            result.splice(j, 1);
            j--; //删除后下标-1
          }
        }
      }

      console.log(result, "resultresultresultresultresultresultresultresult");
      result.forEach((item) => {
        this.lastList.push({
          company: item.company,
          calculatItem: item.calculatItem,
          currencyCode: item.currencyCode,
        });
        // console.log(this.lastList, "lastList");
      });
      this.lastList.forEach((item) => {
        this.calculatedFeeList.forEach((element) => {
          item[element.calculatMonth] = 0;
        });
      });
      this.lastList.forEach((item) => {
        this.calculatedFeeList2.forEach((element) => {
          if (
            item.company === element.company &&
            item.calculatItem === element.calculatItem &&
            item.currencyCode === element.currencyCode
          ) {
            // console.log(item[element.calculatMonth], 'item[element.calculatMonth]');
            item[element.calculatMonth] = element.estimateAmount;
            // item.currencyCode = element.currencyCode;
            // console.log(element.calculatMonth, 'element');
          }
        });
      });
      // this.$set();
      console.log(this.lastList, "lastListaaaa");
      // this.$forceUpdate()
    },
    handleFloatAdjust() {
      if (
        Number(this.iabSlidingScaleAdjustRate) > 1 ||
        Number(this.orpSlidingScaleAdjustRate) > 1
      ) {
        this.$message.warning("浮动因子修改不能大于1");
      } else {
        this.checkLoading = true;
        $http
          .post(api.yearSlidingScaleRateAdjust, {
            iabSlidingScaleAdjustRate: this.iabSlidingScaleAdjustRate,
            orpSlidingScaleAdjustRate: this.orpSlidingScaleAdjustRate,
            estimateKey: sessionStorage.getItem("finAnnualEstimateKey"),
          })
          .then((res) => {
            if (res.data.code === "0") {
              this.contractInfoList = [];
              this.contractInfoList.push(res.data.data.contractInfo);
              this.cedentList = res.data.data.cedentList;
              this.workSheetList = res.data.data.workSheetList;
              this.totalEPI = res.data.data.epiSplitInfo.totalEPI;
              this.EPIData = res.data.data.epiSplitInfo.epiSplitList;
              this.calculatedFeeList = res.data.data.calculatedFeeList;
              this.calculatedFeeList2 = res.data.data.calculatedFeeList;
              this.iabSlidingScaleAdjustRate =
                res.data.data.contractInfo.iabSlidingScaleAdjustRate;
              this.orpSlidingScaleAdjustRate =
                res.data.data.contractInfo.orpSlidingScaleAdjustRate;
              this.handleFloatChange();
              this.$message.success("成功");

              // this.$forceUpdate();
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .finally(() => {
            this.checkLoading = false;
          });
      }
    },
    handleDetial() {
      sessionStorage.removeItem("bookDetialHistory");
      sessionStorage.setItem("accountType", "0");
      this.$router.push({path: '/bookedDetial', query: {type: 1}});
    },
    changtext(scope) {
      console.log(scope, "scope");
      // console.log(this.tableData, "tableData");
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
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.init());
  },
};
</script>
<style lang="scss" scoped>
.annualEstimates {
  .monthHeader {
    margin-bottom: 10px;
    float: right;
    margin-right: 10px;
    margin-top: 10px;
  }
  .separateInfo {
    padding: 10px;
    background-color: #fff;
    margin-bottom: 20px;
    h2 {
    }
    .adjustHeader {
      // display: flex;
      width: 100%;
      height: 50px;
      .adjustBox {
        float: left;
        .adjustName {
          // border: none;
          float: left;
          text-align: center;
          span {
            display: inline-block;
            margin-top: 5px;
          }
        }
        .input {
          float: left;
          margin-right: 20px;
        }
      }

      .adjustButton {
        margin-left: 10px;
      }
      .historyQuery {
        float: right;
      }
    }
    .EPIbutton {
      margin-left: 45%;
    }
  }
  .checkDetial {
    margin-left: 45%;
  }
}
</style>
