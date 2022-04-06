<template>
  <div class="monthAdjustDetial">
    <div
      class="separateInfo"
      v-for="(element, index) in monthAdjustDetailList"
      :key="index"
    >
      <h2>{{ element.adjustMonth }}</h2>
      <el-divider></el-divider>
      <el-table
        :data="element.EPIData"
        border
        :summary-method="getSummaries"
        show-summary
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="calculatMonth" label="计算月份" width="180">
        </el-table-column>
        <el-table-column prop="calculatedEPI" label="月最终预估保费">
        </el-table-column>
        <el-table-column prop="originEPI" label="月原始预估保费">
        </el-table-column>
        <el-table-column prop="manualAdjustEPI" label="EPI调整">
          <!-- <template slot-scope="scope">
            <el-input
              placeholder="请输入内容"
              v-model="scope.row.manualAdjustEPI"
            ></el-input>
          </template> -->
        </el-table-column>
        <el-table-column prop="workSheetAdjustEPI" label="实际账单调整">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in element.monthList"
          :key="index"
          :prop="item.month"
          :label="item.month"
        >
          <!-- <template slot-scope="scope">
            <el-input
              :disabled="scope.row[item.month] === ''"
              placeholder=""
              v-model="scope.row[item.month]"
            ></el-input>
          </template> -->
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getMonthBetween } from "@/utils/utils";
import { $http } from "@/utils/request";
import api from "@/utils/api";

