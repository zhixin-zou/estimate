<template>
  <div class="uy-report">
    <div class="searchBox">
      <div class="searchMain">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="统计月份" style="width: 450px; float: left">
            <el-date-picker
              v-model="form.time"
              type="month"
              format="yyyy-MM"
              value-format="yyyyMM"
              @change="dateChange"
            />
            <el-tag
              v-for="(tag, index) in tags"
              :key="tag.name"
              @close="(params) => tagClose(params, index)"
              closable
              type="success"
            >
              {{ tag.name }}
            </el-tag>
          </el-form-item>
          <el-form-item label="报告类型" style="width: 400px; float: left">
            <el-checkbox-group v-model="form.checkList">
              <el-checkbox label="Year-to-Date">Year-to-Date</el-checkbox>
              <el-checkbox label="Period-to-Date">Period-to-Date</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" style="float: right" class="searchFoot">
        <div class="searchButton">
          <el-button
            :loading="loading"
            size="mini"
            type="primary"
            @click="handleSearchClick"
            style="margin-left: 5px"
            >查询</el-button
          >
          <!-- <el-button size="mini" @click="handleResetClick">重置</el-button> -->
        </div>
      </div>
    </div>
    <div class="listBox">
      <el-table
        :data="item.itemNameList"
        style="width: 100%; margin-bottom: 20px"
        v-for="(item, index) in tablesProp"
        :key="index"
        border
      >
        <el-table-column prop="prop" :label="item.itemType" width="300">
        </el-table-column>
        <el-table-column
          v-for="(element, index) in headerList"
          :key="index"
          :prop="element.prop"
          :label="element.label"
        >
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { $http } from "@/utils/request";
import api from "@/utils/api";

export default {
  data() {
    return {
      loading: false,
      headerList: [],
      form: {
        time: "",
        checkList: [],
      },
      tags: [],
      tablesProp: [],
      tableData: [
        // {
        //   id: 1,
        //   date: "2016-05-02",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1518 弄",
        // },
        // {
        //   id: 2,
        //   date: "2016-05-04",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1517 弄",
        // },
        // {
        //   id: 3,
        //   date: "2016-05-01",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1519 弄",
        //   children: [
        //     {
        //       id: 31,
        //       date: "2016-05-01",
        //       name: "王小虎",
        //       address: "上海市普陀区金沙江路 1519 弄",
        //     },
        //     {
        //       id: 32,
        //       date: "2016-05-01",
        //       name: "王小虎",
        //       address: "上海市普陀区金沙江路 1519 弄",
        //     },
        //   ],
        // },
        // {
        //   id: 4,
        //   date: "2016-05-03",
        //   name: "王小虎",
        //   address: "上海市普陀区金沙江路 1516 弄",
        // },
      ],
    };
  },
  methods: {
    dateChange(val) {
      // console.log(val.getTime(), 'val');
      console.log(val, "val");

      this.tags.push({ name: val }); // 这里记得格式化
    },
    tagClose(val, index) {
      this.tags.splice(index, 1);
    },
    handleSearchClick() {
      let periodList = [];
      this.tags.forEach((element) => {
        periodList.push(element.name);
      });
      $http
        .post(api.uyReportQuery, {
          periodList: periodList,
          blanceTypeList: this.form.checkList,
        })
        .then((res) => {
          console.log(res, "res");
          // table数量处理
          let map = new Map();
          for (let item of res.data.data.reportDetailList) {
            map.set(item.itemType, item);
          }
          this.tablesProp = [...map.values()];
          //   console.log(this.tablesProp, 'res.data.data.reportDetailList');

          // table数据处理
          this.tablesProp.forEach((i) => {
            i.tableData = [];
          });
          this.tablesProp.forEach((i) => {
            res.data.data.reportDetailList.forEach((e) => {
              if (i.itemType === e.itemType) {
                i.tableData.push(e);
              }
            });
          });
          this.tablesProp.forEach((i) => {
            // i.tableData.forEach((p) => {
              let map = new Map();
              for (let item of i.tableData) {
                map.set(item.itemName, item);
              }
              i.itemNameList = [...map.values()];
            // });
          });

            this.tablesProp.forEach((i) => {
              i.itemNameList.forEach(q => {
               q.prop = q.itemName
               this.headerList.forEach(r => {
                q[r.prop] = '1'
               })
            });
          });
          console.log(this.tablesProp, "this.tablesProp");

        });

      // table Header 处理
      this.headerList = [];
      periodList.forEach((e) => {
        this.form.checkList.forEach((i) => {
          this.headerList.push({
            prop: i + e,
            label: i + e,
          });
        });
      });
      console.log(this.headerList, "headerList");
    },
    // handleResetClick() {},
  },
};
</script>

<style lang="scss">
.uy-report {
  position: relative;
  background-color: #fff;
  .searchBox {
    position: relative;
    display: flex;
    flex-flow: column;
    width: 100%;
    height: auto;
    // height: 200px;
    border: 1px solid #ccc;
    border-top: 3px solid #ccc;
    padding: 10px;
    // .el-form {
    //   .el-form-item {
    //     width: 250px;
    //     float: left;
    //     margin-left: 20px;
    //     .el-form-item__label {
    //       // width: ;
    //     }
    //     .el-form-item__content {
    //     .el-input {}
    //     }
    //   }
    // }
    .el-form {
      .el-form-item {
        display: inline-flex;
        width: 250px;
        .el-form-item__content {
          margin-left: 0 !important;
        }
        // .require-date {
        //   span {
        //     margin-left: 2px;
        //     margin-right: 2px;
        //   }
        //   .el-date-editor.el-input {
        //     width: 225px;
        //   }
        // }
        // .amount-range {
        //   span {
        //     margin-left: 2px;
        //     margin-right: 2px;
        //   }
        //   .el-input.el-input--small.el-input--suffix {
        //     width: 80px;
        //   }
        // }
      }
      .el-form-item.el-form-item--small.month-range {
        width: 550px;
        .el-form-item__content .el-date-editor {
          width: 220px;
        }
      }
      // .el-form-item--small {
      //   width: 271px;
      // }
      .el-form-item__label {
        font-size: 12px;
      }
      .el-form-item__content {
        flex: 1;
        .el-cascader {
          width: 100%;
        }
        .el-date-editor {
          width: 100%;
          padding-left: 5px;
          padding-right: 5px;
        }
      }
    }
    .searchFoot {
      .searchButton {
        float: right;
      }
    }
  }
}
</style>
