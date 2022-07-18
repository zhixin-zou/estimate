import Vue from "vue";
import Vuex from "vuex";

import App from "./App.vue";
import ElementUI from "element-ui";
import request from "./utils/request";
import router from "./router";
import store from "./store";
import permission from "./utils/permission";

import "element-ui/lib/theme-chalk/index.css";

// import FilterPanel from '@/components/FilterPanelNew.vue'
import FsListPanel from "@/components/listPanel.vue";
import horizontalScroll from 'el-table-horizontal-scroll'
import TreeTable from 'vue-table-with-tree-grid'

// Vue.use(TreeTable)
Vue.use(horizontalScroll)
Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(ElementUI);
Vue.use(request);

// Vue.component(FilterPanel.name, FilterPanel)
Vue.component(FsListPanel.name, FsListPanel);
Vue.component('tree-table', TreeTable)
/* eslint-disable no-new */
Vue.directive("permission", {
  bind: (el, binding) => {
    if (!binding.value) {
      return;
    }

    if (
      !store.getters["login/hasFeaturePermission"](permission[binding.value])
    ) {
      el.style.display = "none";
    }
  },
});
new Vue({
  router,
  store,

  render: (h) => h(App),
}).$mount("#app");
