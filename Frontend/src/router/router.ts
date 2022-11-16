import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import InscriptionPage from "@/pages/InscriptionPage.vue";
import PageNotFound from "@/pages/PageNotFound.vue";
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
            { path: '/:pathMatch(.*)*', component: PageNotFound }
        ]
    }

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: getRoutes()
})
router.beforeEach((to, from, next) => {
    if(to.name === "Inscription" && useLoggedInStore().isLoggedIn){
        next({name: "Home"});
    }
    next();
})
export default router
