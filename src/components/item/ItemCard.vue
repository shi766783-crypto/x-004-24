<script setup>
import { computed } from 'vue'
import { categoryOf } from '@/constants'
import { daysUntilDue, getUrgency, URGENCY_LABEL } from '@/utils/date'

const props = defineProps({
  item: { type: Object, required: true }
})

const category = computed(() => categoryOf(props.item.category))
const urgency = computed(() => getUrgency(props.item))
const days = computed(() => daysUntilDue(props.item))

const urgencyText = computed(() => {
  const d = days.value
  if (urgency.value === 'overdue') return `已过期 ${Math.abs(d)} 天`
  if (urgency.value === 'dueSoon') return `${d} 天后到期`
  if (urgency.value === 'normal') return `${d} 天后到期`
  return '未设置周期'
})
</script>

<template>
  <router-link :to="`/items/${item.id}`" class="item-card">
    <div class="thumb">
      <img v-if="item.photo" :src="item.photo" alt="" />
      <span v-else class="thumb-ph">{{ category.label.charAt(0) }}</span>
    </div>
    <div class="info">
      <div class="top">
        <span class="name">{{ item.name }}</span>
        <span class="tag" :style="{ background: category.color + '22', color: category.color }">
          {{ category.label }}
        </span>
      </div>
      <div v-if="item.brandModel" class="brand">{{ item.brandModel }}</div>
      <div class="bottom">
        <span class="status" :class="urgency">{{ urgencyText }}</span>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.item-card {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.15s, transform 0.15s;
}
.item-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}
.thumb {
  width: 60px;
  height: 60px;
  flex: none;
  border-radius: 10px;
  overflow: hidden;
  background: var(--bg-soft);
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.thumb-ph {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: var(--text-muted);
}
.info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.top {
  display: flex;
  align-items: center;
  gap: 8px;
}
.name {
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tag {
  flex: none;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
}
.brand {
  font-size: 12px;
  color: var(--text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bottom {
  margin-top: auto;
}
.status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 6px;
}
.status.overdue {
  background: #fef2f2;
  color: #dc2626;
}
.status.dueSoon {
  background: #fffbeb;
  color: #d97706;
}
.status.normal {
  background: #f0fdf4;
  color: #16a34a;
}
.status.none {
  background: var(--bg-soft);
  color: var(--text-muted);
}
</style>
