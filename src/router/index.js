import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/layout/MainLayout.vue'),
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: '仪表盘', icon: 'DataAnalysis' }
      },
      {
        path: 'products',
        name: 'Products',
        component: () => import('@/views/Product/List.vue'),
        meta: { title: '商品管理', icon: 'Goods' }
      },
      {
        path: 'products/add',
        name: 'ProductAdd',
        component: () => import('@/views/Product/Edit.vue'),
        meta: { title: '添加商品', hidden: true }
      },
      {
        path: 'products/edit/:id',
        name: 'ProductEdit',
        component: () => import('@/views/Product/Edit.vue'),
        meta: { title: '编辑商品', hidden: true }
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import('@/views/Order/List.vue'),
        meta: { title: '订单管理', icon: 'ShoppingCart' }
      },
      {
        path: 'orders/:id',
        name: 'OrderDetail',
        component: () => import('@/views/Order/Detail.vue'),
        meta: { title: '订单详情', hidden: true }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/User/List.vue'),
        meta: { title: '用户管理', icon: 'User' }
      },
      {
        path: 'users/:id',
        name: 'UserDetail',
        component: () => import('@/views/User/Detail.vue'),
        meta: { title: '用户详情', hidden: true }
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/views/Category/List.vue'),
        meta: { title: '分类管理', icon: 'Menu' }
      },
      {
        path: 'stores',
        name: 'Stores',
        component: () => import('@/views/Store/List.vue'),
        meta: { title: '门店管理', icon: 'Shop' }
      },
      {
        path: 'stores/add',
        name: 'StoreAdd',
        component: () => import('@/views/Store/Edit.vue'),
        meta: { title: '添加门店', hidden: true }
      },
      {
        path: 'stores/edit/:id',
        name: 'StoreEdit',
        component: () => import('@/views/Store/Edit.vue'),
        meta: { title: '编辑门店', hidden: true }
      },
      {
        path: 'addresses',
        name: 'Addresses',
        component: () => import('@/views/Address/List.vue'),
        meta: { title: '地址管理', icon: 'Location' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
