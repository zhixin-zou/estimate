<template>
  <div class="calculationResult">
    <div class="searchHeader">
      <span style="padding-right: 20px">预估月份</span>
      <el-date-picker v-model="estimateMonth" type="month" placeholder="选择月">
      </el-date-picker>
      <span style="padding-left: 20px">请选择汇算class</span>
      <el-select v-model="classCode" placeholder="请选择" style="padding: 0 20px">
        <el-option
          v-for="(item, index) in classList"
          :key="index"
          :label="item.className"
          :value="item.classCode"
        ></el-option>
      </el-select>
      <el-button type="primary" round @click="handleClick" :loading="loading"
        >汇算</el-button
      >
      <el-button type="primary" round @click="handleCheckClick" :loading="loading"
        >查询</el-button
      >
      <div
        v-if="this.estimateMonthShow !== ''"
        class="headerRight"
        style="float: right; line-height: 36px"
      >
        <h3>预估月份：{{ this.estimateMonthShow }}</h3>
      </div>
    </div>
    <div class="calculationResultBody" v-show="showTable">
      <div class="sectionResult" style="margin-top: 30px">
        <div class="monthHeader">
          <el-button @click="handleBack">返回</el-button>
          <el-button @click="handleExport('hsqContract', '汇算前合同信息')"
            >导出</el-button
          >
        </div>
        <div class="separateInfo">
          <h2>汇算前合同信息</h2>
          <el-divider></el-divider>
          <fs-list-panel
            v-show="false"
            :ref="'hsqContract'"
            :columns="hsqColumns"
            :listData="hsqContractInfoList"
          ></fs-list-panel>
          <el-table
            v-for="item in hsqList"
            :key="item.contractNo"
            :data="item.data"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column prop="contractinfo" :label="item.contractNo" width="180">
            </el-table-column>
            <el-table-column prop="Gross" label="Gross"> </el-table-column>
            <el-table-column prop="Net" label="Net"> </el-table-column>
            <el-table-column prop="Retro" label="Retro"> </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="sectionResult" style="margin-top: 30px">
        <div class="monthHeader">
          <el-button @click="handleExport('xzhzContract', 'class汇总信息')"
            >导出</el-button
          >
        </div>
        <div class="separateInfo">
          <h2>class汇总信息</h2>
          <el-divider></el-divider>
          <fs-list-panel
            v-show="false"
            :ref="'xzhzContract'"
            :columns="hsxzColumns"
            :listData="hsxzDataList"
          ></fs-list-panel>
          <el-table
            v-for="(item, index) in xzhzList"
            :key="index"
            :data="item.data"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column prop="contractinfo" :label="item.className" width="180">
            </el-table-column>
            <el-table-column prop="Gross" label="Gross"> </el-table-column>
            <el-table-column prop="Net" label="Net"> </el-table-column>
            <el-table-column prop="Retro" label="Retro"> </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="sectionResult" style="margin-top: 30px">
        <div class="monthHeader">
          <el-button @click="handleExport('hshContract', '汇算后合同信息')"
            >导出</el-button
          >
        </div>
        <div class="separateInfo">
          <h2>汇算后合同信息</h2>
          <el-divider></el-divider>
          <fs-list-panel
            v-show="false"
            :ref="'hshContract'"
            :columns="hshColumns"
            :listData="hshContractInfoList"
          ></fs-list-panel>
          <el-table
            v-for="item in hshList"
            :key="item.contractNo"
            :data="item.data"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column prop="contractinfo" :label="item.contractNo" width="180">
            </el-table-column>
            <el-table-column prop="Gross" label="Gross"> </el-table-column>
            <el-table-column prop="Net" label="Net"> </el-table-column>
            <el-table-column prop="Retro" label="Retro"> </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="sectionResult" style="margin-top: 30px">
        <div class="monthHeader">
          <el-button @click="handleExport('xfcwInfo', '最终下发财务信息')"
            >导出</el-button
          >
        </div>
        <div class="separateInfo">
          <h2>最终下发财务信息</h2>
          <el-divider></el-divider>
          <!-- <fs-list-panel
            :ref="'xfcwInfo'"
            :columns="xfcwColumns"
            :listData="lastList"
          ></fs-list-panel> -->
          <el-table :data="lastList" border style="width: 100%; margin-top: 20px">
            <el-table-column prop="company" label="公司" width="180" fixed="left">
            </el-table-column>
            <el-table-column prop="calculatItem" label="计算项目" fixed="left">
            </el-table-column>
            <el-table-column prop="currencyCode" label="币种" width="100">
            </el-table-column>
            <el-table-column
              v-for="(item, index) in calculatedFeeList"
              :key="index"
              :prop="item.contractNo"
              :label="item.contractNo"
            >
              <!-- <template slot-scope="scope">
                <span>{{ kiloSplitData(scope.row[item.calculatMonth]) }}</span>
              </template> -->
            </el-table-column>
          </el-table>
          <el-table
            v-show="false"
            ref="xfcwInfo"
            :data="lastList"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column prop="company" label="公司" width="180"> </el-table-column>
            <el-table-column prop="calculatItem" label="计算项目"> </el-table-column>
            <el-table-column prop="currencyCode" label="币种"> </el-table-column>
            <el-table-column
              v-for="(item, index) in calculatedFeeList"
              :key="index"
              :prop="item.contractNo"
              :label="item.contractNo"
            >
              <!-- <template slot-scope="scope">
                <span>{{ kiloSplitData(scope.row[item.calculatMonth]) }}</span>
              </template> -->
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="saveToFinance">
        <el-button
          plain
          v-show="istrycalculate"
          @click="saveToFinance"
          style="margin-top: 10px; margin-left: 45%"
          >确认并下发财务</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import { $http } from "@/utils/request";
