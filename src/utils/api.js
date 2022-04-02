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
    // 月缴预估明细
    monthContractDetailQuery: 'http://yapi.smart-xwork.cn/mock/134845/estimate/finance/monthContractDetailQuery',
    monthAdjustDetail: '/estimate/finance/monthAdjustDetail'
}