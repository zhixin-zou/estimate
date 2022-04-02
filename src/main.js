import Vue from "vue";
import Vuex from "vuex";

import App from "./App.vue";
import ElementUI from "element-ui";
import request from "./utils/request";
import router from "./router";
import store from "./store";

import "element-ui/lib/theme-chalk/index.css";

// import FilterPanel from '@/components/FilterPanelNew.vue'
import FsListPanel from "@/components/listPanel.vue";
Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(ElementUI);
Vue.use(request);

// Vue.component(FilterPanel.name, FilterPanel)
Vue.component(FsListPanel.name, FsListPanel);

new Vue({
  router,
  store,

  render: (h) => h(App),
}).$mount("#app");
