<template>
  <div class="separateEstimateDetial">
    <div class="separateInfo">
      <h2>分出合同信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :columns="columns"
        :listData="contractInfoList"
      ></fs-list-panel>
    </div>
    <div class="separateInfo">
      <h2>分入合同信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :columns="cedentColumns"
        :listData="cedentList"
      ></fs-list-panel>
    </div>
    <div class="separateInfo">
      <h2>分出账单信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :columns="workSheetColumns"
        :listData="workSheetList"
      ></fs-list-panel>
    </div>
    <div class="separateInfo">
      <h2>计算后预估费用明细</h2>
      <el-divider></el-divider>
      <!-- <div class="adjustHeader">
        <div class="adjustBox">
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
          type="primary"
          round
          class="adjustButton"
          @click="handleFloatAdjust"
          >确定</el-button
        >
      </div> -->
      <!-- {{ this.lastList }} -->
      <el-table
        :data="lastList"
        border
        :summary-method="getSummaries"
        show-summary
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="company" label="公司" width="180">
        </el-table-column>
        <el-table-column prop="calculatItem" label="计算项目">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in calculatedFeeList"
          :key="index"
          :prop="item.calculatMonth"
          :label="item.calculatMonth"
        >
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
export default {
  data() {
    return {
      estimateMonth: sessionStorage.getItem("estimateMonth"),
      totalEPI: "0",
      separateForm: {},
      columns: [
        {
          title: "合同号",
          property: "contractNo",
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
        },
        {
          title: "手续费比例",
          property: "commissionRate",
        },
        {
          title: "分出比例",
          property: "cedentRate",
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
          
        },
        {
          title: "分出浮动因子",
          property: "orpSlidingScaleAdjustRate",
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
      let params = sessionStorage.getItem("estimateKey");
      $http
        .post(api.orpContractDetailQuery, {
          estimateKey: params,
        })
        .then((res) => {
          if (res.data.code === "0") {
            this.contractInfoList = res.data.data.orpCedentList
            this.cedentList = res.data.data.iabContractInfo;
            this.workSheetList = res.data.data.orpWorkSheetList;
            this.calculatedFeeList = res.data.data.calculatedFeeList;
            this.calculatedFeeList2 = res.data.data.calculatedFeeList;
            this.handleFloatChange();
            console.log(this.lastList, "lastListaaaa");
          } else {
            this.$message.error(res.data.msg);
          }
        });
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
          console.log(sums[index], "sums[index]");
          sums[index] = sums[index].toFixed(2) + " 元";
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },
    // handleHistoryQuery() {
    //   console.log("调整历史");
    //   this.$router.push("/yearAdjustDetail");
    // },
    // handleTotalEPI() {
    //   $http
    //     .post(api.yearTotalEPIAdjust, {
    //       totalEPI: this.totalEPI,
    //       estimateKey: sessionStorage.getItem("estimateKey"),
    //       estimateMonth: sessionStorage.getItem("estimateMonth"),
    //     })
    //     .then((res) => {
    //       if (res.data.code === "0") {
    //         this.contractInfoList.push(res.data.data.contractInfo);
    //         this.cedentList = res.data.data.cedentList;
    //         this.workSheetList = res.data.data.workSheetList;
    //         this.totalEPI = res.data.data.epiSplitInfo.totalEPI;
    //         this.EPIData = res.data.data.epiSplitInfo.epiSplitList;
    //         this.calculatedFeeList = res.data.data.calculatedFeeList;
    //         this.calculatedFeeList2 = res.data.data.calculatedFeeList;
    //         this.iabSlidingScaleAdjustRate =
    //           res.data.data.contractInfo.iabSlidingScaleAdjustRate;
    //         this.orpSlidingScaleAdjustRate =
    //           res.data.data.contractInfo.orpSlidingScaleAdjustRate;
    //         this.$message.success("修改成功");
    //       } else {
    //         this.$message.error(res.data.msg);
    //       }
    //     });
    // },
    // handleAdjustEPI() {
    //   console.log(this.EPIData, "EPIData");

    //   $http
    //     .post(api.yearDetailEPIAdjust, {
    //       epiSplitList: this.EPIData,
    //       estimateKey: sessionStorage.getItem("estimateKey"),
    //       estimateMonth: sessionStorage.getItem("estimateMonth"),
    //     })
    //     .then((res) => {
    //       if (res.data.code === "0") {
    //         this.contractInfoList.push(res.data.data.contractInfo);
    //         this.cedentList = res.data.data.cedentList;
    //         this.workSheetList = res.data.data.workSheetList;
    //         this.totalEPI = res.data.data.epiSplitInfo.totalEPI;
    //         this.EPIData = res.data.data.epiSplitInfo.epiSplitList;
    //         this.iabSlidingScaleAdjustRate =
    //           res.data.data.contractInfo.iabSlidingScaleAdjustRate;
    //         this.orpSlidingScaleAdjustRate =
    //           res.data.data.contractInfo.orpSlidingScaleAdjustRate;
    //         this.$message.success("修改成功");
    //       }
    //     });
    // },
    handleFloatChange() {
      this.lastList = [];
      console.log(this.calculatedFeeList, "this.calculatedFeeList");
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
      console.log(this.calculatedFeeList2, "this.calculatedFeeList2");
      var obj2 = {};
      this.testList = this.calculatedFeeList2.reduce(function (item, next) {
        obj2[next.company]
          ? ""
          : (obj2[next.company] = true && item.push(next));
        return item;
      }, []);
      console.log(this.testList, "this.testList");
      var result = [];
      var obj3 = {};
      for (var i = 0; i < this.calculatedFeeList2.length; i++) {
        if (
          !(
            obj3[this.calculatedFeeList2[i].company] &&
            obj3[this.calculatedFeeList2[i].calculatItem]
          )
        ) {
          result.push(this.calculatedFeeList2[i]);
          obj3[this.calculatedFeeList2[i].company] = true;
          obj3[this.calculatedFeeList2[i].calculatItem] = true;
        }
      }
      result.forEach((item) => {
        this.lastList.push({
          company: item.company,
          calculatItem: item.calculatItem,
        });
        console.log(this.lastList, "lastList");
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
            item.calculatItem === element.calculatItem
          ) {
            // console.log(item[element.calculatMonth], 'item[element.calculatMonth]');
            item[element.calculatMonth] = element.estimateAmount;
            // console.log(element.calculatMonth, 'element');
          }
        });
      });
      // console.log(this.lastList, "lastListaaaa");
    },
    handleFloatAdjust() {
      $http
        .post(api.yearSlidingScaleRateAdjust, {
          iabSlidingScaleAdjustRate: this.iabSlidingScaleAdjustRate,
          orpSlidingScaleAdjustRate: this.orpSlidingScaleAdjustRate,
          estimateKey: sessionStorage.getItem("estimateKey"),
        })
        .then((res) => {
          this.contractInfoList.push(res.data.data.contractInfo);
          this.cedentList = res.data.data.cedentList;
          this.workSheetList = res.data.data.workSheetList;
          this.totalEPI = res.data.data.epiSplitInfo.totalEPI;
          this.EPIData = res.data.data.epiSplitInfo.epiSplitList;
          this.iabSlidingScaleAdjustRate =
            res.data.data.contractInfo.iabSlidingScaleAdjustRate;
          this.orpSlidingScaleAdjustRate =
            res.data.data.contractInfo.orpSlidingScaleAdjustRate;
          this.handleFloatChange();
        });
    },
    handleDetial() {
      this.$router.push("/bookedDetial");
    },
    changtext(scope) {
      console.log(scope, "scope");
      // console.log(this.tableData, "tableData");
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.init());
  },
};
</script>
<style lang="scss" scoped>
.separateEstimateDetial {
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
