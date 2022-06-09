<template>
  <div class="separateEstimateDetial">
    <div class="monthHeader">
      <el-button @click="handleExport('fccontract', '分出合同信息')"
        >导出</el-button
      >
      <el-button @click="handleBack">返回</el-button>
    </div>
    <div class="separateInfo">
      <h2>分出合同信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :ref="'fccontract'"
        :columns="fcolumns"
        :listData="fccontractInfoList"
      ></fs-list-panel>
    </div>
    <div class="monthHeader">
      <el-button @click="handleExport('cwfcContract', '分出比例信息')"
        >导出</el-button
      >
      <!-- <el-button @click="handleBack">返回</el-button> -->
    </div>
    <div class="separateInfo">
      <h2>分出比例信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :ref="'cwfcContract'"
        :columns="columns"
        :listData="contractInfoList"
      ></fs-list-panel>
    </div>
    <div class="monthHeader">
      <el-button @click="handleExport('cwfcCendent', '分入合同信息')"
        >导出</el-button
      >
    </div>
    <div class="separateInfo">
      <h2>分入合同信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :ref="'cwfcCendent'"
        :columns="cedentColumns"
        :listData="cedentList"
      ></fs-list-panel>
    </div>
    <div class="monthHeader">
      <el-button @click="handleExport('cwfcworkSheet', '分出账单信息')"
        >导出</el-button
      >
    </div>
    <div class="separateInfo">
      <h2>分出账单信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :ref="'cwfcworkSheet'"
        :columns="workSheetColumns"
        :listData="workSheetList"
      ></fs-list-panel>
    </div>
    <div class="monthHeader">
      <span style="padding-right: 20px">计算月份</span>
      <el-date-picker v-model="cMonth" type="month" placeholder="选择月">
      </el-date-picker>
      <el-button :loading="loading" @click="handleDownload()"
        >下载分入费用信息</el-button
      >
      <el-button @click="handleExport('cwfcAdjust', '计算后预估费用明细')"
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
          width="220"
          fixed="left"
        >
        </el-table-column>
        <el-table-column prop="currencyCode" label="币种" width="100"> </el-table-column>
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
        :ref="'cwfcAdjust'"
        :data="lastList"
        v-show="false"
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="company" label="公司" width="200">
        </el-table-column>
        <el-table-column prop="calculatItem" label="计算项目" width="220">
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
    <fs-list-panel
      v-show="false"
      :ref="'frfee'"
      :columns="frfeeColumns"
      :listData="frfeeList"
    ></fs-list-panel>
    <el-button plain class="checkDetial" @click="handleDetial"
      >查看入账明细</el-button
    >
  </div>
</template>

<script>
import { $http } from "@/utils/request";
import api from "@/utils/api";
import { kiloSplit, getYearMonthDate } from "@/utils/utils";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";


export default {
  data() {
    return {
      cMonth: "",
      loading: false,
      estimateMonth: sessionStorage.getItem("sepEstimateMonth"),
      totalEPI: "0",
      separateForm: {},
      frfeeColumns: [
        {
          title: "合同号",
          property: "contractNo",
        },
        {
          title: "合同标题",
          property: "contractTitle",
        },
        {
          title: "合同session",
          property: "classificName",
        },
        {
          title: "合同类型",
          property: "contractType",
        },
        {
          title: "合同类别",
          property: "contractClass",
        },
        {
          title: "合同开始时间",
          property: "effectivePeriodBegin",
        },
        {
          title: "合同结束时间",
          property: "effectivePeriodEnd",
        },
        {
          title: "预估月份",
          property: "estimateMonth",
        },
        {
          title: "计算月份",
          property: "calculatMonth",
        },
        {
          title: "计算公司",
          property: "partnerName",
        },
        {
          title: "计算项目",
          property: "calculatItem",
        },
        {
          title: "币种",
          property: "currencyCode",
        },
        {
          title: "分出合同号",
          property: "orpContractNo",
        },
        {
          title: "计算金额",
          property: "confirmAmount",
        },
      ],
      frfeeList: [],
      fcolumns: [
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
          title: "分出公司",
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
          title: "经纪费比例",
          property: "brokerageRate",
          formatter: "toPercent",
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
      fccontractInfoList: [],
      columns: [
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
      contractInfoList: [],
      cedentColumns: [
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
          title: "经纪费比例",
          property: "brokerageRate",
          formatter: "toPercent",
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
          width: 200,
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
          title: "账单开始时间",
          property: "acStartDate",
        },
        {
          title: "账单结束时间",
          property: "acEndDate",
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
      let params = sessionStorage.getItem("sepEstimateKey");
      $http
        .post(api.orpContractDetailQuery, {
          estimateKey: params,
        })
        .then((res) => {
          if (res.data.code === "0") {
            if (Array.isArray(res.data.data.contractInfo)) {
              this.fccontractInfoList = res.data.data.contractInfo;
            } else {
              this.fccontractInfoList = [];
              this.fccontractInfoList.push(res.data.data.contractInfo);
            }
            this.contractInfoList = res.data.data.orpCedentList;
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
    kiloSplitData(data) {
      return kiloSplit(data);
    },
    handleBack() {
      // this.$router.go(-1);
      this.$router.push("/separateEstimates");
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
    handleDownload() {
      this.loading = true;
      let params = sessionStorage.getItem("sepEstimateKey");
      $http
        .post(api.orpIabContractFeeQuery, {
          estimateKey: params,
          calculatMonth: getYearMonthDate(this.cMonth),
        })
        .then((res) => {
          console.log(
            res.data.data.iabCalculatedFeeList,
            "res.data.data.iabCalculatedFeeList"
          );
          this.frfeeList = res.data.data.iabCalculatedFeeList;
        })
        .finally(() => {
          this.handleExport("frfee", "分入费用信息");
          this.loading = false;
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
          // console.log(sums[index], "sums[index]");
          sums[index] = kiloSplit(sums[index].toFixed(2)) + " 元";
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
    handleDetial() {
      sessionStorage.removeItem("bookDetialHistory");
      // sessionStorage.setItem("accountType", "0");
      this.$router.push({ path: "/seBookedDetial" });
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
