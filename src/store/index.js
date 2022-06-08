import Vue from "vue";
import Vuex from "vuex";
import login from './login'
import test from "./test";
import actuarial from "./actuarial";
import financialView from "./financialView"

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    test,
    actuarial,
    login,
    financialView
  },
});
