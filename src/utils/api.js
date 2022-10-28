export default {
  // 登录网关接口
  getUserInfo: "/SolomonService/GetCurrentUserInfo",
  getUserPermissionList: "/SolomonService/GetUserFunctionList",
  logout: "/SolomonService/Logout",

  // 统一权限接口
  getCommonOrganizationList: "/api/v2/organization/search",
  getCommonUserList: "/api/v2/user/search",
  viewCommonUser: "/api/v2/user/view",

  // 预估查询
  partnerQuery: "/estimate/partnerQuery",
  orpContractListQuery: "/estimate/finance/orpContractListQuery",
  // 缴费方式更新
  contractPayModeAdjust: "/estimate/finance/contractPayModeAdjust",
  //年缴预估明细
  yearContractDetailQuery: "/estimate/finance/yearContractDetailQuery",
  // 分出预估明细信息获取
  orpContractDetailQuery: "/estimate/finance/orpContractDetailQuery",
  // f分出校验信息获取
  orpIabContractFeeQuery: "/estimate/finance/orpIabContractFeeQuery",
  // 年缴总EPI调整
  yearTotalEPIAdjust: "/estimate/finance/yearTotalEPIAdjust",
  // 年缴EPI明细调整
  yearDetailEPIAdjust: "/estimate/finance/yearDetailEPIAdjust",
  // 查看入账明细
  ebsInfoQuery: "/estimate/finance/ebsInfoQuery",
  // 查看预估历史
  estimateHistoryQuery: "/estimate/finance/estimateHistoryQuery",
  // 年缴明细调整
  yearAdjustDetail: "/estimate/finance/yearAdjustDetail",
  // 年缴浮动因子调整
  yearRateAdjust: "/estimate/finance/yearRateAdjust",
  // 月缴预估明细
  monthContractDetailQuery: "/estimate/finance/monthContractDetailQuery",
  // 月缴预估EPI调整
  monthTotalEPIAdjust: "/estimate/finance/monthTotalEPIAdjust",
  // 月缴预估EPI明细调整
  monthDetailEPIAdjust: "/estimate/finance/monthDetailEPIAdjust",
  // 月缴预估Epi历史调整明细
  monthAdjustDetail: "/estimate/finance/monthAdjustDetail",
  // 月缴浮动因子调整
  monthRateAdjust: "/estimate/finance/monthRateAdjust",
  // 上传预估数据文件
  saveEpi: "/estimate/finance/saveEpi",
  // 新增分入预估
  addContractEstimate: '/estimate/finance/addContractEstimate',


  // 精算查询
  contractListQuery: "/estimate/actuarial/contractListQuery",
  // 保费拆分
  premiumSplit: "/estimate/actuarial/premiumSplit",
  // 精算年缴预估明细
  actuarialYearContractDetail: "/estimate/actuarial/yearContractDetailQuery",
  // 年缴费率调整
  yearFeeRateAdjust: "/estimate/actuarial/yearFeeRateAdjust",
  // 月缴预估明细
  actuarialMonthContractDetail: "/estimate/actuarial/monthContractDetailQuery",
  // 月缴费率调整
  monthFeeRateAdjust: "/estimate/actuarial/monthFeeRateAdjust",
  // 保存调整数据
  saveAdjust: "/estimate/actuarial/saveAdjust",

  // 精算试算查询
  trialListQuery: "/estimate/actuarial/trialListQuery",
  // 年缴新增试算
  yearContractDetailTrialAdd: "/estimate/actuarial/yearContractDetailTrialAdd",
  // 月缴新增试算
  monthContractDetailTrialAdd:
    "/estimate/actuarial/monthContractDetailTrialAdd",
  // 月缴预估修改试算
  monthContractDetailTrial: "/estimate/actuarial/monthContractDetailTrial",
  // 年缴预估修改试算
  yearContractDetailTrial: "/estimate/actuarial/yearContractDetailTrial",
  // 年缴试算查询
  yearContractDetailTrialQuery:
    "/estimate/actuarial/yearContractDetailTrialQuery",
  // 月缴试算查询
  monthContractDetailTrialQuery:
    "/estimate/actuarial/monthContractDetailTrialQuery",
  // 根据赔付率获取手续费比例
  commRateQuery: "/estimate/actuarial/commRateQuery",

  // 精算预估历史查看
  actuarialHistoryQuery: "/estimate/actuarial/estimateHistoryQuery",
  // 当月产品列表获取
  productListQuery: "/estimate/actuarial/productListQuery",
  // 汇算信息获取
  summaryAllocatCalculat: "/estimate/actuarial/summaryAllocatCalculat",
  // 试算汇算
  summaryTrialAllocatCalculat:
    "/estimate/actuarial/summaryTrialAllocatCalculat",
  // 确认下发财务
  saveToFinance: "/estimate/actuarial/saveToFinance",
  // 账务修改
  ebsInfoModify: "/estimate/finance/ebsInfoModify",
  // 预估账务查询
  contractAccountListQuery: "/estimate/finance/contractAccountListQuery",
  // 下发财务
  ebsInfoPush: "/estimate/finance/ebsInfoPush",
  // 当月汇算class获取
  classListQuery: "/estimate/actuarial/classListQuery",
  // 审计查询
  auditListQuery: "/estimate/auditListQuery",
  // 审计明细查询
  auditDetailQuery: "/estimate/auditDetailQuery",
  // 操作方法查询
  operationTypeQuery: "/estimate/operationTypeQuery",
  // 获取期间信息
  periodInfoQuery: "/estimate/finance/periodInfoQuery",
  // 期间切换
  periodSwitch: "/estimate/finance/periodSwitch",

  // uy report查询
  uyReportQuery: "/estimate/finance/uyReportQuery",
  // uy report修改
  uyReportModify: '/estimate/finance/uyReportModify',
  // uy report合同明细查询
  uyReportContractQuery: '/estimate/finance/uyReportContractQuery',
  // Ibnr导入
  saveUyReportDetail: '/estimate/finance/saveUyReportDetail',
  // 月缴预估明细拆分视图查询
  monthSpiltViewDetailQuery: '/estimate/finance/monthSpiltViewDetailQuery',
  // i17
  ifrcontractListQuery: '/ifrs17/contractListQuery',
  // 合同分组信息查询
  groupQuery: '/ifrs17/groupQuery',
  // 合同分组创建
  groupAdd: '/ifrs17/groupAdd',
  // 合同管理合同分组
  contractGroupRelate: '/ifrs17/contractGroupRelate',
  // 精算年缴预估保费修改
  yearContractPremiumModify: '/estimate/actuarial/yearContractPremiumModify',
  // 精算年缴预估保费修改
  monthContractPremiumModify: '/estimate/actuarial/monthContractPremiumModify',
  // 项目凭证列表获取
  journalProjectQuery: '/ifrs17/journalProjectQuery',
  // i17项目列表获取
  projectListQuery: '/ifrs17/projectListQuery'
};
