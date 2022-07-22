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
            >下载IBNR数据导入模板</el-button
          >
          <el-button
            type="primary"
            size="mini"
            :loading="importing"
            plain
            @click="handleUpload"
            >IBNR数据导入</el-button
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
        dataPeriod: ''
      },
      tags: [],
      tablesProp: [],
      tableData: [],
      reportModifyList: [],
      treeDataShowList: [
        "0",
        "1",
        "2",
        "05317f2a-00fb-11ed-9a92-a4ae1204f49c",
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
            dataPeriod: this.form.dataPeriod
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
              this.treeDataShowList = [];
              this.treeDataShowList.push(index + "");
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
            dataPeriod: this.form.dataPeriod
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
        "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";
      let contentType = "application/octet-stream";
      const blob = this.b64toBlob(b64Data, contentType);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "IBNR数据导入模板.xlsx");
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
          .post(api.saveEpi, data)
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
