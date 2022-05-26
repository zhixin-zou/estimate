import { $http } from '@/utils/request'
import api from '@/utils/api'
import { SYSTEM_ID, DEV_LOGIN_USER_ACCOUNT } from '@/utils/config'
// import localMenu from '@/router/menu'

export default {
  namespaced: true,
  state: {
    userInfo: {
      ename: '',
      name: '',
      email: '',
      mobile: ''
    },
    userPermissionList: [{
      permissionValue: 'example:create'
    }],
    userPermissionFetced: false,
    // userRole: 1 // 1, 不区分15E或者15F; 2, 15E; 3,15F
  },

  getters: {
    // hasRoutePermission: state => path => {
    //   return state.userPermissionList.find(x => x.uri === path)
    // },
    hasFeaturePermission: state => code => {
      return state.userPermissionList.find(x => x.permissionValue === code)
    },
  },

  mutations: {
    // SET_LOGIN_USER (state, payload) {
    //   extend(state.userInfo, payload)
    // },
    SET_USER_PERMISSION_LIST (state, list) {
      state.userPermissionList = list
      state.userPermissionFetced = true
      console.log(state.userPermissionList, 'state.userPermissionList');
    },
    // SET_USER_ROLE (state, result) {
    //   // let rolesArr = list.roles || []
    //   // let user15E = rolesArr.find(v => v.roleName.indexOf('15E') > 0)
    //   // let user15F = rolesArr.find(v => v.roleName.indexOf('15F') > 0)
    //   // if (user15E && !user15F) {
    //   //   state.userRole = 2
    //   // } else if (!user15E && user15F) {
    //   //   state.userRole = 3
    //   // } else {
    //   //   state.userRole = 1
    //   // }
    //   state.userRole = result
    //   console.log(result, state.userRole, 'getCommonUserDetail')
    // }
  },

  actions: {
    getUserPermissionList ({ state, commit }) {
      if (!state.userPermissionFetced) {
        // 线上环境无需传入参数，通过网关获取当前用户
        let params = null
        if (process.env.NODE_ENV === 'development') {
          params = {
            account: DEV_LOGIN_USER_ACCOUNT,
            systemId: SYSTEM_ID
          }
        }
        return $http
          .post(api.getUserPermissionList, params)
          .then(data => {
            commit('SET_USER_PERMISSION_LIST', data.result || [])
          })
      }
    },
    // getUserInfo: ({ state, commit }) => {
    //   if (state.userInfo.ename) {
    //     return Promise.resolve()
    //   } else {
    //     // 线上环境无需传入参数，通过网关获取当前用户
    //     let params = null
    //     if (process.env.NODE_ENV === 'development') {
    //       params = {
    //         account: DEV_LOGIN_USER_ACCOUNT,
    //         systemId: SYSTEM_ID
    //       }
    //     }
    //     return $http.post(api.getUserInfo, params).then(data => {
    //       if (data.result && data.result.id) {
    //         commit('SET_LOGIN_USER', data.result)
    //       }
    //     })
    //   }
    // },
    // viewUser ({state, commit}, account) {
    //   // let params = {
    //   //   account: account,
    //   //   systemId: SYSTEM_ID
    //   // }
    //   return $http.post(api.getCommonUserDetail, {}).then(data => {
    //     if (data.result && data.result) {
    //       commit('SET_USER_ROLE', data.result)
    //     }
    //   })
    // }
  }
}
