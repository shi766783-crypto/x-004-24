<script setup>
import { ref, computed } from 'vue'
import { useTechnicianStore } from '@/stores/technicians'
import { CATEGORIES } from '@/constants'
import TechnicianCard from '@/components/technician/TechnicianCard.vue'
import TechnicianForm from '@/components/technician/TechnicianForm.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const technicianStore = useTechnicianStore()

const category = ref('')
const area = ref('')
const sortBy = ref('overall')
const showForm = ref(false)

const SORT_OPTIONS = [
  { value: 'overall', label: '综合推荐' },
  { value: 'goodRate', label: '好评率' },
  { value: 'orders', label: '接单量' },
  { value: 'rating', label: '评分最高' }
]

// 各维度排序均带 tie-break：同分时参考评价数与综合信誉分，避免个别评价刷高排名
const SORT_COMPARATORS = {
  overall: (a, b) => b.score - a.score,
  goodRate: (a, b) =>
    b.goodRate - a.goodRate || b.reviewCount - a.reviewCount || b.score - a.score,
  orders: (a, b) => (b.orderCount || 0) - (a.orderCount || 0) || b.score - a.score,
  rating: (a, b) =>
    b.avgRating - a.avgRating || b.reviewCount - a.reviewCount || b.score - a.score
}

const ranked = computed(() => technicianStore.rankedTechnicians)

const filtered = computed(() => {
  const a = area.value.trim().toLowerCase()
  const list = ranked.value.filter((t) => {
    const matchCat = !category.value || (t.categories || []).includes(category.value)
    const matchArea = !a || (t.serviceArea || '').toLowerCase().includes(a)
    return matchCat && matchArea
  })
  const compare = SORT_COMPARATORS[sortBy.value] || SORT_COMPARATORS.overall
  return [...list].sort(compare)
})

function openAdd() {
  showForm.value = true
}
function onSave(payload) {
  technicianStore.addTechnician(payload)
  showForm.value = false
}
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1 class="page-title">维修师傅</h1>
        <p class="page-sub">按类别、区域筛选，多维度排序，找到靠谱的师傅</p>
      </div>
      <button class="btn btn-primary" @click="openAdd">+ 师傅入驻</button>
    </div>

    <div class="toolbar">
      <select v-model="category" class="input" style="max-width: 150px">
        <option value="">全部类别</option>
        <option v-for="c in CATEGORIES" :key="c.value" :value="c.value">{{ c.label }}</option>
      </select>
      <input v-model="area" class="input grow" placeholder="按区域筛选，例如：朝阳" />
    </div>

    <div class="sort-bar">
      <span class="sort-label">排序</span>
      <button
        v-for="opt in SORT_OPTIONS"
        :key="opt.value"
        class="sort-btn"
        :class="{ active: sortBy === opt.value }"
        @click="sortBy = opt.value"
      >
        {{ opt.label }}
      </button>
    </div>

    <div v-if="filtered.length" class="grid">
      <TechnicianCard v-for="t in filtered" :key="t.id" :technician="t" />
    </div>
    <EmptyState v-else title="没有匹配的师傅" desc="试试调整筛选条件，或邀请师傅入驻" />

    <BaseModal v-if="showForm" title="师傅入驻" @close="showForm = false">
      <TechnicianForm @save="onSave" @cancel="showForm = false" />
    </BaseModal>
  </div>
</template>

<style scoped>
.sort-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.sort-label {
  font-size: 13px;
  color: var(--text-muted);
}
.sort-btn {
  padding: 6px 14px;
  font-size: 13px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: #fff;
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.sort-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}
.sort-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}
</style>
