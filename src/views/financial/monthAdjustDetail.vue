<template>
  <div class="monthAdjustDetial">
    <div
      class="separateInfo"
      v-for="(element, index) in monthAdjustDetailList"
      :key="index"
    >
      <h2>{{ element.adjustMonth }}</h2>
      <el-divider></el-divider>
      <el-table
        :data="element.EPIData"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="calculatMonth" label="计算月份" width="180">
        </el-table-column>
        <el-table-column prop="calculatedEPI" label="月最终预估保费">
          <template slot-scope="scope">
            <span> {{ kiloSplitData(scope.row.calculatedEPI) }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="originEPI" label="月原始预估保费">
          <template slot-scope="scope">
            <span> {{ kiloSplitData(scope.row.originEPI) }} </span>
          </template>
        </el-table-column>
        <el-table-column prop="manualAdjustEPI" label="EPI调整">
        </el-table-column>
        <el-table-column prop="workSheetAdjustEPI" label="实际账单调整">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in element.monthList"
          :key="index"
          :prop="item.month"
          :label="item.month"
        >
          <!-- <template slot-scope="scope">
            <el-input
              :disabled="scope.row[item.month] === ''"
              placeholder=""
              v-model="scope.row[item.month]"
            ></el-input>
          </template> -->
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
          estimateKey: sessionStorage.getItem("estimateKey"),
        })
        .then((res) => {
          // console.log(res);
          this.monthAdjustDetailList = res.data.data.monthAdjustDetail;
          console.log(this.monthAdjustDetailList, "this.monthAdjustDetailList");
          this.monthAdjustDetailList.forEach((item) => {
            this.dataProcess(item);
          });
          console.log(this.monthAdjustDetailList, 'this.monthAdjustDetailList');
        });
      // let epiSplitInfo =
      // this.monthAdjustDetailList = data.data.monthAdjustDetail;
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
      this.monthList.forEach((item) => {
        newEPIObj[item.month] = "";
        sumObj[item.month] = "";
        totalPremiumObj[item.month] = "";
        cumulativeAmount[item.month] = "";
      });
      epiSplitInfo.monthList = this.monthList
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
      allHeaderObj.calculatMonth = "合计";
      sumHeaderObj.calculatMonth = "累计";
      // sumHeaderObj.calculatedEPI = "";
      // sumHeaderObj.originEPI = "";
      // sumHeaderObj.manualAdjustEPI = "";
      premiumHeaderObj.calculatMonth = "预估+实际";
      epiSplitSumList.forEach((item) => {
        for (var key in sumHeaderObj) {
          if (item.calculatMonth === key) {
            sumHeaderObj[key] = item.sumAmount;
          }
        }
         for (var key1 in premiumHeaderObj) {
          if (item.calculatMonth === key1) {
            premiumHeaderObj[key1] = item.totalPremium;
          }
        }
        for (var key2 in allHeaderObj) {
          if (item.calculatMonth === key2) {
            allHeaderObj[key2] = item.cumulativeAmount;
          }
        }
      });
      console.log(
        sumObj,
        "sumHeaderObjsumHeaderObjsumHeaderObjsumHeaderObjsumHeaderObjj"
      );
      this.EPIData.push(allHeaderObj);
      this.EPIData.push(premiumHeaderObj);
      this.EPIData.push(sumHeaderObj);
      // console.log(epiSplitInfo.epiSplitList, "epiSplitInfo.epiSplitList");
      //epi调整结束
      epiSplitInfo.EPIData = this.EPIData
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

<style></style>
