import Vue from 'vue'
import Router from 'vue-router'
// import HomeView from '@/views/HomeView.vue'
import NotFound from '@/views/NotFound.vue'
// import Forbidden from '@/views/Forbidden.vue'
// import HelpIndex from '@/views/help/HelpIndex.vue'
import FinancialForecasts from '@/views/financial/financialForecasts.vue'
import AnnualEstimates from '@/views/financial/annualEstimates.vue'
import BookedDetial from '@/views/financial/bookedDetial.vue'
import ViewHistory from '@/views/financial/viewHistory.vue'
import YearAdjustDetail from '@/views/financial/yearAdjustDetail.vue'
import MonthContractDetail from '@/views/financial/monthContractDetail.vue'
import ActuarialEstimates from '@/views/actuarial/actuarialEstimates.vue'
import MonthAdjustDetail from '@/views/financial/monthAdjustDetail.vue'
import SeparateEstimates from '@/views/financial/separateEstimates.vue'
import FinancialSearch from '@/views/financialView/financialSearch.vue'
import SeparateEstimateDetial from '@/views/financial/separateEstimateDetial.vue'
import YearActuarial from '@/views/actuarial/yearActuarial.vue'
import CalculationResult from '@/views/actuarial/calculationResult.vue'

// import store from '@/store'
// import { Message } from 'element-ui'
// const CustomAppView = () =>
//     import ('@/views/CustomAppView')

Vue.use(Router)

const routes = [
    {
        path: '/',
        component: FinancialSearch,
        meta: {
            title: 'test',
            requireAuth: false
        }
    },
    {
        path: '/financialForecasts',
        component: FinancialForecasts
    },
    {
        path: '/separateEstimates',
        component: SeparateEstimates
    },
    {
        path: '/annualEstimates',
        component: AnnualEstimates
    },
    {
        path: '/bookedDetial',
        component: BookedDetial
    },
    {
        path: '/viewHistory',
        component: ViewHistory
    },
    {
        path: '/yearAdjustDetail',
        component: YearAdjustDetail
    },
    {
        path: '/monthContractDetail',
        component: MonthContractDetail
    },
    {
        path: '/actuarialEstimates',
        component: ActuarialEstimates
    },
    {
        path: '/monthAdjustDetail',
        component: MonthAdjustDetail
    },
    {
        path: '/financialSearch',
        component: FinancialSearch
    },
    {
        path: '/separateEstimateDetial',
        component: SeparateEstimateDetial
    },
    {
        path: '/yearActuarial',
        component: YearActuarial
    },
    {
        path: '/calculationResult',
        component: CalculationResult
    },
    {
        path: '/404',
        component: NotFound,
        meta: {
            layout: 'error',
            requireAuth: false
        }
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
        path: '*',
        redirect: '/404'
    }
]

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

const router = new Router({ mode: 'hash', routes })
    // 捕获 router.push 异常
    // const originalPush = Router.prototype.push
    // Router.prototype.push = function push(location) {
    //         return originalPush.call(this, location).catch(err => err)
    //     }
    // router.beforeEach((to, from, next) => {
    //     // const path = to.matched[0].path
    //     // store.dispatch('common/getDict')
    //     // store
    //     //     .dispatch('login/getUserInfo')
    //     //     .then(() => {
    //     //         store.dispatch('login/getUserPermissionList').then(() => {
    //     //             if (!to.meta.requireAuth) {
    //     //                 next()
    //     //                 return
    //     //             }

//     //             if (store.getters['login/hasRoutePermission'](path)) {
//     //                 next()
//     //             } else {
//     //                 next('/forbidden')
//     //             }
//     //         })
//     //         const account = store.state.login.userInfo.ename
//     //         if (!store.state.login.userRole) {
//     //             store.dispatch('login/viewUser', account).then(() => {
//     //                 store.dispatch('common/getDict')
//     //             })
//     //         }
//     //     })
//     //     .catch(() => {
//     //         Message.error('用户权限获取失败')
//     //     })
// })

export default router