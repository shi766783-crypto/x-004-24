<script setup>
import { computed } from 'vue'
import { useItemStore } from '@/stores/items'
import { useRecordStore } from '@/stores/records'
import { useTechnicianStore } from '@/stores/technicians'
import { useUserStore } from '@/stores/user'

const itemStore = useItemStore()
const recordStore = useRecordStore()
const technicianStore = useTechnicianStore()
const userStore = useUserStore()

const badges = computed(() => userStore.allBadges)
const unlocked = computed(() => userStore.unlockedCount)

const stats = computed(() => [
  { label: '物品', value: itemStore.items.length },
  { label: '记录', value: recordStore.records.length },
  { label: '师傅', value: technicianStore.technicians.length },
  { label: '评价', value: technicianStore.reviews.length }
])
</script>

<template>
  <div class="page">
    <section class="profile-head">
      <div class="avatar">我</div>
      <div class="head-info">
        <h1>我的家</h1>
        <p>已解锁 {{ unlocked }} / {{ badges.length }} 枚成就徽章</p>
      </div>
    </section>

    <section class="stats">
      <div v-for="s in stats" :key="s.label" class="stat-card">
        <div class="stat-label">{{ s.label }}</div>
        <div class="stat-value">{{ s.value }}</div>
      </div>
    </section>

    <section class="card">
      <h3>成就徽章</h3>
      <div class="badges">
        <div v-for="b in badges" :key="b.id" class="badge" :class="{ locked: !b.unlocked }">
          <span class="badge-icon" :style="{ background: b.unlocked ? b.color : 'var(--bg-soft)', color: b.unlocked ? '#fff' : '#cbd5e1' }">
            {{ b.glyph }}
          </span>
          <span class="badge-name">{{ b.name }}</span>
          <span class="badge-desc">{{ b.desc }}</span>
        </div>
      </div>
    </section>

    <section class="card">
      <h3>快捷入口</h3>
      <div class="links">
        <router-link to="/items" class="btn btn-outline">我的物品</router-link>
        <router-link to="/records" class="btn btn-outline">保养记录</router-link>
        <router-link to="/records" class="btn btn-outline">维修历史</router-link>
        <router-link to="/dashboard" class="btn btn-outline">统计看板</router-link>
      </div>
    </section>
  </div>
</template>

<style scoped>
.profile-head {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, var(--primary), #38a169);
  color: #fff;
  border-radius: 14px;
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
}
.head-info h1 {
  font-size: 20px;
}
.head-info p {
  margin: 4px 0 0;
  opacity: 0.9;
  font-size: 13px;
}
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}
.badges {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 12px;
}
.badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 8px;
  border: 1px solid var(--border);
  border-radius: 12px;
  text-align: center;
}
.badge.locked {
  opacity: 0.55;
}
.badge-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
}
.badge-name {
  font-weight: 600;
  font-size: 13px;
}
.badge-desc {
  font-size: 11px;
  color: var(--text-muted);
}
.links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
