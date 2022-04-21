<template>
  <div class="yearActuarail">
    <div class="separateInfo">
      <h2>合同信息</h2>
      <el-divider></el-divider>
      <fs-list-panel
        :columns="columns"
        :listData="contractInfoList"
      ></fs-list-panel>
    </div>
  </div>
</template>

<script>
// import api from "@/utils/api";
import { $http } from "@/utils/request";
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
      contractInfoList: [],
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
          this.contractInfoList.push(res.data.data.contractInfo);
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
