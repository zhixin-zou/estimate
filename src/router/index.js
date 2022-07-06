import Vue from "vue";
import Router from "vue-router";
import store from "@/store";

// import HomeView from '@/views/HomeView.vue'
import NotFound from "@/views/NotFound.vue";
// import Forbidden from '@/views/Forbidden.vue'
// import HelpIndex from '@/views/help/HelpIndex.vue'
import FinancialForecasts from "@/views/financial/financialForecasts.vue";
import AnnualEstimates from "@/views/financial/annualEstimates.vue";
import BookedDetial from "@/views/financial/bookedDetial.vue";
import SeBookedDetial from "@/views/financial/seBookedDetial.vue";
import ViewHistory from "@/views/financial/viewHistory.vue";
import YearAdjustDetail from "@/views/financial/yearAdjustDetail.vue";
import MonthContractDetail from "@/views/financial/monthContractDetail.vue";
import ActuarialEstimates from "@/views/actuarial/actuarialEstimates.vue";
import MonthAdjustDetail from "@/views/financial/monthAdjustDetail.vue";
import SeparateEstimates from "@/views/financial/separateEstimates.vue";
import FinancialSearch from "@/views/financialView/financialSearch.vue";
import SeparateEstimateDetial from "@/views/financial/separateEstimateDetial.vue";
import YearActuarial from "@/views/actuarial/yearActuarial.vue";
import MonthActuarial from "@/views/actuarial/monthActuarial.vue";
import FsBookedDetial from "@/views/financialView/fsBookedDetial.vue";
import FsAllBookedDetial from "@/views/financialView/fsAllBookedDetial.vue";
import SeViewHistory from "@/views/financial/seviewHistory.vue";
import JsnViewHistory from "@/views/financial/jsnViewHistory.vue";
import JsyViewHistory from "@/views/financial/jsyViewHistory.vue";
import AuditLog from "@/views/financialView/auditLog.vue";
import MonthAudit from "@/views/financialView/monthAudit";
import YearAudit from "@/views/financialView/yearAudit";
import EstimateDuring from "@/views/financialView/estimateDuring";
import AnnualEstimatesAudit from "@/views/financialView/annualEstimatesAudit";
import MonthContractDetailAudit from "@/views/financialView/monthContractDetailAudit";
import YearTrial from "@/views/actuarial/yearTrial";
import MonthTrial from "@/views/actuarial/monthTrial";
import YearTrialSearch from "@/views/actuarial/yearTrialSearch";
import MonthTrialSearch from "@/views/actuarial/monthTrialSearch";
import YearTrialAdd from "@/views/actuarial/yearTrialAdd";
import MonthTrialAdd from "@/views/actuarial/monthTrialAdd";
import TrialSearch from "@/views/actuarial/trialSearch.vue";
import TrialSearchView from "@/views/actuarial/trialSearchView.vue";
import CalculationResult from "@/views/actuarial/calculationResult.vue";
import EbsDetailSearch from "@/views/financialView/ebsDetailSearch";

// import { Message } from 'element-ui'
// const CustomAppView = () =>
//     import ('@/views/CustomAppView')

Vue.use(Router);

