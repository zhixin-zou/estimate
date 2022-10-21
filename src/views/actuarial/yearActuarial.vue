<template>
  <div class="yearActuarail">
    <div class="monthHeader">
      <el-button @click="handleExport('contract', '合同信息')">导出</el-button>
      <el-button @click="handleBack">返回</el-button>
    </div>
    <div class="separateInfo">
      <h2>合同信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :ref="'contract'"
        :columns="columns"
        :listData="contractInfoList"
      ></fs-list-panel>
    </div>
    <div class="twoMain" style="background-color: #fff">
      <div class="monthHeader">
        <el-button @click="handleExport('feeInfo', '费用信息')">导出</el-button>
      </div>
      <div class="separateInfo">
        <h2>费用信息</h2>
        <el-divider></el-divider>
        <!-- <fs-list-panel
        :ref="'feeInfo'"
        :columns="feeColumns"
        :listData="feeInfoList"
      ></fs-list-panel> -->
        <span style="padding-right: 20px">是否根据赔付率获取手续费比例</span>
        <el-switch
          v-model="isDAC"
          active-text="是"
          inactive-text="否"
          @change="handleIsDAC"
        >
        </el-switch>
        <el-table
          :data="feeInfoList"
          ref="feeInfo"
          border
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column prop="dacRate" label="DAC比例">
            <template slot-scope="scope">
              <span v-if="historyShow === '4' || isDAC === true">{{
                scope.row.dacRate
              }}</span>
              <el-input v-else v-model="scope.row.dacRate"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="expectClaimRate" label="预计赔付率">
            <template slot-scope="scope">
              <span v-if="historyShow === '4'">{{
                scope.row.expectClaimRate
              }}</span>
              <el-input
                v-else
                v-model="scope.row.expectClaimRate"
                @blur="handleChangelossRatio(scope.row.expectClaimRate)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="expectXOLRate" label="预期XOL費用率">
            <template slot-scope="scope">
              <span v-if="historyShow === '4'">{{
                scope.row.expectXOLRate
              }}</span>
              <el-input v-else v-model="scope.row.expectXOLRate"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="expectMaintainRate" label="预计维持費用">
            <template slot-scope="scope">
              <span v-if="historyShow === '4'">{{
                scope.row.expectMaintainRate
              }}</span>
              <el-input
                v-else
                v-model="scope.row.expectMaintainRate"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="riskMargin" label="Risk Margin">
            <template slot-scope="scope">
              <span v-if="historyShow === '4'">{{ scope.row.riskMargin }}</span>
              <el-input v-else v-model="scope.row.riskMargin"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="discounting" label="Discounting">
            <template slot-scope="scope">
              <span v-if="historyShow === '4'">{{
                scope.row.discounting
              }}</span>
              <el-input v-else v-model="scope.row.discounting"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="adjustedRiskMarginFactor"
            label="Adjusted Risk Margin factor"
          >
            <template slot-scope="scope">
              <span v-if="historyShow === '4'">{{
                scope.row.adjustedRiskMarginFactor
              }}</span>
              <el-input
                v-else
                v-model="scope.row.adjustedRiskMarginFactor"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="cedentRate" label="比例分出">
            <template slot-scope="scope">
              <span v-if="historyShow === '4'">{{ scope.row.cedentRate }}</span>
              <el-input
                v-else
                v-model="scope.row.cedentRate"
              ></el-input> </template
          ></el-table-column>
          <el-table-column prop="retroDacRate" label="转分保DAC比例">
            <template slot-scope="scope">
              <span v-if="historyShow === '4'">{{
                scope.row.retroDacRate
              }}</span>
              <el-input v-else v-model="scope.row.retroDacRate"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="monthHeader">
        <el-button @click="handleExport('uprRate', 'UPR计算比例')"
          >导出</el-button
        >
      </div>
      <div class="separateInfo">
        <h2>UPR计算比例</h2>
        <el-divider></el-divider>
        <!-- <fs-list-panel
        :ref="'uprRate'"
        :columns="uprRateColumns"
        :listData="uprRateListData"
      ></fs-list-panel> -->
        <el-table
          ref="uprRate"
          :data="uprRateListData"
          border
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column prop="policyMonth" label="Policy month" width="180">
          </el-table-column>
          <el-table-column
            v-for="(item, index) in uprRateList"
            :key="index"
            :prop="item.policyMonth"
            :label="item.policyMonth"
          >
            <template slot-scope="scope">
              <span v-if="historyShow === '4'"
                >{{ scope.row[item.policyMonth] }}
              </span>
              <el-input
                v-else
                @change="handleChange"
                placeholder="请输入内容"
                v-model="scope.row[item.policyMonth]"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          v-if="historyShow !== '4'"
          :loading="adjustLoading"
          type="primary"
          plain
          @click="handleUprRate"
          style="margin-top: 10px; margin-left: 45%"
          >确认调整</el-button
        >
      </div>
    </div>
    <div class="monthHeader">
      <el-button @click="handleExport('cedentInfo', '分出信息')"
        >导出</el-button
      >
    </div>
    <div class="separateInfo">
      <h2>分出信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :ref="'cedentInfo'"
        :columns="cedentColumns"
        :listData="cedentList"
      ></fs-list-panel>
    </div>

    <div class="monthHeader">
      <el-button @click="handleExport('upr', 'upr预估')">导出</el-button>
    </div>
    <div class="separateInfo">
      <h2>UPR预估</h2>
      <el-divider></el-divider>
      <el-table
        :data="UPRData"
        border
        style="width: 100%; margin-top: 20px"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column
          prop="calculatMonth"
          label="计算月份"
          width="180"
          fixed="left"
        >
        </el-table-column>
        <el-table-column prop="financePremium" label="月年缴保费" width="150">
          <template slot-scope="scope">
            <el-input
              placeholder="请输入内容"
              v-model="scope.row.financePremium"
            ></el-input>
            <!-- <span> {{ kiloSplitData(scope.row.financePremium) }} </span> -->
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in monthList"
          :key="index"
          :prop="item.month"
          :label="item.month"
          width="130"
        >
          <template slot-scope="scope">
            <!-- <el-input
              placeholder="请输入内容"
              disabled
              v-model="scope.row[item.month]"
            ></el-input> -->
            <span>{{ kiloSplitData(scope.row[item.month]) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        :loading="adjustLoading"
        type="primary"
        plain
        @click="handleEditPremium"
        style="margin-top: 10px; margin-left: 45%"
        >预估保费修改</el-button
      >
      <el-table
        :data="UPRData"
        ref="upr"
        v-show="false"
        border
        style="width: 100%; margin-top: 20px"
        :summary-method="getSummaries"
        show-summary
      >
        <el-table-column prop="calculatMonth" label="计算月份" width="180">
        </el-table-column>
        <el-table-column prop="financePremium" label="月年缴保费" width="150">
          <template slot-scope="scope">
            <span> {{ kiloSplitData(scope.row.financePremium) }} </span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in monthList"
          :key="index"
          :prop="item.month"
          :label="item.month"
          width="130"
        >
          <template slot-scope="scope">
            <span>{{ kiloSplitData(scope.row[item.month]) }}</span>
            <!-- <el-input
              v-else
              @keydown.native="keydown"
              :disabled="
                scope.row[item.month] === ' ' ||
                item.month < estimateMonth ||
                scope.row.commandFlag === '0'
              "
              placeholder=""
              v-model="scope.row[item.month]"
            ></el-input> -->
            <!-- <span v-show="!scope.row.show">{{scope.row.tab1}}</span> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="monthHeader">
      <el-button @click="handleExport('adjustForm', '计算后预估费用明细')"
        >导出</el-button
      >
    </div>
    <div class="separateInfo">
      <h2>计算后预估费用明细</h2>
      <el-divider></el-divider>
      <el-table :data="lastList" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="company" label="公司" width="200" fixed="left">
        </el-table-column>
        <el-table-column
          prop="calculatItem"
          label="计算项目"
          width="100"
          fixed="left"
        >
        </el-table-column>
        <el-table-column prop="currencyCode" label="币种" width="100">
        </el-table-column>
        <el-table-column
          width="150"
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
        :ref="'adjustForm'"
        :data="lastList"
        v-show="false"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="company" label="公司" width="200">
        </el-table-column>
        <el-table-column prop="calculatItem" label="计算项目" width="100">
        </el-table-column>
        <el-table-column prop="currencyCode" label="币种"> </el-table-column>
        <el-table-column
          width="150"
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
    <el-button
      plain
      class="checkDetial"
      @click="handleSave"
      v-if="historyShow !== '4'"
      >保存</el-button
    >
  </div>
</template>

<script>
import api from "@/utils/api";
import { $http } from "@/utils/request";
import { getMonthBetween, kiloSplit } from "@/utils/utils";

import * as XLSX from "xlsx";
import FileSaver from "file-saver";
export default {
  data() {
    return {
      historyShow: sessionStorage.getItem("licl"),
      adjustLoading: false,
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
          property: "cedent",
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
          title: "币种",
          property: "currencyCode",
        },
        // {
        //   title: "预估保费",
        //   property: "epi",
        //   formatter: "kiloSplit",
        // },
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
        // {
        //   title: "转分合同",
        //   property: "estimateStatus",
        //   formatter: "dict",
        //   dictName: "estimateStatus",
        // },
        {
          title: "合同状态",
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
        //   formatter: "toPercent",
        // },
        // {
        //   title: "分出浮动因子",
        //   property: "orpSlidingScaleAdjustRate",
        //   formatter: "toPercent",
        // },
        {
          title: "预估月份",
          property: "estimateMonth",
        },
      ],
      feeColumns: [
        {
          title: "DAC比例",
          property: "dacRate",
          formatter: "toPercent",
        },
        {
          title: "预计赔付率",
          property: "expectClaimRate",
          formatter: "toPercent",
        },
        {
          title: "预期XOL费用率",
          property: "expectXOLRate",
          formatter: "toPercent",
        },
        {
          title: "预计维持费用率",
          property: "expectMaintainRate",
          formatter: "toPercent",
        },
        {
          title: "Risk Margin",
          property: "riskMargin",
          formatter: "toPercent",
        },
        {
          title: "discounting",
          property: "discounting",
          formatter: "toPercent",
        },
        {
          title: "Adjusted Risk Margin Factor",
          property: "adjustedRiskMarginFactor",
          formatter: "toPercent",
        },
        {
          title: "分出比例",
          property: "cedentRate",
          formatter: "toPercent",
        },
        {
          title: "分出DAC比例",
          property: "retroDacRate",
          formatter: "toPercent",
        },
      ],
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
          title: "分出比例",
          property: "orpRate",
          formatter: "toPercent",
        },
      ],
      uprRateColumns: [
        {
          title: "Policy month",
          property: "policyMonth",
        },
      ],
      contractInfoList: [],
      feeInfoList: [],
      cedentList: [],
      uprRateList: [],
      uprRateListData: [],
      monthList: [],
      UPRData: [],
      calculatedFeeList: [],
      calculatedFeeList2: [],
      lastList: [],
      isDAC: false,
      // dacRateData: ''
    };
  },
  methods: {
    init() {
      $http
        .post("/estimate/actuarial/yearContractDetailQuery", {
          estimateKey: sessionStorage.getItem("jsAnnualEstimateKey"),
        })
        .then((res) => {
          // console.log(res, "rrrrrrrrreeeeeeeeeeeeeesssssssssssss");
          this.contractInfoList = [];
          this.feeInfoList = [];
          this.contractInfoList.push(res.data.data.contractInfo);
          this.feeInfoList.push(res.data.data.feeInfo);
          // localStorage.setItem("dacRateData", this.feeInfoList[0].dacRate);

          // this.dacRateData = res.data.data.dacRate
          this.cedentList = res.data.data.cedentList;
          let obj = { policyMonth: "UPR 分布" };
          this.uprRateList = res.data.data.uprRateList;
          // 对this.uprRAteList进行冒泡排序
          for (var i = 0; i < this.uprRateList.length; i++) {
            for (var j = 0; j < this.uprRateList.length - 1 - i; j++) {
              console.log(
                this.uprRateList.length[j],
                "this.uprRateList.length[j]"
              );
              if (
                Number(this.uprRateList[j].policyMonth) >
                Number(this.uprRateList[j + 1].policyMonth)
              ) {
                //相邻元素两两对比
                var temp = this.uprRateList[j + 1]; //元素交换
                this.uprRateList[j + 1] = this.uprRateList[j];
                this.uprRateList[j] = temp;
              }
            }
          }
          // 排序结束
          // console.log(this.uprRateList, 'this.uprRateListthis.uprRateListthis.uprRateListthis.uprRateList');
          this.uprRateList.map((item) => {
            obj[item.policyMonth] = item.uprRate;
          });
          this.uprRateListData = [];
          this.uprRateListData.push(obj);
          console.log(this.uprRateListData, "this.uprRateListData");
          let uprSplitInfo = res.data.data.uprEstimateList;
          this.dataProcess(uprSplitInfo);
          this.calculatedFeeList = res.data.data.calculatedFeeList;
          this.calculatedFeeList2 = res.data.data.calculatedFeeList;
          this.handleFloatChange();
        });
    },
    kiloSplitData(data) {
      return kiloSplit(data);
    },
    dataProcess(uprSplitInfo) {
      // 横向时间处理
      let startTime =
        uprSplitInfo.contractMonthBegin.slice(0, 4) +
        "-" +
        uprSplitInfo.contractMonthBegin.slice(4) +
        "-01";
      console.log(startTime, "startTime");
      let endTime = "";
      // 年份处理
      let monthInfo = uprSplitInfo.calculatMonths % 12;
      let yearsInfo = parseInt(uprSplitInfo.calculatMonths / 12);
      console.log(yearsInfo, "?????", monthInfo);
      let endYear =
        Number(uprSplitInfo.contractMonthBegin.slice(0, 4)) + yearsInfo;
      let endMonth =
        Number(uprSplitInfo.contractMonthBegin.slice(4)) + monthInfo;
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
      // uprEstimateList
      uprSplitInfo.uprSplitList.forEach((item) => {
        item.commandFlag = "0";
        Object.assign(item, newEPIObj);
      });

      console.log(uprSplitInfo.uprSplitList, "uprSplitInfo.uprEstimateList");
      // uprEstimateList
      uprSplitInfo.uprSplitList.forEach((item) => {
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
      this.UPRData = uprSplitInfo.uprSplitList;
      // // 合计累计预估加实际处理
      // console.log(uprSplitInfo.epiSplitSumList, "??????????????????????");
      // let epiSplitSumList = uprSplitInfo.epiSplitSumList;
      // let sumHeaderObj = cumulativeAmount;
      // let premiumHeaderObj = totalPremiumObj;
      // let allHeaderObj = sumObj;
      // allHeaderObj.calculatMonth = "合计";
      // sumHeaderObj.calculatMonth = "累计";
      // // sumHeaderObj.calculatedEPI = "";
      // // sumHeaderObj.originEPI = "";
      // // sumHeaderObj.manualAdjustEPI = "";
      // premiumHeaderObj.calculatMonth = "预估+实际";
      // epiSplitSumList.forEach((item) => {
      //   // for (var key in sumHeaderObj) {
      //   //   if (item.calculatMonth === key) {
      //   //     sumHeaderObj[key] = item.sumAmount;
      //   //   }
      //   // }
      //   // for (var key1 in premiumHeaderObj) {
      //   //   if (item.calculatMonth === key1) {
      //   //     premiumHeaderObj[key1] = item.cumulativeAmount;
      //   //   }
      //   // }
      //   // for (var key2 in allHeaderObj) {
      //   //   if (item.calculatMonth === key2) {
      //   //     allHeaderObj[key2] = item.totalPremium;
      //   //   }
      //   // }
      // });
      console.log(
        sumObj,
        "sumHeaderObjsumHeaderObjsumHeaderObjsumHeaderObjsumHeaderObjj"
      );
    },
    handleIsDAC() {
      if (this.isDAC === true) {
        $http
          .post(api.commRateQuery, {
            estimateKey: sessionStorage.getItem("jsAnnualEstimateKey"),
            lossRatioList: [{ lossRatio: this.feeInfoList[0].expectClaimRate }],
          })
          .then((res) => {
            this.feeInfoList[0].dacRate = res.data.data[0].commRate;
            // console.log(commRate, '??????')
          });
      } else {
        // console.log(dacRateData, "dacRateData");
        // this.feeInfoList[0].dacRate = localStorage.getItem("dacRateData");
      }
    },
    handleChangelossRatio(lossRatio) {
      console.log(lossRatio);
      if (this.isDAC === true) {
        $http
          .post(api.commRateQuery, {
            estimateKey: sessionStorage.getItem("jsAnnualEstimateKey"),
            lossRatioList: [{ lossRatio: this.feeInfoList[0].expectClaimRate }],
          })
          .then((res) => {
            this.feeInfoList[0].dacRate = res.data.data[0].commRate;
          });
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
    handleBack() {
      // this.$router.go(-1);
      if (localStorage.getItem('ActuarialGoto') === 'actuarialEstimates') {
      this.$router.push("/actuarialEstimates");
      } else if (localStorage.getItem('ActuarialGoto') === 'jsnViewHistory') {
        this.$router.push("/jsnViewHistory")
      }
      localStorage.removeItem("ActuarialGoto")
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
    },
    handleUprRate() {
      for (var key in this.uprRateListData[0]) {
        this.uprRateList.forEach((item) => {
          if (key === item.policyMonth) {
            item.uprRate = this.uprRateListData[0][key];
          }
        });
      }
      this.adjustLoading = true;

      this.$http
        .post(api.yearFeeRateAdjust, {
          estimateKey: sessionStorage.getItem("jsAnnualEstimateKey"),
          feeInfo: this.feeInfoList[0],
          uprRateList: this.uprRateList,
        })
        .then((res) => {
          if (res.data.code === "0") {
            this.$message.success("调整成功");
            // this.$router.push("/actuarialEstimates");
            this.init();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .finally(() => {
          this.adjustLoading = false;
        });
    },
    handleChange() {
      console.log(
        this.uprRateListData,
        "this.uprRateListDatathis.uprRateListDatathis.uprRateListDatathis.uprRateListData"
      );
      console.log(
        this.uprRateList,
        "this.uprRateList.uprRateList.uprRateList.uprRateList"
      );
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
    handleSave() {
      sessionStorage.removeItem("bookDetialHistory");
      sessionStorage.setItem("accountType", "1");
      $http
        .post(api.saveAdjust, {
          estimateKey: sessionStorage.getItem("jsAnnualEstimateKey"),
        })
        .then((res) => {
          if (res.data.code === "0") {
            this.$message.success("成功");
          }
        });
    },
    handleEditPremium () {
      console.log(this.UPRData, 'UPRDataUPRDataUPRDataUPRData');
      for (var key in this.uprRateListData[0]) {
        this.uprRateList.forEach((item) => {
          if (key === item.policyMonth) {
            item.uprRate = this.uprRateListData[0][key];
          }
        });
      }
      this.adjustLoading = true;
      console.log(this.UPRData, "UPRDataUPRDataUPRDataUPRDataUPRDataUPRData");
      let premiumList = [];
      this.UPRData.map((item) => {
        premiumList.push({
          calculatMonth: item.calculatMonth,
          financePremium: item.financePremium,
        });
      });

      this.$http
        .post(api.yearContractPremiumModify, {
          estimateKey: sessionStorage.getItem("jsAnnualEstimateKey"),
          premiumList: premiumList,
        })
        .then((res) => {
          if (res.data.code === "0") {
            this.$message.success("成功");
            this.contractInfoList = [];
            this.feeInfoList = [];
            this.contractInfoList.push(res.data.data.contractInfo);
            this.feeInfoList.push(res.data.data.feeInfo);
            this.cedentList = res.data.data.cedentList;
            let obj = { policyMonth: "UPR 分布" };
            this.uprRateList = res.data.data.uprRateList;
            // 对this.uprRAteList进行冒泡排序
            for (var i = 0; i < this.uprRateList.length; i++) {
              for (var j = 0; j < this.uprRateList.length - 1 - i; j++) {
                if (
                  Number(this.uprRateList[j].policyMonth) >
                  Number(this.uprRateList[j + 1].policyMonth)
                ) {
                  //相邻元素两两对比
                  var temp = this.uprRateList[j + 1]; //元素交换
                  this.uprRateList[j + 1] = this.uprRateList[j];
                  this.uprRateList[j] = temp;
                }
              }
            }
            // 排序结束
            this.uprRateList.map((item) => {
              obj[item.policyMonth] = item.uprRate;
            });
            this.uprRateListData = [];
            this.uprRateListData.push(obj);
            let uprSplitInfo = res.data.data.uprEstimateList;
            this.dataProcess(uprSplitInfo);
            this.calculatedFeeList = res.data.data.calculatedFeeList;
            this.calculatedFeeList2 = res.data.data.calculatedFeeList;
            this.handleFloatChange();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .finally(() => {
          this.adjustLoading = false;
        });
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.init());
  },
};
</script>

<style lang="scss" scoped>
.yearActuarail {
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
