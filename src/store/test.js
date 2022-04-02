import { $http } from "@/utils/request";
import api from "@/utils/api";

export default {
  namespaced: true,
  state: {
    userPermissionList: [],
    userPermissionFetced: false,
    hrTodoCount: 0,
  },

  getters: {},

  mutations: {
    SET_USER_PERMISSION_LIST(state, list) {
      state.userPermissionList = list;
      state.userPermissionFetced = true;
      console.log(state.userPermissionList, "userPremission");
    },
    SET_HR_TODO_COUNT(state, list) {
      state.hrTodoCount = list.length || 0;
    },
  },

  actions: {
      // { state, commit }, params
    test() {
      return $http.post(api.yearContractDetailQuery, {
        estimateKey: "a3137f63-aa83-11ec-9e97-a4ae1204f49c",
      }).then(data => {
          console.log(data, '//////');
        //   commit('SET_LIST', {
        //     list: data.result.data.data,
        //     total: data.result.totalCount,
        //     sumData: data.result.data.sumData
        //   })
      })
    },
  },
};
