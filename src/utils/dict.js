export const jobStatus = [
    { value: 1, text: '待入职' },
    { value: 2, text: '在职' },
    { value: 3, text: '待离职' },
    { value: 4, text: '已离职' }
]

export const sync = [
    { value: 1, text: '同步' },
    { value: 2, text: '不同步' }
]

export const syncStatus = [
    { value: 0, text: '未同步' },
    { value: 1, text: '已同步' }
]

export const userStatus = [
    { value: 1, text: '有效' },
    { value: 2, text: '无效' }
]

export const userType = [
    { value: 1, text: '正式' },
    { value: 2, text: '外包' },
    { value: 3, text: '顾问' }
]

export const gender = [
    { value: 1, text: '男' },
    { value: 2, text: '女' }
]

export const permissionStatus = [
    { value: 0, text: '禁止' },
    { value: 1, text: '正常' }
]

export const permissionType = [
    { value: 0, text: '系统' },
    { value: 1, text: '目录' },
    { value: 2, text: '菜单' },
    { value: 3, text: '按钮' }
]

export const cmqStatus = [
    { value: 1, text: '未消费' },
    { value: 2, text: '未消费成功' },
    { value: 3, text: '已成功消费' }
]

export const category = [
    { value: 'A', text: '代收' },
    { value: 'B', text: '预收' },
    { value: 'C', text: '收入' },
    { value: 'D', text: '抵扣' },
    { value: 'E', text: '支出' }
]

export const configStatus = [
    { value: 1, text: '有效' },
    { value: 2, text: '无效' },
    { value: 3, text: '待审批' }
]

export const accountErrorStatus = [
    { value: 'red', text: '数据缺失' },
    { value: 'yellow', text: '金额不一致' }
]

export const iacStatus = [
    { text: '未提交', value: 0 },
    { text: '已提交', value: 1 },
    { text: '撤销', value: 2 }
]

export const goodsCalc = [
    { text: '按比例', value: 1 },
    { text: '按金额', value: 2 }
]

export const refundStatus = [
    { text: '发放', value: 1 },
    { text: '退保', value: 2 },
    { text: '到期', value: 3 },
    { text: '出单失败', value: 4 }
]

export const ticketSource = [
    { text: '系统生成', value: 1 },
    { text: '导入', value: 2 }
]

export const balanceStatus = [
    { text: '待平账', value: 1 },
    { text: '平账失败', value: 2 },
    { text: '已平账', value: 3 }
]
export const checkResultType = [
    { text: '匹配成功', value: 'match' },
    { text: '金额错误', value: 'amount_error' },
    { text: '我方缺失数据', value: 'own_side_miss' },
    { text: '他方缺失数据', value: 'other_side_miss' }
]
export const batchStatus = [
    { text: '未上传', value: 1 },
    { text: '正在上传', value: 2 },
    { text: '已上传', value: 3 }
]

export const giftSource = [
    { text: '微保', value: 1 },
    { text: '保险公司', value: 2 }
]

export const useMode = [
    { text: '在线使用', value: 1 },
    { text: 'CDK兑换码', value: 2 }
]

export const settlementType = [
    { text: 'CDK结算', value: 1 },
    { text: '卡券结算', value: 2 },
    { text: '卡券不结算', value: 3 },
    { text: 'CDK不结算', value: 4 }
]

export const accountStatus = [
    { text: '未结算', value: 1 },
    { text: '已结算', value: 2 }
]

export const disableStatus = [
    { text: '未作废', value: 1 },
    { text: '已作废', value: 2 }
]

export const flatStatus = [
    { text: '待平账', value: 0 },
    { text: '平账中', value: 1 },
    { text: '平账失败', value: 2 },
    { text: '已平账', value: 3 }
]

export const abnormalStatus = [
    { text: '待退费', value: 0 },
    { text: '已退费', value: 1 },
    { text: '无需退费', value: 2 }
]

export const payType = [
    { text: '重复支付', value: 1 },
    { text: '出单失败退费', value: 2 }
]

export const settSubjectType = [
    { text: '保费', value: 'A-01' },
    { text: '手续费', value: 'C-01' },
    { text: '抵扣', value: 'D-99' },
    { text: '补充抵扣', value: 'D-98' },
    { text: '补充手续费', value: 'C-99' }
]

