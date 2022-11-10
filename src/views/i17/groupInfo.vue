<template>
  <div class="groupInfo">
    <div class="searchBox">
      分组名称：
      <el-input v-model="form.groupName" style="width: 200px"></el-input>
      <el-button style="float: right" @click="handleBack()">返回</el-button>
    </div>
    <div class="mainBox">
      分组信息填充：
      <div class="fillInfo">
        <!-- <el-table :data="listData" border style="width: 100%">
          <el-table-column prop="groupItemName1" label="分项名称">
          </el-table-column>
          <el-table-column prop="groupItemValue1" label="分项值"> </el-table-column>
          <el-table-column prop="groupItemName2" label="分项名称">
          </el-table-column>
          <el-table-column prop="groupItemValue2" label="分项值">
          </el-table-column>
        </el-table> -->
        <table>
          <tr>
            <th>分项名称</th>
            <th>分项值</th>
            <th>分项名称</th>
            <th>分项值</th>
          </tr>
          <tr>
            <td>IFRS17 methodology flag (e.g. GMM, PAA)</td>
            <td><el-input v-model="form.methodologyFlag"></el-input></td>
            <td>Attributable/non-attributable classification</td>
            <td>
              <el-input v-model="form.attributableClassification"></el-input>
            </td>
          </tr>
          <tr>
            <td>Level of Aggregation (IFRS 17 group tagging)</td>
            <td><el-input v-model="form.levelOfAggregation"></el-input></td>
            <td>acquisitionClassification</td>
            <td>
              <el-input v-model="form.acquisitionClassification"></el-input>
            </td>
          </tr>
          <tr>
            <td>IFRS17 group tagging - Inception date</td>
            <td><el-input v-model="form.inceptionDate"></el-input></td>
            <td>Loss ratio (LRC)</td>
            <td><el-input v-model="form.lossRatioLRC"></el-input></td>
          </tr>
          <tr>
            <td>IFRS17 group tagging - Expiry date</td>
            <td><el-input v-model="form.expiryDate"></el-input></td>
            <td>Loss ratio (LIC)</td>
            <td><el-input v-model="form.lossRatioLIC"></el-input></td>
          </tr>
          <tr>
            <td>IFRS17 group tagging - Currency</td>
            <td><el-input v-model="form.currency"></el-input></td>
            <td>Coverage Units</td>
            <td><el-input v-model="form.coverageUnits"></el-input></td>
          </tr>
          <tr>
            <td>IFRS17 group tagging - Onerosity</td>
            <td><el-input v-model="form.onerosity"></el-input></td>
            <td>Current period discount rates</td>
            <td>
              <el-input v-model="form.currentPeriodDiscountRates"></el-input>
            </td>
          </tr>
          <tr>
            <td>IFRS17 group tagging - Portfolio</td>
            <td><el-input v-model="form.portfolio"></el-input></td>
            <td>Risk adjustment ratios (GMM)</td>
            <td>
              <el-input v-model="form.riskAdjustmentRatios"></el-input>
            </td>
          </tr>
          <tr>
            <td>Type of contract</td>
            <td><el-input v-model="form.typeOfContract"></el-input></td>
            <td>Locked-in Rate</td>
            <td><el-input v-model="form.lockedInRate"></el-input></td>
          </tr>
          <tr>
            <td>Total Premium Written (EPI)</td>
            <td><el-input v-model="form.epi"></el-input></td>
            <td>P&L Rates curves</td>
            <td><el-input v-model="form.plRatesCurves"></el-input></td>
          </tr>
          <tr>
            <td>Commission type</td>
            <td><el-input v-model="form.commissionType"></el-input></td>
            <td>Maximum sliding scale commission ratio（多个值怎么计算综合）</td>
            <td>
              <el-input v-model="form.maximumSlidingScaleCommissionRatio"></el-input>
            </td>
          </tr>
          <tr>
            <td>Actual Premium Received for Current & Future Service</td>
            <td><el-input v-model="form.actualPremiumReceived"></el-input></td>
            <td>Provisional sliding scale commission ratio（多个值怎么计算综合）</td>
            <td>
              <el-input v-model="form.provisionalSlidingScaleCommissionRatio"></el-input>
            </td>
          </tr>
          <tr>
            <td>Paid Claims and ALAE</td>
            <td><el-input v-model="form.paidClaimsAndALAE"></el-input></td>
            <td>
              Sliding scale commission ratio correponding to the incurred loss ratio
            </td>
            <td>
              <el-input v-model="form.slidingScaleCommissionRatio"></el-input>
            </td>
          </tr>
          <tr>
            <td>Actual commissions paid</td>
            <td><el-input v-model="form.actualCommissionsPaid"></el-input></td>
            <td>Maximum profit commission ratio</td>
            <td>
              <el-input v-model="form.maximumProfitCommissionRatio"></el-input>
            </td>
          </tr>
          <tr>
            <td>Paid acquisition and maintenance expenses</td>
            <td>
              <el-input v-model="form.paidAcquisitionAndMaintenanceExpenses"></el-input>
            </td>
            <td></td>
            <td>
              <!-- <el-input v-model="form.maximumProfitCommissionRatio"></el-input> -->
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div class="subFoot">
      <el-button @click="handleCreateGroup">提交</el-button>
    </div>
  </div>
