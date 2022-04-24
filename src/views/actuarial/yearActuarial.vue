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
    <div class="monthHeader">
      <el-button @click="handleExport('feeInfo', '费用信息')">导出</el-button>
    </div>
    <div class="separateInfo">
      <h2>费用信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :ref="'feeInfo'"
        :columns="feeColumns"
        :listData="feeInfoList"
      ></fs-list-panel>
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
  </div>
</template>

<script>
// import api from "@/utils/api";
import { $http } from "@/utils/request";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";
export default {
  data() {
    return {
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
          property: "planCode",
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
        {
          title: "转分合同",
          property: "estimateStatus",
          formatter: "dict",
          dictName: "estimateStatus",
        },
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
      contractInfoList: [],
      feeInfoList: [],
      cedentList: [],
    };
  },
  methods: {
    init() {
      $http
        .post(
          "http://yapi.smart-xwork.cn/mock/134845/estimate/actuarial/yearContractDetailQuery",
          {
            estimateKey: sessionStorage.getItem("estimateKey"),
          }
        )
        .then((res) => {
          console.log(res, "rrrrrrrrreeeeeeeeeeeeeesssssssssssss");
          this.contractInfoList = [];
          this.feeInfoList = [];
          this.contractInfoList.push(res.data.data.contractInfo);
          this.feeInfoList.push(res.data.data.feeInfo)
          this.cedentList = res.data.data.cedentList
          console.log();
        });
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
