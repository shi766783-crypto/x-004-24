<script setup>
import { computed } from 'vue'
import { categoryOf } from '@/constants'
import StarRating from '@/components/common/StarRating.vue'

const props = defineProps({
  technician: { type: Object, required: true }
})

const cats = computed(() =>
  (props.technician.categories || []).map((v) => categoryOf(v).label).join('、')
)
</script>

<template>
  <router-link :to="`/technicians/${technician.id}`" class="tech-card">
    <div class="avatar">{{ technician.name.charAt(0) }}</div>
    <div class="info">
      <div class="top">
        <span class="name">{{ technician.name }}</span>
        <span class="orders">{{ technician.orderCount || 0 }} 单</span>
      </div>
      <div class="cats">{{ cats || '未设置类别' }}</div>
      <div class="row">
        <StarRating :model-value="technician.avgRating ?? 0" readonly show-value />
        <span v-if="technician.reviewCount" class="good-rate">
          好评率 {{ Math.round((technician.goodRate || 0) * 100) }}%
        </span>
        <span class="area" v-if="technician.serviceArea">{{ technician.serviceArea }}</span>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.tech-card {
  display: flex;
  gap: 12px;
  padding: 14px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.15s, transform 0.15s;
}
.tech-card:hover {
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}
.avatar {
  width: 52px;
  height: 52px;
  flex: none;
  border-radius: 50%;
  background: var(--primary-soft);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
}
.info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.name {
  font-weight: 600;
}
.orders {
  font-size: 12px;
  color: var(--text-muted);
}
.cats {
  font-size: 13px;
  color: var(--text-muted);
}
.row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.area {
  font-size: 12px;
  color: var(--text-muted);
  background: var(--bg-soft);
  padding: 2px 8px;
  border-radius: 6px;
}
.good-rate {
  font-size: 12px;
  color: var(--primary);
  font-weight: 600;
}
</style>
