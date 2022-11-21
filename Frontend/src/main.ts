import {init} from "@/utils/generalUtils";
import {createApp} from "vue";
import App from "@/App.vue";


const app = createApp(App)
await init(app);