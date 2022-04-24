<template>
  <div class="monthContractDetial">
    <div class="monthHeader">
      <el-button @click="handleBack">返回</el-button>
      <el-button @click="handleExport('cwMonthContract', '合同信息')"
        >导出</el-button
      >
    </div>
    <div class="separateInfo">
      <h2>合同信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :ref="'cwMonthContract'"
        :columns="columns"
        :listData="contractInfoList"
      ></fs-list-panel>
    </div>
    <div class="monthHeader">
      <el-button @click="handleExport('cwMonthCedent', '分出信息')"
        >导出</el-button
      >
    </div>
    <div class="separateInfo">
      <h2>分出信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :ref="'cwMonthCedent'"
        :columns="cedentColumns"
        :listData="cedentList"
      ></fs-list-panel>
    </div>
    <div class="monthHeader">
      <el-button @click="handleExport('cwMonthWorkSheet', '分入保费账单信息')"
        >导出</el-button
      >
    </div>
    <div class="separateInfo">
      <h2>分入保费账单信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :ref="'cwMonthWorkSheet'"
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
        <el-button class="historyQuery" @click="handleExport('epiData', 'epi')"
          >导出</el-button
        >
      </div>
      <el-table :data="EPIData" border style="width: 100%; margin-top: 20px">
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
          <template slot-scope="scope">
            <span
              v-if="
                scope.row.calculatMonth === '累计' ||
                scope.row.calculatMonth === '预估+实际' ||
                scope.row.calculatMonth === '合计'
              "
            >
              {{ scope.row.manualAdjustEPI }}</span
            >
            <!-- (Number(scope.row.calculatMonth) + 11) < estimateMonth || -->
            <el-input
              v-else
              placeholder="请输入内容"
              v-model="scope.row.manualAdjustEPI"
              :disabled="scope.row.commandFlag === '1'"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="workSheetAdjustEPI" label="实际账单调整">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in monthList"
          :key="index"
          :prop="item.month"
          :label="item.month"
          width="130"
        >
          <template slot-scope="scope">
            <span
              v-if="
                scope.row.calculatMonth === '累计' ||
                scope.row.calculatMonth === '预估+实际' ||
                scope.row.calculatMonth === '合计'
              "
              >{{ kiloSplitData(scope.row[item.month]) }}</span
            >
            <el-input
              v-else
              @keydown.native="keydown"
              :disabled="
                scope.row[item.month] === ' ' ||
                item.month < estimateMonth ||
                scope.row.commandFlag === '0'
              "
              placeholder=""
              v-model="scope.row[item.month]"
            ></el-input>
            <!-- <span v-show="!scope.row.show">{{scope.row.tab1}}</span> -->
          </template>
        </el-table-column>
      </el-table>
      <el-table
        v-show="false"
        :ref="'epiData'"
        :data="EPIData"
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
          v-for="(item, index) in monthList"
          :key="index"
          :prop="item.month"
          :label="item.month"
          width="130"
        >
        </el-table-column>
      </el-table>
      <span
        >温馨提示：每月6号前调整的可调整上月EPI，每月6号后只能调整本月EPI</span
      >
      <br />
      <el-dropdown
        class="dropdownButton"
        split-button
        type="primary"
        @click="handleAdjustEPI"
        @command="handleCommand"
      >
        保存调整后的EPI
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="0">月份金额调整</el-dropdown-item>
          <el-dropdown-item command="1">分摊明细调整</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="separateInfo">
      <h2>计算后预估费用明细</h2>
      <el-divider></el-divider>
      <div class="adjustHeader">
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
        <el-button
          style="float: right"
          @click="handleExport('adjustForm', '计算后预估费用明细')"
          >导出</el-button
        >
      </div>
      <el-table
        :ref="'adjustForm'"
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
        <el-table-column prop="currencyCode" label="币种"> </el-table-column>
        <el-table-column
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
import { getMonthBetween, kiloSplit } from "@/utils/utils";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";

