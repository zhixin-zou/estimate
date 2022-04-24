<template>
  <el-table :data="listData" border style="width: 100%" :ref="refProp">
    <el-table-column
      v-for="(col, index) in columns"
      :key="index"
      :prop="col.property"
      :label="col.title"
      :width="col.width || 0"
    >
      <template slot-scope="scope">
        <template v-if="Array.isArray(col.actions)">
          <span v-for="action in col.actions" :key="action.name">
            <el-button
              type="text"
              size="mini"
              @click="
                handleActionClick(
                  action.name,
                  scope.row,
                  scope.$index,
                  col,
                  action
                )
              "
            >
              {{ action.title }}
            </el-button>
            <i
              class="el-icon-loading"
              v-show="
                Array.isArray(action.loading) &&
                action.loading.indexOf(scope.$index) > -1
              "
            ></i>
          </span>
        </template>
        <template v-else>
          <span>{{ getCellValue(scope.row, col) }}</span>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { getText } from "@/utils/dict.js";
import { toPercent, kiloSplit } from "@/utils/utils.js";

export default {
  name: "fs-list-panel",
  props: {
    columns: Array,
    listData: Array,
    refProp: String,
  },
  methods: {
    // handleClick(row) {
    //   console.log(row);
    // },
    getCellValue(row, col) {
      if (col.formatter === "dict" && col.dictName) {
        // 本地字典
        return getText(col.dictName, row[col.property]);
      } else if (col.formatter === "toPercent") {
        return toPercent(row[col.property]);
      } else if (col.formatter === "kiloSplit") {
        return kiloSplit(row[col.property]);
      } else {
        return row[col.property];
      }
    },
  },

  data() {
    return {
      methods: {
        getActions(actions) {
          return actions.filter((act) => !act.more);
        },

        getMoreActions(actions) {
          return actions.filter((act) => act.more);
        },
        handleActionClick(name, row, index, col, action) {
          if (
            Array.isArray(action.loading) &&
            action.loading.indexOf(index) > -1
          ) {
            return;
          }
          this.$emit(name, row, index, col, action);
        },

        getActionTitle(row, action) {
          if (typeof action.title === "function") {
            return action.title(row, action);
          } else {
            return action.title;
          }
        },
      },
    };
  },
};
</script>
<style></style>
