<template>
  <div class="financialSearch">
    <div class="searchBox">
      <div class="searchMain">
        <el-form ref="form" :model="form" label-width="100px">
          <el-form-item label="合同类型">
            <el-select
              v-model="form.contractType"
              placeholder="请选择"
              clearable
            >
              <el-option label="比例合约" value="PROPTREATY "></el-option>
              <el-option label="非比例合约" value="NONPROPTREATY"></el-option>
              <el-option label="比例临分" value="PROPFAC"></el-option>
              <el-option label="非比例临分" value="NONPROPFAC"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同号开始">
            <el-input v-model="form.contractNoBegin"></el-input>
          </el-form-item>
          <el-form-item label="合同号结束">
            <el-input v-model="form.contractNoEnd"></el-input>
          </el-form-item>
          <el-form-item label="分出公司">
            <el-select v-model="form.cedent" placeholder="请选择" clearable>
              <el-option
                v-for="(item, index) in companyList"
                :key="index"
                :label="item.partnerName"
                :value="item.partnerCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="合同时间开始">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.contractTimeBegin"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="合同时间开始">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="form.contractTimeEnd"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="合同类别">
            <el-select v-model="form.contractClass" placeholder="请选择">
              <el-option label="分入" value="AB"></el-option>
              <el-option label="分出" value="opr"></el-option>
            </el-select>
          </el-form-item> -->
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
      <el-popover ref="config" placement="bottom" width="200" trigger="click">
        <el-checkbox
          class="table-col"
          v-for="col in columns"
          :key="col.property"
          v-model="col.show"
          >{{ col.title }}</el-checkbox
        >
      </el-popover>
      <!-- <el-button
        v-popover:config
        class="exportButton"
        style="margin-right: 10px"
        >自定义列</el-button
      > -->

      <el-table
        :data="currentPageData"
        border
        style="width: 100%"
        ref="listBox"
      >
        <el-table-column
          prop="contractNo"
          label="合同号"
          v-if="columns[0].show"
        >
        </el-table-column>
        <el-table-column
          prop="planName"
          label="合同标题"
          v-if="columns[1].show"
        >
        </el-table-column>
        <el-table-column
          prop="contractType"
          label="合同类型"
          v-if="columns[2].show"
        >
        </el-table-column>
        <el-table-column prop="planName" label="主险种" v-if="columns[3].show">
        </el-table-column>
        <!-- <el-table-column
          prop="productName"
          label="产品名称"
          v-if="columns[4].show"
        >
        </el-table-column> -->
        <el-table-column
          prop="cedentName"
          label="分出公司"
          v-if="columns[5].show"
        >
        </el-table-column>
        <el-table-column
          prop="effectivePeriodBegin"
          label="开始日期"
          v-if="columns[6].show"
        >
        </el-table-column>
        <el-table-column
          prop="effectivePeriodEnd"
          label="结束日期"
          v-if="columns[7].show"
        >
        </el-table-column>
        <el-table-column prop="payType" label="缴费方式" v-if="columns[8].show">
        </el-table-column>
        <el-table-column
          prop="epi"
          label="预估保费"
          width="200"
          v-if="columns[9].show"
        >
          <template slot-scope="scope">
            <span>{{ kiloSplitData(scope.row.epi) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="commissionRate"
          label="手续费比例"
          v-if="columns[10].show"
        >
          <template slot-scope="scope">
            <span>{{ toPercentData(scope.row.commissionRate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="brokerageRate"
          label="经纪费比例"
          v-if="columns[11].show"
        >
          <template slot-scope="scope">
            <span>{{ toPercentData(scope.row.brokerageRate) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cedentRate"
          label="分出比例"
          v-if="columns[12].show"
        >
          <template slot-scope="scope">
            <span>{{ toPercentData(scope.row.cedentRate) }}</span>
          </template></el-table-column
        >
        <!-- <el-table-column prop="estimateStatus" label="预估状态">
        </el-table-column> -->
        <!-- <el-table-column
          prop="grop"
          label="合同分组？？？？"
          v-if="columns[12].show"
        >
        </el-table-column> -->
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              @click="handleookedDetail(scope.row)"
              type="text"
              size="small"
              >查看明细</el-button
            >
          </template>
        </el-table-column>
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
      form: {
        contractType: "",
        contractNoBegin: "",
        contractNoEnd: "",
        cedent: "",
        contractTimeBegin: "",
        contractTimeEnd: "",
        estimateMonth: "",
        contractClass: "",
        ifNotZero: "Y",
      },
      columns: [
        {
          title: "合同号",
          property: "contractNo",
          show: true,
        },
        {
          title: "合同session",
          property: "sessionName",
          show: true,
        },
        {
          title: "合同类型",
          property: "contractType",
          show: true,
        },
        {
          title: "主险种",
          property: "planName",
          show: true,
        },
        {
          title: "产品名称",
          property: "productName",
          show: true,
        },
        {
          title: "分入公司",
          property: "cedentName",
          show: true,
        },
        {
          title: "开始日期",
          property: "effectivePeriodBegin",
          show: true,
        },
        {
          title: "结束日期",
          property: "effectivePeriodEnd",
          show: true,
        },
        {
          title: " 缴费方式",
          property: "payType",
          show: true,
        },
        {
          title: "预估保费",
          property: "epi",
          show: true,
        },
        {
          title: "手续费比例",
          property: "commissionRate",
          show: true,
        },
        {
          title: "经纪费比例",
          property: "brokerageRate",
          show: true,
        },
        {
          title: "分出比例",
          property: "cedentRate",
          show: true,
        },
      ],
      currentPageData: [],
      tableData: [],
      companyList: [],
    };
  },
  methods: {
    // ...mapActions('actuarial/actuarialEstimates', ['handleSearch']),
    init() {
      // $http.get("/estimate/partnerQuery").then((res) => {
      //   console.log(res, "queryCompany");
      //   this.companyList = res.data.data.partnerList;
      // });
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
          .post(api.ifrcontractListQuery, this.form)
          .then((res) => {
            // this.$message.success('');
            if (res.data.code === "0") {
              this.tableData = res.data.data.contractList;
              this.total = res.data.data.contractList.length;
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
        contractType: "",
        contractNoBegin: "",
        contractNoEnd: "",
        cedent: "",
        contractTimeBegin: "",
        contractTimeEnd: "",
        ifNotZero: "Y",
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
  .calculateResult {
    margin-left: 45%;
    // margin-bottom: 20px;
    height: 50px;
  }
}
</style>
