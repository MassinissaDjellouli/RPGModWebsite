import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ProgressSpinner from 'primevue/progressspinner';

import 'primevue/resources/themes/bootstrap4-dark-blue/theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primeicons/primeicons.css';
import './main.css';
import App from './App.vue'
import router from './router/router'
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
import loginFormVue from './components/LoggedOut/LoginForm.vue';
import Divider from 'primevue/divider';
import Password from 'primevue/password';
import homeButtonVue from './components/HomeButton.vue';
import Ripple from 'primevue/ripple';
import { login, loginFromCookies } from './utils/apiUtils';
import confirmEmailmVue from '@/pages/ConfirmEmail.vue';
import inscriptionPage from "@/pages/InscriptionPage.vue";
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
app.component('ProgressSpinner', ProgressSpinner);
app.component('LoggedInNavBar', loggedInNavBarVue);
app.component('LoggedOutNavBar', loggedOutNavBarVue);
app.component('LoggedOutHome', loggedOutHomeVue);
app.component('InscriptionForm', inscriptionFormVue);
app.component('InscriptionPage', inscriptionPage);
app.component('HomeButton', homeButtonVue);
app.component('ConfirmationEmailPage', confirmEmailmVue);
app.component('LoginForm', loginFormVue);
app.mount('#app')
app.directive('ripple', Ripple);
loginFromCookies();
login({username: "test", password: "testtest", email: "massidjel@gmail.com"})