const routes = [
  {
    path: "/",
    component: FinancialForecasts,
    meta: {
      title: "test",
      requireAuth: false,
    },
  },
  {
    path: "/financialForecasts",
    component: FinancialForecasts,
  },
  {
    path: "/separateEstimates",
    component: SeparateEstimates,
  },
  {
    path: "/actuarialEstimates",
    component: ActuarialEstimates,
  },
  {
    path: "/financialSearch",
    component: FinancialSearch,
  },
  {
    path: "/auditLog",
    component: AuditLog,
  },
  {
    path: "/estimateDuring",
    component: EstimateDuring,
  },
  {
    path: "/trialSearchView",
    component: TrialSearchView,
  },
  {
    path: "/ebsDetailSearch",
    component: EbsDetailSearch,
  },
  {
    path: "/annualEstimates",
    component: AnnualEstimates,
  },
  {
    path: "/bookedDetial",
    component: BookedDetial,
  },
  {
    path: "/viewHistory",
    component: ViewHistory,
  },
  {
    path: "/yearAdjustDetail",
    component: YearAdjustDetail,
  },
  {
    path: "/monthContractDetail",
    component: MonthContractDetail,
  },
  {
    path: "/monthAdjustDetail",
    component: MonthAdjustDetail,
  },
  {
    path: "/separateEstimateDetial",
    component: SeparateEstimateDetial,
  },
  {
    path: "/yearActuarial",
    component: YearActuarial,
  },
  {
    path: "/monthActuarial",
    component: MonthActuarial,
  },
  {
    path: "/calculationResult",
    component: CalculationResult,
  },
  {
    path: "/fsBookedDetial",
    component: FsBookedDetial,
  },
  {
    path: "/fsAllBookedDetial",
    component: FsAllBookedDetial,
  },
  {
    path: "/seBookedDetial",
    component: SeBookedDetial,
  },
  {
    path: "/seviewHistory",
    component: SeViewHistory,
  },
  {
    path: "/jsnViewHistory",
    component: JsnViewHistory,
  },
  {
    path: "/jsyViewHistory",
    component: JsyViewHistory,
  },
  // {
  //   path: "/auditLog",
  //   component: AuditLog,
  // },
  {
    path: "/auditLog/yearAudit",
    component: YearAudit,
  },
  {
    path: "/auditLog/monthAudit",
    component: MonthAudit,
  },
  {
    path: "/auditLog/annualEstimatesAudit",
    component: AnnualEstimatesAudit,
  },
  {
    path: "/auditLog/monthContractDetailAudit",
    component: MonthContractDetailAudit,
  },
  {
    path: "/trialSearch",
    component: TrialSearch,
  },
  {
    path: "/yearTrial",
    component: YearTrial,
  },
  {
    path: "/monthTrial",
    component: MonthTrial,
  },
  {
    path: "/yearTrialSearch",
    component: YearTrialSearch,
  },
  {
    path: "/monthTrialSearch",
    component: MonthTrialSearch,
  },
  {
    path: "/yearTrialAdd",
    component: YearTrialAdd,
  },
  {
    path: "/monthTrialAdd",
    component: MonthTrialAdd,
  },
  {
    path: "/404",
    component: NotFound,
    meta: {
      layout: "error",
      requireAuth: false,
    },
  },
  // {
  //     path: '/forbidden',
  //     component: Forbidden,
  //     meta: {
  //         layout: 'error',
  //         requireAuth: false
  //     }
  // },
  {
    path: "*",
    redirect: "/404",
  },
];

// // 路由元信息默认值
// routes.forEach(route => {
//     if (!route.redirect) {
//         route.meta = route.meta || {}
//         route.meta.layout = route.meta.layout || 'default'
//         route.meta.requireAuth = route.meta.requireAuth === undefined ? true : route.meta.requireAuth
//     }
// })

// // 根据路由查找上级路由
// export const findRouteAncestors = route => {
//     const path = route.path
//     const ancestors = path.split('/').reduce(
//         (acc, curr) => {
//             if (curr !== '') {
//                 const p = '/' + curr
//                 acc.push(acc[acc.length - 1] === '/' ? p : acc[acc.length - 1] + p)
//             }
//             return acc
//         }, ['/']
//     )

//     const result = []
//     ancestors.forEach(ancestor => {
//         const match = routes.find(route => {
//             if (route.path.indexOf(':id') > -1) {
//                 const reg = new RegExp('^' + route.path.replace(':id', '\\w+') + '$')
//                 return ancestor.match(reg)
//             } else {
//                 return ancestor === route.path
//             }
//         })
//         match &&
//             result.push({
//                 path: ancestor,
//                 title: (match.meta || {}).title
//             })
//     })

//     return result
// }

const router = new Router({ mode: "hash", routes });
// 捕获 router.push 异常
// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//         return originalPush.call(this, location).catch(err => err)
//     }
router.beforeEach((to, from, next) => {
  // console.log(to, from, next, "beforein", window.location.href);
  if (
    !window.location.href.includes("localhost") &&
    !window.location.href.includes("10.10.128.14")
  ) {
    store.dispatch("login/getUserPermissionList").then(() => {
      // next();
    });
  } else {
    store.dispatch("login/getLocalUserPermissionList").then(() => {
      // next()
    });
  }
  next();

  // const path = to.matched[0].path
  // store
  //     .dispatch('login/getUserInfo')
  //     .then(() => {
  // store.dispatch('login/getUserPermissionList').then(() => {
  //     if (!to.meta.requireAuth) {
  //         next()
  //         return
  //     }

  //     // if (store.getters['login/hasRoutePermission'](path)) {
  //     //     next()
  //     // } else {
  //     //     next('/forbidden')
  //     // }
  // })
  // const account = store.state.login.userInfo.ename
  // if (!store.state.login.userRole) {
  //     store.dispatch('login/viewUser', account).then(() => {
  //         store.dispatch('common/getDict')
  //     })
  // }
  // })
  // .catch(() => {
  //     Message.error('用户权限获取失败')
  // })
});

export default router;
