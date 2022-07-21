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
            @click="handleEdit"
            style="margin-left: 5px"
            >修改</el-button
          >
          <el-button
            :loading="loading"
            size="mini"
            type="primary"
            @click="handleSearchClick"
            style="margin-left: 5px"
            >查询</el-button
          >
          <el-button
            class="exportButton"
            size="mini"
            type="primary"
            plain
            @click="handleExport('lazyTableRefdownload', '导出信息')"
            >导出</el-button
          >
          <!-- <el-button size="mini" @click="handleResetClick">重置</el-button> -->
        </div>
      </div>
    </div>
    <div class="listBox">
      <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="reportId"
        :load="load"
        row-click="handlerow"
        ref="lazyTableRef"
        lazy
        :expand-row-keys="treeDataShowList"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column show-overflow-tooltip prop="name" label="" width="400">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width || ''"
        >
          <template slot-scope="scope">
            <el-input
              v-model="scope.row[item.prop]"
              v-if="scope.row.modifyFlag === 'Y'"
              @change="handleChage(scope.row, scope.column)"
            ></el-input>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
            <el-table
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="reportId"
        :load="load"
        v-show="false"
        row-click="handlerow"
        ref="lazyTableRefdownload"
        lazy
        :expand-row-keys="treeDataShowList"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column show-overflow-tooltip prop="name" label="" width="400">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width || ''"
        >
          <template slot-scope="scope">
            <!-- <el-input
              v-model="scope.row[item.prop]"
              v-if="scope.row.modifyFlag === 'Y'"
              @change="handleChage(scope.row, scope.column)"
            ></el-input> -->
            <span>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { $http } from "@/utils/request";