</template>

<script>
import { $http } from "@/utils/request";
import api from "@/utils/api";
export default {
  data() {
    return {
      groupName: "",
      listData: [],
      form: {
        methodologyFlag: "",
        levelOfAggregation: "",
        inceptionDate: "",
        expiryDate: "",
        currency: "",
        onerosity: "",
        portfolio: "",
        typeOfContract: "",
        epi: "",
        commissionType: "",
        actualPremiumReceived: "",
        paidClaimsAndALAE: "",
        actualCommissionsPaid: "",
        paidAcquisitionAndMaintenanceExpenses: "",
        attributableClassification: "",
        acquisitionClassification: "",
        lossRatioLRC: "",
        lossRatioLIC: "",
        coverageUnits: "",
        currentPeriodDiscountRates: "",
        riskAdjustmentRatios: "",
        lockedInRate: "",
        plRatesCurves: "",
        maximumSlidingScaleCommissionRatio: "",
        provisionalSlidingScaleCommissionRatio: "",
        slidingScaleCommissionRatio: "",
        maximumProfitCommissionRatio: "",
        parentGroup: "",
        groupName: "",
        groupId: "",
      },
    };
  },
  methods: {
    handleCreateGroup() {
      $http.post(api.groupAdd, this.form).then((res) => {
        console.log(res);
        if (res.data.code === "0") {
          this.$message.success("创建分组成功");
          this.form = {
            methodologyFlag: "",
            levelOfAggregation: "",
            inceptionDate: "",
            expiryDate: "",
            currency: "",
            onerosity: "",
            portfolio: "",
            typeOfContract: "",
            epi: "",
            commissionType: "",
            actualPremiumReceived: "",
            paidClaimsAndALAE: "",
            actualCommissionsPaid: "",
            paidAcquisitionAndMaintenanceExpenses: "",
            attributableClassification: "",
            acquisitionClassification: "",
            lossRatioLRC: "",
            lossRatioLIC: "",
            coverageUnits: "",
            currentPeriodDiscountRates: "",
            riskAdjustmentRatios: "",
            lockedInRate: "",
            plRatesCurves: "",
            maximumSlidingScaleCommissionRatio: "",
            provisionalSlidingScaleCommissionRatio: "",
            slidingScaleCommissionRatio: "",
            maximumProfitCommissionRatio: "",
            parentGroup: "",
            groupName: "",
            groupId: "",
          };
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    handleBack() {
      this.$router.push("/contractGroupQuery");
    },
  },
};
</script>

<style lang="scss" scoped>
.groupInfo {
  .searchBox {
  }
  .mainBox {
    margin-top: 20px;
    .fillInfo {
      width: 100%;
      table {
        width: 100%;
        border-right: 1px solid #494848;
        border-bottom: 1px solid #494848;
        border-collapse: collapse;
        td,
        th {
          border-left: 1px solid #494848;
          border-top: 1px solid #494848;
        }
      }
    }
  }
  .subFoot {
    text-align: center;
    margin-top: 20px;
  }
}
</style>
