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
        <span style="padding-right: 20px">是否根据赔付率获取手续费比例</span>
        <el-switch
          v-model="isDAC"
          active-text="是"
          inactive-text="否"
          @change="handleIsDAC"
        >
        </el-switch>
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
              <span
                v-if="
                  historyShow === '5' ||
                  isDAC === true ||
                  premiumUpdateFlag === 'N'
                "
                >{{ scope.row.dacRate }}</span
              >
              <el-input
                v-else
                v-model="scope.row.dacRate"
                @change="getIndex(scope.row, scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="expectClaimRate" label="预计赔付率">
            <template slot-scope="scope">
              <span v-if="historyShow === '5' || premiumUpdateFlag === 'N'">{{
                scope.row.expectClaimRate
              }}</span>
              <el-input
                v-else
                v-model="scope.row.expectClaimRate"
                @blur="
                  handleChangelossRatio(scope.row.expectClaimRate, scope.$index)
                "
                @change="getIndex(scope.row, scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="expectXOLRate" label="预期XOL費用率">
            <template slot-scope="scope">
              <span v-if="historyShow === '5' || premiumUpdateFlag === 'N'">{{
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
              <span v-if="historyShow === '5' || premiumUpdateFlag === 'N'">{{
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
              <span v-if="historyShow === '5' || premiumUpdateFlag === 'N'">{{
                scope.row.riskMargin
              }}</span>
              <el-input
                v-else
                v-model="scope.row.riskMargin"
                @change="getIndex(scope.row, scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="discounting" label="Discounting">
            <template slot-scope="scope">
              <span v-if="historyShow === '5' || premiumUpdateFlag === 'N'">{{
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
              <span v-if="historyShow === '5' || premiumUpdateFlag === 'N'">{{
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
              <span v-if="historyShow === '5' || premiumUpdateFlag === 'N'">{{
                scope.row.cedentRate
              }}</span>
              <el-input
                v-else
                v-model="scope.row.cedentRate"
                @change="getIndex(scope.row, scope.$index)"
              ></el-input> </template
          ></el-table-column>
          <el-table-column prop="retroDacRate" label="转分保DAC比例">
            <template slot-scope="scope">
              <span v-if="historyShow === '5' || premiumUpdateFlag === 'N'">{{
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

    <div class="separateInfo" v-if="premiumUpdateFlag !== 'N'">
      <span style="width: 400px; font-size: 20px; font-weight: 600"
        >EPI拆分</span
      >
      <el-button
        class="historyQuery"
        @click="handleExport('epiData', 'epi')"
        style="float: right"
        >导出</el-button
      >
      <el-divider></el-divider>
      <el-table :data="EPIData" border style="width: 100%; margin-top: 20px">
        <el-table-column
          fixed="left"
          prop="calculatMonth"
          label="计算月份"
          width="180"
        >
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
          <template slot-scope="scope">
            <span
              v-if="
                scope.row.calculatMonth === '累计' ||
                scope.row.calculatMonth === '预估+实际' ||
                scope.row.calculatMonth === '合计' ||
                scope.row.calculatMonth === '原始epi' ||
                scope.row.calculatMonth === '调整epi' ||
                scope.row.calculatMonth === '实际账单金额' ||
                scope.row.calculatMonth === '实际账单金额调整' ||
                scope.row.calculatMonth === '精算计算金额' ||
                scope.row.calculatMonth === '计算后epi' ||
                historyShow === '2'
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
        <!-- <el-table-column
          prop="workSheetAdjustEPI"
          label="实际账单调整"
          width="200"
        >
        </el-table-column> -->
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
                scope.row.calculatMonth === '原始epi' ||
                scope.row.calculatMonth === '调整epi' ||
                scope.row.calculatMonth === '实际账单金额' ||
                scope.row.calculatMonth === '实际账单金额调整' ||
                scope.row.calculatMonth === '精算计算金额' ||
                scope.row.calculatMonth === '计算后epi' ||
                historyShow === '5'
              "
              >{{ kiloSplitData(scope.row[item.month]) }}</span
            >
            <el-input
              v-else
              @keydown.native="keydown"
              :disabled="
                scope.row[item.month] === ' ' ||
                item.month < estimateMonth ||
                (scope.row.commandFlag === '0' &&
                  scope.row.calculatMonth !== '合计')
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
          v-for="(item, index) in monthList"
          :key="index"
          :prop="item.month"
          :label="item.month"
          width="130"
        >
        </el-table-column>
      </el-table>
      <!-- <span
        >温馨提示：每月6号前调整的可调整上月EPI，每月6号后只能调整本月EPI</span
      > -->
      <br />
      <!-- <el-dropdown
        v-if="historyShow !== '5'"
        :loading="dropLoading"
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
      </el-dropdown> -->
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
      <el-button
        :loading="adjustLoading"
        type="primary"
        plain
        @click="handleEditPremium"
        style="margin-top: 10px; margin-left: 45%"
        >试算</el-button
      >
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
        <el-table-column
          prop="calculatItem"
          label="计算项目"
          width="200"
          fixed="left"
        >
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
import { getMonthBetween, kiloSplit } from "@/utils/utils";

import * as XLSX from "xlsx";
import FileSaver from "file-saver";
export default {
  data() {
    return {
      feeIndex: Number,
      adjustLoading: false,
      premiumUpdateFlag: "N",
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
        {
          title: "预估月份",
          property: "estimateMonth",
        },
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
      isDAC: false,
      totalEPI: "",
      commandFlag: "0",
      EPIData: [],
      monthList: [],
      dropLoading: false,
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
          this.premiumUpdateFlag =
            res.data.data.contractInfo.premiumUpdateFlag || "N";
          this.feeInfoList = res.data.data.feeList;
          // localStorage.setItem("dacRateData", this.feeInfoList[0].dacRate);

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
      $http
        .post(api.monthSpiltViewDetailQuery, {
          estimateKey: sessionStorage.getItem("jsMonthEstimateKey"),
          viewType: "1",
          accountType: "1",
        })
        .then((res) => {
          // console.log(res, "resrrrrrrrrrrrrrrrrrr");
          let epiSplitInfo = res.data.data.epiSplitInfo;
          // this.epiDatacopy = res.data.data.epiSplitInfo.epiSplitList
          localStorage.setItem(
            "epiDatacopy",
            JSON.stringify(res.data.data.epiSplitInfo.epiSplitList)
          );
          this.totalEPI = epiSplitInfo.totalEPI;
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
    handleIsDAC() {
      if (this.isDAC === true) {
        console.log(this.feeInfoList, "feeInfoList");
        let lossRatioList = [];
        this.feeInfoList.forEach((item) => {
          lossRatioList.push({ lossRatio: item.expectClaimRate });
        });
        console.log(lossRatioList, "lossRatioList");
        $http
          .post(api.commRateQuery, {
            estimateKey: sessionStorage.getItem("jsMonthEstimateKey"),
            lossRatioList: lossRatioList,
          })
          .then((res) => {
            if (res.data.data.length === 1) {
              this.feeInfoList.forEach((item) => {
                item.dacRate = res.data.data[0].commRate;
              });
            } else {
              this.feeInfoList.forEach((item) => {
                res.data.data.forEach((element) => {
                  if (item.expectClaimRate === element.lossRatio) {
                    item.dacRate = element.commRate;
                  }
                });
              });
            }
            // this.feeInfoList[0].dacRate = res.data.data.commRate;
          });
      } else {
        // console.log(dacRateData, "dacRateData");
        // this.feeInfoList[0].dacRate = localStorage.getItem("dacRateData");
      }
    },
    handleChangelossRatio(ratio, index) {
      console.log(ratio, index);
      if (this.isDAC === true) {
        $http
          .post(api.commRateQuery, {
            estimateKey: sessionStorage.getItem("jsMonthEstimateKey"),
            lossRatioList: [{ lossRatio: ratio }],
          })
          .then((res) => {
            this.feeInfoList[index].dacRate = res.data.data[0].commRate;
          });
      }
    },
    handleBack() {
      // this.$router.go(-1);
      if (localStorage.getItem("ActuarialGoto") === "actuarialEstimates") {
        this.$router.push("/actuarialEstimates");
      } else if (localStorage.getItem("ActuarialGoto") === "jsyViewHistory") {
        this.$router.push("/jsyViewHistory");
      }
      localStorage.removeItem("ActuarialGoto");
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
    dataProcess(epiSplitInfo) {
      // 横向时间处理
      let startTime =
        epiSplitInfo.contractMonthBegin.slice(0, 4) +
        "-" +
        epiSplitInfo.contractMonthBegin.slice(4) +
        "-01";
      // console.log(startTime, "startTime");
      let endTime = "";
      // 年份处理
      let monthInfo = epiSplitInfo.calculatMonths % 12;
      let yearsInfo = parseInt(epiSplitInfo.calculatMonths / 12);
      // console.log(yearsInfo, "?????", monthInfo);
      let endYear =
        Number(epiSplitInfo.contractMonthBegin.slice(0, 4)) + yearsInfo;
      let endMonth =
        Number(epiSplitInfo.contractMonthBegin.slice(4)) + monthInfo;
      // console.log(endYear, endMonth, "===============");
      if (endMonth > 12) {
        endYear += 1;
        endMonth = endMonth - 12;
      }
      if (endMonth < 10) {
        endTime = String(endYear) + "-0" + String(endMonth - 1) + "-01";
      } else {
        endTime = String(endYear) + "-" + String(endMonth - 1) + "-01";
      }
      // console.log(endTime, "endTime");
      this.monthList = getMonthBetween(startTime, endTime);
      // console.log(this.monthList, "monthList");
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
            // console.log(idx, "idx");
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
        // console.log(lastData, "lastData");
        for (var p in item) {
          for (var q in lastData) {
            if (p === q) {
              item[p] = lastData[q];
            }
          }
          // console.log(item[p], p);
          if (item[p] === "") {
            item[p] = " ";
          }
        }
        // console.log(item, "item");
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
            // console.log(
            //   workSheetAmountHeaderSum,
            //   "workSheetAmountHeader",
            //   key5
            // );
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
      // console.log(
      //   sumObj,
      //   originEPIObj,
      //   "sumHeaderObjsumHeaderObjsumHeaderObjsumHeaderObjsumHeaderObjj"
      // );
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
    },
    handleTotalEPI() {
      if (this.totalEPI === "") {
        this.$message.warning("请输入需要调整的总EPI");
        return;
      }
      this.adjustLoading = true;
      $http
        .post(api.monthTotalEPIAdjust, {
          totalEPI: this.totalEPI,
          estimateKey: sessionStorage.getItem("jsMonthEstimateKey"),
        })
        .then((res) => {
          if (res.data.code == "0") {
            let epiSplitInfo = res.data.data.epiSplitInfo;
            // this.epiDatacopy = res.data.data.epiSplitInfo.epiSplitList
            localStorage.setItem(
              "epiDatacopy",
              JSON.stringify(res.data.data.epiSplitInfo.epiSplitList)
            );
            this.totalEPI = epiSplitInfo.totalEPI;
            this.dataProcess(epiSplitInfo);
            this.$message.success("修改成功");
          } else {
            this.$messag.error(res.data.msg);
          }
        })
        .finally(() => {
          this.adjustLoading = false;
        });
    },
    handleAdjustEPI() {
      // console.log(
      //   JSON.parse(localStorage.getItem("epiDatacopy")),
      //   "epiDatacopy",
      //   this.EPIData,
      //   "sadad"
      // );
      let monthEpiSplitList = JSON.parse(localStorage.getItem("epiDatacopy"));
      this.dropLoading = true;
      if (this.commandFlag === "0") {
        this.EPIData.forEach((item) => {
          monthEpiSplitList.forEach((e) => {
            if (item.calculatMonth === e.calculatMonth) {
              e.manualAdjustEPI = item.manualAdjustEPI;
            }
          });
        });
        this.sumDataList = [];
        this.EPIData.forEach((item) => {
          if (item.calculatMonth === "合计") {
            for (let key in item) {
              // console.log(key, "key");
              this.sumDataList.push({
                calculatMonth: key,
                sumAmount: item[key],
              });
            }
            this.sumDataList = this.sumDataList.splice(
              0,
              this.sumDataList.length - 2
            );
            console.log(this.sumDataList, "Object.keys(item)");
          }
        });
        // console.log(
        //   this.EPIData,
        //   "this.EPIDatathis.EPIDatathis.EPIDatathis.EPIDatathis.EPIDatathis.EPIDatathis.EPIData"
        // );

        console.log(monthEpiSplitList, this.EPIData, "monthEpiSplitList");
        $http
          .post(api.monthDetailEPIAdjust, {
            estimateKey: sessionStorage.getItem("jsMonthEstimateKey"),
            monthAdjustType: this.commandFlag,
            monthEpiSplitList: monthEpiSplitList,
            epiSplitSumList: this.sumDataList,
          })
          .then((res) => {
            if (res.data.code == "0") {
              let epiSplitInfo = res.data.data.epiSplitInfo;
              localStorage.setItem(
                "epiDatacopy",
                JSON.stringify(res.data.data.epiSplitInfo.epiSplitList)
              );
              this.totalEPI = epiSplitInfo.totalEPI;

              this.dataProcess(epiSplitInfo);

              this.$message.success("修改成功");
            } else {
              this.$messag.error(res.data.msg);
            }
          })
          .finally(() => {
            this.dropLoading = false;
          });
      } else {
        this.sumDataList = [];
        this.EPIData.forEach((item) => {
          if (item.calculatMonth === "合计") {
            for (let key in item) {
              // console.log(key, "key");
              this.sumDataList.push({
                calculatMonth: key,
                sumAmount: item[key],
              });
            }
            this.sumDataList = this.sumDataList.splice(
              0,
              this.sumDataList.length - 2
            );
            console.log(this.sumDataList, "Object.keys(item)");
          }
        });
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
            estimateKey: sessionStorage.getItem("jsMonthEstimateKey"),
            monthAdjustType: this.commandFlag,
            monthEpiSplitList: monthEpiSplitList,
            epiSplitSumList: this.sumDataList,
          })
          .then((res) => {
            if (res.data.code == "0") {
              let epiSplitInfo = res.data.data.epiSplitInfo;
              // this.epiDatacopy = res.data.data.epiSplitInfo.epiSplitList
              localStorage.setItem(
                "epiDatacopy",
                JSON.stringify(res.data.data.epiSplitInfo.epiSplitList)
              );
              this.totalEPI = epiSplitInfo.totalEPI;
              this.dataProcess(epiSplitInfo);
              this.$message.success("修改成功");
              this.commandFlag = "0";
            } else {
              this.$messag.error(res.data.msg);
            }
          })
          .finally(() => {
            this.dropLoading = false;
          });
        console.log(monthEpiSplitList, "epiList");
      }
    },
    handleCommand(command) {
      this.commandFlag = command;
      this.EPIData.forEach((item) => {
        item.commandFlag = this.commandFlag;
      });
      // console.log(this.commandFlag);
    },
    handleEditPremium() {
      for (var key in this.uprRateListData[0]) {
        this.uprRateList.forEach((item) => {
          if (key === item.policyMonth) {
            item.uprRate = this.uprRateListData[0][key];
          }
        });
      }
      console.log(this.UPRData, "this.UPRData");
      let premiumList = [];
      this.UPRData.map((item) => {
        if (item.class === "月预估保费") {
          for (var key in item) {
            console.log(key, item[key]);
            key === "class"
              ? console.log("class")
              : premiumList.push({
                  calculatMonth: key,
                  financePremium: item[key],
                  // uprAmount: "",
                });
          }
        }
        // if (item.class === "预估UPR") {
        //   // console.log(premiumList, 'premiumList');
        //   premiumList.map((e) => {
        //     for (var key in item) {
        //       if (e.calculatMonth === key) {
        //         e.uprAmount = item[key]
        //       }
        //     }
        //   })
        // }
      });
      console.log(premiumList, "premiumList");
      this.adjustLoading = true;
      this.$http
        .post(api.monthContractPremiumModify, {
          estimateKey: sessionStorage.getItem("jsMonthEstimateKey"),
          // feeList: this.feeInfoList,
          // uprRateList: this.uprRateList,
          premiumList: premiumList,
        })
        .then((res) => {
          if (res.data.code === "0") {
            this.$message.success("调整成功");
            // this.$router.push("/actuarialEstimates");
            // this.init();
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
            this.uprRateListData = [];
            this.uprRateListData.push(obj);
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
            this.UPRData = upryuguList;
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
    .dropdownButton {
      margin-left: 45%;
    }
  }
  .checkDetial {
    margin-left: 45%;
  }
}
</style>
