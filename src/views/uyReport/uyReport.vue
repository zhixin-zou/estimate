<template>
  <div class="uy-report">
    <div class="searchBox">
      <div class="searchMain">
        <el-form ref="form" :model="form" label-width="100px">
          <div style="height: 102px">
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

            <el-form-item label="报告类型" style="width: 380px; float: left">
              <el-checkbox-group v-model="form.checkList">
                <el-checkbox label="Year-to-Date">Year-to-Date</el-checkbox>

                <el-checkbox label="Period-to-Date">Period-to-Date</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="合同号开始" style="width: 380px; float: left">
              <el-input v-model="form.contractNoBegin"></el-input>
            </el-form-item>

            <el-form-item label="合同号结束" style="width: 380px; float: left">
              <el-input v-model="form.contractNoEnd"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="数据期间" style="width: 380px; float: left">
            <el-date-picker
              type="month"
              placeholder="选择日期"
              v-model="form.dataPeriod"
              value-format="yyyyMM"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="分入公司" style="float: left; width: 380px">
            <el-select
              v-model="form.cedent"
              placeholder="请选择"
              clearable
              style="width: 300px"
            >
              <el-option
                v-for="(item, index) in companyList"
                :key="index"
                :label="item.partnerName"
                :value="item.partnerCode"
              ></el-option>
            </el-select>
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
            @click="showAllData()"
            >一键展开合同数据</el-button
          >
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
        ref="lazyTableRef"
        @expand-change="handleNodeClick"
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
        :data="anotherTableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="reportId"
        v-show="true"
        v-if="showAnotherTable"
        ref="lazyTableRefdownload"
        lazy
        default-expand-all
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
      showAnotherTable: true,
      importing: false,
      loading: false,
      headerList: [],
      companyList: [],
      form: {
        time: "",
        checkList: [],
        contractNoBegin: "",
        contractNoEnd: "",
        dataPeriod: "",
        cedent: "",
      },
      tags: [],
      tablesProp: [],
      tableData: [],
      anotherTableData: [],
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
      anotherTableDataFlag: false,
    };
  },
  methods: {
    init() {
      $http.get("/estimate/partnerQuery").then((res) => {
        this.companyList = res.data.data.partnerList;
      });
    },
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
            cedent: this.form.cedent,
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
              item[item.balanceType + item.period] = "";
            });
            arrnews.forEach((item) => {
              this.headerList.forEach((p) => {
                arrs.forEach((q) => {
                  if (
                    p.prop === q.balanceType + q.period &&
                    item.itemName === q.itemName &&
                    q.contractNo === ""
                  ) {
                    item[p.prop] = q.amount;
                    item[p.prop + "id"] = q.reportId;
                    item[p.prop + "contractNo"] = q.contractNo;
                  }
                });
              });
            });
            console.log(arrnews, "arrnewslllllllllllllllllllllllllllllllllll");
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
                if (
                  !obj[item.nextchild[i].contractNo] &&
                  item.nextchild[i].contractNo !== ""
                ) {
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
            this.anotherTableData = arrnews;
          });
      } else {
        $http
          .post(api.uyReportQuery, {
            periodList: periodList,
            blanceTypeList: this.form.checkList,
            contractNoBegin: "",
            contractNoEnd: "",
            dataPeriod: this.form.dataPeriod,
            cedent: this.form.cedent,
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
            localStorage.setItem("showData", JSON.stringify(showData));
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
          contractNoBegin: this.form.contractNoBegin || "",
          contractNoEnd: this.form.contractNoEnd || "",
          dataPeriod: this.form.dataPeriod || "",
          cedent: this.form.cedent || "",
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
          if (!this.anotherTableDataFlag) {
            let anotherTableData = JSON.parse(localStorage.getItem("showData"));
            this.anotherTableData = anotherTableData;
            this.anotherTableDataFlag = true;
          }
          // anotherTableData.forEach((item) => {
          //   console.log(item.itemType, "item.itemType");
          //   if (item.name === tree.itemType) {
          //     item.children.forEach((element) => {
          //       if (element.itemName === tree.itemName) {
          //         delete element.hasChildren;
          //         element.children = arrnewfin;
          //       }
          //     });
          //   }
          // });

          // arrnewfin.sort((a, b) => {
          //   return Number(a.itemCode) - Number(b.itemCode);
          // });
          setTimeout(() => {
            resolve(arrnewfin);
          }, 1000);
        });
    },
    handleNodeClick(row, expandedRows) {
      console.log(row, "rowrownode", expandedRows);
      this.anotherTableData.forEach((item) => {
        if (item.children) {
          // console.log(item, "item");
          item.children.forEach((element) => {
            if (element.reportId === row.reportId && !expandedRows) {
              element.children = [];
              console.log(this.anotherTableData, "aaaaatableData");
              this.showAnotherTable = false;
              this.$nextTick(() => {
                this.showAnotherTable = true;
              });
            } else if (element.reportId === row.reportId && expandedRows) {
              console.log(1);
              let periodList = [];
              this.tags.forEach((e) => {
                periodList.push(e.name);
              });
              $http
                .post(api.uyReportContractQuery, {
                  periodList: periodList,
                  blanceTypeList: this.form.checkList,
                  itemCodeList: [row.itemCode],
                  contractNoBegin: this.form.contractNoBegin || "",
                  contractNoEnd: this.form.contractNoEnd || "",
                  dataPeriod: this.form.dataPeriod || "",
                  cedent: this.form.cedent || "",
                })
                .then((res) => {
                  let arrfin = res.data.data.reportDetailContractList || [];
                  let arrnewfin = [];
                  var obfin1 = {};
                  arrnewfin = arrfin.reduce(function (item, next) {
                    obfin1[next.contractNo]
                      ? ""
                      : (obfin1[next.contractNo] = true && item.push(next));
                    return item;
                  }, []);
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
                  console.log(element, "element");
                  delete element.hasChildren;
                  element.children = arrnewfin;
                  this.showAnotherTable = false;
                  this.$nextTick(() => {
                    this.showAnotherTable = true;
                  });
                });
            }
          });
        }
      });
      console.log(this.anotherTableData, "this.anotherTableData");
    },
    editCurrentApplicationApproval(row) {
      console.log(row, "row");
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
    showAllData () {
      console.log(this.tableData, 'this.tabledata');
      // this.tableData.forEach(item => {
      //   if(item.children) {
      //     item.children.forEach(e => {

      //     })
      //   }
      // })
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
  watch: {
    anotherTableData: {
      handler(newValue) {
        console.log(newValue, "newVals");
      },
      immediate: true,
    },
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.init());
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