export const newSettType = [
    { text: '保费结算', value: 'PR' },
    { text: '手续费结算', value: 'CO' }
]

export const applyStatus = [
    { text: '结算单正在生成', value: 1 },
    { text: '生成结算单失败', value: 2 },
    { text: '生成结算单成功', value: 3 },
    { text: '结算单正在提交', value: 4 },
    { text: '提交结算申请失败', value: 5 },
    { text: '提交结算申请成功', value: 6 },
    { text: '提交结算审核中', value: 7 }
]

export const invoicenature = [
    { text: '正常发票', value: 0 },
    { text: '作废发票', value: 1 },
    { text: '负数（红字发票）', value: 2 }
]

export const receivedStatus = [
    { text: '未回款', value: 1 },
    { text: '已回款', value: 2 }
]

export const isWriteoff = [
    { text: '未核销', value: 0 },
    { text: '已核销', value: 1 }
]

export const matchStatus = [
    { text: '匹配错误', value: 0 },
    { text: '匹配成功', value: 1 }
]

export const isBalanced = [
    { text: '正常', value: 'Y' },
    { text: '错误', value: 'N' },
    { text: '警告', value: 'W' }
]

export const dataType = [
    { text: '保司', value: 1 },
    { text: '微保', value: 2 }
]

export const ebsImportStatus = [
    { text: '未导入', value: 0 },
    { text: '已导入', value: 1 }
]
export const ebsImportStatusNew = [
    { text: '未导入', value: 0 },
    { text: '已导入', value: 1 },
    { text: '已导入', value: 2 },
    { text: '已导入', value: 3 },
    { text: '已导入', value: 4 },
    { text: '已导入', value: 5 }
]

export const reconciliationType = [
    { text: '保费', value: 1 },
    { text: '手续费', value: 2 },
    { text: '抵扣手续费', value: 3 },
    { text: '抵扣保费', value: 4 },
    { text: '赠险出单', value: 5 },
    { text: '赠险批改', value: 6 },
    { text: '技术服务费', value: 7 },
    { text: '技术抵扣', value: 8 }
]
export const taskcodeToReconciliationType = [
    { text: 1, value: 'CORPORATION_PREMIUM' },
    { text: 2, value: 'CORPORATION_COMMISSION' },
    { text: 3, value: 'CORPORATION_SURRENDER' },
    { text: 4, value: 'CORPORATION_SURRENDER_PREMIUM' },
    { text: 5, value: 'CORPORATION_FREE_POLICY' },
    { text: 6, value: 'CORPORATION_FREE_ENDORSE' },
    { text: 7, value: 'CORPORATION_TECH_COST' },
    { text: 8, value: 'CORPORATION_TECH_DEDUCT' }
]
export const refundTypesOption = [
    { text: '重复支付', value: '1' },
    { text: '出单失败', value: '2' },
    { text: '溢缴退费', value: '3' },
    { text: '预收退费', value: '4' },
    { text: '退保退费', value: '5' },
    { text: '其他退费', value: '99' }
]
export const isGroup = [
    { text: '非团险', value: 0 },
    { text: '团险', value: 1 }
]
export const platformAccountPacket = [
    { text: '1443854702', value: '1443854702' },
    { text: '1488163892', value: '1488163892' }
]
export const busTypeAccountPacket = [
    { text: 'MMPAY', value: 'MMPAY' },
    { text: 'COUPON', value: 'COUPON' }
]
export const isWefit = [
    // { text: '非wefit', value: 0 },
    // { text: 'wefit', value: 1 }
    { text: '否', value: 0 },
    { text: '是', value: 1 }
]
export const queryCaches = [
    { text: '是', value: 1 },
    { text: '否', value: 2 }
]
export const isWriteOffs = [
    { text: '未冲销', value: 0 },
    { text: '已冲销', value: 1 },
    { text: '待冲销', value: 2 }
]
export const isTaxs = [
    { text: '是', value: 1 },
    { text: '否', value: 0 }
]
export const isCorportions = [
    { text: '其他', value: 0 },
    { text: '促成交', value: 1 },
    { text: '共建', value: 2 },
    { text: '微保顾问', value: 3 }
]
export const isDeductPremiums = [
    { text: '是', value: 1 },
    { text: '否', value: 0 }
]
export const annualOptions = [
    { text: '年化', value: 1 },
    { text: '未年化', value: 0 }
]
export const handleClassOptions = [{
        value: 'cn.wesure.ops.hans.biz.impl.channelcalc.byration.ChannelExpenseCalcServiceImpl',
        text: '固定金额'
    },
    {
        value: 'cn.wesure.ops.hans.biz.impl.channelcalc.byrate.ChannelExpenseCalcServiceImpl',
        text: '比例'
    },
    {
        value: 'cn.wesure.ops.hans.biz.impl.channelcalc.bycost.ChannelExpenseCalcServiceImpl',
        text: '返点'
    },
    {
        value: 'cn.wesure.ops.hans.biz.impl.channelcalc.byavg.byrate.ChannelExpenseCalcServiceImpl',
        text: '月日均阶梯-比例'
    },
    {
        value: 'cn.wesure.ops.hans.biz.impl.channelcalc.byavg.byration.ChannelExpenseCalcServiceImpl',
        text: '月日均阶梯-固定金额'
    },
    {
        value: 'cn.wesure.ops.hans.biz.impl.channelcalc.bycount.byrate.ChannelExpenseCalcServiceImpl',
        text: '月成交阶梯-比例'
    },
    {
        value: 'cn.wesure.ops.hans.biz.impl.channelcalc.bycount.byration.ChannelExpenseCalcServiceImpl',
        text: '月成交阶梯-固定金额'
    },
    {
        value: 'cn.wesure.ops.hans.biz.impl.channelcalc.bytotal.byrate.ChannelExpenseCalcServiceImpl',
        text: '月成交总数阶梯-比例'
    },
    {
        value: 'cn.wesure.ops.hans.biz.impl.channelcalc.bytotal.byration.ChannelExpenseCalcServiceImpl',
        text: '月成交总数阶梯-固定金额'
    }
]
export const isCorportion = [{
        value: 0,
        text: '否'
    },
    {
        value: 1,
        text: '是'
    }
]
export const channelDataSources = [{
            value: 1,
            text: 'c端传费用'
        },
        {
            value: 2,
            text: '外部渠道费用'
        },
        {
            value: 3,
            text: '手续费出单wtag'
        }
    ]
    // 对账状态
