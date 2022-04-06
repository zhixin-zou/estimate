import { $http } from "@/utils/request";
import api from "@/utils/api";

export default {
  namespaced: true,

  state: {
  },

  mutations: {},

  actions: {
    handleSearch(filter) {
      return $http.post(api.contractListQuery, filter)
    },
  },
};