export default {
  data() {
    return {
      monthAdjustDetailList: [],
    };
  },
  methods: {
    init() {
      $http;
      // .post("/estimate/finance/monthContractDetailQuery", {
      //   estimateKey: "a3137f63-aa83-11ec-9e97-a4ae1204f49c",
      // }).then(res => {
      //   console.log(res, 'res')
      // })
      let data = {
        msg: "",
        code: "0",
        data: {
          monthAdjustDetail: [
            {
              contractMonthBegin: "202106",
              calculatMonth: "18",
              epiSplitList: [
                {
                  calculatMonth: "202106",
                  calculatedEPI: "6.901871344380952E7",
                  cumulativeAmount: "0.0",
                  m1: "5648444.374285714",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "6688007.866349206",
                  m2: "5648444.374285714",
                  m3: "5648444.374285714",
                  m4: "5648444.374285714",
                  m5: "5648444.374285714",
                  m6: "5648444.374285714",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "1237380.9523809552",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202107",
                  calculatedEPI: "6.905827693587302E7",
                  cumulativeAmount: "0.0",
                  m1: "5648444.374285714",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "6688007.866349206",
                  m2: "5648444.374285714",
                  m3: "5648444.374285714",
                  m4: "5648444.374285714",
                  m5: "5648444.374285714",
                  m6: "5688007.866349206",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "1276944.4444444478",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202108",
                  calculatedEPI: "6.809784042793651E7",
                  cumulativeAmount: "0.0",
                  m1: "5648444.374285714",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "5688007.866349206",
                  m2: "5648444.374285714",
                  m3: "5648444.374285714",
                  m4: "5648444.374285714",
                  m5: "5688007.866349206",
                  m6: "5688007.866349206",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "316507.9365079403",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202109",
                  calculatedEPI: "6.813740392E7",
                  cumulativeAmount: "0.0",
                  m1: "5648444.374285714",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "5688007.866349206",
                  m2: "5648444.374285714",
                  m3: "5648444.374285714",
                  m4: "5688007.866349206",
                  m5: "5688007.866349206",
                  m6: "5688007.866349206",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "356071.4285714328",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202110",
                  calculatedEPI: "6.81769674120635E7",
                  cumulativeAmount: "0.0",
                  m1: "5648444.374285714",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "5688007.866349206",
                  m2: "5648444.374285714",
                  m3: "5688007.866349206",
                  m4: "5688007.866349206",
                  m5: "5688007.866349206",
                  m6: "5688007.866349206",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "395634.92063492537",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202111",
                  calculatedEPI: "6.821653090412699E7",
                  cumulativeAmount: "0.0",
                  m1: "5648444.374285714",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "5688007.866349206",
                  m2: "5688007.866349206",
                  m3: "5688007.866349206",
                  m4: "5688007.866349206",
                  m5: "5688007.866349206",
                  m6: "5688007.866349206",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "435198.4126984179",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202112",
                  calculatedEPI: "6.825609439619048E7",
                  cumulativeAmount: "0.0",
                  m1: "5688007.866349206",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "5688007.866349206",
                  m2: "5688007.866349206",
                  m3: "5688007.866349206",
                  m4: "5688007.866349206",
                  m5: "5688007.866349206",
                  m6: "5688007.866349206",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "474761.90476191044",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
              ],
              adjustMonth: "202112",
              contractMonthEnd: "202110",
              totalEPI: "4.7896182744E8",
              epiSplitSumList: [
                {
                  calculatMonth: "202203",
                  calculatedEPI: "3.9816055064444445E7",
                  cumulativeAmount: "2.7788155211777776E8",
                  manualAdjustEPI: "276944.44444444776",
                  originEPI: "3.953911062E7",
                  totalPremium: "3.9816055064444445E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202211",
                  calculatedEPI: "5688007.866349206",
                  cumulativeAmount: "4.7896182744E8",
                  manualAdjustEPI: "39563.49206349254",
                  originEPI: "5648444.374285714",
                  totalPremium: "5688007.866349206",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202210",
                  calculatedEPI: "1.1376015732698413E7",
                  cumulativeAmount: "4.732738195736508E8",
                  manualAdjustEPI: "79126.98412698507",
                  originEPI: "1.1296888748571428E7",
                  totalPremium: "1.1376015732698413E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202209",
                  calculatedEPI: "1.706402359904762E7",
                  cumulativeAmount: "4.6189780384095234E8",
                  manualAdjustEPI: "118690.47619047761",
                  originEPI: "1.6945333122857142E7",
                  totalPremium: "1.706402359904762E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202208",
                  calculatedEPI: "2.2752031465396825E7",
                  cumulativeAmount: "4.4483378024190474E8",
                  manualAdjustEPI: "158253.96825397015",
                  originEPI: "2.2593777497142855E7",
                  totalPremium: "2.2752031465396825E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202207",
                  calculatedEPI: "2.844003933174603E7",
                  cumulativeAmount: "4.220817487765079E8",
                  manualAdjustEPI: "197817.46031746268",
                  originEPI: "2.8242221871428568E7",
                  totalPremium: "2.844003933174603E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202206",
                  calculatedEPI: "3.512804719809524E7",
                  cumulativeAmount: "3.936417094447619E8",
                  manualAdjustEPI: "1237380.9523809552",
                  originEPI: "3.3890666245714284E7",
                  totalPremium: "3.512804719809524E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202205",
                  calculatedEPI: "4.0816055064444445E7",
                  cumulativeAmount: "3.585136622466666E8",
                  manualAdjustEPI: "1276944.4444444478",
                  originEPI: "3.953911062E7",
                  totalPremium: "4.0816055064444445E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202204",
                  calculatedEPI: "3.9816055064444445E7",
                  cumulativeAmount: "3.176976071822222E8",
                  manualAdjustEPI: "276944.44444444776",
                  originEPI: "3.953911062E7",
                  totalPremium: "3.9816055064444445E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202106",
                  calculatedEPI: "5648444.374285714",
                  cumulativeAmount: "5648444.374285714",
                  manualAdjustEPI: "0.0",
                  originEPI: "5648444.374285714",
                  totalPremium: "5648444.374285714",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202202",
                  calculatedEPI: "3.9816055064444445E7",
                  cumulativeAmount: "2.3806549705333334E8",
                  manualAdjustEPI: "276944.44444444776",
                  originEPI: "3.953911062E7",
                  totalPremium: "3.9816055064444445E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202201",
                  calculatedEPI: "3.9816055064444445E7",
                  cumulativeAmount: "1.982494419888889E8",
                  manualAdjustEPI: "276944.44444444776",
                  originEPI: "3.953911062E7",
                  totalPremium: "3.9816055064444445E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202112",
                  calculatedEPI: "3.9816055064444445E7",
                  cumulativeAmount: "1.5843338692444444E8",
                  manualAdjustEPI: "276944.44444444776",
                  originEPI: "3.953911062E7",
                  totalPremium: "3.9816055064444445E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202111",
                  calculatedEPI: "3.3890666245714284E7",
                  cumulativeAmount: "1.1861733185999998E8",
                  manualAdjustEPI: "0.0",
                  originEPI: "3.3890666245714284E7",
                  totalPremium: "3.3890666245714284E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202110",
                  calculatedEPI: "2.8242221871428568E7",
                  cumulativeAmount: "8.472666561428571E7",
                  manualAdjustEPI: "0.0",
                  originEPI: "2.8242221871428568E7",
                  totalPremium: "2.8242221871428568E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202109",
                  calculatedEPI: "2.2593777497142855E7",
                  cumulativeAmount: "5.648444374285714E7",
                  manualAdjustEPI: "0.0",
                  originEPI: "2.2593777497142855E7",
                  totalPremium: "2.2593777497142855E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202108",
                  calculatedEPI: "1.6945333122857142E7",
                  cumulativeAmount: "3.3890666245714284E7",
                  manualAdjustEPI: "0.0",
                  originEPI: "1.6945333122857142E7",
                  totalPremium: "1.6945333122857142E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202107",
                  calculatedEPI: "1.1296888748571428E7",
                  cumulativeAmount: "1.6945333122857142E7",
                  manualAdjustEPI: "0.0",
                  originEPI: "1.1296888748571428E7",
                  totalPremium: "1.1296888748571428E7",
                  workSheetAdjustEPI: "0.0",
                },
              ],
            },
            {
              contractMonthBegin: "202106",
              calculatMonth: "18",
              epiSplitList: [
                {
                  calculatMonth: "202106",
                  calculatedEPI: "6.901871344380952E7",
                  cumulativeAmount: "0.0",
                  m1: "5648444.374285714",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "6688007.866349206",
                  m2: "5648444.374285714",
                  m3: "5648444.374285714",
                  m4: "5648444.374285714",
                  m5: "5648444.374285714",
                  m6: "5648444.374285714",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "1237380.9523809552",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202107",
                  calculatedEPI: "6.905827693587302E7",
                  cumulativeAmount: "0.0",
                  m1: "5648444.374285714",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "6688007.866349206",
                  m2: "5648444.374285714",
                  m3: "5648444.374285714",
                  m4: "5648444.374285714",
                  m5: "5648444.374285714",
                  m6: "5688007.866349206",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "1276944.4444444478",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202108",
                  calculatedEPI: "6.809784042793651E7",
                  cumulativeAmount: "0.0",
                  m1: "5648444.374285714",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "5688007.866349206",
                  m2: "5648444.374285714",
                  m3: "5648444.374285714",
                  m4: "5648444.374285714",
                  m5: "5688007.866349206",
                  m6: "5688007.866349206",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "316507.9365079403",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202109",
                  calculatedEPI: "6.813740392E7",
                  cumulativeAmount: "0.0",
                  m1: "5648444.374285714",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "5688007.866349206",
                  m2: "5648444.374285714",
                  m3: "5648444.374285714",
                  m4: "5688007.866349206",
                  m5: "5688007.866349206",
                  m6: "5688007.866349206",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "356071.4285714328",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202110",
                  calculatedEPI: "6.81769674120635E7",
                  cumulativeAmount: "0.0",
                  m1: "5648444.374285714",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "5688007.866349206",
                  m2: "5648444.374285714",
                  m3: "5688007.866349206",
                  m4: "5688007.866349206",
                  m5: "5688007.866349206",
                  m6: "5688007.866349206",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "395634.92063492537",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202111",
                  calculatedEPI: "6.821653090412699E7",
                  cumulativeAmount: "0.0",
                  m1: "5648444.374285714",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "5688007.866349206",
                  m2: "5688007.866349206",
                  m3: "5688007.866349206",
                  m4: "5688007.866349206",
                  m5: "5688007.866349206",
                  m6: "5688007.866349206",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "435198.4126984179",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202112",
                  calculatedEPI: "6.825609439619048E7",
                  cumulativeAmount: "0.0",
                  m1: "5688007.866349206",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "5688007.866349206",
                  m2: "5688007.866349206",
                  m3: "5688007.866349206",
                  m4: "5688007.866349206",
                  m5: "5688007.866349206",
                  m6: "5688007.866349206",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "474761.90476191044",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
              ],
              adjustMonth: "202112",
              contractMonthEnd: "202112",
              totalEPI: "4.7896182744E8",
              epiSplitSumList: [
                {
                  calculatMonth: "202203",
                  calculatedEPI: "3.9816055064444445E7",
                  cumulativeAmount: "2.7788155211777776E8",
                  manualAdjustEPI: "276944.44444444776",
                  originEPI: "3.953911062E7",
                  totalPremium: "3.9816055064444445E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202211",
                  calculatedEPI: "5688007.866349206",
                  cumulativeAmount: "4.7896182744E8",
                  manualAdjustEPI: "39563.49206349254",
                  originEPI: "5648444.374285714",
                  totalPremium: "5688007.866349206",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202210",
                  calculatedEPI: "1.1376015732698413E7",
                  cumulativeAmount: "4.732738195736508E8",
                  manualAdjustEPI: "79126.98412698507",
                  originEPI: "1.1296888748571428E7",
                  totalPremium: "1.1376015732698413E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202209",
                  calculatedEPI: "1.706402359904762E7",
                  cumulativeAmount: "4.6189780384095234E8",
                  manualAdjustEPI: "118690.47619047761",
                  originEPI: "1.6945333122857142E7",
                  totalPremium: "1.706402359904762E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202208",
                  calculatedEPI: "2.2752031465396825E7",
                  cumulativeAmount: "4.4483378024190474E8",
                  manualAdjustEPI: "158253.96825397015",
                  originEPI: "2.2593777497142855E7",
                  totalPremium: "2.2752031465396825E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202207",
                  calculatedEPI: "2.844003933174603E7",
                  cumulativeAmount: "4.220817487765079E8",
                  manualAdjustEPI: "197817.46031746268",
                  originEPI: "2.8242221871428568E7",
                  totalPremium: "2.844003933174603E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202206",
                  calculatedEPI: "3.512804719809524E7",
                  cumulativeAmount: "3.936417094447619E8",
                  manualAdjustEPI: "1237380.9523809552",
                  originEPI: "3.3890666245714284E7",
                  totalPremium: "3.512804719809524E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202205",
                  calculatedEPI: "4.0816055064444445E7",
                  cumulativeAmount: "3.585136622466666E8",
                  manualAdjustEPI: "1276944.4444444478",
                  originEPI: "3.953911062E7",
                  totalPremium: "4.0816055064444445E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202204",
                  calculatedEPI: "3.9816055064444445E7",
                  cumulativeAmount: "3.176976071822222E8",
                  manualAdjustEPI: "276944.44444444776",
                  originEPI: "3.953911062E7",
                  totalPremium: "3.9816055064444445E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202106",
                  calculatedEPI: "5648444.374285714",
                  cumulativeAmount: "5648444.374285714",
                  manualAdjustEPI: "0.0",
                  originEPI: "5648444.374285714",
                  totalPremium: "5648444.374285714",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202202",
                  calculatedEPI: "3.9816055064444445E7",
                  cumulativeAmount: "2.3806549705333334E8",
                  manualAdjustEPI: "276944.44444444776",
                  originEPI: "3.953911062E7",
                  totalPremium: "3.9816055064444445E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202201",
                  calculatedEPI: "3.9816055064444445E7",
                  cumulativeAmount: "1.982494419888889E8",
                  manualAdjustEPI: "276944.44444444776",
                  originEPI: "3.953911062E7",
                  totalPremium: "3.9816055064444445E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202112",
                  calculatedEPI: "3.9816055064444445E7",
                  cumulativeAmount: "1.5843338692444444E8",
                  manualAdjustEPI: "276944.44444444776",
                  originEPI: "3.953911062E7",
                  totalPremium: "3.9816055064444445E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202111",
                  calculatedEPI: "3.3890666245714284E7",
                  cumulativeAmount: "1.1861733185999998E8",
                  manualAdjustEPI: "0.0",
                  originEPI: "3.3890666245714284E7",
                  totalPremium: "3.3890666245714284E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202110",
                  calculatedEPI: "2.8242221871428568E7",
                  cumulativeAmount: "8.472666561428571E7",
                  manualAdjustEPI: "0.0",
                  originEPI: "2.8242221871428568E7",
                  totalPremium: "2.8242221871428568E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202109",
                  calculatedEPI: "2.2593777497142855E7",
                  cumulativeAmount: "5.648444374285714E7",
                  manualAdjustEPI: "0.0",
                  originEPI: "2.2593777497142855E7",
                  totalPremium: "2.2593777497142855E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202108",
                  calculatedEPI: "1.6945333122857142E7",
                  cumulativeAmount: "3.3890666245714284E7",
                  manualAdjustEPI: "0.0",
                  originEPI: "1.6945333122857142E7",
                  totalPremium: "1.6945333122857142E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202107",
                  calculatedEPI: "1.1296888748571428E7",
                  cumulativeAmount: "1.6945333122857142E7",
                  manualAdjustEPI: "0.0",
                  originEPI: "1.1296888748571428E7",
                  totalPremium: "1.1296888748571428E7",
                  workSheetAdjustEPI: "0.0",
                },
              ],
            },
            {
              contractMonthBegin: "202106",
              calculatMonth: "18",
              epiSplitList: [
                {
                  calculatMonth: "202106",
                  calculatedEPI: "6.901871344380952E7",
                  cumulativeAmount: "0.0",
                  m1: "5648444.374285714",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "6688007.866349206",
                  m2: "5648444.374285714",
                  m3: "5648444.374285714",
                  m4: "5648444.374285714",
                  m5: "5648444.374285714",
                  m6: "5648444.374285714",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "1237380.9523809552",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202107",
                  calculatedEPI: "6.905827693587302E7",
                  cumulativeAmount: "0.0",
                  m1: "5648444.374285714",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "6688007.866349206",
                  m2: "5648444.374285714",
                  m3: "5648444.374285714",
                  m4: "5648444.374285714",
                  m5: "5648444.374285714",
                  m6: "5688007.866349206",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "1276944.4444444478",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202108",
                  calculatedEPI: "6.809784042793651E7",
                  cumulativeAmount: "0.0",
                  m1: "5648444.374285714",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "5688007.866349206",
                  m2: "5648444.374285714",
                  m3: "5648444.374285714",
                  m4: "5648444.374285714",
                  m5: "5688007.866349206",
                  m6: "5688007.866349206",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "316507.9365079403",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202109",
                  calculatedEPI: "6.813740392E7",
                  cumulativeAmount: "0.0",
                  m1: "5648444.374285714",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "5688007.866349206",
                  m2: "5648444.374285714",
                  m3: "5648444.374285714",
                  m4: "5688007.866349206",
                  m5: "5688007.866349206",
                  m6: "5688007.866349206",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "356071.4285714328",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202110",
                  calculatedEPI: "6.81769674120635E7",
                  cumulativeAmount: "0.0",
                  m1: "5648444.374285714",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "5688007.866349206",
                  m2: "5648444.374285714",
                  m3: "5688007.866349206",
                  m4: "5688007.866349206",
                  m5: "5688007.866349206",
                  m6: "5688007.866349206",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "395634.92063492537",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202111",
                  calculatedEPI: "6.821653090412699E7",
                  cumulativeAmount: "0.0",
                  m1: "5648444.374285714",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "5688007.866349206",
                  m2: "5688007.866349206",
                  m3: "5688007.866349206",
                  m4: "5688007.866349206",
                  m5: "5688007.866349206",
                  m6: "5688007.866349206",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "435198.4126984179",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202112",
                  calculatedEPI: "6.825609439619048E7",
                  cumulativeAmount: "0.0",
                  m1: "5688007.866349206",
                  m10: "5688007.866349206",
                  m11: "5688007.866349206",
                  m12: "5688007.866349206",
                  m2: "5688007.866349206",
                  m3: "5688007.866349206",
                  m4: "5688007.866349206",
                  m5: "5688007.866349206",
                  m6: "5688007.866349206",
                  m7: "5688007.866349206",
                  m8: "5688007.866349206",
                  m9: "5688007.866349206",
                  manualAdjustEPI: "474761.90476191044",
                  originEPI: "6.778133249142857E7",
                  totalPremium: "6.778133249142857E7",
                  workSheetAdjustEPI: "0.0",
                },
              ],
              adjustMonth: "202112",
              contractMonthEnd: "202112",
              totalEPI: "4.7896182744E8",
              epiSplitSumList: [
                {
                  calculatMonth: "202203",
                  calculatedEPI: "3.9816055064444445E7",
                  cumulativeAmount: "2.7788155211777776E8",
                  manualAdjustEPI: "276944.44444444776",
                  originEPI: "3.953911062E7",
                  totalPremium: "3.9816055064444445E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202211",
                  calculatedEPI: "5688007.866349206",
                  cumulativeAmount: "4.7896182744E8",
                  manualAdjustEPI: "39563.49206349254",
                  originEPI: "5648444.374285714",
                  totalPremium: "5688007.866349206",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202210",
                  calculatedEPI: "1.1376015732698413E7",
                  cumulativeAmount: "4.732738195736508E8",
                  manualAdjustEPI: "79126.98412698507",
                  originEPI: "1.1296888748571428E7",
                  totalPremium: "1.1376015732698413E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202209",
                  calculatedEPI: "1.706402359904762E7",
                  cumulativeAmount: "4.6189780384095234E8",
                  manualAdjustEPI: "118690.47619047761",
                  originEPI: "1.6945333122857142E7",
                  totalPremium: "1.706402359904762E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202208",
                  calculatedEPI: "2.2752031465396825E7",
                  cumulativeAmount: "4.4483378024190474E8",
                  manualAdjustEPI: "158253.96825397015",
                  originEPI: "2.2593777497142855E7",
                  totalPremium: "2.2752031465396825E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202207",
                  calculatedEPI: "2.844003933174603E7",
                  cumulativeAmount: "4.220817487765079E8",
                  manualAdjustEPI: "197817.46031746268",
                  originEPI: "2.8242221871428568E7",
                  totalPremium: "2.844003933174603E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202206",
                  calculatedEPI: "3.512804719809524E7",
                  cumulativeAmount: "3.936417094447619E8",
                  manualAdjustEPI: "1237380.9523809552",
                  originEPI: "3.3890666245714284E7",
                  totalPremium: "3.512804719809524E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202205",
                  calculatedEPI: "4.0816055064444445E7",
                  cumulativeAmount: "3.585136622466666E8",
                  manualAdjustEPI: "1276944.4444444478",
                  originEPI: "3.953911062E7",
                  totalPremium: "4.0816055064444445E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202204",
                  calculatedEPI: "3.9816055064444445E7",
                  cumulativeAmount: "3.176976071822222E8",
                  manualAdjustEPI: "276944.44444444776",
                  originEPI: "3.953911062E7",
                  totalPremium: "3.9816055064444445E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202106",
                  calculatedEPI: "5648444.374285714",
                  cumulativeAmount: "5648444.374285714",
                  manualAdjustEPI: "0.0",
                  originEPI: "5648444.374285714",
                  totalPremium: "5648444.374285714",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202202",
                  calculatedEPI: "3.9816055064444445E7",
                  cumulativeAmount: "2.3806549705333334E8",
                  manualAdjustEPI: "276944.44444444776",
                  originEPI: "3.953911062E7",
                  totalPremium: "3.9816055064444445E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202201",
                  calculatedEPI: "3.9816055064444445E7",
                  cumulativeAmount: "1.982494419888889E8",
                  manualAdjustEPI: "276944.44444444776",
                  originEPI: "3.953911062E7",
                  totalPremium: "3.9816055064444445E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202112",
                  calculatedEPI: "3.9816055064444445E7",
                  cumulativeAmount: "1.5843338692444444E8",
                  manualAdjustEPI: "276944.44444444776",
                  originEPI: "3.953911062E7",
                  totalPremium: "3.9816055064444445E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202111",
                  calculatedEPI: "3.3890666245714284E7",
                  cumulativeAmount: "1.1861733185999998E8",
                  manualAdjustEPI: "0.0",
                  originEPI: "3.3890666245714284E7",
                  totalPremium: "3.3890666245714284E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202110",
                  calculatedEPI: "2.8242221871428568E7",
                  cumulativeAmount: "8.472666561428571E7",
                  manualAdjustEPI: "0.0",
                  originEPI: "2.8242221871428568E7",
                  totalPremium: "2.8242221871428568E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202109",
                  calculatedEPI: "2.2593777497142855E7",
                  cumulativeAmount: "5.648444374285714E7",
                  manualAdjustEPI: "0.0",
                  originEPI: "2.2593777497142855E7",
                  totalPremium: "2.2593777497142855E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202108",
                  calculatedEPI: "1.6945333122857142E7",
                  cumulativeAmount: "3.3890666245714284E7",
                  manualAdjustEPI: "0.0",
                  originEPI: "1.6945333122857142E7",
                  totalPremium: "1.6945333122857142E7",
                  workSheetAdjustEPI: "0.0",
                },
                {
                  calculatMonth: "202107",
                  calculatedEPI: "1.1296888748571428E7",
                  cumulativeAmount: "1.6945333122857142E7",
                  manualAdjustEPI: "0.0",
                  originEPI: "1.1296888748571428E7",
                  totalPremium: "1.1296888748571428E7",
                  workSheetAdjustEPI: "0.0",
                },
              ],
            },
          ],
        },
      };
      // let epiSplitInfo =
      this.monthAdjustDetailList = data.data.monthAdjustDetail;
      this.monthAdjustDetailList.forEach((item) => {
        // 横向时间处理
        let startTime =
          item.contractMonthBegin.slice(0, 4) +
          "-" +
          item.contractMonthBegin.slice(4) +
          "-01";
        let endTime = "";
        // 年份处理
        let monthInfo = item.calculatMonth % 12;
        let yearsInfo = parseInt(item.calculatMonth / 12);
        let endYear = Number(item.contractMonthEnd.slice(0, 4)) + yearsInfo;
        let endMonth = Number(item.contractMonthEnd.slice(4)) + monthInfo;
        // console.log(monthInfo, "monthinfo");
        if (endMonth > 12) {
          endYear += 1;
          endMonth = endMonth - 12;
        }
        if (endMonth < 10) {
          endTime = String(endYear) + "-0" + String(endMonth) + "-01";
        } else {
          endTime = String(endYear) + "-" + String(endMonth) + "-01";
        }
        let monthList = getMonthBetween(startTime, endTime);
        item.monthList = monthList
        // end
        let newEPIObj = {};

        monthList.forEach((element) => {
          newEPIObj[element.month] = "";
        });
        // epiSplitList中对象拼接
        item.epiSplitList.forEach((element) => {
          Object.assign(element, newEPIObj);
        });
        console.log(item.epiSplitList, "item.epiSplitList");
        // epiSplitList中数据重组
        item.epiSplitList.forEach((item) => {
          let newData = {};
          let MData = {};
          // let newMonthList = [];
          // 截取12个月data
          let newKeys = Object.keys(item);
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
          let finArr1 = Reflect.ownKeys(newData);
          let finArr2 = Reflect.ownKeys(MData);
          let lastData = {};
          finArr1.forEach((i, index) => {
            lastData[i] = MData[finArr2[index]];
          });
          for (var p in item) {
            for (var q in lastData) {
              if (p === q) {
                item[p] = lastData[q];
              }
            }
          }
        });
        item.EPIData = item.epiSplitList;
      });
      console.log(this.monthAdjustDetailList, 'this.monthAdjustDetailList');
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
          console.log(sums[index], "sums[index]");
          sums[index] = sums[index].toFixed(2) + " 元";
        } else {
          sums[index] = "N/A";
        }
      });

      return sums;
    },
  },
  mounted() {
    this.init();
    $http
      .post(api.monthAdjustDetail, {
        estimateKey: "a3137f63-aa83-11ec-9e97-a4ae1204f49c",
      })
      .then((res) => {
        console.log(res, "res");
      });
  },
};
</script>

<style></style>
