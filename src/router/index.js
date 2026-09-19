import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/items', name: 'items', component: () => import('@/views/ItemsView.vue') },
  { path: '/items/:id', name: 'item-detail', component: () => import('@/views/ItemDetailView.vue') },
  { path: '/records', name: 'records', component: () => import('@/views/RecordsView.vue') },
  { path: '/technicians', name: 'technicians', component: () => import('@/views/TechniciansView.vue') },
  { path: '/technicians/:id', name: 'technician-detail', component: () => import('@/views/TechnicianDetailView.vue') },
  { path: '/dashboard', name: 'dashboard', component: () => import('@/views/DashboardView.vue') },
  { path: '/leaderboard', name: 'leaderboard', component: () => import('@/views/LeaderboardView.vue') },
  { path: '/profile', name: 'profile', component: () => import('@/views/ProfileView.vue') }
]

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})
