<template>
  <div class="monthContractDetial">
    <div class="separateInfo">
      <h2>合同信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :columns="columns"
        :listData="contractInfoList"
      ></fs-list-panel>
    </div>
    <div class="separateInfo">
      <h2>分出信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :columns="cedentColumns"
        :listData="cedentList"
      ></fs-list-panel>
    </div>
    <div class="separateInfo">
      <h2>分入保费账单信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :columns="workSheetColumns"
        :listData="workSheetList"
      ></fs-list-panel>
    </div>
    <div class="separateInfo">
      <h2>EPI拆分</h2>
      <el-divider></el-divider>
      <div class="adjustHeader">
        <div class="adjustBox">
          <div class="adjustName"><span>总EPI：</span></div>
          <div class="input"><el-input v-model="totalEPI"></el-input></div>
        </div>
        <el-button
          type="primary"
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
      </div>

      <el-table
        :data="EPIData"
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
          <template slot-scope="scope">
            <el-input
              placeholder="请输入内容"
              v-model="scope.row.manualAdjustEPI"
            ></el-input>
            <!-- <span v-show="!scope.row.show">{{scope.row.tab1}}</span> -->
          </template>
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
    <div class="separateInfo">
      <h2>计算后预估费用明细</h2>
      <el-divider></el-divider>
      <div class="adjustHeader">
        <div class="adjustBox">
          <div class="adjustName"><span>浮动因子：</span></div>
          <div class="input">
            <el-input v-model="floatingFactor"></el-input>
          </div>
        </div>
        <el-button
          type="primary"
          round
          class="adjustButton"
          @click="handleFloatChange"
          >确定</el-button
        >
      </div>
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
// import api from "@/utils/api";
import { getMonthBetween } from "@/utils/utils";
export default {
  data() {
    return {
      totalEPI: "0",
      floatingFactor: "",
      columns: [
        {
          title: "合同号",
          property: "contratNo",
        },
        {
          title: "合同类型",
          property: "contratType",
        },
        {
          title: "主险种",
          property: "planCode",
        },
        {
          title: "分入公司",
          property: "cedent",
        },
        {
          title: "再保公司",
          property: "reinsurer",
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
        },
        // {
        //   title: "预估维度键值",
        //   property: "estimateKey",
        // },
        // {
        //   title: "分入浮动因子",
        //   property: "iabSlidingScaleAdjustRate",
        // },
        // {
        //   title: "分出浮动因子",
        //   property: "orpSlidingScaleAdjustRate",
        // },
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
          property: "orpPartnerNo",
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
      monthList: [],
      lastList: [],
      calculatedFeeList: [],
    };
  },
  methods: {
    init() {
      $http
        .post("/estimate/finance/monthContractDetailQuery", {
          estimateKey: "a3137f63-aa83-11ec-9e97-a4ae1204f49c",
        })
        .then((res) => {
          console.log(res, "month");
          this.contractInfoList.push(res.data.data.contractInfo);
          this.cedentList = res.data.data.cedentList;
          this.workSheetList = res.data.data.workSheetList;
          let epiSplitInfo = res.data.data.epiSplitInfo;
          console.log(epiSplitInfo, "epiSplitInfo");
          // 横向时间处理
          let startTime =
            epiSplitInfo.contractMonthBegin.slice(0, 4) +
            "-" +
            epiSplitInfo.contractMonthBegin.slice(4) +
            "-01";
          let endTime = "";
          if (
            epiSplitInfo.contractMonthBegin.slice(4) !== "01" &&
            epiSplitInfo.contractMonthBegin.slice(4) !== "02"
          ) {
            let endYear =
              Number(epiSplitInfo.contractMonthBegin.slice(0, 4)) + 2;
            let endMonth = Number(epiSplitInfo.contractMonthBegin.slice(4)) - 2;
            if (endMonth < 10) {
              endTime = String(endYear) + "-0" + String(endMonth) + "-01";
            } else {
              endTime = String(endYear) + String(endMonth) + "-01";
            }
            console.log(endTime, "endTime");
          } else if (epiSplitInfo.contractMonthBegin.slice(4) === "01") {
            let endYear =
              Number(epiSplitInfo.contractMonthBegin.slice(0, 4)) + 1;
            endTime = String(endYear) + "-11" + "-01";
          } else if (epiSplitInfo.contractMonthBegin.slice(4) === "02") {
            let endYear =
              Number(epiSplitInfo.contractMonthBegin.slice(0, 4)) + 1;
            endTime = String(endYear) + "-12" + "-01";
          }
          this.monthList = getMonthBetween(startTime, endTime);
          // console.log(this.monthList, "monthList");
          // end
          let newEPIObj = {};
          this.monthList.forEach((item) => {
            newEPIObj[item.month] = "";
          });
          // console.log(newEPIObj, "newEPIList");
          // epiSplitList中对象拼接
          epiSplitInfo.epiSplitList.forEach((item) => {
            Object.assign(item, newEPIObj);
          });
          // console.log(epiSplitInfo.epiSplitList, "epiSplitInfo.epiSplitList");
          // epiSplitList中数据重组
          epiSplitInfo.epiSplitList.forEach((item) => {
            let newData = {};
            let MData = {};
            // let newMonthList = [];
            // 截取12个月data
            let newKeys = Object.keys(item);
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
            }
            // console.log(item, 'item');
          });
          this.EPIData = epiSplitInfo.epiSplitList;
          console.log(epiSplitInfo.epiSplitList, "epiSplitInfo.epiSplitList");
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
          sums[index] = "N/A";
        }
      });

      return sums;
    },
    handleTotalEPI() {},
    handleHistoryQuery() {
      // console.log("调整历史");
      this.$router.push("/monthAdjustDetail");
    },
    handleAdjustEPI() {
      console.log(this.EPIData, "EPIData");
    },
    handleFloatChange() {},
    handleDetial() {},
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.init());
  },
};
</script>

<style lang="scss" scoped>
.monthContractDetial {
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
}
</style>
