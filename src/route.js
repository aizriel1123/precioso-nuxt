import { createRouter, createWebHistory } from 'vue-router'
import LoginRegisterPage from '@/pages/login-register/login.vue'
import RegisterPage from '@/pages/login-register/register.vue'

const routes = [
  {
    path: '/',
    component: LoginRegisterPage,
    children: [
      {
        path: '',
        component: () => import('@/components/ui/page'),
        children: [
          {
            path: 'login',
            component: LoginRegisterPage,
          },
          {
            path: 'register',
            component: RegisterPage,
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router