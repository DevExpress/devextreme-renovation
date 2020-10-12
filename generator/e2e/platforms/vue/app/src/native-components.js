import Vue from "vue";
import App from "./pages/native-components.vue";

new Vue({
  el: "#app",
  components: { App },
  render: (h) => h(App),
});