import { kiloSplit, getYearMonthDate } from "@/utils/utils";
// import { getText } from "@/utils/dict.js";
import api from "@/utils/api";
import { mapState, mapActions } from "vuex";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";

export default {
  data() {
    return {
      istrycalculate: false,
      loading: false,
      classCode: "",

      // productList: [],
      hsqColumns: [
        {
          title: "合同号",
          property: "contractNo",
        },
        {
          title: "费用项目UPR/DAC/URR/PDR",
          property: "feeItem",
        },
        {
          title: "分入分出类型",
          property: "inOutItem",
        },
        {
          title: "币种",
          property: "currencyCode",
        },
        {
          title: "金额",
          property: "amount",
        },
      ],
      hsxzColumns: [
        {
          title: "类别名称",
          property: "className",
        },
        {
          title: "费用项目UPR/DAC/URR/PDR",
          property: "feeItem",
        },
        {
          title: "分入分出类型",
          property: "inOutItem",
        },
        {
          title: "币种",
          property: "currencyCode",
        },
        {
          title: "金额",
          property: "amount",
        },
      ],
      hshColumns: [
        {
          title: "合同号",
          property: "contractNo",
        },
        {
          title: "费用项目UPR/DAC/URR/PDR",
          property: "feeItem",
        },
        {
          title: "分入分出类型",
          property: "inOutItem",
        },
        {
          title: "币种",
          property: "currencyCode",
        },
        {
          title: "金额",
          property: "amount",
        },
      ],
      xfcwColumns: [],
      hsqList: [],
      hshList: [],
      hsqContractInfoList: [],
      xzhzList: [],
      hsxzDataList: [],
      hshContractInfoList: [],
      lastList: [],
      calculatedFeeList: [],
      calculatedFeeList2: [],
      showTable: false,
      estimateMonth: "",
      estimateMonthShow: "",
    };
  },
  computed: {
    ...mapState("actuarial/actuarialEstimates", ["classList"]),
  },
  methods: {
    ...mapActions("actuarial/actuarialEstimates", ["getClassList"]),
    init() {
      this.getClassList();
      this.estimateMonthShow = "";
      this.showTable = true;
      var date = new Date();
      date.getFullYear(); //获取完整的年份(4位)
      date.getMonth(); //获取当前月份(0-11,0代表1月)
      let month = 0;
      let paramsMonth = "";
      if (date.getMonth() < 9) {
        month = "0" + (date.getMonth() + 1);
        paramsMonth = String(date.getFullYear()) + month;
      } else {
        month = date.getMonth() + 1;
        paramsMonth = String(date.getFullYear()) + month;
      }
      let trialListData = JSON.parse(localStorage.getItem("tyrCalculateResult"));
      $http
        .post(api.summaryAllocatCalculat, {
          classCode: "Health",
          estimateMonth: paramsMonth,
          trialList: trialListData,
        })
        .then((res) => {
          this.hsqContractInfoList = res.data.data.beforeCalculatTreatyList;
          this.handleHsq(this.hsqContractInfoList, 0);
          let hsxzInfoList = res.data.data.calculatClassSummaryList;
          this.hsxzDataList = res.data.data.calculatClassSummaryList;
          this.handleHshz(hsxzInfoList);
          this.hshContractInfoList = res.data.data.afterCalculatTreatyList;
          this.handleHsq(this.hshContractInfoList, 1);
          this.calculatedFeeList = res.data.data.calculatedFeeList;
          this.calculatedFeeList2 = res.data.data.calculatedFeeList;
          this.handleFloatChange();
          this.estimateMonthShow = res.data.data.estimateMonth;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleBack() {
      // this.$router.go(-1);
      this.$router.push("/actuarialEstimates");
    },
    kiloSplitData(data) {
      return kiloSplit(data);
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
    handleClick() {
      //   this.istrycalculate = true;
      //   this.loading = true;
      //   this.estimateMonthShow = "";
      //   this.showTable = true;
      //   $http
      //     .post(api.summaryAllocatCalculat, {
      //       classCode: this.classCode,
      //       estimateMonth:
      //         this.estimateMonth === ""
      //           ? ""
      //           : getYearMonthDate(this.estimateMonth),
      //     })
      //     .then((res) => {
      //       this.hsqContractInfoList = res.data.data.beforeCalculatTreatyList;
      //       this.handleHsq(this.hsqContractInfoList, 0);
      //       let hsxzInfoList = res.data.data.calculatClassSummaryList;
      //       this.hsxzDataList = res.data.data.calculatClassSummaryList;
      //       this.handleHshz(hsxzInfoList);
      //       this.hshContractInfoList = res.data.data.afterCalculatTreatyList;
      //       this.handleHsq(this.hshContractInfoList, 1);
      //       this.calculatedFeeList = res.data.data.calculatedFeeList;
      //       this.calculatedFeeList2 = res.data.data.calculatedFeeList;
      //       this.handleFloatChange();
      //       this.estimateMonthShow = res.data.data.estimateMonth;
      //     })
      //     .finally(() => {
      //       this.loading = false;
      //     });
      this.istrycalculate = false;
      this.loading = true;
      this.showTable = true;
      let trialListData = JSON.parse(localStorage.getItem("tyrCalculateResult"));

      console.log(trialListData, "trialListDatatrialListData");
      // $http.post(api.summaryTrialAllocatCalculat, paramsList)
      $http
        .post(api.summaryTrialAllocatCalculat, {
          classCode: this.classCode,
          estimateMonth:
            this.estimateMonth === "" ? "" : getYearMonthDate(this.estimateMonth),
          trialList: trialListData,
        })
        .then((res) => {
          console.log(res);
          this.hsqContractInfoList = res.data.data.beforeCalculatTreatyList;
          this.handleHsq(this.hsqContractInfoList, 0);
          let hsxzInfoList = res.data.data.calculatClassSummaryList;
          this.hsxzDataList = res.data.data.calculatClassSummaryList;
          this.handleHshz(hsxzInfoList);
          this.hshContractInfoList = res.data.data.afterCalculatTreatyList;
          this.handleHsq(this.hshContractInfoList, 1);
          this.calculatedFeeList = res.data.data.calculatedFeeList;
          this.calculatedFeeList2 = res.data.data.calculatedFeeList;
          this.handleFloatChange();
          this.estimateMonthShow = res.data.data.estimateMonth;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleCheckClick() {
      this.istrycalculate = true;

      this.$message.warning("功能暂不支持");
      $http
        .post(api.summaryAllocatCalculatQuery, {
          classCode: this.classCode,
          estimateMonth:
            this.estimateMonth === "" ? "" : getYearMonthDate(this.estimateMonth),
        })
        .then((res) => {
          this.hsqContractInfoList = res.data.data.beforeCalculatTreatyList;
          this.handleHsq(this.hsqContractInfoList, 0);
          let hsxzInfoList = res.data.data.calculatClassSummaryList;
          this.hsxzDataList = res.data.data.calculatClassSummaryList;
          this.handleHshz(hsxzInfoList);
          this.hshContractInfoList = res.data.data.afterCalculatTreatyList;
          this.handleHsq(this.hshContractInfoList, 1);
          this.calculatedFeeList = res.data.data.calculatedFeeList;
          this.calculatedFeeList2 = res.data.data.calculatedFeeList;
          this.handleFloatChange();
          this.estimateMonthShow = res.data.data.estimateMonth;
        });
      this.istrycalculate = false;
    },
    handleHshz(hshz) {
      let obj = {};
      let contractList = hshz.reduce((cur, next) => {
        obj[next.className] ? "" : (obj[next.className] = true && cur.push(next));
        return cur;
      }, []); //设置cur默认类型为数组，并且初始值为空的数组
      // console.log(contractList, "cont..............................................................................................ractList", hshz);
      // let copyList = [];
      let newshqhel = [];
      // contractList.forEach((item) => {
      //   newshqhel.push({
      //     contractNo: item.contractNo,
      //     data: shqhel,
      //   });
      // });
      contractList.forEach((e) => {
        var arr = [];
        let shqhel = [
          { contractinfo: "UPR", Gross: "", Retro: "", Net: "" },
          { contractinfo: "DAC", Gross: "", Retro: "", Net: "" },
          // { contractinfo: "URR", Gross: "", Retro: "", Net: "" },
          { contractinfo: "PDR", Gross: "", Retro: "", Net: "" },
        ];
        hshz.forEach((i) => {
          if (e.contractNo === i.contractNo) {
            arr.push(i);
            // console.log(11111, i);
          }
        });
        // console.log(shqhel, arr, "?????????????????????????????????????");
        shqhel.forEach((j) => {
          arr.forEach((k) => {
            if (j.contractinfo === k.feeItem) {
              j[k.inOutItem] = k.amount;
              // console.log(j,k, 'jkjkjkjkjk');
            }
            // console.log(shqhel, 'shqhelshqhelshqhelshqhel');
          });
        });
        // console.log(shqhel, "shqhelshqhelshqhelshqhel");
        newshqhel.push({
          className: e.className,
          data: shqhel,
        });
        // console.log(arr, "arrarrarrarrarrarr");
      });
      // console.log(newshqhel, "newshqhelnewshqhel");
      this.xzhzList = newshqhel;
    },
    handleHsq(hsxx, flag) {
      let obj = {};
      let contractList = hsxx.reduce((cur, next) => {
        obj[next.contractNo] ? "" : (obj[next.contractNo] = true && cur.push(next));
        return cur;
      }, []); //设置cur默认类型为数组，并且初始值为空的数组
      // console.log(contractList, "contractList", hsxx);
      // let copyList = [];
      let newshqhel = [];
      // contractList.forEach((item) => {
      //   newshqhel.push({
      //     contractNo: item.contractNo,
      //     data: shqhel,
      //   });
      // });
      contractList.forEach((e) => {
        var arr = [];
        let shqhel = [
          { contractinfo: "UPR", Gross: "", Retro: "", Net: "" },
          { contractinfo: "DAC", Gross: "", Retro: "", Net: "" },
          { contractinfo: "URR", Gross: "", Retro: "", Net: "" },
          { contractinfo: "PDR", Gross: "", Retro: "", Net: "" },
        ];
        hsxx.forEach((i) => {
          if (e.contractNo === i.contractNo) {
            arr.push(i);
            // console.log(11111, i);
          }
        });
        // console.log(shqhel, arr, "?????????????????????????????????????");
        shqhel.forEach((j) => {
          arr.forEach((k) => {
            if (j.contractinfo === k.feeItem) {
              j[k.inOutItem] = k.amount;
              // console.log(j,k, 'jkjkjkjkjk');
            }
            // console.log(shqhel, 'shqhelshqhelshqhelshqhel');
          });
        });
        // console.log(shqhel, "shqhelshqhelshqhelshqhel");
        newshqhel.push({
          contractNo: e.contractNo,
          data: shqhel,
        });
        // console.log(arr, "arrarrarrarrarrarr");
      });
      // console.log(newshqhel, "newshqhelnewshqhel");
      if (flag === 0) {
        this.hsqList = newshqhel;
      } else {
        this.hshList = newshqhel;
      }
    },
    handleFloatChange() {
      this.lastList = [];
      // console.log(this.calculatedFeeList, "this.calculatedFeeList");
      var obj = {};
      this.calculatedFeeList = this.calculatedFeeList.reduce(function (item, next) {
        obj[next.contractNo] ? "" : (obj[next.contractNo] = true && item.push(next));
        return item;
      }, []);
      var obj2 = {};
      var calculatObj = {};
      this.testList = this.calculatedFeeList2.reduce(function (item, next) {
        obj2[next.company] ? "" : (obj2[next.company] = true && item.push(next));
        return item;
      }, []);
      let calculatItemList = this.calculatedFeeList2.reduce(function (item, next) {
        calculatObj[next.calculatItem]
          ? ""
          : (calculatObj[next.calculatItem] = true && item.push(next));
        return item;
      }, []);

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
        console.log(this.lastList, "lastList");
      });
      this.lastList.forEach((item) => {
        this.calculatedFeeList.forEach((element) => {
          item[element.contractNo] = "";
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
            item[element.contractNo] = element.estimateAmount;
            // item.currencyCode = element.currencyCode;
            // console.log(element.calculatMonth, 'element');
          }
        });
      });
      // this.$set();
      console.log(this.lastList, "lastListaaaa");
      // this.$forceUpdate()
    },
    saveToFinance() {
      $http
        .post(api.saveToFinance, {
          classCode: this.classCode,
          estimateMonth: this.estimateMonth,
        })
        .then((res) => {
          if (res.data.code === "0") {
            this.$message.success("成功");
            // this.$router.go(-1);
            this.$router.push("/actuarialEstimates");
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
</style>
