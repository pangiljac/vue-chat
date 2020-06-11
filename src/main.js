import Vue from "vue";
import App from "./App.vue";
import router from "./router/index.js";

/* 
Vue - Framework for single page web-apps
Bootstrap - Mobile-first front-end component libraries, UIs 
Firebase - Online/Cloud Dev (Pseudo-server)
Moment - Data Struct for dates and  times
Vue-Chat-Scroll - Plugin to automically view latest messages
Firebase-Tools - Gives me access to commands for firebase
*/

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import VueChatScroll from 'vue-chat-scroll';


 

Vue.config.productionTip = false;
Vue.use(VueChatScroll);


new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