export const isBalanceOptions = [{
        value: 0,
        text: '未对账'
    },
    {
        value: 1,
        text: '对账错误'
    },
    {
        value: 2,
        text: '对账正确'
    }
]
export const amountSames = [{
            value: false,
            text: '对账失败'
        },
        {
            value: true,
            text: '对账正确'
        }
    ]
    // 状态
export const typeOptions = [{
        value: 1,
        text: '佣金'
    },
    {
        value: 2,
        text: '技术服务费'
    }
]
export const isCorportionNew = [{
        value: '否',
        text: '否'
    },
    {
        value: '是',
        text: '是'
    }
]

// 对账状态
export const commissionTypeOptions = [{
        value: 1,
        text: '默认手续费'
    },
    {
        value: 2,
        text: '补充手续费'
    },
    {
        value: 3,
        text: '技术服务费'
    }
]

// 验收状态
export const acceptanceStatusOptions = [{
            value: 10,
            text: '待验收'
        },
        {
            value: 20,
            text: '已创建验收单'
        },
        {
            value: 21,
            text: '已删除'
        },
        {
            value: 30,
            text: '已执行暂估'
        },
        {
            value: 40,
            text: '已执行验收单'
        }
    ]
    // 验收状态new
export const acceptanceStatusOptionsForSearch = [{
            value: 10,
            text: '待验收'
        },
        {
            value: 20,
            text: '已创建验收单'
        },
        {
            value: 40,
            text: '已执行验收单'
        }
    ]
    // 验收状态new
export const acceptanceStatusOptionsForSearchNew = [{
            value: 20,
            text: '已创建验收单'
        },
        {
            value: 40,
            text: '已执行验收单'
        }
    ]
    // 暂估状态
export const estimateStatusOptions = [
    // {
    //   value: 5,
    //   text: '待暂估'
    // },
    {
        value: 15,
        text: '已创建暂估单'
    },
    // {
    //   value: 25,
    //   text: '已删除'
    // },
    {
        value: 30,
        text: '已执行暂估'
    }
]

