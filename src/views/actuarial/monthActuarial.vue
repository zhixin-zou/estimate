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
        <el-button @click="handlefill()">一键填充</el-button>
        <el-button @click="handleExport('feeInfo', '费用信息')">导出</el-button>
      </div>
      <div class="separateInfo">
        <h2>费用信息</h2>
        <el-divider></el-divider>
        <fs-list-panel
          v-show="false"
          :ref="'feeInfo'"
          :columns="feeColumns"
          :listData="feeInfoList"
        ></fs-list-panel>
        <el-table
          :data="feeInfoList"
          border
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column prop="calculatMonth" label="计算月份">
          </el-table-column>
          <el-table-column prop="dacRate" label="DAC比例">
            <template slot-scope="scope">
              <span v-if="historyShow === '5'">{{ scope.row.dacRate }}</span>
              <el-input
                v-else
                v-model="scope.row.dacRate"
                @change="getIndex(scope.row, scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="expectClaimRate" label="预计赔付率">
            <template slot-scope="scope">
              <span v-if="historyShow === '5'">{{
                scope.row.expectClaimRate
              }}</span>
              <el-input
                v-else
                v-model="scope.row.expectClaimRate"
                @change="getIndex(scope.row, scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="expectXOLRate" label="预期XOL費用率">
            <template slot-scope="scope">
              <span v-if="historyShow === '5'">{{
                scope.row.expectXOLRate
              }}</span>
              <el-input
                v-else
                v-model="scope.row.expectXOLRate"
                @change="getIndex(scope.row, scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="expectMaintainRate" label="预计维持費用">
            <template slot-scope="scope">
              <span v-if="historyShow === '5'">{{
                scope.row.expectMaintainRate
              }}</span>
              <el-input
                v-else
                v-model="scope.row.expectMaintainRate"
                @change="getIndex(scope.row, scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="riskMargin" label="Risk Margin">
            <template slot-scope="scope">
              <span v-if="historyShow === '5'">{{ scope.row.riskMargin }}</span>
              <el-input
                v-else
                v-model="scope.row.riskMargin"
                @change="getIndex(scope.row, scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="discounting" label="Discounting">
            <template slot-scope="scope">
              <span v-if="historyShow === '5'">{{
                scope.row.discounting
              }}</span>
              <el-input
                v-else
                v-model="scope.row.discounting"
                @change="getIndex(scope.row, scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="adjustedRiskMarginFactor"
            label="Adjusted Risk Margin factor"
          >
            <template slot-scope="scope">
              <span v-if="historyShow === '5'">{{
                scope.row.adjustedRiskMarginFactor
              }}</span>
              <el-input
                v-else
                v-model="scope.row.adjustedRiskMarginFactor"
                @change="getIndex(scope.row, scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="cedentRate" label="比例分出">
            <template slot-scope="scope">
              <span v-if="historyShow === '5'">{{ scope.row.cedentRate }}</span>
              <el-input
                v-else
                v-model="scope.row.cedentRate"
                @change="getIndex(scope.row, scope.$index)"
              ></el-input> </template
          ></el-table-column>
          <el-table-column prop="retroDacRate" label="转分保DAC比例">
            <template slot-scope="scope">
              <span v-if="historyShow === '5'">{{
                scope.row.retroDacRate
              }}</span>
              <el-input
                v-else
                v-model="scope.row.retroDacRate"
                @change="getIndex(scope.row, scope.$index)"
              ></el-input>
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
              <span v-if="historyShow === '5'">{{
                scope.row[item.policyMonth]
              }}</span>
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
          v-if="historyShow !== '5'"
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
      <el-table :data="UPRData" border style="width: 100%; margin-top: 20px">
        <el-table-column prop="class" label=" " width="180" fixed="left">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in uprEstimateList"
          :key="index"
          :prop="item.calculatMonth"
          :label="item.calculatMonth"
          width="130"
        >
          <template slot-scope="scope">
            <span>{{ kiloSplitData(scope.row[item.calculatMonth]) }}</span>
            <!-- <el-input
              placeholder=""
              v-model="scope.row[item.calculatMonth]"
            ></el-input> -->
            <!-- <span v-show="!scope.row.show">{{scope.row.tab1}}</span> -->
          </template>
        </el-table-column>
      </el-table>
      <el-table
        :data="UPRData"
        ref="upr"
        v-show="false"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="class" label=" " width="180"> </el-table-column>
        <el-table-column
          v-for="(item, index) in uprEstimateList"
          :key="index"
          :prop="item.calculatMonth"
          :label="item.calculatMonth"
          width="130"
        >
          <template slot-scope="scope">
            <span>{{ kiloSplitData(scope.row[item.calculatMonth]) }}</span>
            <!-- <el-input
              placeholder=""
              v-model="scope.row[item.calculatMonth]"
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
        <el-table-column prop="calculatItem" label="计算项目" width="200" fixed="left">
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
      <el-table
        :ref="'adjustForm'"
        :data="lastList"
        v-show="false"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="company" label="公司" width="200">
        </el-table-column>
        <el-table-column prop="calculatItem" label="计算项目" width="200">
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
import { kiloSplit } from "@/utils/utils";

