<script setup>
import { ref, computed } from 'vue'
import { useTechnicianStore } from '@/stores/technicians'
import { useItemStore } from '@/stores/items'
import { useRecordStore } from '@/stores/records'
import { categoryOf } from '@/constants'
import StarRating from '@/components/common/StarRating.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const technicianStore = useTechnicianStore()
const itemStore = useItemStore()
const recordStore = useRecordStore()

const tab = ref('tech')

const rankedTechs = computed(() => technicianStore.rankedTechnicians)

const rankedKeepers = computed(() => {
  return itemStore.items
    .map((i) => {
      const onTimeCount = recordStore.records.filter(
        (r) => r.itemId === i.id && r.type === 'maintenance' && r.onTime
      ).length
      return { ...i, onTimeCount }
    })
    .sort((a, b) => b.onTimeCount - a.onTimeCount)
})

function medalStyle(i) {
  if (i === 0) return { background: '#f6c343', color: '#7c5a00' }
  if (i === 1) return { background: '#cbd5e1', color: '#475569' }
  if (i === 2) return { background: '#e8a06c', color: '#7c3a00' }
  return { background: 'var(--bg-soft)', color: 'var(--text-muted)' }
}
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1 class="page-title">排行榜</h1>
        <p class="page-sub">看看谁是最值得信赖的师傅，谁是最会保养的达人</p>
      </div>
    </div>

    <div class="tabs">
      <button class="btn" :class="{ 'btn-primary': tab === 'tech' }" @click="tab = 'tech'">
        金牌维修师傅榜
      </button>
      <button class="btn" :class="{ 'btn-primary': tab === 'keeper' }" @click="tab = 'keeper'">
        保养达人榜
      </button>
    </div>

    <!-- 金牌师傅榜 -->
    <template v-if="tab === 'tech'">
      <div v-if="rankedTechs.length" class="rank-list">
        <div v-for="(t, i) in rankedTechs" :key="t.id" class="rank-item">
          <span class="medal" :style="medalStyle(i)">{{ i + 1 }}</span>
          <router-link :to="`/technicians/${t.id}`" class="rank-main">
            <div class="rank-head">
              <span class="name">{{ t.name }}</span>
              <span class="score">信誉分 {{ Math.round(t.score) }}</span>
            </div>
            <div class="rank-meta">
              <StarRating :model-value="t.avgRating" readonly />
              <span class="muted">好评率 {{ Math.round(t.goodRate * 100) }}% · {{ t.reviewCount }} 条评价 · {{ t.orderCount || 0 }} 单</span>
            </div>
          </router-link>
        </div>
      </div>
      <EmptyState v-else title="还没有师傅入驻" desc="邀请师傅入驻后即可查看排行榜" />
    </template>

    <!-- 保养达人榜 -->
    <template v-else>
      <div v-if="rankedKeepers.length" class="rank-list">
        <div v-for="(it, i) in rankedKeepers" :key="it.id" class="rank-item">
          <span class="medal" :style="medalStyle(i)">{{ i + 1 }}</span>
          <router-link :to="`/items/${it.id}`" class="rank-main">
            <div class="rank-head">
              <span class="name">{{ it.name }}</span>
              <span class="tag">{{ categoryOf(it.category).label }}</span>
            </div>
            <div class="rank-meta">
              <span class="muted">按时保养 {{ it.onTimeCount }} 次</span>
            </div>
          </router-link>
        </div>
      </div>
      <EmptyState v-else title="还没有物品档案" desc="添加物品并按时保养，登上达人榜" />
    </template>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: 10px;
}
.rank-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.rank-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
}
.medal {
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}
.rank-main {
  flex: 1;
  min-width: 0;
  text-decoration: none;
  color: inherit;
}
.rank-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.name {
  font-weight: 600;
}
.score {
  font-size: 12px;
  color: var(--primary);
  font-weight: 600;
}
.tag {
  font-size: 12px;
  color: var(--text-muted);
}
.rank-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
  flex-wrap: wrap;
}
.muted {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
