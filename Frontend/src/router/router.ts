import {createRouter, createWebHistory} from 'vue-router'
import Home from '../pages/Everyone/Home.vue'
import InscriptionPage from "@/pages/Everyone/InscriptionPage.vue";
import PageNotFound from "@/pages/PageNotFound.vue";
import ConfirmEmailPage from "@/pages/User/ConfirmEmail.vue";
import LoginPage from "@/pages/Everyone/LoginPage.vue";
import SendNewConfirmPage from "@/pages/User/SendNewConfirmPage.vue";
import ModVersionsPage from "@/pages/User/ModVersionsPage.vue";
import {useLoggedInStore} from "@/stores/loggedIn";
import AddVersionPage from "@/pages/Admin/AddVersionPage.vue";
import LinkWorldPage from "@/pages/User/LinkWorldPage.vue";
import RemoveVersionPage from "@/pages/Admin/RemoveVersionPage.vue";
import myStatsPage from "@/pages/User/MyStatsPage.vue";
import moreStatsPage from "@/pages/User/MoreStatsPage.vue";

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
            path: '/login',
            name: 'Login',
            component: LoginPage
        },
        {
            path: '/confirmEmail',
            name: 'ConfirmEmail',
            component: ConfirmEmailPage
        },
        {
            path: '/sendNewConfirm',
            name: 'NewConfirm',
            component: SendNewConfirmPage
        }, {
            path: '/modVersions',
            name: 'modVersions',
            component: ModVersionsPage
        },
        {
            path: '/addVersion',
            name: 'AddVersion',
            component: AddVersionPage
        },
        {
            path: '/RemoveVersion',
            name: 'RemoveVersion',
            component: RemoveVersionPage
        },
        {
            path: '/LinkWorld',
            name: 'LinkWorld',
            component: LinkWorldPage
        },
        {
            path: '/MyStats',
            name: 'MyStats',
            component: myStatsPage
        },
        {
            path: '/MyStats/:id',
            name: 'MoreStats',
            component: moreStatsPage
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'ErrorPage',
            component: PageNotFound
        }
    ]
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: getRoutes()
})
router.beforeEach((to, from, next) => {
    const loggedOutPages = ['Inscription', 'Login', 'ConfirmEmail', 'NewConfirm'];
    const adminPages = ['RemoveVersion', 'AddVersion'];
    const loggedInPages = ['LinkWorld', 'MyStats', 'MoreStats'];
    if (useLoggedInStore().isLoggedIn && loggedOutPages.includes(to.name as string)) {
        next({name: "Home"});
        return
    }
    if ((!useLoggedInStore().isLoggedIn || useLoggedInStore().userType !== "admin")
        && adminPages.includes(to.name as string)) {
        next({name: "ErrorPage"});
        return;
    }
    if ((!useLoggedInStore().isLoggedIn || useLoggedInStore().userType !== "user")
        && loggedInPages.includes(to.name as string)) {
        next({name: "ErrorPage"});
        return;
    }
    next();
})
export default router