export default {
  data() {
    return {
      estimateMonth: sessionStorage.getItem("estimateMonth"),
      totalEPI: "0",
      floatingFactor: "",
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
          title: "账单状态",
          property: "workSheetStatus",
        },
      ],
      workSheetList: [],
      EPIData: [],
      // epiDatacopy: [],

      monthList: [],
      lastList: [],
      // calculatedFeeList: [],
      calculatedFeeList: [],
      calculatedFeeList2: [],
      iabSlidingScaleAdjustRate: "",
      orpSlidingScaleAdjustRate: "",
      commandFlag: "0",
    };
  },
  methods: {
    init() {
      $http
        .post(api.monthContractDetailQuery, {
          estimateKey: sessionStorage.getItem("estimateKey"),
        })
        .then((res) => {
          if (res.data.code == "0") {
            console.log(res, "month");
            this.contractInfoList.push(res.data.data.contractInfo);
            this.cedentList = res.data.data.cedentList;
            this.workSheetList = res.data.data.workSheetList;
            let epiSplitInfo = res.data.data.epiSplitInfo;
            // this.epiDatacopy = res.data.data.epiSplitInfo.epiSplitList
            localStorage.setItem(
              "epiDatacopy",
              JSON.stringify(res.data.data.epiSplitInfo.epiSplitList)
            );
            this.totalEPI = epiSplitInfo.totalEPI;
            this.calculatedFeeList = res.data.data.calculatedFeeList;
            this.calculatedFeeList2 = res.data.data.calculatedFeeList;
            console.log(epiSplitInfo, "epiSplitInfo");
            this.dataProcess(epiSplitInfo);
            this.handleFloatChange();
            this.iabSlidingScaleAdjustRate =
              res.data.data.contractInfo.iabSlidingScaleAdjustRate;
            this.orpSlidingScaleAdjustRate =
              res.data.data.contractInfo.orpSlidingScaleAdjustRate;
          } else {
            this.$messag.error(res.data.msg);
          }
        });
    },
    kiloSplitData(data) {
      return kiloSplit(data);
    },
    handleBack() {
      this.$router.go(-1);
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
    handleExport(data, filename) {
      this.exportBtn(data, filename);
      // console.log(this.$refs.exportTableRef1.$el);
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
            premiumHeaderObj[key1] = item.cumulativeAmount;
          }
        }
        for (var key2 in allHeaderObj) {
          if (item.calculatMonth === key2) {
            allHeaderObj[key2] = item.totalPremium;
          }
        }
      });
      console.log(
        sumObj,
        "sumHeaderObjsumHeaderObjsumHeaderObjsumHeaderObjsumHeaderObjj"
      );
      this.EPIData.push(allHeaderObj);
      this.EPIData.push(sumHeaderObj);
      this.EPIData.push(premiumHeaderObj);
      // console.log(epiSplitInfo.epiSplitList, "epiSplitInfo.epiSplitList");
      //epi调整结束
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
    handleTotalEPI() {
      $http
        .post(api.monthTotalEPIAdjust, {
          totalEPI: this.totalEPI,
          estimateKey: sessionStorage.getItem("estimateKey"),
        })
        .then((res) => {
          if (res.data.code == "0") {
            this.contractInfoList = [];
            this.contractInfoList.push(res.data.data.contractInfo);
            this.cedentList = res.data.data.cedentList;
            this.workSheetList = res.data.data.workSheetList;
            let epiSplitInfo = res.data.data.epiSplitInfo;
            // this.epiDatacopy = res.data.data.epiSplitInfo.epiSplitList
            localStorage.setItem(
              "epiDatacopy",
              JSON.stringify(res.data.data.epiSplitInfo.epiSplitList)
            );
            this.totalEPI = epiSplitInfo.totalEPI;
            this.calculatedFeeList = res.data.data.calculatedFeeList;
            this.calculatedFeeList2 = res.data.data.calculatedFeeList;
            this.dataProcess(epiSplitInfo);
            this.handleFloatChange();
            this.iabSlidingScaleAdjustRate =
              res.data.data.contractInfo.iabSlidingScaleAdjustRate;
            this.orpSlidingScaleAdjustRate =
              res.data.data.contractInfo.orpSlidingScaleAdjustRate;
            this.$message.success("修改成功");
          } else {
            this.$messag.error(res.data.msg);
          }
        });
    },
    handleHistoryQuery() {
      // console.log("调整历史");
      this.$router.push("/monthAdjustDetail");
    },
    handleTest(scope) {
      console.log(scope, ";;;;;;;");
    },
    handleCommand(command) {
      this.commandFlag = command;
      this.EPIData.forEach((item) => {
        item.commandFlag = this.commandFlag;
      });
      console.log(this.commandFlag);
    },
    handleAdjustEPI() {
      console.log(
        JSON.parse(localStorage.getItem("epiDatacopy")),
        "epiDatacopy",
        this.EPIData,
        "sadad"
      );
      let monthEpiSplitList = JSON.parse(localStorage.getItem("epiDatacopy"));
      if (this.commandFlag === "0") {
        this.EPIData.forEach((item) => {
          monthEpiSplitList.forEach((e) => {
            if (item.calculatMonth === e.calculatMonth) {
              e.manualAdjustEPI = item.manualAdjustEPI;
            }
          });
        });
        $http
          .post(api.monthDetailEPIAdjust, {
            estimateKey: sessionStorage.getItem("estimateKey"),
            monthAdjustType: this.commandFlag,
            monthEpiSplitList: monthEpiSplitList,
          })
          .then((res) => {
            if (res.data.code == "0") {
              this.contractInfoList = [];
              this.contractInfoList.push(res.data.data.contractInfo);
              this.cedentList = res.data.data.cedentList;
              this.workSheetList = res.data.data.workSheetList;
              let epiSplitInfo = res.data.data.epiSplitInfo;
              // this.epiDatacopy = res.data.data.epiSplitInfo.epiSplitList
              localStorage.setItem(
                "epiDatacopy",
                JSON.stringify(res.data.data.epiSplitInfo.epiSplitList)
              );
              this.totalEPI = epiSplitInfo.totalEPI;
              this.calculatedFeeList = res.data.data.calculatedFeeList;
              this.calculatedFeeList2 = res.data.data.calculatedFeeList;
              this.dataProcess(epiSplitInfo);
              this.handleFloatChange();
              this.iabSlidingScaleAdjustRate =
                res.data.data.contractInfo.iabSlidingScaleAdjustRate;
              this.orpSlidingScaleAdjustRate =
                res.data.data.contractInfo.orpSlidingScaleAdjustRate;
              this.$message.success("修改成功");
            } else {
              this.$messag.error(res.data.msg);
            }
          });
      } else {
        // console.log(this.EPIData, 'this.EPIDatathis.EPIDatathis.EPIData');
        let epiList = this.EPIData.splice(0, this.EPIData.length - 3);
        epiList.forEach((item) => {
          let monthArrNew = [];
          let mArr = [];
          let monthArr = Object.keys(item);
          monthArr.map((e, idx) => {
            if (e === item.calculatMonth) {
              console.log(idx, "idx");
              let startId = idx;
              monthArr.map((i, id) => {
                if (id < startId + 12 && id >= startId) {
                  monthArrNew[i] = item[i];
                  mArr.push(item[i]);
                }
              });
            }
          });

          monthEpiSplitList.forEach((element) => {
            if (element.calculatMonth === item.calculatMonth) {
              element.m1 = mArr[0];
              element.m2 = mArr[1];
              element.m3 = mArr[2];
              element.m4 = mArr[3];
              element.m5 = mArr[4];
              element.m6 = mArr[5];
              element.m7 = mArr[6];
              element.m8 = mArr[7];
              element.m9 = mArr[8];
              element.m10 = mArr[9];
              element.m11 = mArr[10];
              element.m12 = mArr[11];
            }
          });
          // console.log(monthEpiSplitList, mArr, "monthArrmonthArrmonthArr", index);
        });
        $http
          .post(api.monthDetailEPIAdjust, {
            estimateKey: sessionStorage.getItem("estimateKey"),
            monthAdjustType: this.commandFlag,
            monthEpiSplitList: monthEpiSplitList,
          })
          .then((res) => {
            if (res.data.code == "0") {
              this.contractInfoList = [];
              this.contractInfoList.push(res.data.data.contractInfo);
              this.cedentList = res.data.data.cedentList;
              this.workSheetList = res.data.data.workSheetList;
              let epiSplitInfo = res.data.data.epiSplitInfo;
              // this.epiDatacopy = res.data.data.epiSplitInfo.epiSplitList
              localStorage.setItem(
                "epiDatacopy",
                JSON.stringify(res.data.data.epiSplitInfo.epiSplitList)
              );
              this.totalEPI = epiSplitInfo.totalEPI;
              this.calculatedFeeList = res.data.data.calculatedFeeList;
              this.calculatedFeeList2 = res.data.data.calculatedFeeList;
              this.dataProcess(epiSplitInfo);
              this.handleFloatChange();
              this.iabSlidingScaleAdjustRate =
                res.data.data.contractInfo.iabSlidingScaleAdjustRate;
              this.orpSlidingScaleAdjustRate =
                res.data.data.contractInfo.orpSlidingScaleAdjustRate;
              this.$message.success("修改成功");
              this.commandFlag = "0";
            } else {
              this.$messag.error(res.data.msg);
            }
          });
        console.log(monthEpiSplitList, "epiList");
        //      $http.post(api.monthTotalEPIAdjust, {
        //   estimateKey: sessionStorage.getItem("estimateKey"),
        //   monthAdjustType: this.commandFlag,
        //   monthEpiSplitList: monthEpiSplitList
        // })
        // epiList.forEach(item => {
        //   // if ()
        // })
      }
    },
    keydown(e) {
      console.log(e.target);
      if (e.code === "Space") {
        console.log(1111);
        e.target.value = 0;
        this.$message.warning("请勿输入空格符");
      }
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
        $http
          .post(api.monthSlidingScaleRateAdjust, {
            iabSlidingScaleAdjustRate: this.iabSlidingScaleAdjustRate,
            orpSlidingScaleAdjustRate: this.orpSlidingScaleAdjustRate,
            estimateKey: sessionStorage.getItem("estimateKey"),
          })
          .then((res) => {
            if (res.data.code === "0") {
              this.contractInfoList = [];
              this.contractInfoList.push(res.data.data.contractInfo);
              this.cedentList = res.data.data.cedentList;
              this.workSheetList = res.data.data.workSheetList;
              let epiSplitInfo = res.data.data.epiSplitInfo;
              this.totalEPI = epiSplitInfo.totalEPI;
              this.calculatedFeeList = res.data.data.calculatedFeeList;
              this.calculatedFeeList2 = res.data.data.calculatedFeeList;
              console.log(epiSplitInfo, "epiSplitInfo");
              this.dataProcess(epiSplitInfo);
              this.handleFloatChange();
              this.iabSlidingScaleAdjustRate =
                res.data.data.contractInfo.iabSlidingScaleAdjustRate;
              this.orpSlidingScaleAdjustRate =
                res.data.data.contractInfo.orpSlidingScaleAdjustRate;
              this.$message.success("修改成功");
            } else {
              this.$message.error(res.data.msg);
            }
          });
      }
    },
    handleDetial() {
      sessionStorage.setItem("accountType", "0");
      this.$router.push("/bookedDetial");
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.init());
  },
};
</script>

<style lang="scss" scoped>
.monthContractDetial {
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
          margin-right: 20px;
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
    .dropdownButton {
      margin-left: 45%;
    }
  }
  .checkDetial {
    margin-left: 45%;
  }
}
</style>
