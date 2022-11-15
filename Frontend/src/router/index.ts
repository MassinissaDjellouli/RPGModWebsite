import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import InscriptionFormVue from '@/components/LoggedOut/InscriptionForm.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/inscription',
      name: 'inscription',
      component: InscriptionFormVue
    }
  ]
})


export default router
