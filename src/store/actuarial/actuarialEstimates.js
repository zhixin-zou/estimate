import { $http } from "@/utils/request";
import api from "@/utils/api";

export default {
  namespaced: true,

  state: {
    productList: []
  },

  mutations: {
    SET_PRODUCTLIST(state, payload) {
      console.log(payload, 'payload');
      state.productList = payload.productList
      console.log(state.productList, 'state.productList')
    }
  },

  actions: {
    handleSearch(filter) {
      return $http.post(api.contractListQuery, filter)
    },
    getProductList({ commit }) {
      return $http.get('http://yapi.smart-xwork.cn/mock/134845' + api.productListQuery).then(res => {
        // res.data.productList
        console.log(res.data)
        commit('SET_PRODUCTLIST', res.data.data)
      })
    }
  },
};
