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
        :summary-method="getSummaries"
        show-summary
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
        .post("/estimate/finance/monthContractDetailQuery", {
          estimateKey: sessionStorage.getItem("estimateKey"),
        })
        .then((res) => {
          console.log(res);
          this.monthAdjustDetailList = res.data.data.monthAdjustDetail;
          this.monthAdjustDetailList.forEach((item) => {
            // 横向时间处理
            let startTime =
              item.contractMonthBegin.slice(0, 4) +
              "-" +
              item.contractMonthBegin.slice(4) +
              "-01";
            let endTime = "";
            // 年份处理
            let monthInfo = item.calculatMonth % 12;
            let yearsInfo = parseInt(item.calculatMonth / 12);
            let endYear = Number(item.contractMonthEnd.slice(0, 4)) + yearsInfo;
            let endMonth = Number(item.contractMonthEnd.slice(4)) + monthInfo;
            // console.log(monthInfo, "monthinfo");
            if (endMonth > 12) {
              endYear += 1;
              endMonth = endMonth - 12;
            }
            if (endMonth < 10) {
              endTime = String(endYear) + "-0" + String(endMonth) + "-01";
            } else {
              endTime = String(endYear) + "-" + String(endMonth) + "-01";
            }
            let monthList = getMonthBetween(startTime, endTime);
            item.monthList = monthList;
            // end
            let newEPIObj = {};

            monthList.forEach((element) => {
              newEPIObj[element.month] = "";
            });
            // epiSplitList中对象拼接
            item.epiSplitList.forEach((element) => {
              Object.assign(element, newEPIObj);
            });
            console.log(item.epiSplitList, "item.epiSplitList");
            // epiSplitList中数据重组
            item.epiSplitList.forEach((item) => {
              let newData = {};
              let MData = {};
              // let newMonthList = [];
              // 截取12个月data
              let newKeys = Object.keys(item);
              newKeys.map((e, idx) => {
                if (e === item.calculatMonth) {
                  // console.log(idx, "idx");
                  let startId = idx;
                  newKeys.map((i, id) => {
                    if (id < startId + 12 && id >= startId) {
                      // console.log(i, 'item[i]');
                      newData[i] = item[i];
                    }
                  });
                }
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
              let finArr1 = Reflect.ownKeys(newData);
              let finArr2 = Reflect.ownKeys(MData);
              let lastData = {};
              finArr1.forEach((i, index) => {
                lastData[i] = MData[finArr2[index]];
              });
              for (var p in item) {
                for (var q in lastData) {
                  if (p === q) {
                    item[p] = lastData[q];
                  }
                }
              }
            });
            item.EPIData = item.epiSplitList;
          });
          console.log(this.monthAdjustDetailList, "this.monthAdjustDetailList");
        });
      // let epiSplitInfo =
      // this.monthAdjustDetailList = data.data.monthAdjustDetail;
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
          console.log(sums[index], "sums[index]");
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
