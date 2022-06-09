<template>
  <div class="during">
    <div class="duringHeader">
      <div class="duringLeft">
        <span>当前期间:</span> <span>{{ nowDate }}</span>
      </div>
      <div class="duringright">
        <el-button size="mini" @click="handleNext()" :disabled="nextDuring">切换至下一期间</el-button>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="duringMain">
      
      <el-table
        :data="this.duringList"
        border
        style="width: 100%"
        ref="listBox"
      >
        <el-table-column
          prop="checkItem"
          label="检查项"
        >
        </el-table-column>
        <el-table-column
          prop="checkContent"
          label="检查内容"
        >
        </el-table-column>
        <el-table-column
          prop="checkResult"
          label="检查结果"
        >
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.checkResult"
              @change="handleTypeChange(scope)"
            >
              <el-option value="通过">通过</el-option>
              <el-option value="不通过">不通过</el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="estimateMonth" label="预估期间">
        </el-table-column>
        <el-table-column
          prop="checkRecordId"
          label="检查记录Id"
        >
        </el-table-column>
      </el-table>
      <!-- <fs-list-panel
        :ref="'duringList'"
        :columns="columns"
        :listData="duringList"
      ></fs-list-panel> -->
    </div>
  </div>
</template>

<script>
import { $http } from "@/utils/request";
import api from "@/utils/api";

export default {
  data() {
    return {
      nowDate: "????-??-??",
      columns: [
        {
          title: "检查项",
          property: "checkItem",
        },
        {
          title: "检查内容",
          property: "checkContent",
        },
        {
          title: "检查结果",
          property: "checkResult",
        },
        {
          title: "预估期间",
          property: "estimateMonth",
        },
        {
          title: "检查记录Id",
          property: "checkRecordId",
        },
      ],
      duringList: [],
      nextDuring: false
    };
  },
  methods: {
    init() {
      $http.post(api.periodInfoQuery, {}).then((res) => {
        console.log(res);
        this.duringList = res.data.data.periodCheckList
        this.nowDate = res.data.data.periodCheckList[0].estimateMonth
      });
    },
    handleNext () {
      $http.post(api.periodSwitch, {
        periodCheckList: this.duringList,
        estimateMonth: this.nowDate
      }).then(res => {
        if (res.data.code === '0') {
          this.nextDuring = true
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.init());
  },
};
</script>

<style lang="scss" scoped>
.during {
  .duringHeader {
    height: 30px;
    .duringLeft {
      float: left;
    }
    .duringright {
      float: left;
      margin-left: 50px;
    }
  }
}
</style>
