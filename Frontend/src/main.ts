import { createApp } from 'vue'
import { createPinia } from 'pinia'

import 'primevue/resources/themes/bootstrap4-dark-blue/theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primeicons/primeicons.css';
import './main.css';
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Toolbar from 'primevue/toolbar';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import VueCookies from 'vue3-cookies'
import loggedInNavBarVue from './components/LoggedIn/LoggedInNavBar.vue';
import loggedOutNavBarVue from './components/LoggedOut/LoggedOutNavBar.vue';
import loggedOutHomeVue from './components/LoggedOut/LoggedOutHome.vue';
import inscriptionFormVue from './components/LoggedOut/InscriptionForm.vue';
import Divider from 'primevue/divider';
import Password from 'primevue/password';
import homeButtonVue from './components/HomeButton.vue';
import Ripple from 'primevue/ripple';
import { inscription, login } from './utils/apiUtils';
const app = createApp(App)
app.use(VueCookies);
app.use(createPinia())
app.use(router)
app.use(PrimeVue, { ripple: true });
app.component('Toolbar', Toolbar);
app.component('Button', Button);
app.component('Card', Card);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('Divider', Divider);
app.component('LoggedInNavBar', loggedInNavBarVue);
app.component('LoggedOutNavBar', loggedOutNavBarVue);
app.component('LoggedOutHome', loggedOutHomeVue);
app.component('InscriptionForm', inscriptionFormVue);
app.component('HomeButton', homeButtonVue);
app.mount('#app')
app.directive('ripple', Ripple);

inscription({username: "test", password: "testtest", email: "massidjel@gmail.com"})