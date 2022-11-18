import {createApp} from 'vue'
import {createPinia} from 'pinia'
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
import adminHome from './components/Administrator/AdminHome.vue';
import loggedInHomeVue from './components/LoggedIn/LoggedInHome.vue';
import loggedOutNavBarVue from './components/LoggedOut/LoggedOutNavBar.vue';
import loggedOutHomeVue from './components/LoggedOut/LoggedOutHome.vue';
import sendNewConfirmPageVue from './pages/SendNewConfirmPage.vue';
import ModVersionsPage from './pages/ModVersionsPage.vue';
import inscriptionFormVue from './components/LoggedOut/InscriptionForm.vue';
import loginFormVue from './components/LoggedOut/LoginForm.vue';
import userLogin from './components/LoggedOut/UserLogin.vue';
import adminLogin from './components/LoggedOut/AdminLogin.vue';
import adminLoginForm from './components/LoggedOut/AdminLoginForm.vue';
import loginPageVue from './pages/LoginPage.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Divider from 'primevue/divider';
import Password from 'primevue/password';
import homeButtonVue from './components/HomeButton.vue';
import confirmEmailmVue from '@/pages/ConfirmEmail.vue';
import inscriptionPage from "@/pages/InscriptionPage.vue";
import {loginFromCookies} from "@/utils/apiUtils";
import Sidebar from 'primevue/sidebar';
import Dropdown from 'primevue/dropdown';
import ConfirmationService from 'primevue/confirmationservice';
import Toast from "primevue/toast";
import ToastService from 'primevue/toastservice';
import ConfirmPopup from 'primevue/confirmpopup';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';

const app = createApp(App)

app.use(VueCookies);
app.use(createPinia())
await loginFromCookies();

app.use(router)
app.use(PrimeVue, {
    locale: {
        accept: 'Oui',
        reject: 'Non'
    }
});
app.use(ConfirmationService);
app.use(ToastService);
app.component('Toolbar', Toolbar);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('ConfirmPopup', ConfirmPopup);
app.component('Toast', Toast);
app.component('Button', Button);
app.component('Card', Card);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('Dropdown', Dropdown);
app.component('Divider', Divider);
app.component('Sidebar', Sidebar);
app.component('ProgressSpinner', ProgressSpinner);
app.component('LoggedInNavBar', loggedInNavBarVue);
app.component('LoggedOutNavBar', loggedOutNavBarVue);
app.component('LoggedOutHome', loggedOutHomeVue);
app.component('UserLogin', userLogin);
app.component('AdminLogin', adminLogin);
app.component('AdminHome', adminHome);
app.component('AdminLoginForm', adminLoginForm);
app.component('LoggedInHome', loggedInHomeVue);
app.component('InscriptionForm', inscriptionFormVue);
app.component('InscriptionPage', inscriptionPage);
app.component('HomeButton', homeButtonVue);
app.component('ConfirmationEmailPage', confirmEmailmVue);
app.component('SendNewConfirmPage', sendNewConfirmPageVue);
app.component('ModVersionsPage', ModVersionsPage);
app.component('LoginPage', loginPageVue);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('LoginForm', loginFormVue);
app.mount('#app')
