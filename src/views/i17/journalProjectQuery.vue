<template>
  <div class="financialSearch">
    <div class="searchBox">
      <div class="searchMain">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="项目id">
            <el-input v-model="form.projectId"></el-input>
          </el-form-item>
          <el-form-item label="凭证id">
            <el-input v-model="form.journalId"></el-input>
          </el-form-item>
          <el-form-item label="凭证日期">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              v-model="form.effectiveDate"
              style="width: 100%"
            ></el-date-picker>
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
          <el-button size="mini" @click="handleResetClick">重置</el-button>
        </div>
      </div>
    </div>
    <div class="listBox">
      <!-- <el-popover ref="config" placement="bottom" width="200" trigger="click">
        <el-checkbox
          class="table-col"
          v-for="col in columns"
          :key="col.property"
          v-model="col.show"
          >{{ col.title }}</el-checkbox
        >
      </el-popover> -->
      <!-- <el-button
          v-popover:config
          class="exportButton"
          style="margin-right: 10px"
          >自定义列</el-button
        > -->
      <!-- <el-button
        @click="handleProjectJournalPush"
        style="float: right; margin-bottom: 10px"
        >凭证信息生成</el-button
      > -->
      <el-table
        :data="currentPageData"
        border
        style="width: 100%"
        ref="listBox"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column width="120" prop="projectId" label="项目ID"> </el-table-column>
        <el-table-column prop="projectType" label="项目类型"> </el-table-column>
        <el-table-column prop="journalId" label="凭证id"> </el-table-column>
        <el-table-column prop="journalType" label="凭证类型"> </el-table-column>
        <el-table-column prop="taskId" label="任务id"> </el-table-column>
        <el-table-column prop="taskType" label="任务类型"> </el-table-column>
        <el-table-column prop="dateEntry" label="生成凭证日期"> </el-table-column>
        <el-table-column prop="hierarchyNodeName" label="节点名称"> </el-table-column>
        <el-table-column prop="projectHumanName" label="项目名称"> </el-table-column>
        <el-table-column prop="effectiveDate" label="凭证日期"> </el-table-column>
        <el-table-column prop="openingDate" label="凭证开启日期"> </el-table-column>
        <el-table-column prop="journalStatus" label="凭证状态"> </el-table-column>
        <!-- <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="handleookedDetail(scope.row)" type="text" size="small"
              >查看明细</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>
      <div class="listPagination">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next"
          @prev-click="prevPage"
          @next-click="nextPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          :page-sizes="[10, 20, 50, 100, 1000]"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <div class="checkGroup">
      <el-button @click="handleShowDialog">确认</el-button>
    </div>
  </div>
</template>

<script>
import { $http } from "@/utils/request";
import api from "@/utils/api";
import { kiloSplit, toPercent } from "@/utils/utils";
// import * as XLSX from "xlsx";
// import FileSaver from "file-saver";
// import { mapActions } from "vuex";

