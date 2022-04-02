<template>
  <div class="monthAdjustDetial">
    <div
      class="separateInfo"
      v-for="(element, index) in monthAdjustDetailList"
      :key="index"
    >
      <h2>EPI拆分</h2>
      <el-divider></el-divider>
      <el-table
        :data="element.EPIData"
        border
        :summary-method="getSummaries"
        show-summary
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="calculatMonth" label="计算月份" width="180">
        </el-table-column>
        <el-table-column prop="calculatedEPI" label="月最终预估保费">
        </el-table-column>
        <el-table-column prop="originEPI" label="月原始预估保费">
        </el-table-column>
        <el-table-column prop="manualAdjustEPI" label="EPI调整">
          <!-- <template slot-scope="scope">
            <el-input
              placeholder="请输入内容"
              v-model="scope.row.manualAdjustEPI"
            ></el-input>
          </template> -->
        </el-table-column>
        <el-table-column prop="workSheetAdjustEPI" label="实际账单调整">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in monthList"
          :key="index"
          :prop="item.month"
          :label="item.month"
        >
          <template slot-scope="scope">
            <el-input
              :disabled="scope.row[item.month] === ''"
              placeholder=""
              v-model="scope.row[item.month]"
            ></el-input>
            <!-- <span v-show="!scope.row.show">{{scope.row.tab1}}</span> -->
          </template>
        </el-table-column>
      </el-table>
      <span
        >温馨提示：每月6号前调整的可调整上月EPI，每月6号后只能调整本月EPI</span
      >
      <br />
      <el-button class="EPIbutton" @click="handleAdjustEPI"
        >保存调整后的EPI</el-button
      >
    </div>
  </div>
</template>

<script>
import { getMonthBetween } from "@/utils/utils";
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
      //   $http
      //     .post("/estimate/finance/monthContractDetailQuery", {
      //       estimateKey: "a3137f63-aa83-11ec-9e97-a4ae1204f49c",
      //     })
      //     .then((res) => {
      //   console.log(res, "month");
      //   this.contractInfoList.push(res.data.data.contractInfo);
      //   this.cedentList = res.data.data.cedentList;
      //   this.workSheetList = res.data.data.workSheetList;
      //   let epiSplitInfo = res.data.data.epiSplitInfo;
      //   console.log(epiSplitInfo, "epiSplitInfo");
      let epiSplitInfo = {
        contractMonthBegin: "202105",
        contractMonthEnd: "202203",
        calculateMonth: "18",
      };

      // 横向时间处理
      let startTime =
        epiSplitInfo.contractMonthBegin.slice(0, 4) +
        "-" +
        epiSplitInfo.contractMonthBegin.slice(4) +
        "-01";
      let endTime = "";
      // 年份处理
      let monthInfo = epiSplitInfo.calculateMonth % 12;
      let yearsInfo = parseInt(epiSplitInfo.calculateMonth / 12);
      console.log(yearsInfo, "?????", monthInfo);
      let endYear =
        Number(epiSplitInfo.contractMonthEnd.slice(0, 4)) + yearsInfo;
      let endMonth = Number(epiSplitInfo.contractMonthEnd.slice(4)) + monthInfo;
      console.log(endYear, endMonth, "===============");
      if (endMonth < 10) {
        endTime = String(endYear) + "-0" + String(endMonth) + "-01";
      } else {
        endTime = String(endYear) + String(endMonth) + "-01";
      }
      console.log(endTime, 'endTime');
      this.monthList = getMonthBetween(startTime, endTime);
      console.log(this.monthList, "monthList");
      // end
        let newEPIObj = {};
        this.monthList.forEach((item) => {
          newEPIObj[item.month] = "";
        });
      //   // console.log(newEPIObj, "newEPIList");
      //   // epiSplitList中对象拼接
      //   epiSplitInfo.epiSplitList.forEach((item) => {
      //     Object.assign(item, newEPIObj);
      //   });
      //   // console.log(epiSplitInfo.epiSplitList, "epiSplitInfo.epiSplitList");
      //   // epiSplitList中数据重组
      //   epiSplitInfo.epiSplitList.forEach((item) => {
      //     let newData = {};
      //     let MData = {};
      //     // let newMonthList = [];
      //     // 截取12个月data
      //     let newKeys = Object.keys(item);
      //     newKeys.map((e, idx) => {
      //       if (e === item.calculatMonth) {
      //         console.log(idx, "idx");
      //         let startId = idx;
      //         newKeys.map((i, id) => {
      //           if (id < startId + 12 && id >= startId) {
      //             // console.log(i, 'item[i]');
      //             newData[i] = item[i];
      //           }
      //         });
      //       }
      //       // console.log(e, 'MDataMDataMDataMDataMData');
      //       if (e === "m1") {
      //         // console.log(idx, "idx2");
      //         let startId = idx;
      //         newKeys.map((i, id2) => {
      //           if (id2 < startId + 12 && id2 >= startId) {
      //             MData[i] = item[i];
      //           }
      //         });
      //       }
      //     });
      //     // console.log(newData, "!!!!!", MData);
      //     // console.log(Reflect.ownKeys(newData), 'newDatanewDatanewData', Reflect.ownKeys(MData));
      //     let finArr1 = Reflect.ownKeys(newData);
      //     let finArr2 = Reflect.ownKeys(MData);
      //     let lastData = {};
      //     finArr1.forEach((i, index) => {
      //       // console.log(i, 'iiiiiii')
      //       lastData[i] = MData[finArr2[index]];
      //     });
      //     console.log(lastData, "lastData");
      //     for (var p in item) {
      //       for (var q in lastData) {
      //         if (p === q) {
      //           item[p] = lastData[q];
      //         }
      //       }
      //     }
      //     // console.log(item, 'item');
      //   });
      //   this.EPIData = epiSplitInfo.epiSplitList;
      //   console.log(epiSplitInfo.epiSplitList, "epiSplitInfo.epiSplitList");
      // });
    },
  },
  mounted() {
    this.init();
    $http
      .post(api.monthAdjustDetail, {
        estimateKey: "a3137f63-aa83-11ec-9e97-a4ae1204f49c",
      })
      .then((res) => {
        console.log(res, "res");
      });
  },
};
</script>

<style></style>
