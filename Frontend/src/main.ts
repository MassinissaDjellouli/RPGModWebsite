import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/md-dark-indigo/theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/main.css';
import Toolbar from 'primevue/toolbar';
import Card from 'primevue/card';
import Button from 'primevue/button';
import VueCookies from 'vue3-cookies'
import loggedInNavBarVue from './components/LoggedIn/LoggedInNavBar.vue';
import loggedOutNavBarVue from './components/LoggedOut/LoggedOutNavBar.vue';
import loggedOutHomeVue from './components/LoggedOut/LoggedOutHome.vue';
import Ripple from 'primevue/ripple';
const app = createApp(App)
app.use(VueCookies);
app.use(createPinia())
app.use(router)
app.use(PrimeVue, { ripple: true });
app.component('Toolbar', Toolbar);
app.component('Button', Button);
app.component('Card', Card);
app.component('LoggedInNavBar', loggedInNavBarVue);
app.component('LoggedOutNavBar', loggedOutNavBarVue);
app.component('LoggedOutHome', loggedOutHomeVue);
app.mount('#app')
app.directive('ripple', Ripple);