import * as XLSX from "xlsx";
import FileSaver from "file-saver";
export default {
  data() {
    return {
      feeIndex: Number,
      adjustLoading: false,
      historyShow: sessionStorage.getItem("licl"),
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
        // {
        //   title: "预估月份",
        //   property: "estimateMonth",
        // },
      ],
      feeColumns: [
        {
          title: "计算月份",
          property: "calculatMonth",
        },
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

      feeInfoListCopy: JSON.parse(localStorage.getItem("feeInfoListCopy")),

      cedentList: [],
      uprRateList: [],
      uprRateListData: [],
      // monthList: [],
      UPRData: [],
      calculatedFeeList: [],
      calculatedFeeList2: [],
      lastList: [],
      uprEstimateList: [],
    };
  },
  methods: {
    init() {
      $http
        .post(api.actuarialMonthContractDetail, {
          estimateKey: sessionStorage.getItem("jsMonthEstimateKey"),
        })
        .then((res) => {
          // console.log(res, "rrrrrrrrreeeeeeeeeeeeeesssssssssssss");
          this.contractInfoList = [];
          this.feeInfoList = [];
          this.contractInfoList.push(res.data.data.contractInfo);
          this.feeInfoList = res.data.data.feeList;
          if (res.data.data.feeList.length !== 0) {
            localStorage.setItem(
              "feeInfoListCopy",
              JSON.stringify(res.data.data.feeList)
            );
          }
          this.cedentList = res.data.data.cedentList;
          let obj = { policyMonth: "UPR 分布" };
          this.uprRateList = res.data.data.uprRateList;
          this.uprRateList.map((item) => {
            obj[item.policyMonth] = item.uprRate;
          });
          console.log(this.uprRateList, obj, "??????????????");
          this.uprRateListData = [];
          this.uprRateListData.push(obj);
          console.log(this.uprRateListData, "this.uprRateListData");
          this.uprEstimateList = res.data.data.uprEstimateList;
          let upryuguList = [{ class: "月预估保费" }, { class: "预估UPR" }];
          let uprObj = {};
          this.uprEstimateList.forEach((item) => {
            uprObj[item.calculatMonth] = item.calculatMonth;
          });
          upryuguList.forEach((item) => {
            Object.assign(item, uprObj);
          });
          upryuguList.forEach((item) => {
            if (item.class === "月预估保费") {
              for (var key in item) {
                this.uprEstimateList.forEach((e) => {
                  if (key === e.calculatMonth) {
                    item[key] = e.financeEPI;
                  }
                });
              }
            } else {
              for (var key2 in item) {
                this.uprEstimateList.forEach((e) => {
                  if (key2 === e.calculatMonth) {
                    item[key2] = e.uprAmount;
                  }
                });
              }
            }
          });
          console.log(upryuguList, "upryuguListupryuguList");
          this.UPRData = upryuguList;
          this.calculatedFeeList = res.data.data.calculatedFeeList;
          this.calculatedFeeList2 = res.data.data.calculatedFeeList;
          this.handleFloatChange();
        });
    },
    kiloSplitData(data) {
      return kiloSplit(data);
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
      this.$router.push('/actuarialEstimates')
      
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
    getIndex(el, index) {
      console.log(el, index);
      this.feeIndex = index;
    },
    handlefill() {
      // let arr = [];
      // let finI = Number;
      // if (localStorage.getItem("feeInfoListCopy") !== "") {
      //   arr = JSON.parse(localStorage.getItem("feeInfoListCopy"));
      // }
      // for (var i = 0; i < this.feeInfoList.length; i++) {
      //   if (JSON.stringify(arr[i]) !== JSON.stringify(this.feeInfoList[i])) {
      //     console.log(
      //       JSON.stringify(arr[i]),
      //       JSON.stringify(this.feeInfoList[i]),
      //       "JSON.stringify(this.feeInfoList[i])JSON.stringify(this.feeInfoList[i])"
      //     );
      //     // console.log(i, "iii");
      //     finI = i;
      //   }
      // }
      console.log(this.feeIndex, "finI");
      for (var k = this.feeIndex + 1; k < this.feeInfoList.length; k++) {
        this.feeInfoList[k].dacRate = this.feeInfoList[this.feeIndex].dacRate;
        this.feeInfoList[k].expectClaimRate =
          this.feeInfoList[this.feeIndex].expectClaimRate;
        this.feeInfoList[k].expectXOLRate =
          this.feeInfoList[this.feeIndex].expectXOLRate;
        this.feeInfoList[k].expectMaintainRate =
          this.feeInfoList[this.feeIndex].expectMaintainRate;
        this.feeInfoList[k].riskMargin =
          this.feeInfoList[this.feeIndex].riskMargin;
        this.feeInfoList[k].discounting =
          this.feeInfoList[this.feeIndex].discounting;
        this.feeInfoList[k].retroDacRate =
          this.feeInfoList[this.feeIndex].retroDacRate;
                this.feeInfoList[k].cedentRate =
          this.feeInfoList[this.feeIndex].cedentRate;
        this.feeInfoList[k].adjustedRiskMarginFactor =
          this.feeInfoList[this.feeIndex].adjustedRiskMarginFactor;
      }
      console.log(this.feeInfoList, " this.feeInfoList this.feeInfoList");
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
        .post(api.monthFeeRateAdjust, {
          estimateKey: sessionStorage.getItem("jsMonthEstimateKey"),
          feeList: this.feeInfoList,
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
          estimateKey: sessionStorage.getItem("jsMonthEstimateKey"),
        })
        .then((res) => {
          if (res.data.code === "0") {
            this.$message.success("成功");
          }
        });
    },
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