export const annualModes = [{
        value: 1,
        text: '按照当期出单时间范围确认是否年化'
    },
    {
        value: 2,
        text: '按照当年首期出单时间范围确认是否年化'
    }
]

// frp tofss

export const nodeTypeNames = [
    // { value: 'start', text: '开始节点' },
    { value: 'rule', text: '规则节点' },
    { value: 'action', text: '动作节点' }
]

export const actionTypes = [
    { value: 'http', text: '接口' },
    { value: 'expression', text: '表达式' }
]

export const resultNotifyMethods = [
    { value: 'CMQ', text: '消息队列' },
    { value: 'HTTP', text: 'http接口' }
]

export const asyncFlags = [
    { value: '0', text: '同步调用' },
    { value: '1', text: '异步调用' }
]

export const isLastestVersion = [
    { value: 0, text: '非最新版本' },
    { value: 1, text: '最新版本' }
]

export const publishFlags = [
    { value: 0, text: '未发布' },
    { value: 1, text: '已发布' },
    { value: 2, text: '草稿' }
]

export const dataTypes = [
    { value: 'table', text: '决策表' },
    { value: 'tree', text: '规则树' }
]

export const feeTypes = [
    { value: '10', text: '手续费' },
    { value: '20', text: '补充手续费' },
    { value: '30', text: '技术服务费' },
    { value: '40', text: 'CAC服务费' },
    { value: '61', text: '抵扣默认手续费' },
    { value: '62', text: '抵扣补充手续费' },
    { value: '63', text: '抵扣技术服务费' },
    { value: '70', text: '保全结案' },
    { value: '71', text: '保全默认手续费' },
    { value: '72', text: '保全补充手续费' },
    { value: '73', text: '保全技术服务费' },
    { value: '74', text: '保全CAC' },
    { value: '80', text: '保全收退费' },
    { value: '90', text: '佣金预测' }
]

export const companyLevel = [
    { value: 1, text: '一级' },
    { value: 2, text: '二级' },
    { value: 3, text: '三级' },
    { value: 4, text: '四级' }
]

export const paymentMode = [
    { value: 1, text: '微保代收' },
    { value: 2, text: '直通商户号' }
]

const set = {
    jobStatus,
    sync,
    syncStatus,
    userStatus,
    userType,
    gender,
    permissionStatus,
    permissionType,
    cmqStatus,
    category,
    configStatus,
    accountErrorStatus,
    iacStatus,
    goodsCalc,
    refundStatus,
    ticketSource,
    balanceStatus,
    checkResultType,
    batchStatus,
    giftSource,
    useMode,
    settlementType,
    accountStatus,
    disableStatus,
    flatStatus,
    abnormalStatus,
    payType,
    settSubjectType,
    newSettType,
    applyStatus,
    invoicenature,
    receivedStatus,
    isWriteoff,
    matchStatus,
    isBalanced,
    dataType,
    ebsImportStatus,
    ebsImportStatusNew,
    reconciliationType,
    taskcodeToReconciliationType,
    isGroup,
    platformAccountPacket,
    busTypeAccountPacket,
    isWefit,
    queryCaches,
    isWriteOffs,
    isTaxs,
    isCorportions,
    isDeductPremiums,
    annualOptions,
    handleClassOptions,
    isCorportion,
    channelDataSources,
    refundTypesOption,
    isBalanceOptions,
    typeOptions,
    amountSames,
    isCorportionNew,
    commissionTypeOptions,
    acceptanceStatusOptions,
    acceptanceStatusOptionsForSearch,
    estimateStatusOptions,
    acceptanceStatusOptionsForSearchNew,
    annualModes,
    nodeTypeNames,
    actionTypes,
    resultNotifyMethods,
    asyncFlags,
    isLastestVersion,
    publishFlags,
    dataTypes,
    feeTypes,
    companyLevel,
    paymentMode
}

export const getText = (dictName, value) => {
    const dict = set[dictName]
    if (!dict) {
        return value
    }

    const item = dict.find(x => x.value === value)
    if (item) {
        return item.text
    } else {
        return value
    }
}

export default {
    ...set,
    getText
}