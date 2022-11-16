import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import InscriptionPage from "@/pages/InscriptionPage.vue";
import PageNotFound from "@/pages/PageNotFound.vue";
import ConfirmEmailPage from "@/pages/ConfirmEmail.vue";
import {useLoggedInStore} from "@/stores/loggedIn";

const getRoutes = () => {
        return [
            {
            path: '/',
            name: 'Home',
            component: Home
            },
            {
            path: '/inscription',
            name: 'Inscription',
            component: InscriptionPage
            },
            {
                path: '/download',
                name: 'Download',
                component: InscriptionPage
            },
            {
                path: '/login',
                name: 'Login',
                component: InscriptionPage
            },
            {
                path: '/confirmEmail',
                name: 'ConfirmEmail',
                component: ConfirmEmailPage
            },
            { path: '/:pathMatch(.*)*', component: PageNotFound }
        ]
    }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: getRoutes()
})
router.beforeEach((to, from, next) => {
    const loggedOutPages = ['Inscription', 'Login', 'ConfirmEmail'];
    if(useLoggedInStore().isLoggedIn && loggedOutPages.includes(to.name as string)){
        next({name: "Home"});
    }
    next();
})
export default router
