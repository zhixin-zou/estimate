<template>
  <div class="monthAdjustDetial">
    <div class="yearAdjustDetailHeader">
      <el-button size="medium" @click="handleBack">返回</el-button>
    </div>
    <div
      class="separateInfo"
      v-for="(element, index) in monthAdjustDetailList"
      :key="index"
    >
      <h2>{{ element.adjustMonth }}</h2>
      <el-divider></el-divider>
      <!-- :ref="monthHistoryList" -->

      <el-table
        :data="element.EPIData"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="calculatMonth" label="计算月份" width="180">
        </el-table-column>
        <el-table-column
          prop="calculatedEPI"
          label="月最终预估保费/合计"
          width="200"
        >
          <template slot-scope="scope">
            <span> {{ kiloSplitData(scope.row.calculatedEPI) }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="originEPI" label="月原始预估保费" width="200">
          <template slot-scope="scope">
            <span> {{ kiloSplitData(scope.row.originEPI) }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="manualAdjustEPI" label="EPI调整" width="200">
        </el-table-column>
        <el-table-column
          prop="workSheetAdjustEPI"
          label="实际账单调整"
          width="200"
        >
        </el-table-column>
        <el-table-column
          width="200"
          v-for="(item, index) in element.monthList"
          :key="index"
          :prop="item.month"
          :label="item.month"
        >
          <template slot-scope="scope">
            <span>{{ kiloSplitData(scope.row[item.month]) }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getMonthBetween, kiloSplit } from "@/utils/utils";
import { $http } from "@/utils/request";
import api from "@/utils/api";

export default {
  data() {
    return {
      monthAdjustDetailList: [],
    };
  },
  methods: {
    init() {
      $http
        .post(api.monthAdjustDetail, {
          estimateKey: sessionStorage.getItem("finEstimateKey"),
        })
        .then((res) => {
          // console.log(res);
          this.monthAdjustDetailList = res.data.data.monthAdjustDetail;
          console.log(this.monthAdjustDetailList, "this.monthAdjustDetailList");
          this.monthAdjustDetailList.forEach((item) => {
            this.dataProcess(item);
          });
          console.log(this.monthAdjustDetailList, "this.monthAdjustDetailList");
        });
      // let epiSplitInfo =
      // this.monthAdjustDetailList = data.data.monthAdjustDetail;
    },
    handleBack() {
      this.$router.go(-1);
    },
    dataProcess(epiSplitInfo) {
      // 横向时间处理
      let startTime =
        epiSplitInfo.contractMonthBegin.slice(0, 4) +
        "-" +
        epiSplitInfo.contractMonthBegin.slice(4) +
        "-01";
      console.log(startTime, "startTime");
      let endTime = "";
      // 年份处理
      let monthInfo = epiSplitInfo.calculatMonths % 12;
      let yearsInfo = parseInt(epiSplitInfo.calculatMonths / 12);
      console.log(yearsInfo, "?????", monthInfo);
      let endYear =
        Number(epiSplitInfo.contractMonthBegin.slice(0, 4)) + yearsInfo;
      let endMonth =
        Number(epiSplitInfo.contractMonthBegin.slice(4)) + monthInfo;
      console.log(endYear, endMonth, "===============");
      if (endMonth > 12) {
        endYear += 1;
        endMonth = endMonth - 12;
      }
      if (endMonth < 10) {
        endTime = String(endYear) + "-0" + String(endMonth - 1) + "-01";
      } else {
        endTime = String(endYear) + "-" + String(endMonth - 1) + "-01";
      }
      console.log(endTime, "endTime");
      this.monthList = getMonthBetween(startTime, endTime);
      console.log(this.monthList, "monthList");
      // end
      let newEPIObj = {};
      let sumObj = {};
      let totalPremiumObj = {};
      let cumulativeAmount = {};
      // 原始epi
      let originEPIObj = {};
      // 调整epi
      let manualAdjustEPIObj = {};
      // 实际账单金额
      let workSheetAmount = {};
      // 实际账单金额调整
      let workSheetAdjustEPI = {};
      // 精算计算金额
      let actuarialAmount = {};
      // 计算后epi
      let calculatedEP = {};
      this.monthList.forEach((item) => {
        newEPIObj[item.month] = "";
        sumObj[item.month] = "";
        totalPremiumObj[item.month] = "";
        cumulativeAmount[item.month] = "";
        originEPIObj[item.month] = "";
        manualAdjustEPIObj[item.month] = "";
        workSheetAmount[item.month] = "";
        workSheetAdjustEPI[item.month] = "";
        actuarialAmount[item.month] = "";
        calculatedEP[item.month] = "";
      });
      epiSplitInfo.monthList = this.monthList;
      console.log(newEPIObj, "newEPIList");
      // epiSplitList中对象拼接
      epiSplitInfo.epiSplitList.forEach((item) => {
        item.commandFlag = "0";
        Object.assign(item, newEPIObj);
      });

      console.log(epiSplitInfo.epiSplitList, "epiSplitInfo.epiSplitList");
      // epiSplitList中数据重组
      epiSplitInfo.epiSplitList.forEach((item) => {
        let newData = {};
        let MData = {};
        // let newMonthList = [];
        // 截取12个月data
        let newKeys = Object.keys(item);
        // console.log(newKeys, "========================");
        newKeys.map((e, idx) => {
          if (e === item.calculatMonth) {
            console.log(idx, "idx");
            let startId = idx;
            newKeys.map((i, id) => {
              if (id < startId + 12 && id >= startId) {
                // console.log(i, 'item[i]');
                newData[i] = item[i];
              }
            });
          }
          // console.log(e, 'MDataMDataMDataMDataMData');
          if (e === "m1") {
            // console.log(idx, "idx2");
            let startId = idx;
            newKeys.map((i, id2) => {
              if (id2 < startId + 12 && id2 >= startId) {
                MData[i] = item[i];
              }
            });
          }
        });
        // console.log(newData, "!!!!!", MData);
        // console.log(Reflect.ownKeys(newData), 'newDatanewDatanewData', Reflect.ownKeys(MData));
        let finArr1 = Reflect.ownKeys(newData);
        let finArr2 = Reflect.ownKeys(MData);
        let lastData = {};
        let finArr2copy = finArr2.splice(1, 3);
        // console.log(finArr2copy,'finArr2copyfinArr2copyfinArr2copyfinArr2copyfinArr2copyfinArr2copyfinArr2copyfinArr2copyfinArr2copyfinArr2copyfinArr2copyfinArr2copy', finArr2);
        finArr2 = finArr2.concat(finArr2copy);
        // console.log(
        //   finArr2,
        //   "finArr2finArr2finArr2finArr2finArr2",
        //   finArr2copy
        // );
        finArr1.forEach((i, index) => {
          // console.log(i, 'iiiiiii')
          lastData[i] = MData[finArr2[index]];
        });
        console.log(lastData, "lastData");
        for (var p in item) {
          for (var q in lastData) {
            if (p === q) {
              item[p] = lastData[q];
            }
          }
          console.log(item[p], p);
          if (item[p] === "") {
            item[p] = " ";
          }
        }
        console.log(item, "item");
      });
      this.EPIData = epiSplitInfo.epiSplitList;
      // 合计累计预估加实际处理
      console.log(epiSplitInfo.epiSplitSumList, "??????????????????????");
      let epiSplitSumList = epiSplitInfo.epiSplitSumList;
      let sumHeaderObj = cumulativeAmount;
      let premiumHeaderObj = totalPremiumObj;
      let allHeaderObj = sumObj;
      let originEPIHeaderObj = originEPIObj;
      let manualAdjustEPIHeaderObj = manualAdjustEPIObj;
      let workSheetAmountHeader = workSheetAmount;
      let workSheetAdjustEPIHeader = workSheetAdjustEPI;
      let actuarialAmountHeader = actuarialAmount;
      let calculatedEPIHeader = calculatedEP;

      allHeaderObj.calculatMonth = "合计";
      sumHeaderObj.calculatMonth = "累计";
      premiumHeaderObj.calculatMonth = "预估+实际";
      originEPIHeaderObj.calculatMonth = "原始epi";
      manualAdjustEPIHeaderObj.calculatMonth = "调整epi";
      workSheetAmountHeader.calculatMonth = "实际账单金额";
      workSheetAdjustEPIHeader.calculatMonth = "实际账单金额调整";
      actuarialAmountHeader.calculatMonth = "精算计算金额";
      calculatedEPIHeader.calculatMonth = "计算后epi";

      // sumHeaderObj.calculatedEPI = "";
      // sumHeaderObj.originEPI = "";
      // sumHeaderObj.manualAdjustEPI = "";
      // console.log(epiSplitSumList, 'epiSplitSumList???????????????????????????????????????????????');
      let sumHeaderObjSum = 0;
      let premiumHeaderObjSum = 0;
      let allHeaderObjSum = 0;
      let originEPIHeaderObjSum = 0;
      let manualAdjustEPIHeaderObjSum = 0;
      let workSheetAmountHeaderSum = 0;
      let workSheetAdjustEPIHeaderSum = 0;
      let actuarialAmountHeaderSum = 0;
      let calculatedEPIHeaderSum = 0;
      epiSplitSumList.forEach((item) => {
        for (var key in sumHeaderObj) {
          if (item.calculatMonth === key) {
            sumHeaderObj[key] = item.cumulativeAmount;
            sumHeaderObjSum = sumHeaderObjSum + Number(item.cumulativeAmount);
          }
        }
        for (var key1 in premiumHeaderObj) {
          if (item.calculatMonth === key1) {
            premiumHeaderObj[key1] = item.totalPremium;
            premiumHeaderObjSum =
              premiumHeaderObjSum + Number(item.totalPremium);
          }
        }
        for (var key2 in allHeaderObj) {
          if (item.calculatMonth === key2) {
            allHeaderObj[key2] = item.sumAmount;
            allHeaderObjSum = allHeaderObjSum + Number(item.sumAmount);
          }
        }
        for (var key3 in originEPIHeaderObj) {
          if (item.calculatMonth === key3) {
            originEPIHeaderObj[key3] = item.originEPI;
            originEPIHeaderObjSum =
              originEPIHeaderObjSum + Number(item.originEPI);
          }
        }
        for (var key4 in manualAdjustEPIHeaderObj) {
          if (item.calculatMonth === key4) {
            manualAdjustEPIHeaderObj[key4] = item.manualAdjustEPI;
            manualAdjustEPIHeaderObjSum =
              manualAdjustEPIHeaderObjSum + Number(item.manualAdjustEPI);
          }
        }
        for (var key5 in workSheetAmountHeader) {
          if (item.calculatMonth === key5) {
            workSheetAmountHeader[key5] = item.workSheetAmount;
            workSheetAmountHeaderSum =
              workSheetAmountHeaderSum + Number(item.workSheetAmount);
            console.log(
              workSheetAmountHeaderSum,
              "workSheetAmountHeader",
              key5
            );
          }
        }

        for (var key6 in workSheetAdjustEPIHeader) {
          if (item.calculatMonth === key6) {
            workSheetAdjustEPIHeader[key6] = item.workSheetAdjustEPI;
            workSheetAdjustEPIHeaderSum =
              workSheetAdjustEPIHeaderSum + Number(item.workSheetAdjustEPI);
          }
        }
        for (var key7 in actuarialAmountHeader) {
          if (item.calculatMonth === key7) {
            actuarialAmountHeader[key7] = item.actuarialAmount;
            actuarialAmountHeaderSum =
              actuarialAmountHeaderSum + Number(item.actuarialAmount);
          }
        }

        for (var key8 in calculatedEPIHeader) {
          if (item.calculatMonth === key8) {
            calculatedEPIHeader[key8] = item.calculatedEPI;
            calculatedEPIHeaderSum =
              calculatedEPIHeaderSum + Number(item.calculatedEPI);
          }
        }
      });

      allHeaderObj.calculatedEPI = sumHeaderObjSum.toFixed(2);
      sumHeaderObj.calculatedEPI = premiumHeaderObjSum.toFixed(2);
      premiumHeaderObj.calculatedEPI = allHeaderObjSum.toFixed(2);
      originEPIHeaderObj.calculatedEPI = originEPIHeaderObjSum.toFixed(2);
      manualAdjustEPIHeaderObj.calculatedEPI =
        manualAdjustEPIHeaderObjSum.toFixed(2);
      workSheetAmountHeader.calculatedEPI = workSheetAmountHeaderSum.toFixed(2);
      workSheetAdjustEPIHeader.calculatedEPI =
        workSheetAdjustEPIHeaderSum.toFixed(2);
      actuarialAmountHeader.calculatedEPI = actuarialAmountHeaderSum.toFixed(2);
      calculatedEPIHeader.calculatedEPI = calculatedEPIHeaderSum.toFixed(2);
      console.log(
        sumObj,
        originEPIObj,
        "sumHeaderObjsumHeaderObjsumHeaderObjsumHeaderObjsumHeaderObjj"
      );
      this.EPIData.push(calculatedEPIHeader);
      this.EPIData.push(originEPIHeaderObj);
      this.EPIData.push(manualAdjustEPIHeaderObj);
      this.EPIData.push(workSheetAmountHeader);
      this.EPIData.push(workSheetAdjustEPIHeader);
      this.EPIData.push(allHeaderObj);
      this.EPIData.push(premiumHeaderObj);
      this.EPIData.push(sumHeaderObj);
      this.EPIData.push(actuarialAmountHeader);

      // console.log(epiSplitInfo.epiSplitList, "epiSplitInfo.epiSplitList");
      //epi调整结束
      // console.log(epiSplitInfo.epiSplitList, "epiSplitInfo.epiSplitList");
      //epi调整结束
      epiSplitInfo.EPIData = this.EPIData;
    },
    kiloSplitData(data) {
      return kiloSplit(data);
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
  },
  mounted() {
    this.init();
    // $http
    //   .post(api.monthAdjustDetail, {
    //     estimateKey: "a3137f63-aa83-11ec-9e97-a4ae1204f49c",
    //   })
    //   .then((res) => {
    //     console.log(res, "res");
    //   });
  },
};
</script>

<style lang="scss" scoped>
.monthAdjustDetial {
  .yearAdjustDetailHeader {
    float: right;
    margin-bottom: 20px;
  }
}
</style>
