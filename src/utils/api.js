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
    //年缴预估明细
    yearContractDetailQuery: 'http://yapi.smart-xwork.cn/mock/134845/estimate/finance/yearContractDetailQuery',
    // 年缴总EPI调整
    yearTotalEPIAdjust: 'http://yapi.smart-xwork.cn/mock/134845/estimate/finance/yearTotalEPIAdjust',
    // 年缴EPI明细调整
    yearDetailEPIAdjust: 'http://yapi.smart-xwork.cn/mock/134845/estimate/finance/yearDetailEPIAdjust',
    // 查看入账明细
    EBSInfoQuery: 'http://yapi.smart-xwork.cn/mock/134845/estimate/finance/EBSInfoQuery',
    // 查看预估历史
    estimateHistoryQuery: 'http://yapi.smart-xwork.cn/mock/134845/estimate/finance/estimateHistoryQuery',
    // 年缴明细调整
    yearAdjustDetail: 'http://yapi.smart-xwork.cn/mock/134845/estimate/finance/yearAdjustDetail',
    // 年缴浮动因子调整
    yearSlidingScaleRateAdjust: 'http://yapi.smart-xwork.cn/mock/134845/estimate/finance/yearSlidingScaleRateAdjust',
    // 月缴预估明细
    monthContractDetailQuery: 'http://yapi.smart-xwork.cn/mock/134845/estimate/finance/monthContractDetailQuery',
    // 月缴预估EPI调整
    monthTotalEPIAdjust: 'http://yapi.smart-xwork.cn/mock/134845/estimate/finance/monthTotalEPIAdjust',
    // 月缴预估EPI明细调整
    monthDetailEPIAdjust: 'http://yapi.smart-xwork.cn/mock/134845/estimate/finance/monthDetailEPIAdjust',
    // 月缴预估Epi历史调整明细
    monthAdjustDetail: '/estimate/finance/monthAdjustDetail',
    // 月缴浮动因子调整
    monthSlidingScaleRateAdjust: 'http://yapi.smart-xwork.cn/mock/134845/estimate/finance/monthSlidingScaleRateAdjust',

    
    // 精算查询
    contractListQuery: 'http://yapi.smart-xwork.cn/mock/134845/estimate/actuarial/contractListQuery',
    // 保费拆分
    premiumSplit: 'http://yapi.smart-xwork.cn/mock/134845/estimate/actuarial/premiumSplit',
    // 精算年缴预估明细
    actuarialYearContractDetail: 'http://yapi.smart-xwork.cn/mock/134845/estimate/actuarial/yearContractDetailQuery',
    // 年缴费率调整
    yearFeeRateAdjust: 'http://yapi.smart-xwork.cn/mock/134845/estimate/actuarial/yearFeeRateAdjust',
    // 月缴预估明细
    actuarialMonthContractDetail: 'http://yapi.smart-xwork.cn/mock/134845/estimate/actuarial/monthContractDetailQuery',
    // 月缴费率调整
    monthFeeRateAdjust: 'http://yapi.smart-xwork.cn/mock/134845/estimate/actuarial/monthFeeRateAdjust',
    // 保存调整数据
    saveAdjust: 'http://yapi.smart-xwork.cn/mock/134845/estimate/actuarial/saveAdjust',
    // 精算预估历史查看
    actuarialHistoryQuery: 'http://yapi.smart-xwork.cn/mock/134845/estimate/actuarial/estimateHistoryQuery',
    // 当月产品列表获取
    productListQuery: 'http://yapi.smart-xwork.cn/mock/134845/estimate/actuarial/productListQuery',
    // 汇算信息获取
    summaryAllocatCalculat: 'http://yapi.smart-xwork.cn/mock/134845/estimate/actuarial/summaryAllocatCalculat',
    // 确认下发财务
    saveToFinance: 'http://yapi.smart-xwork.cn/mock/134845/estimate/actuarial/saveToFinance'

}