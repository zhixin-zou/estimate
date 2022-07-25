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

          <el-form-item label="合同号开始">
            <el-input v-model="form.contractNoBegin"></el-input>
          </el-form-item>

          <el-form-item label="合同号结束">
            <el-input v-model="form.contractNoEnd"></el-input>
          </el-form-item>

          <el-form-item label="数据期间">
            <el-date-picker
              type="month"
              placeholder="选择日期"
              v-model="form.dataPeriod"
              value-format="yyyyMM"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>

      <div slot="footer" style="float: right" class="searchFoot">
        <div class="searchButton">
          <el-button
            class="exportButton"
            size="mini"
            type="primary"
            plain
            @click="downloadFromBase64()"
            >UY明细导入模板下载</el-button
          >

          <el-button
            type="primary"
            size="mini"
            :loading="importing"
            plain
            @click="handleUpload"
            >UY明细数据导入</el-button
          >

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
    <input ref="file" type="file" class="hide" @change="fileChange" />
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
      importing: false,
      loading: false,
      headerList: [],
      form: {
        time: "",
        checkList: [],
        contractNoBegin: "",
        contractNoEnd: "",
        dataPeriod: "",
      },
      tags: [],
      tablesProp: [],
      tableData: [],
      reportModifyList: [],
      treeDataShowList: [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29",
        "30",
        "31",
        "32",
        "33",
        "34",
        "35",
        "36",
        "37",
        "38",
        "39",
        "40",
      ],
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
      this.tableData = [];
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

      console.log(this.headerList, "headerList", this.columns);
      if (this.form.contractNoBegin !== "" || this.form.contractNoEnd !== "") {
        $http
          .post(api.uyReportQuery, {
            periodList: periodList,
            blanceTypeList: this.form.checkList,
            contractNoBegin: this.form.contractNoBegin,
            contractNoEnd: this.form.contractNoEnd,
            dataPeriod: this.form.dataPeriod,
          })
          .then((res) => {
            console.log(res, "resres");
            let showData = [];
            // columns 处理
            this.columns.forEach((item) => {
              showData.forEach((e) => {
                if (item.prop !== "name") {
                  e[item.prop] = "";
                  console.log(e, "e");
                }
              });
            });
            localStorage.setItem(
              "reportDetailList",
              JSON.stringify(res.data.data.reportDetailList)
            );
            let arrs = res.data.data.reportDetailList;

            var arrnews = [];
            var obj = {};
            for (var i = 0; i < arrs.length; i++) {
              if (!obj[arrs[i].itemName]) {
                arrnews.push(arrs[i]);
                obj[arrs[i].itemName] = true;
              }
            }
            arrnews.forEach((item) => {
              item.nextchild = [];
              item.name = item.itemName;
              item.children = [];
            });
            let arrnew = JSON.parse(localStorage.getItem("reportDetailList"));
            for (let i = 0; i < arrnews.length; i++) {
              let arrcopy = [];
              for (let j = 0; j < arrnew.length; j++) {
                if (arrnews[i].itemName === arrnew[j].itemName) {
                  arrcopy.push(arrnew[j]);
                }
                arrnews[i].nextchild = arrcopy;
              }
            }

            arrnews.forEach((item) => {
              let childArr = [];
              var obj = {};
              for (var i = 0; i < item.nextchild.length; i++) {
                if (!obj[item.nextchild[i].contractNo]) {
                  childArr.push(item.nextchild[i]);
                  obj[item.nextchild[i].contractNo] = true;
                }
              }
              item.children = childArr;
              // let contractList = arr.reduce(function (item, next) {
              //   obj[next.contractNo]
              //     ? ""
              //     : (obj[next.contractNo] = true && item.push(next));
              //   return item;
              // }, []);
            });
            arrnews.forEach((i) => {
              i.children.forEach((item) => {
                this.headerList.forEach((p) => {
                  i.nextchild.forEach((q) => {
                    if (
                      p.prop === q.balanceType + q.period &&
                      item.contractNo === q.contractNo
                    ) {
                      item[p.prop] = q.amount;
                      item[p.prop + "id"] = q.reportId;
                      item[p.prop + "contractNo"] = q.contractNo;
                      item.name = item.contractNo;
                    }
                  });
                });
              });
            });

            arrnews.forEach((item, index) => {
              item.reportId = index + "";
              item.modifyFlag = "N";
              // this.treeDataShowList = [];
              // this.treeDataShowList.push(index + "");
            });
            console.log(arrnews, "result");
            console.log(arrnew, "arrssss");
            this.tableData = arrnews;
          });
      } else {
        $http
          .post(api.uyReportQuery, {
            periodList: periodList,
            blanceTypeList: this.form.checkList,
            contractNoBegin: "",
            contractNoEnd: "",
            dataPeriod: this.form.dataPeriod,
          })
          .then((res) => {
            let showData = [];
            console.log(res, "res");
            // table数量处理
            let map = new Map();
            for (let item of res.data.data.reportDetailList) {
              map.set(item.itemType, item);
            }
            console.log(11111);
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
            if (showData[0] && showData[0].children) {
              showData[0].children = arrnew1;
            }
            if (showData[1] && showData[1].children) {
              showData[1].children = arrnew2;
            }
            if (showData[2] && showData[2].children) {
              showData[2].children = arrnew3;
            }

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
      }
    },
    handleEdit() {
      this.$http
        .post(api.uyReportModify, { reportModifyList: this.changeList })
        .then((res) => {
          console.log(res, "resres");
          if (res.data.code === "0") {
            this.$message.success("修改成功");
            this.handleSearchClick();
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
                  item.contractNo === q.contractNo
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
    b64toBlob(b64Data, contentType = "", sliceSize = 512) {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    },
    downloadFromBase64() {
      let b64Data =
        "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"
      let contentType = "application/octet-stream";
      const blob = this.b64toBlob(b64Data, contentType);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "UY Report Detail import template.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    handleUpload() {
      this.$refs["file"].click();
    },
    fileChange(e) {
      var target = e.target;
      if (target.files && target.files.length) {
        var data = new FormData();
        data.append("file", target.files[0]);
        this.importing = true;
        $http
          .post(api.saveUyReportDetail, data)
          .then((res) => {
            console.log(res);
            if (res.data.code === "0") {
              this.$message.success("导入成功");
            } else {
              if (res.data.msg !== "") {
                this.$message.error(res.data.msg);
              } else {
                this.$message.error("导入失败");
              }
            }
          })
          .finally(() => {
            this.importing = false;
            this.$refs.file.value = "";
          });
      }
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
    height: auto; // height: 200px;
    border: 1px solid #ccc;
    border-top: 3px solid #ccc;
    padding: 10px; // .el-form {
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
        } // .require-date {
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
      } // .el-form-item--small {
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