import api from "@/utils/api";
import * as XLSX from "xlsx";
import FileSaver from "file-saver";

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
      tableData: [],
      reportModifyList: [],
      treeDataShowList: ["0", "1", "2", "05317f2a-00fb-11ed-9a92-a4ae1204f49c"],
      columns: [
        // {
        //   label: "",
        //   prop: "name",
        //   type: "template",
        //   template: "isEdit",
        //   width: 200,
        // },
      ],
      changeList: [],
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
      this.columns = [
        // {
        //   label: "",
        //   prop: "name",
        //   type: "template",
        //   template: "isEdit",
        //   width: 200,
        // },
      ];
      this.headerList = [];
      periodList.forEach((e) => {
        this.form.checkList.forEach((i) => {
          this.headerList.push({
            prop: i + e,
            label: i + e,
          });
          this.columns.push({
            label: i + e,
            prop: i + e,
            type: "template",
            template: "isEdit",
          });
        });
      });
      // table Header 处理

      console.log(this.headerList, "headerList", this.columns);
      $http
        .post(api.uyReportQuery, {
          periodList: periodList,
          blanceTypeList: this.form.checkList,
        })
        .then((res) => {
          let showData = [];
          console.log(res, "res");
          // table数量处理
          let map = new Map();
          for (let item of res.data.data.reportDetailList) {
            map.set(item.itemType, item);
          }
          this.tablesProp = [...map.values()];
          console.log(
            this.tablesProp,
            "res.data.data.reportDetailList",
            this.columns
          );

          // table数据处理
          this.tablesProp.forEach((i, index) => {
            this.columns.forEach((e) => {
              if (e.prop !== "name") {
                showData.push({
                  name: i.itemType,
                  reportId: index + "",
                  children: [],
                });
              }
            });
          });

          // 对showData去重
          for (let i = 0; i < showData.length; i++) {
            for (let j = i + 1; j < showData.length; j++) {
              if (showData[i].name === showData[j].name) {
                showData.splice(j, 1);
                j = j - 1;
              }
            }
          }

          this.columns.forEach((item) => {
            showData.forEach((e) => {
              if (item.prop !== "name") {
                e[item.prop] = "";
                console.log(e, "e");
              }
            });
          });

          let arr1 = [];
          let arr2 = [];
          let arr3 = [];

          console.log(
            res.data.data.reportDetailList,
            "res.data.data.reportDetailList"
          );
          for (let item of res.data.data.reportDetailList) {
            if (item.itemType === "REVENUE") {
              arr1.push(item);
            }
            if (item.itemType === "EXPENSES") {
              arr2.push(item);
            }
            if (item.itemType === "OTHER COMPREHENSIVE INCOME") {
              arr3.push(item);
            }
          }

          // console.log(arr1, 'firstarr1');

          let arrnew1 = [];
          let arrnew2 = [];
          let arrnew3 = [];
          var obj1 = {};
          arrnew1 = arr1.reduce(function (item, next) {
            obj1[next.itemName]
              ? ""
              : (obj1[next.itemName] = true && item.push(next));
            return item;
          }, []);

          // console.log(arr1, 'arr1');
          arrnew1.forEach((item) => {
            this.headerList.forEach((p) => {
              console.log(p.prop, "p.prop");
              arr1.forEach((q) => {
                if (
                  p.prop === q.balanceType + q.period &&
                  item.itemName === q.itemName
                ) {
                  item[p.prop] = q.amount;
                  item[p.prop + "id"] = q.reportId;
                  item[p.prop + "contractNo"] = q.contractNo;
                  item.name = item.itemName;
                  item.reportId = q.reportId;
                  if (item.contractFlag === "Y") {
                    item.hasChildren = true;
                  }
                  if (item.showPlace === "1.1") {
                    item.name = "----" + " " + item.itemName;
                  }
                  if (item.showPlace === "1.1.1") {
                    item.name = "--------" + " " + item.itemName;
                  }
                }
              });
            });
          });

          var obj2 = {};
          arrnew2 = arr2.reduce(function (item, next) {
            obj2[next.itemName]
              ? ""
              : (obj2[next.itemName] = true && item.push(next));
            return item;
          }, []);
          arrnew2.forEach((item) => {
            this.headerList.forEach((p) => {
              arr2.forEach((q) => {
                if (
                  p.prop === q.balanceType + q.period &&
                  item.itemName === q.itemName
                ) {
                  item[p.prop] = q.amount;
                  item[p.prop + "id"] = q.reportId;
                  item[p.prop + "contractNo"] = q.contractNo;
                  item.name = item.itemName;
                  if (item.contractFlag === "Y") {
                    item.hasChildren = true;
                  }
                  if (item.showPlace === "1.1") {
                    item.name = "----" + " " + item.itemName;
                  }
                  if (item.showPlace === "1.1.1") {
                    item.name = "--------" + " " + item.itemName;
                  }
                }
              });
            });
          });

          var obj3 = {};
          arrnew3 = arr3.reduce(function (item, next) {
            obj3[next.itemName]
              ? ""
              : (obj3[next.itemName] = true && item.push(next));
            return item;
          }, []);
          arrnew3.forEach((item) => {
            this.headerList.forEach((p) => {
              arr3.forEach((q) => {
                console.log(
                  q.reportId,
                  "reportIdreportIdreportIdreportIdreportId"
                );
                if (
                  p.prop === q.balanceType + q.period &&
                  item.itemName === q.itemName
                ) {
                  item[p.prop] = q.amount;
                  item[p.prop + "id"] = q.reportId;
                  item[p.prop + "contractNo"] = q.contractNo;
                  item.name = item.itemName;
                  if (item.contractFlag === "Y") {
                    item.hasChildren = true;
                  }
                  if (item.showPlace === "1.1") {
                    item.name = "----" + " " + item.itemName;
                  }
                  if (item.showPlace === "1.1.1") {
                    item.name = "--------" + " " + item.itemName;
                  }
                }
              });
            });
          });

          console.log(arr1, "firstarr1", arrnew1, "arrnew1");
          showData[0].children = arrnew1;
          showData[1].children = arrnew2;
          showData[2].children = arrnew3;

          // // 对所有showPlace为1 的数据进行处理
          // // let arrone = [];
          // let arr1 = [];
          // let arr2 = [];
          // let arr3 = [];

          // console.log(
          //   res.data.data.reportDetailList,
          //   "res.data.data.reportDetailList"
          // );
          // for (let item of res.data.data.reportDetailList) {
          //   if (item.showPlace === "1" && item.itemType === "REVENUE") {
          //     arr1.push(item);
          //   }
          //   if (item.showPlace === "1" && item.itemType === "EXPENSES") {
          //     arr2.push(item);
          //   }
          //   if (
          //     item.showPlace === "1" &&
          //     item.itemType === "OTHER COMPREHENSIVE INCOME"
          //   ) {
          //     arr3.push(item);
          //   }
          // }

          // // console.log(arr1, 'firstarr1');

          // let arrnew1 = [];
          // let arrnew2 = [];
          // let arrnew3 = [];
          // //
          // var obj1 = {};
          // arrnew1 = arr1.reduce(function (item, next) {
          //   obj1[next.itemName]
          //     ? ""
          //     : (obj1[next.itemName] = true && item.push(next));
          //   return item;
          // }, []);

          // // console.log(arr1, 'arr1');
          // arrnew1.forEach((item) => {
          //   this.headerList.forEach((p) => {
          //     console.log(p.prop, "p.prop");
          //     arr1.forEach((q) => {
          //       if (
          //         p.prop === q.balanceType + q.period &&
          //         item.itemName === q.itemName
          //       ) {
          //         item[p.prop] = q.amount;
          //         item[p.prop + "id"] = q.reportId;
          //         item[p.prop + "contractNo"] = q.contractNo;
          //         item.name = item.itemName;
          //         item.reportId = q.reportId;
          //         if (item.contractFlag === "Y") {
          //           item.hasChildren = true;
          //         }
          //       }
          //     });
          //   });
          // });
          // console.log(arr1, "firstarr1", arrnew1, "arrnew1");

          // var obj2 = {};
          // arrnew2 = arr2.reduce(function (item, next) {
          //   obj2[next.itemName]
          //     ? ""
          //     : (obj2[next.itemName] = true && item.push(next));
          //   return item;
          // }, []);
          // arrnew2.forEach((item) => {
          //   this.headerList.forEach((p) => {
          //     arr2.forEach((q) => {
          //       if (
          //         p.prop === q.balanceType + q.period &&
          //         item.itemName === q.itemName
          //       ) {
          //         item[p.prop] = q.amount;
          //         item[p.prop + "id"] = q.reportId;
          //         item[p.prop + "contractNo"] = q.contractNo;
          //         item.name = item.itemName;
          //         if (item.contractFlag === "Y") {
          //           item.hasChildren = true;
          //         }
          //       }
          //     });
          //   });
          // });

          // var obj3 = {};
          // arrnew3 = arr3.reduce(function (item, next) {
          //   obj3[next.itemName]
          //     ? ""
          //     : (obj3[next.itemName] = true && item.push(next));
          //   return item;
          // }, []);
          // arrnew3.forEach((item) => {
          //   this.headerList.forEach((p) => {
          //     arr3.forEach((q) => {
          //       console.log(
          //         q.reportId,
          //         "reportIdreportIdreportIdreportIdreportId"
          //       );
          //       if (
          //         p.prop === q.balanceType + q.period &&
          //         item.itemName === q.itemName
          //       ) {
          //         item[p.prop] = q.amount;
          //         item[p.prop + "id"] = q.reportId;
          //         item[p.prop + "contractNo"] = q.contractNo;
          //         item.name = item.itemName;
          //         if (item.contractFlag === "Y") {
          //           item.hasChildren = true;
          //         }
          //       }
          //     });
          //   });
          // });
          // console.log(arrnew1, arrnew2, arrnew3, "arrnew");
          // arrnew1.sort((a, b) => {
          //   return Number(a.itemCode) - Number(b.itemCode);
          // });
          // arrnew2.sort((a, b) => {
          //   return Number(a.itemCode) - Number(b.itemCode);
          // });
          // arrnew3.sort((a, b) => {
          //   return Number(a.itemCode) - Number(b.itemCode);
          // });

          // showData[0].children = arrnew1;
          // showData[1].children = arrnew2;
          // showData[2].children = arrnew3;

          // // 对所有showPlace为1.1 的数据进行处理
          // // let arrone = [];
          // let arrson1 = [];
          // let arrson2 = [];
          // let arrson3 = [];

          // for (let item of res.data.data.reportDetailList) {
          //   if (item.showPlace === "1.1" && item.itemType === "REVENUE") {
          //     arrson1.push(item);
          //   }
          //   if (item.showPlace === "1.1" && item.itemType === "EXPENSES") {
          //     arrson2.push(item);
          //   }
          //   if (
          //     item.showPlace === "1.1" &&
          //     item.itemType === "OTHER COMPREHENSIVE INCOME"
          //   ) {
          //     arrson3.push(item);
          //   }
          // }

          // let arrnewson1 = [];
          // let arrnewson2 = [];
          // let arrnewson3 = [];
          // //
          // var objson1 = {};
          // arrnewson1 = arrson1.reduce(function (item, next) {
          //   objson1[next.itemName]
          //     ? ""
          //     : (objson1[next.itemName] = true && item.push(next));
          //   return item;
          // }, []);
          // arrnewson1.forEach((item) => {
          //   this.headerList.forEach((p) => {
          //     arrson1.forEach((q) => {
          //       if (
          //         p.prop === q.balanceType + q.period &&
          //         item.itemName === q.itemName
          //       ) {
          //         item[p.prop] = q.amount;
          //         item[p.prop + "id"] = q.reportId;
          //         item[p.prop + "contractNo"] = q.contractNo;
          //         item.name = item.itemName;
          //         item.reportId = q.reportId;
          //         // item.itemCode = q.itemCode
          //         if (item.contractFlag === "Y") {
          //           item.hasChildren = true;
          //         }
          //       }
          //     });
          //   });
          // });

          // console.log(arrnewson1, "arrn1arrnewson1arrnewson1");
          // showData[0].children.forEach((item) => {
          //   arrnewson1.forEach((element) => {
          //     if (item.itemCode === element.parentCode) {
          //       if (!item.children) {
          //         item.children = [];
          //       }
          //       item.children.push(element);
          //       // console.log(item.children, 'element');
          //     }
          //   });
          // });
          // var objson2 = {};
          // if (arrson2.length !== 0) {
          //   arrnewson2 = arrson2.reduce(function (item, next) {
          //     objson2[next.itemName]
          //       ? ""
          //       : (objson2[next.itemName] = true && item.push(next));
          //     return item;
          //   }, []);
          //   arrnewson2.forEach((item) => {
          //     this.headerList.forEach((p) => {
          //       arrson2.forEach((q) => {
          //         if (
          //           p.prop === q.balanceType + q.period &&
          //           item.itemName === q.itemName
          //         ) {
          //           item[p.prop] = q.amount;
          //           item[p.prop + "id"] = q.reportId;
          //           item[p.prop + "contractNo"] = q.contractNo;
          //           item.name = item.itemName;
          //           if (item.contractFlag === "Y") {
          //             item.hasChildren = true;
          //           }
          //         }
          //       });
          //     });
          //   });
          // }
          // showData[1].children.forEach((item) => {
          //   arrnewson2.forEach((element) => {
          //     if (item.itemCode === element.parentCode) {
          //       if (!item.children) {
          //         item.children = [];
          //       }
          //       item.children.push(element);
          //     }
          //   });
          // });

          // var objson3 = {};
          // arrnewson3 = arrson3.reduce(function (item, next) {
          //   objson3[next.itemName]
          //     ? ""
          //     : (objson3[next.itemName] = true && item.push(next));
          //   return item;
          // }, []);
          // arrnewson3.forEach((item) => {
          //   this.headerList.forEach((p) => {
          //     arrson3.forEach((q) => {
          //       if (
          //         p.prop === q.balanceType + q.period &&
          //         item.itemName === q.itemName
          //       ) {
          //         item[p.prop] = q.amount;
          //         item[p.prop + "id"] = q.reportId;
          //         item[p.prop + "contractNo"] = q.contractNo;
          //         item.name = item.itemName;
          //         if (item.contractFlag === "Y") {
          //           item.hasChildren = true;
          //         }
          //       }
          //     });
          //   });
          // });
          // showData[2].children.forEach((item) => {
          //   arrnewson3.forEach((element) => {
          //     if (item.itemCode === element.parentCode) {
          //       if (!item.children) {
          //         item.children = [];
          //       }
          //       item.children.push(element);
          //     }
          //   });
          // });
          // // arrnewson1.sort((a, b) => {
          // //   return Number(a.itemCode) - Number(b.itemCode);
          // // });
          // // arrnewson2.sort((a, b) => {
          // //   return Number(a.itemCode) - Number(b.itemCode);
          // // });
          // // arrnewson3.sort((a, b) => {
          // //   return Number(a.itemCode) - Number(b.itemCode);
          // // });

          // // if (showData[0].children.length !== 0) {
          // //   showData[0].children[showData[0].children.length - 1].children =
          // //     arrnewson1;
          // // }
          // // if (showData[1].children.length !== 0) {
          // //   showData[1].children[showData[1].children.length - 1].children =
          // //     arrnewson2;
          // // }
          // // if (showData[2].children.length !== 0) {
          // //   showData[2].children[showData[2].children.length - 1].children =
          // //     arrnewson3;
          // // }

          // // 对所有showPlace为1.1.1 的数据进行处理
          // // let arrone = [];
          // let arrGrandson1 = [];
          // let arrGrandson2 = [];
          // let arrGrandson3 = [];

          // for (let item of res.data.data.reportDetailList) {
          //   if (item.showPlace === "1.1.1" && item.itemType === "REVENUE") {
          //     arrGrandson1.push(item);
          //   }
          //   if (item.showPlace === "1.1.1" && item.itemType === "EXPENSES") {
          //     arrGrandson2.push(item);
          //   }
          //   if (
          //     item.showPlace === "1.1.1" &&
          //     item.itemType === "OTHER COMPREHENSIVE INCOME"
          //   ) {
          //     arrGrandson3.push(item);
          //   }
          // }
          // console.log(arrGrandson1, arrGrandson2, arrGrandson3, "??!!!");
          // let arrnewGrandson1 = [];
          // let arrnewGrandson2 = [];
          // let arrnewGrandson3 = [];
          // //
          // var objGrandson1 = {};
          // if (arrGrandson1.length !== 0) {
          //   arrnewGrandson1 = arrGrandson1.reduce(function (item, next) {
          //     objGrandson1[next.itemName]
          //       ? ""
          //       : (objGrandson1[next.itemName] = true && item.push(next));
          //     return item;
          //   }, []);
          //   arrnewGrandson1.forEach((item) => {
          //     this.headerList.forEach((p) => {
          //       arrGrandson1.forEach((q) => {
          //         if (
          //           p.prop === q.balanceType + q.period &&
          //           item.itemName === q.itemName
          //         ) {
          //           item[p.prop] = q.amount;
          //           item[p.prop + "id"] = q.reportId;
          //           item[p.prop + "contractNo"] = q.contractNo;
          //           item.name = item.itemName;
          //           if (item.contractFlag === "Y") {
          //             item.hasChildren = true;
          //           }
          //         }
          //       });
          //     });
          //   });
          // }
          // console.log(
          //   arrnewGrandson1,
          //   "arrnewGrandson1arrnewGrandson1arrnewGrandson1arrnewGrandson1arrnewGrandson1arrnewGrandson1arrnewGrandson1"
          // );

          // showData[0].children.forEach((item) => {
          //   if (item.children && item.children.length !== 0) {
          //     item.children.forEach((p) => {
          //       console.log(p.itemCode, "1.1.1item");

          //       arrnewGrandson1.forEach((q) => {
          //         if (p.itemCode === q.parentCode) {
          //           if (!p.children) {
          //             p.children = [];
          //           }
          //           p.children.push(q);
          //         }
          //       });
          //     });
          //   }
          // });

          // var objGrandson2 = {};
          // if (arrGrandson2.length !== 0) {
          //   arrnewGrandson2 = arrson2.reduce(function (item, next) {
          //     objGrandson2[next.itemName]
          //       ? ""
          //       : (objGrandson2[next.itemName] = true && item.push(next));
          //     return item;
          //   }, []);
          //   arrnewGrandson2.forEach((item) => {
          //     this.headerList.forEach((p) => {
          //       arrGrandson2.forEach((q) => {
          //         if (
          //           p.prop === q.balanceType + q.period &&
          //           item.itemName === q.itemName
          //         ) {
          //           item[p.prop] = q.amount;
          //           item[p.prop + "id"] = q.reportId;
          //           item[p.prop + "contractNo"] = q.contractNo;
          //           item.name = item.itemName;
          //           if (item.contractFlag === "Y") {
          //             item.hasChildren = true;
          //           }
          //         }
          //       });
          //     });
          //   });
          // }

          // showData[1].children.forEach((item) => {
          //   if (item.children && item.children.length !== 0) {
          //     item.children.forEach((p) => {
          //       console.log(p.itemCode, "1.1.1item");

          //       arrnewGrandson2.forEach((q) => {
          //         if (p.itemCode === q.parentCode) {
          //           if (!p.children) {
          //             p.children = [];
          //           }
          //           p.children.push(q);
          //         }
          //       });
          //     });
          //   }
          // });

          // var objGrandson3 = {};

          // if (arrGrandson3.length !== 0) {
          //   arrnewGrandson3 = arrGrandson3.reduce(function (item, next) {
          //     objGrandson3[next.itemName]
          //       ? ""
          //       : (objGrandson3[next.itemName] = true && item.push(next));
          //     return item;
          //   }, []);
          //   arrnewGrandson3.forEach((item) => {
          //     this.headerList.forEach((p) => {
          //       arrGrandson3.forEach((q) => {
          //         if (
          //           p.prop === q.balanceType + q.period &&
          //           item.itemName === q.itemName
          //         ) {
          //           item[p.prop] = q.amount;
          //           item[p.prop + "id"] = q.reportId;
          //           item[p.prop + "contractNo"] = q.contractNo;
          //           item.name = item.itemName;
          //           if (item.contractFlag === "Y") {
          //             item.hasChildren = true;
          //           }
          //         }
          //       });
          //     });
          //   });
          // }

          // showData[2].children.forEach((item) => {
          //   if (item.children && item.children.length !== 0) {
          //     item.children.forEach((p) => {
          //       console.log(p.itemCode, "1.1.1item");

          //       arrnewGrandson3.forEach((q) => {
          //         if (p.itemCode === q.parentCode) {
          //           if (!p.children) {
          //             p.children = [];
          //           }
          //           p.children.push(q);
          //         }
          //       });
          //     });
          //   }
          // });
          // // arrnewGrandson1.sort((a, b) => {
          // //   return Number(a.itemCode) - Number(b.itemCode);
          // // });
          // // arrnewGrandson2.sort((a, b) => {
          // //   return Number(a.itemCode) - Number(b.itemCode);
          // // });
          // // arrnewGrandson3.sort((a, b) => {
          // //   return Number(a.itemCode) - Number(b.itemCode);
          // // });

          // // if (
          // //   showData[0].children.length !== 0 &&
          // //   showData[0].children[showData[0].children.length - 1].length !==
          // //     0 &&
          // //   arrnewGrandson1.length !== 0
          // // ) {
          // //   showData[0].children[showData[0].children.length - 1].children[
          // //     showData[0].children[showData[0].children.length - 1].children
          // //       .length - 1
          // //   ].children = arrnewGrandson1;
          // // }
          // // if (
          // //   showData[1].children.length !== 0 &&
          // //   showData[1].children[showData[1].children.length - 1].length !==
          // //     0 &&
          // //   arrnewGrandson2.length !== 0
          // // ) {
          // //   console.log(arrnewGrandson2, "aaaa");

          // //   showData[1].children[showData[1].children.length - 1].children[
          // //     showData[1].children[showData[1].children.length - 1].children
          // //       .length - 1
          // //   ].children = arrnewGrandson2;
          // // }

          console.log(showData, "showData");
          this.tableData = showData;
        });
    },
    handleEdit() {
      this.$http
        .post(api.uyReportModify, { reportModifyList: this.changeList })
        .then((res) => {
          console.log(res, "resres");
          if (res.data.code === "0") {
            this.$message.success("修改成功");
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .finally(() => {
          this.changeList = [];
        });
    },
    handleChage(row, column) {
      console.log(row[column.property + "id"], "row", column);
      if (
        this.changeList.find((x) => x.reportId === row[column.property + "id"])
      ) {
        let nowObj = this.changeList.find(
          (x) => x.reportId === row[column.property + "id"]
        );
        console.log(nowObj, "nowObj");
        nowObj.reportId = row[column.property + "id"];
        nowObj.contractNo = row[column.property + "contractNo"];
        nowObj.amount = row[column.property];
      } else {
        this.changeList.push({
          reportId: row[column.property + "id"],
          contractNo: row[column.property + "contractNo"],
          amount: row[column.property],
        });
      }

      console.log(this.changeList, "changeList");
    },
    load(tree, treeNode, resolve) {
      console.log(tree, treeNode, "???????");
      let periodList = [];
      this.tags.forEach((element) => {
        periodList.push(element.name);
      });
      $http
        .post(api.uyReportContractQuery, {
          periodList: periodList,
          blanceTypeList: this.form.checkList,
          itemCodeList: [tree.itemCode],
        })
        .then((res) => {
          console.log(this.$refs.lazyTableRef, "finally");
          //
          let arrfin = res.data.data.reportDetailContractList || [];
          let arrnewfin = [];
          var obfin1 = {};
          arrnewfin = arrfin.reduce(function (item, next) {
            obfin1[next.contractNo]
              ? ""
              : (obfin1[next.contractNo] = true && item.push(next));
            return item;
          }, []);
          console.log(arrfin, "arrfinarrfinarrfinarrfinarrfin");
          console.log(arrnewfin, "arrnewfinarrnewfin");

          arrnewfin.forEach((item) => {
            this.headerList.forEach((p) => {
              arrfin.forEach((q) => {
                if (
                  p.prop === q.balanceType + q.period &&
                  item.itemName === q.itemName
                ) {
                  item[p.prop] = q.amount;
                  item[p.prop + "id"] = q.reportId;
                  item[p.prop + "contractNo"] = q.contractNo;
                  item.name = item.contractNo;
                }
              });
            });
          });
          arrnewfin.sort((a, b) => {
            return Number(a.itemCode) - Number(b.itemCode);
          });
          setTimeout(() => {
            resolve(arrnewfin);
          }, 1000);
        });
    },
    // handleResetClick() {},
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
