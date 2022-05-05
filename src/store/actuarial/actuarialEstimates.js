import { $http } from "@/utils/request";
import api from "@/utils/api";

export default {
  namespaced: true,

  state: {
    classList: []
  },

  mutations: {
    SET_CLASSLIST(state, payload) {
      console.log(payload, 'payload');
      state.classList = payload.classList
      console.log(state.classList, 'state.classList')
    }
  },

  actions: {
    handleSearch(filter) {
      return $http.post(api.contractListQuery, filter)
    },
    getClassList({ commit }) {
      return $http.post(api.classListQuery, {}).then(res => {
        console.log(res.data)
        commit('SET_CLASSLIST', res.data.data)
      })
    }
  },
};
