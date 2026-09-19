<script setup>
import { computed } from 'vue'
import { useRecordStore } from '@/stores/records'
import { useItemStore } from '@/stores/items'
import { useTechnicianStore } from '@/stores/technicians'
import { categoryOf, PALETTE } from '@/constants'
import { fmtMoney } from '@/utils/format'
import PieChart from '@/components/dashboard/PieChart.vue'
import BarChart from '@/components/dashboard/BarChart.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const recordStore = useRecordStore()
const itemStore = useItemStore()
const technicianStore = useTechnicianStore()

const year = new Date().getFullYear()

const totalCost = computed(() => recordStore.records.reduce((s, r) => s + (Number(r.cost) || 0), 0))

const maintenanceYear = computed(
  () =>
    recordStore.records.filter(
      (r) => r.type === 'maintenance' && r.date && Number(r.date.slice(0, 4)) === year
    ).length
)

const repairCount = computed(() => recordStore.records.filter((r) => r.type !== 'maintenance').length)

const avgCost = computed(() => {
  const withCost = recordStore.records.filter((r) => Number(r.cost) > 0)
  if (!withCost.length) return 0
  return totalCost.value / withCost.length
})

const categoryCost = computed(() => {
  const map = {}
  for (const r of recordStore.records) {
    const item = itemStore.itemById(r.itemId)
    if (!item) continue
    const cat = item.category
    map[cat] = (map[cat] || 0) + (Number(r.cost) || 0)
  }
  return Object.entries(map)
    .map(([value, cost]) => ({
      label: categoryOf(value).label,
      value: Math.round(cost * 100) / 100,
      color: categoryOf(value).color
    }))
    .sort((a, b) => b.value - a.value)
})

const monthlyData = computed(() => {
  const months = Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}月`, value: 0 }))
  for (const r of recordStore.records) {
    if (r.type !== 'maintenance' || !r.date) continue
    const m = Number(r.date.slice(5, 7)) - 1
    if (Number(r.date.slice(0, 4)) === year && m >= 0 && m < 12) months[m].value += 1
  }
  return months
})

const techOrders = computed(() =>
  technicianStore.rankedTechnicians
    .filter((t) => (t.orderCount || 0) > 0)
    .slice(0, 8)
    .map((t, i) => ({ label: t.name, value: t.orderCount, color: PALETTE[i % PALETTE.length] }))
)
</script>

<template>
  <div class="page">
    <div class="page-head">
      <div>
        <h1 class="page-title">统计看板</h1>
        <p class="page-sub">维修保养开销与频次一目了然</p>
      </div>
    </div>

    <section class="stats">
      <div class="stat-card">
        <div class="stat-label">总花费</div>
        <div class="stat-value accent">¥{{ fmtMoney(totalCost) }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">今年保养次数</div>
        <div class="stat-value">{{ maintenanceYear }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">维修 / 更换次数</div>
        <div class="stat-value">{{ repairCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">平均单次花费</div>
        <div class="stat-value">¥{{ fmtMoney(avgCost) }}</div>
      </div>
    </section>

    <template v-if="recordStore.records.length">
      <section class="card">
        <h3>各类别花费占比</h3>
        <PieChart :data="categoryCost" :center-text="'¥' + fmtMoney(totalCost)" center-sub="总花费" />
      </section>

      <section class="card">
        <h3>本年度每月保养次数</h3>
        <BarChart :data="monthlyData" />
      </section>

      <section v-if="techOrders.length" class="card">
        <h3>师傅接单量</h3>
        <BarChart :data="techOrders" color="#3182ce" />
      </section>
    </template>

    <EmptyState v-else title="暂无统计数据" desc="添加保养 / 维修记录后，这里会展示图表">
      <router-link to="/records" class="btn btn-primary" style="margin-top: 12px">去记录</router-link>
    </EmptyState>
  </div>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}
</style>
