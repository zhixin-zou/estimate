import Vue from "vue";
import Vuex from "vuex";
// import login from './login'
import test from "./test";
import actuarial from "./actuarial";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    test,
    actuarial,
  },
});
