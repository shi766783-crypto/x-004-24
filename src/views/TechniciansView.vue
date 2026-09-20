<script setup>
import { ref, computed } from 'vue'
import { useTechnicianStore, TECH_SORT_OPTIONS } from '@/stores/technicians'
import { CATEGORIES } from '@/constants'
import TechnicianCard from '@/components/technician/TechnicianCard.vue'
import TechnicianForm from '@/components/technician/TechnicianForm.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const technicianStore = useTechnicianStore()

const category = ref('')
const area = ref('')
const sort = ref('composite')
const showForm = ref(false)

const filtered = computed(() => {
  const a = area.value.trim().toLowerCase()
  return technicianStore.sortedTechnicians(sort.value).filter((t) => {
    const matchCat = !category.value || (t.categories || []).includes(category.value)
    const matchArea = !a || (t.serviceArea || '').toLowerCase().includes(a)
    return matchCat && matchArea
  })
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
        <p class="page-sub">按类别和区域筛选，按口碑排序，找到靠谱的师傅</p>
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

    <div class="toolbar sort-bar">
      <span class="sort-label">排序</span>
      <button
        v-for="o in TECH_SORT_OPTIONS"
        :key="o.value"
        class="btn btn-sm"
        :class="{ 'btn-primary': sort === o.value }"
        @click="sort = o.value"
      >
        {{ o.label }}
      </button>
    </div>

    <div v-if="filtered.length" class="grid">
      <TechnicianCard v-for="t in filtered" :key="t.id" :technician="t" />
    </div>
    <EmptyState v-else title="没有匹配的师傅" desc="试试调整筛选或排序条件，或邀请师傅入驻" />

    <BaseModal v-if="showForm" title="师傅入驻" @close="showForm = false">
      <TechnicianForm @save="onSave" @cancel="showForm = false" />
    </BaseModal>
  </div>
</template>

<style scoped>
.sort-bar {
  gap: 8px;
}
.sort-label {
  font-size: 13px;
  color: var(--text-muted);
  margin-right: 2px;
}
</style>
