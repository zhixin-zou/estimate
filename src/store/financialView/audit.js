// import { $http } from "@/utils/request";
// import api from "@/utils/api";

export default {
  namespaced: true,

  state: {
    auditLogId: ''
  },

  mutations: {
    SET_AUDITID(state, payload) {
      state.auditLogId = payload.auditLogId
      console.log(state.auditLogId);
    }
  },

  actions: {
    // handleSearch(filter) {
    //   return $http.post(api.contractListQuery, filter)
    // },
    // getClassList({ commit }) {
    //   return $http.post(api.classListQuery, {}).then(res => {
    //     console.log(res.data)
    //     commit('SET_CLASSLIST', res.data.data)
    //   })
    // }
  },
};
