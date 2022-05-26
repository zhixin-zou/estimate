const PAGE_SIZE = 10
// 侧边栏宽度配置需要与组件样式中保持一致
const ASIDE_WIDTH = '200px'
const ASIDE_WIDTH_COLLAPSED = '64px'

// 开发环境统一登录网关/统一权限服务模拟
const DEV_LOGIN_USER_ACCOUNT = 'v_zxzou'
// const DEV_SYSTEM_ACCESS_ID = 'c097888509bb4786adfc2c4cf404e627'
// const DEV_SYSTEM_ACCESS_SECRET = '23a880aa20104956a5e9932b8c2757c9'

const SYSTEM_ID = 'ops' // 当前系统在权限系统中的系统标识

// 采用CommonJS写法兼容node环境
module.exports = {
  PAGE_SIZE,
  ASIDE_WIDTH,
  ASIDE_WIDTH_COLLAPSED,
  DEV_LOGIN_USER_ACCOUNT,
//   DEV_SYSTEM_ACCESS_ID,
//   DEV_SYSTEM_ACCESS_SECRET,
  SYSTEM_ID
}
