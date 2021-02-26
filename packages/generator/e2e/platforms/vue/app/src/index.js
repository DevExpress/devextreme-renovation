import Vue from "vue";
import App from "./pages/index.vue";

new Vue({
  el: "#app",
  components: { App },
  render: (h) => h(App),
});
