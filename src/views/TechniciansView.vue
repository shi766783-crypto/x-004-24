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
const showForm = ref(false)

const ranked = computed(() => technicianStore.rankedTechnicians)

const filtered = computed(() => {
  const a = area.value.trim().toLowerCase()
  return ranked.value.filter((t) => {
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
        <p class="page-sub">按类别和区域筛选，找到合适的师傅</p>
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

    <div v-if="filtered.length" class="grid">
      <TechnicianCard v-for="t in filtered" :key="t.id" :technician="t" />
    </div>
    <EmptyState v-else title="没有匹配的师傅" desc="试试调整筛选条件，或邀请师傅入驻" />

    <BaseModal v-if="showForm" title="师傅入驻" @close="showForm = false">
      <TechnicianForm @save="onSave" @cancel="showForm = false" />
    </BaseModal>
  </div>
</template>
