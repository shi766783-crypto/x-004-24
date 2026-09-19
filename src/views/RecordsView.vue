<script setup>
import { ref, computed } from 'vue'
import { useRecordStore } from '@/stores/records'
import { useItemStore } from '@/stores/items'
import { useTechnicianStore } from '@/stores/technicians'
import { RECORD_TYPES } from '@/constants'
import RecordCard from '@/components/record/RecordCard.vue'
import RecordForm from '@/components/record/RecordForm.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const recordStore = useRecordStore()
const itemStore = useItemStore()
const technicianStore = useTechnicianStore()

const typeFilter = ref('')
const showForm = ref(false)

const filtered = computed(() => {
  if (!typeFilter.value) return recordStore.records
  return recordStore.records.filter((r) => r.type === typeFilter.value)
})

function itemName(id) {
  const it = itemStore.itemById(id)
  return it ? it.name : ''
}
function techName(id) {
  const t = technicianStore.technicianById(id)
  return t ? t.name : ''
}
function onSave(payload) {
  recordStore.addRecord(payload)
  showForm.value = false
}
function onDelete(record) {
  if (!confirm('确定删除这条记录吗？')) return
  recordStore.removeRecord(record.id)
}
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1 class="page-title">保养 / 维修记录</h1>
        <p class="page-sub">共 {{ recordStore.records.length }} 条记录</p>
      </div>
      <button class="btn btn-primary" @click="showForm = true">+ 添加记录</button>
    </div>

    <div class="toolbar">
      <button
        v-for="t in [{ value: '', label: '全部' }, ...RECORD_TYPES]"
        :key="t.value"
        class="btn btn-sm"
        :class="{ 'btn-primary': typeFilter === t.value }"
        @click="typeFilter = t.value"
      >
        {{ t.label }}
      </button>
    </div>

    <div v-if="filtered.length" class="record-grid">
      <RecordCard
        v-for="r in filtered"
        :key="r.id"
        :record="r"
        :item-name="itemName(r.itemId)"
        :technician-name="techName(r.technicianId)"
        @delete="onDelete"
      />
    </div>
    <EmptyState v-else title="暂无记录" desc="记录每次保养和维修，方便回顾和统计" />

    <BaseModal v-if="showForm" title="记录保养 / 维修" @close="showForm = false">
      <RecordForm
        :items="itemStore.items"
        :technicians="technicianStore.technicians"
        @save="onSave"
        @cancel="showForm = false"
      />
    </BaseModal>
  </div>
</template>

<style scoped>
.record-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  align-items: start;
}
</style>
