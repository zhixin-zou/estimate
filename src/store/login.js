// import { $http } from '@/utils/request'
// import api from '@/utils/api'
// import { arrayToTree, extend } from '@/utils/utils'
// import { SYSTEM_ID, DEV_LOGIN_USER_ACCOUNT } from '@/utils/config'
// import localMenu from '@/router/menu'
// // import axios from 'axios'

// export default {
//   namespaced: true,
//   state: {
//     userInfo: {
//       ename: '',
//       name: '',
//       email: '',
//       mobile: '',
//       avatar: ''
//     },
//     userPermissionList: [],
//     userPermissionFetced: false,
//     hrTodoCount: 0
//   },

//   getters: {
//     hasRoutePermission: state => path => {
//       return state.userPermissionList.find(x => x.uri === path)
//     },
//     hasFeaturePermission: state => code => {
//       return state.userPermissionList.find(x => x.permissionValue === code)
//     },
//     menu: state => {
//       let workflowTemplateList = state.userPermissionList.filter(v => v.permissionName === '工作流管理')
//       let workflowTemplateListNew = state.userPermissionList.filter(v => v.permissionName === '工作流管理(new)')
//       console.log(workflowTemplateList, workflowTemplateListNew, 'workflowTemplateList')
//       // 菜单、目录
//       const menuItems = state.userPermissionList
//         .filter(x => x.permissionType === 1 || x.permissionType === 2)
//         .concat(localMenu)
//         .sort((x, y) => (x.orders || 0) - (y.orders || 0))
//       return arrayToTree(menuItems, {
//         parentProperty: 'pid'
//       })
//     }
//   },

//   mutations: {
//     SET_LOGIN_USER (state, payload) {
//       extend(state.userInfo, payload)
//     },
//     SET_USER_PERMISSION_LIST (state, list) {
//       state.userPermissionList = list
//       state.userPermissionFetced = true
//       console.log(state.userPermissionList, 'userPremission')
//     },
//     SET_HR_TODO_COUNT (state, list) {
//       state.hrTodoCount = list.length || 0
//     }
//   },

//   actions: {
//     getUserPermissionList ({ state, commit }) {
//       if (!state.userPermissionFetced) {
//         // 线上环境无需传入参数，通过网关获取当前用户
//         let params = null
//         if (process.env.NODE_ENV === 'development') {
//           params = {
//             account: DEV_LOGIN_USER_ACCOUNT,
//             systemId: SYSTEM_ID
//           }
//         }

//         return $http.post(api.getUserPermissionList, params).then(data => {
//           commit('SET_USER_PERMISSION_LIST', data.result || [])
//         })
//       }
//     },

//     getUserInfo: ({ state, commit }) => {
//       // localStorage.removeItem('version')
//       if (state.userInfo.ename) {
//         return Promise.resolve()
//       } else {
//         // 线上环境无需传入参数，通过网关获取当前用户
//         let params = null
//         if (process.env.NODE_ENV === 'development') {
//           params = {
//             account: DEV_LOGIN_USER_ACCOUNT,
//             systemId: SYSTEM_ID
//           }
//         }

//         return $http.post(api.getUserInfo, params).then(data => {
//           if (data.result && data.result.id) {
//             commit('SET_LOGIN_USER', data.result)
//           }
//         })
//       }
//     }
//   }
// }
