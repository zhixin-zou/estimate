import { $http } from "@/utils/request";
import api from "@/utils/api";
// import { SYSTEM_ID, DEV_LOGIN_USER_ACCOUNT } from '@/utils/config'
import { extend } from "@/utils/utils";

// import localMenu from '@/router/menu'

export default {
  namespaced: true,
  state: {
    userInfo: {
      ename: "",
      name: "",
      email: "",
      mobile: "",
    },
    userPermissionList: [
      {
        permissionValue: "example:create",
      },
    ],
    userPermissionFetced: false,
    localUserPermissionFetced: false,
    // userRole: 1 // 1, 不区分15E或者15F; 2, 15E; 3,15F
  },

  getters: {
    // hasRoutePermission: state => path => {
    //   return state.userPermissionList.find(x => x.uri === path)
    // },
    hasFeaturePermission: (state) => (code) => {
      return state.userPermissionList.find((x) => x.permissionValue === code);
    },
  },

  mutations: {
    SET_LOGIN_USER(state, payload) {
      extend(state.userInfo, payload);
    },
    SET_USER_PERMISSION_LIST(state, list) {
      state.userPermissionList = list;
      state.userPermissionFetced = true;
      console.log(state.userPermissionList, "state.userPermissionList");
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
    getUserPermissionList({ state, commit }) {
      if (!state.userPermissionFetced) {
        // 线上环境无需传入参数，通过网关获取当前用户
        let params = null;
        // if (process.env.NODE_ENV === 'development') {
        //   params = {
        //     account: DEV_LOGIN_USER_ACCOUNT,
        //     systemId: SYSTEM_ID
        //   }
        // }
        return $http.post(api.getUserPermissionList, params).then((data) => {
          commit("SET_USER_PERMISSION_LIST", data.result || []);
        });
      }
    },
    getLocalUserPermissionList({ state }) {
      if (!state.localUserPermissionFetced) {
        state.userPermissionList = [
          {
            id: 9010,
            systemId: 229,
            pid: 8926,
            permissionName: "预估账务查询",
            permissionType: 2,
            permissionValue: "finance:business:financialSearch",
            uri: "/financialSearch.html#/",
            icon: "",
            permissionStatus: 1,
            orders: 1,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 8963,
            systemId: 229,
            pid: 8294,
            permissionName: "主页",
            permissionType: 2,
            permissionValue: "finance:home",
            uri: "/welcome",
            icon: "fa-home",
            permissionStatus: 1,
            orders: 0,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 9006,
            systemId: 229,
            pid: 9008,
            permissionName: "精算预估",
            permissionType: 2,
            permissionValue: "finance:business:actuarialEstimate",
            uri: "/actuarialEstimates.html#/",
            icon: "",
            permissionStatus: 1,
            orders: 2,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 9007,
            systemId: 229,
            pid: 8924,
            permissionName: "错误日志",
            permissionType: 2,
            permissionValue: "finance:monitor:errorLog",
            uri: "/errorLine",
            icon: "",
            permissionStatus: 1,
            orders: 4,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 9008,
            systemId: 229,
            pid: 8294,
            permissionName: "预估中心",
            permissionType: 2,
            permissionValue: "finance:",
            uri: "",
            icon: "fa-tags",
            permissionStatus: 1,
            orders: 4,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 9005,
            systemId: 229,
            pid: 9008,
            permissionName: "财务分入预估",
            permissionType: 2,
            permissionValue: "finance:business:financeInwardEstimate",
            uri: "/financialForecasts.html#/",
            icon: "",
            permissionStatus: 1,
            orders: 0,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 9059,
            systemId: 229,
            pid: 8926,
            permissionName: "预估期间切换",
            permissionType: 2,
            permissionValue: "finance:business:periodSwitch",
            uri: "/estimateDuring.html#/",
            icon: "",
            permissionStatus: 1,
            orders: 2,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 8924,
            systemId: 229,
            pid: 8294,
            permissionName: "管理中心",
            permissionType: 2,
            permissionValue: "finance:manage",
            uri: "",
            icon: "fa-calendar-plus-o",
            permissionStatus: 1,
            orders: 1,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 8925,
            systemId: 229,
            pid: 8294,
            permissionName: "配置中心",
            permissionType: 2,
            permissionValue: "finance:config",
            uri: "",
            icon: "fa-clone",
            permissionStatus: 1,
            orders: 2,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 8999,
            systemId: 229,
            pid: 8924,
            permissionName: "邮箱配置",
            permissionType: 2,
            permissionValue: "finance:manage:mail",
            uri: "/emailpage",
            icon: "",
            permissionStatus: 1,
            orders: 0,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 9001,
            systemId: 229,
            pid: 8925,
            permissionName: "产品配置",
            permissionType: 2,
            permissionValue: "finance:config:product",
            uri: "/product",
            icon: "",
            permissionStatus: 1,
            orders: 0,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 9004,
            systemId: 229,
            pid: 8924,
            permissionName: "任务监控",
            permissionType: 2,
            permissionValue: "finance:monitor:taskMonitor",
            uri: "/monitoringPage",
            icon: "",
            permissionStatus: 1,
            orders: 3,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 9026,
            systemId: 229,
            pid: 9008,
            permissionName: "财务分出预估",
            permissionType: 2,
            permissionValue: "finance:business:financeOutwardEstimate",
            uri: "/separateEstimates.html#/",
            icon: "",
            permissionStatus: 1,
            orders: 1,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 9057,
            systemId: 229,
            pid: 8294,
            permissionName: "审计中心",
            permissionType: 2,
            permissionValue: "finance:audit",
            uri: "",
            icon: "fa-tags",
            permissionStatus: 1,
            orders: 5,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 9060,
            systemId: 229,
            pid: 9008,
            permissionName: "精算试算",
            permissionType: 2,
            permissionValue: "finance:business:actuarialEstimate:trial",
            uri: "/trialSearchView.html#/",
            icon: "",
            permissionStatus: 1,
            orders: 4,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 9003,
            systemId: 229,
            pid: 8926,
            permissionName: "SICS账务下发",
            permissionType: 2,
            permissionValue: "finance:business:Issued",
            uri: "/manual",
            icon: "",
            permissionStatus: 1,
            orders: 0,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 9009,
            systemId: 229,
            pid: 9008,
            permissionName: "预估分析",
            permissionType: 2,
            permissionValue: "finance::",
            uri: "https://atlas.oa.fusure.com/$NavBlock_application?permissionValue=atlas%3Adashboard%3Afinance",
            icon: "",
            permissionStatus: 1,
            orders: 5,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 9058,
            systemId: 229,
            pid: 9057,
            permissionName: "财务审计",
            permissionType: 2,
            permissionValue: "finance:audit:financeAudit",
            uri: "/auditLog.html#/",
            icon: "",
            permissionStatus: 1,
            orders: 0,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 8294,
            systemId: 229,
            pid: 0,
            permissionName: "财务系统",
            permissionType: 0,
            permissionValue: "finance",
            uri: "",
            icon: "",
            permissionStatus: 1,
            orders: 0,
            type: 1,
            authFlag: 1,
            appKey: "finance",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 8926,
            systemId: 229,
            pid: 8294,
            permissionName: "账务中心",
            permissionType: 2,
            permissionValue: "finance:business",
            uri: "",
            icon: "fa-tags",
            permissionStatus: 1,
            orders: 3,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 9000,
            systemId: 229,
            pid: 8924,
            permissionName: "任务配置",
            permissionType: 2,
            permissionValue: "finance:manage:task",
            uri: "/jobscheduling",
            icon: "",
            permissionStatus: 1,
            orders: 1,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
          {
            id: 9002,
            systemId: 229,
            pid: 8925,
            permissionName: "科目配置",
            permissionType: 2,
            permissionValue: "finance:config:subject",
            uri: "/account",
            icon: "",
            permissionStatus: 1,
            orders: 1,
            type: 1,
            authFlag: 1,
            appKey: "",
            showType: 0,
            iconColor: "",
            permissionDesc: "",
          },
        ];
        state.localUserPermissionFetced = true;
        console.log(state.userPermissionList);
      }
    },
    getUserInfo: ({ commit }) => {
      // 线上环境无需传入参数，通过网关获取当前用户
      let params = null;
      return $http.post(api.getUserInfo, params).then((data) => {
        if (data.result && data.result.id) {
          commit("SET_LOGIN_USER", data.result);
        }
      });
    },
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
  },
};
