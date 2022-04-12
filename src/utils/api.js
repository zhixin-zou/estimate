export default {
    // 登录网关接口
    getUserInfo: '/SolomonService/GetCurrentUserInfo',
    getUserPermissionList: '/SolomonService/GetUserFunctionList',
    logout: '/SolomonService/Logout',

    // 统一权限接口
    getCommonOrganizationList: '/api/v2/organization/search',
    getCommonUserList: '/api/v2/user/search',
    viewCommonUser: '/api/v2/user/view',

    // 预估查询
    partnerQuery: '/estimate/partnerQuery',
    orpContractListQuery: '/estimate/finance/orpContractListQuery',
    // 缴费方式更新
    contractPayModeAdjust: '/estimate/finance/contractPayModeAdjust',
    //年缴预估明细
    yearContractDetailQuery: '/estimate/finance/yearContractDetailQuery',
    // 分出预估明细信息获取
    orpContractDetailQuery: '/estimate/finance/orpContractDetailQuery',
    // 年缴总EPI调整
    yearTotalEPIAdjust: '/estimate/finance/yearTotalEPIAdjust',
    // 年缴EPI明细调整
    yearDetailEPIAdjust: '/estimate/finance/yearDetailEPIAdjust',
    // 查看入账明细
    ebsInfoQuery: '/estimate/finance/ebsInfoQuery',
    // 查看预估历史
    estimateHistoryQuery: '/estimate/finance/estimateHistoryQuery',
    // 年缴明细调整
    yearAdjustDetail: '/estimate/finance/yearAdjustDetail',
    // 年缴浮动因子调整
    yearSlidingScaleRateAdjust: '/estimate/finance/yearSlidingScaleRateAdjust',
    // 月缴预估明细
    monthContractDetailQuery: '/estimate/finance/monthContractDetailQuery',
    // 月缴预估EPI调整
    monthTotalEPIAdjust: '/estimate/finance/monthTotalEPIAdjust',
    // 月缴预估EPI明细调整
    monthDetailEPIAdjust: '/estimate/finance/monthDetailEPIAdjust',
    // 月缴预估Epi历史调整明细
    monthAdjustDetail: '/estimate/finance/monthAdjustDetail',
    // 月缴浮动因子调整
    monthSlidingScaleRateAdjust: '/estimate/finance/monthSlidingScaleRateAdjust',

    
    // 精算查询
    contractListQuery: '/estimate/actuarial/contractListQuery',
    // 保费拆分
    premiumSplit: '/estimate/actuarial/premiumSplit',
    // 精算年缴预估明细
    actuarialYearContractDetail: '/estimate/actuarial/yearContractDetailQuery',
    // 年缴费率调整
    yearFeeRateAdjust: '/estimate/actuarial/yearFeeRateAdjust',
    // 月缴预估明细
    actuarialMonthContractDetail: '/estimate/actuarial/monthContractDetailQuery',
    // 月缴费率调整
    monthFeeRateAdjust: '/estimate/actuarial/monthFeeRateAdjust',
    // 保存调整数据
    saveAdjust: '/estimate/actuarial/saveAdjust',
    // 精算预估历史查看
    actuarialHistoryQuery: '/estimate/actuarial/estimateHistoryQuery',
    // 当月产品列表获取
    productListQuery: '/estimate/actuarial/productListQuery',
    // 汇算信息获取
    summaryAllocatCalculat: '/estimate/actuarial/summaryAllocatCalculat',
    // 确认下发财务
    saveToFinance: '/estimate/actuarial/saveToFinance'

}