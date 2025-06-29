import { createApp } from "vue";
import router from "@/plugins/router";
import vuetify from "@/plugins/vuetify";
import App from "@/App.vue";
import initFacebookSDK from "@/plugins/facebook_SDK";

const app = createApp(App);
app.use(router);
app.use(vuetify);

initFacebookSDK().then(() => app.mount("#app"));
