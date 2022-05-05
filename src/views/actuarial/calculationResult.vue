<template>
  <div class="calculationResult">
    <div class="searchHeader">
      <span>请选择汇算产品</span>
      <el-select
        v-model="classCode"
        placeholder="请选择"
        style="padding: 0 20px"
      >
        <el-option
          v-for="(item, index) in classList"
          :key="index"
          :label="item.className"
          :value="item.classCode"
        ></el-option>
      </el-select>
      <el-button type="primary" round @click="handleClick">确认</el-button>
    </div>
    <div class="calculationResultBody" v-show="showTable">
      <div class="sectionResult" style="margin-top: 30px">
        <div class="monthHeader">
          <el-button @click="handleBack">返回</el-button>
          <el-button @click="handleExport('hsqContract', '合同信息')"
            >导出</el-button
          >
        </div>
        <div class="separateInfo">
          <h2>汇算前合同信息</h2>
          <el-divider></el-divider>
          <!-- <fs-list-panel
            :ref="'hsqContract'"
            :columns="hsqColumns"
            :listData="hsqContractInfoList"
          ></fs-list-panel> -->
          <el-table
            :ref="'hsqContract'"
            :data="hsqList"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column prop="contractinfo" label="合同号" width="180">
            </el-table-column>
            <el-table-column prop="Retro" label="Retro"> </el-table-column>
            <el-table-column prop="Gross" label="Gross"> </el-table-column>
            <el-table-column prop="Net" label="Net"> </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="sectionResult" style="margin-top: 30px">
        <div class="monthHeader">
          <el-button @click="handleExport('hsxzInfo', '险种汇总信息')"
            >导出</el-button
          >
        </div>
        <div class="separateInfo">
          <h2>险种汇总信息</h2>
          <el-divider></el-divider>
          <fs-list-panel
            :ref="'hsxzInfo'"
            :columns="hsxzColumns"
            :listData="hsxzInfoList"
          ></fs-list-panel>
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
            :ref="'hshContract'"
            :columns="hshColumns"
            :listData="hshContractInfoList"
          ></fs-list-panel>
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
          <el-table
            :ref="'xfcwInfo'"
            :data="lastList"
            border
            style="width: 100%; margin-top: 20px"
          >
            <el-table-column prop="company" label="公司" width="180">
            </el-table-column>
            <el-table-column prop="calculatItem" label="计算项目">
            </el-table-column>
            <el-table-column prop="currencyCode" label="币种">
            </el-table-column>
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
      </div>
      <div class="saveToFinance">
        <el-button plain @click="saveToFinance">确认并下发财务</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { $http } from "@/utils/request";
import { kiloSplit } from "@/utils/utils";
// import { getText } from "@/utils/dict.js";
import api from "@/utils/api";
import { mapState, mapActions } from "vuex";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";

export default {
  data() {
    return {
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
      hsqContractInfoList: [],
      hsxzInfoList: [],
      hshContractInfoList: [],
      lastList: [],
      calculatedFeeList: [],
      calculatedFeeList2: [],
      showTable: false,
      estimateMonth: "",
    };
  },
  computed: {
    ...mapState("actuarial/actuarialEstimates", ["classList"]),
  },
  methods: {
    ...mapActions("actuarial/actuarialEstimates", ["getClassList"]),
    init() {
      this.getClassList();
    },
    handleBack() {
      this.$router.go(-1);
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
      this.showTable = true;
      $http
        .post(api.summaryAllocatCalculat, {
          classCode: this.classCode,
        })
        .then((res) => {
          this.hsqContractInfoList = res.data.data.beforeCalculatTreatyList;
          let shqhel = [
            { contractinfo: "UPR", Gross: "", Retro: "", Net: "" },
            { contractinfo: "DAC", Gross: "", Retro: "", Net: "" },
            { contractinfo: "URR", Gross: "", Retro: "", Net: "" },
            { contractinfo: "PDR", Gross: "", Retro: "", Net: "" },
          ];
          console.log(shqhel, 'shqhel');
          this.hsqContractInfoList.forEach((item) => {
            console.log(item, '??item');
          });
          this.hsxzInfoList = res.data.data.calculatClassSummaryList;
          this.hshContractInfoList = res.data.data.afterCalculatTreatyList;
          this.calculatedFeeList = res.data.data.calculatedFeeList;
          this.calculatedFeeList2 = res.data.data.calculatedFeeList;
          this.handleFloatChange();
          this.estimateMonth = res.data.data.estimateMonth;
        });
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
    saveToFinance() {
      $http
        .post(api.saveToFinance, {
          classCode: this.classCode,
          estimateMonth: this.estimateMonth,
        })
        .then((res) => {
          if (res.data.code === "0") {
            this.$message.success("成功");
            this.$router.go(-1);
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