export default {
  data() {
    return {
      loading: false,
      total: 0,
      pageSize: 10,
      currentPage: 1,
      totalPage: 1,
      showGroupDialog: false,
      groupValue: "",
      form: {
        projectId: "",
        journalId: "",
        effectiveDate: "",
      },
      //   columns: [
      //     {
      //       title: "合同号",
      //       property: "contractNo",
      //       show: true,
      //     },
      //     {
      //       title: "合同session",
      //       property: "sessionName",
      //       show: true,
      //     },
      //     {
      //       title: "合同类型",
      //       property: "contractType",
      //       show: true,
      //     },
      //     {
      //       title: "主险种",
      //       property: "planName",
      //       show: true,
      //     },
      //     {
      //       title: "产品名称",
      //       property: "productName",
      //       show: true,
      //     },
      //     {
      //       title: "分入公司",
      //       property: "cedentName",
      //       show: true,
      //     },
      //     {
      //       title: "开始日期",
      //       property: "effectivePeriodBegin",
      //       show: true,
      //     },
      //     {
      //       title: "结束日期",
      //       property: "effectivePeriodEnd",
      //       show: true,
      //     },
      //     {
      //       title: " 缴费方式",
      //       property: "payType",
      //       show: true,
      //     },
      //     {
      //       title: "预估保费",
      //       property: "epi",
      //       show: true,
      //     },
      //     {
      //       title: "手续费比例",
      //       property: "commissionRate",
      //       show: true,
      //     },
      //     {
      //       title: "经纪费比例",
      //       property: "brokerageRate",
      //       show: true,
      //     },
      //     {
      //       title: "分出比例",
      //       property: "cedentRate",
      //       show: true,
      //     },
      //   ],
      currentPageData: [],
      tableData: [],
      companyList: [],
      groupList: [],
      projectJournalList: [],
    };
  },
  methods: {
    // ...mapActions('actuarial/actuarialEstimates', ['handleSearch']),
    init() {
      this.handleSearchClick();
    },
    handleookedDetail() {},
    toPercentData(data) {
      return toPercent(data);
    },
    kiloSplitData(data) {
      return kiloSplit(data);
    },
    handleSearchClick() {
      this.currentPage = 1;
      this.loading = true;

      $http
        .post(api.journalProjectQuery, this.form)
        .then((res) => {
          // this.$message.success('');
          if (res.data.code === "0") {
            this.tableData = res.data.data.journalProjectList;
            this.total = res.data.data.journalProjectList.length;
            this.totalPage = Math.ceil(this.total / this.pageSize);
            this.totalPage = this.totalPage === 0 ? 1 : this.totalPage;
            this.setCurrentPageData();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleResetClick() {
      this.form = {
        projectId: "",
        journalId: "",
        effectiveDate: "",
      };
    },
    // 假分页
    setCurrentPageData() {
      let begin = (this.currentPage - 1) * this.pageSize;
      let end = this.currentPage * this.pageSize;
      this.currentPageData = this.tableData.slice(begin, end);
    },
    prevPage() {
      console.log(this.currentPage);
      if (this.currentPage == 1) return;

      this.currentPage--;
      this.setCurrentPageData();
    },
    nextPage() {
      if (this.currentPage === this.totalPage) return;
      this.currentPage++;
      console.log(this.currentPage, "this.currentPage");
      this.setCurrentPageData();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.setCurrentPageData();
    },
    handleCurrentChange(page) {
      this.currentPage = page;
      this.setCurrentPageData();
    },
    handleSelectionChange(val) {
      console.log(val, "val");
      this.projectJournalList = val;
    },
    handleShowDialog() {
      this.groupValue = "";
      this.showGroupDialog = true;
    },
    handleProjectJournalPush() {
      let dataList = [];
      if (this.projectJournalList.length !== 0) {
        this.projectJournalList.forEach((item) => {
          dataList.push(item.id);
        });
        $http.post(api.projectJournalPush, { projectId: dataList }).then((res) => {
          if (res.data.code === "0") {
            this.$message.error("生成成功");
            this.handleSearchClick();
          } else {
            this.$message.error(res.data.msg);
          }
        });
      }
    },
    // handleCancel() {
    //   this.showGroupDialog = false;
    // },
    // 导出方法
    // exportBtn(refProp, fname) {
    //   // 获取表格元素
    //   const el = this.$refs[refProp].$el;
    //   // 文件名
    //   console.log(this.$refs[refProp], "elelele");
    //   const filename = fname + ".xlsx";
    //   /* generate workbook object from table */
    //   const wb = XLSX.utils.table_to_book(el);
    //   /* get binary string as output */
    //   const wbout = XLSX.write(wb, {
    //     bookType: "xlsx",
    //     bookSST: true,
    //     type: "array",
    //   });
    //   try {
    //     FileSaver.saveAs(
    //       new Blob([wbout], { type: "application/octet-stream" }),
    //       filename
    //     );
    //   } catch (e) {
    //     console.log(e);
    //   }
    //   return wbout;
    // },
    // handleExport(data, filename) {
    //   this.exportBtn(data, filename);
    //   // console.log(this.$refs.exportTableRef1.$el);
    // },
  },
  // mounted () {
  //   this.test()
  // },
  beforeRouteEnter(to, from, next) {
    next((vm) => vm.init());
  },
};
</script>

<style lang="scss">
.financialSearch {
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
  .listBox {
    border-top: 3px solid #ccc;
    position: relative;

    padding: 20px 20px 50px 20px;
    .exportButton,
    .selfButton {
      float: right;
      margin-bottom: 10px;
    }
    .listPagination {
      // position: absolute;
      margin-top: 10px;
      float: right;
    }
  }
  .checkGroup {
    text-align: center;
    padding-bottom: 20px;
  }
  .groupDialog {
    .dialogBody {
    }
    .dialogFoot {
      margin-top: 10px;
    }
  }
  .calculateResult {
    margin-left: 45%;
    // margin-bottom: 20px;
    height: 50px;
  }
}
</style>
