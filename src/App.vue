<script setup>
import { watch } from 'vue'
import { useItemStore } from '@/stores/items'
import { useRecordStore } from '@/stores/records'
import { useTechnicianStore } from '@/stores/technicians'
import { useUserStore } from '@/stores/user'

const itemStore = useItemStore()
const recordStore = useRecordStore()
const technicianStore = useTechnicianStore()
const userStore = useUserStore()

const navs = [
  { to: '/', label: '首页' },
  { to: '/items', label: '物品' },
  { to: '/records', label: '记录' },
  { to: '/technicians', label: '师傅' },
  { to: '/dashboard', label: '看板' },
  { to: '/leaderboard', label: '排行榜' },
  { to: '/profile', label: '我的' }
]

// 集中监听数据变化，统一触发成就判定（解耦各业务 store 与成就逻辑）
watch(
  [
    () => itemStore.items,
    () => recordStore.records,
    () => technicianStore.technicians,
    () => technicianStore.reviews
  ],
  () => userStore.refreshAchievements(),
  { deep: true, immediate: true }
)
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="app-header-inner">
        <router-link to="/" class="brand">
          <span class="brand-mark"></span>
          <span class="brand-text">家庭维修与保养管家</span>
        </router-link>
        <span class="badge-count" v-if="userStore.unlockedCount">
          已解锁 {{ userStore.unlockedCount }} 枚徽章
        </span>
      </div>
    </header>

    <nav class="app-nav">
      <router-link
        v-for="n in navs"
        :key="n.to"
        :to="n.to"
        class="nav-item"
        :exact-active-class="n.to === '/' ? 'active' : undefined"
        active-class="active"
      >
        {{ n.label }}
      </router-link>
    </nav>

    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
}

.app-header {
  background: var(--primary);
  color: #fff;
}
.app-header-inner {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  font-size: 18px;
}
.brand-mark {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: #fff;
  position: relative;
}
.brand-mark::after {
  content: '';
  position: absolute;
  inset: 5px;
  background: var(--primary);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 70%, 0 100%);
}
.badge-count {
  font-size: 12px;
  background: rgba(255, 255, 255, 0.18);
  padding: 4px 10px;
  border-radius: 999px;
}

.app-nav {
  background: #fff;
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  gap: 4px;
  padding: 0 12px;
  overflow-x: auto;
}
.app-nav .nav-item {
  flex: none;
  padding: 12px 16px;
  font-size: 14px;
  color: var(--text-muted);
  text-decoration: none;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}
.app-nav .nav-item.active {
  color: var(--primary);
  border-bottom-color: var(--primary);
  font-weight: 600;
}

.app-main {
  flex: 1;
  width: 100%;
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 20px;
}
</style>
