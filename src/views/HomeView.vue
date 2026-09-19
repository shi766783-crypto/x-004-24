<script setup>
import { ref, computed } from 'vue'
import { useItemStore } from '@/stores/items'
import { useRecordStore } from '@/stores/records'
import { useTechnicianStore } from '@/stores/technicians'
import { getUrgency } from '@/utils/date'
import { fmtMoney } from '@/utils/format'
import ReminderList from '@/components/reminder/ReminderList.vue'
import RecordForm from '@/components/record/RecordForm.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const itemStore = useItemStore()
const recordStore = useRecordStore()
const technicianStore = useTechnicianStore()

const showRecord = ref(false)
const presetItemId = ref('')

const overdueCount = computed(() => itemStore.items.filter((i) => getUrgency(i) === 'overdue').length)
const dueSoonCount = computed(() => itemStore.items.filter((i) => getUrgency(i) === 'dueSoon').length)

const monthCost = computed(() => {
  const now = new Date()
  const m = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  return recordStore.records
    .filter((r) => r.date && r.date.startsWith(m))
    .reduce((s, r) => s + (Number(r.cost) || 0), 0)
})

function openRecord(item) {
  presetItemId.value = item.id
  showRecord.value = true
}
function openNewRecord() {
  presetItemId.value = ''
  showRecord.value = true
}
function onSave(payload) {
  recordStore.addRecord(payload)
  showRecord.value = false
}
</script>

<template>
  <div class="page">
    <section class="hero">
      <div>
        <h1 class="hero-title">欢迎回来</h1>
        <p class="hero-sub">今天有 {{ overdueCount + dueSoonCount }} 项需要关注</p>
      </div>
      <button class="btn btn-primary" @click="openNewRecord">+ 记录保养/维修</button>
    </section>

    <section class="stats">
      <div class="stat-card">
        <div class="stat-label">物品总数</div>
        <div class="stat-value">{{ itemStore.items.length }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">已过期</div>
        <div class="stat-value" style="color: #dc2626">{{ overdueCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">即将到期</div>
        <div class="stat-value" style="color: #d97706">{{ dueSoonCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">本月花费</div>
        <div class="stat-value accent">¥{{ fmtMoney(monthCost) }}</div>
      </div>
    </section>

    <section class="card">
      <h3>待保养 / 待维修提醒</h3>
      <ReminderList v-if="itemStore.items.length" :items="itemStore.items" @maintain="openRecord" />
      <EmptyState v-else title="还没有物品档案" desc="添加第一个物品，系统会自动为你生成保养提醒">
        <router-link to="/items" class="btn btn-primary" style="margin-top: 12px">去添加物品</router-link>
      </EmptyState>
    </section>

    <BaseModal v-if="showRecord" title="记录保养 / 维修" @close="showRecord = false">
      <RecordForm
        :items="itemStore.items"
        :technicians="technicianStore.technicians"
        :preset-item-id="presetItemId"
        @save="onSave"
        @cancel="showRecord = false"
      />
    </BaseModal>
  </div>
</template>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--primary), #38a169);
  color: #fff;
  border-radius: 14px;
  padding: 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.hero-title {
  font-size: 20px;
}
.hero-sub {
  margin: 4px 0 0;
  opacity: 0.9;
  font-size: 13px;
}
.hero .btn-primary {
  background: #fff;
  color: var(--primary);
  border-color: #fff;
}
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}
</style>
