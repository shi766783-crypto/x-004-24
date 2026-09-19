<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useItemStore } from '@/stores/items'
import { useRecordStore } from '@/stores/records'
import { useTechnicianStore } from '@/stores/technicians'
import { categoryOf, CYCLE_UNITS } from '@/constants'
import {
  nextDueDate,
  getUrgency,
  getWarrantyStatus,
  URGENCY_LABEL,
  WARRANTY_LABEL,
  daysUntilDue
} from '@/utils/date'
import { fmtMoney } from '@/utils/format'
import ItemForm from '@/components/item/ItemForm.vue'
import RecordForm from '@/components/record/RecordForm.vue'
import RecordCard from '@/components/record/RecordCard.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const itemStore = useItemStore()
const recordStore = useRecordStore()
const technicianStore = useTechnicianStore()

const showEdit = ref(false)
const showRecord = ref(false)

const item = computed(() => itemStore.itemById(route.params.id))
const category = computed(() => (item.value ? categoryOf(item.value.category) : null))
const records = computed(() => (item.value ? recordStore.recordsByItem(item.value.id) : []))
const unitLabel = computed(() => {
  const u = CYCLE_UNITS.find((x) => x.value === item.value?.cycleUnit)
  return u ? u.label : ''
})
const totalCost = computed(() => records.value.reduce((s, r) => s + (Number(r.cost) || 0), 0))

function techName(id) {
  const t = technicianStore.technicianById(id)
  return t ? t.name : ''
}

function onSaveItem(payload) {
  itemStore.updateItem(item.value.id, payload)
  showEdit.value = false
}
function onSaveRecord(payload) {
  recordStore.addRecord(payload)
  showRecord.value = false
}
function onDelete() {
  if (!confirm('确定删除该物品及其档案吗？')) return
  itemStore.removeItem(item.value.id)
  router.push('/items')
}
function onDeleteRecord(record) {
  if (!confirm('确定删除这条记录吗？')) return
  recordStore.removeRecord(record.id)
}
</script>

<template>
  <div v-if="item" class="page">
    <div class="page-head">
      <button class="btn btn-sm" @click="router.back()">← 返回</button>
      <div class="spacer"></div>
      <button class="btn btn-sm" @click="showEdit = true">编辑</button>
      <button class="btn btn-sm btn-danger" @click="onDelete">删除</button>
    </div>

    <section class="card detail-head">
      <div class="thumb">
        <img v-if="item.photo" :src="item.photo" alt="" />
        <span v-else>{{ category?.label.charAt(0) }}</span>
      </div>
      <div class="head-info">
        <div class="name-row">
          <h2>{{ item.name }}</h2>
          <span class="tag" :style="{ background: category?.color + '22', color: category?.color }">
            {{ category?.label }}
          </span>
        </div>
        <div v-if="item.brandModel" class="muted">{{ item.brandModel }}</div>
        <div class="status-row">
          <span class="status" :class="getUrgency(item)">{{ URGENCY_LABEL[getUrgency(item)] }}</span>
          <span v-if="nextDueDate(item)" class="muted">下次保养：{{ nextDueDate(item) }}</span>
          <span v-if="daysUntilDue(item) != null" class="muted">{{ daysUntilDue(item) >= 0 ? daysUntilDue(item) + ' 天后' : '已过期 ' + Math.abs(daysUntilDue(item)) + ' 天' }}</span>
        </div>
        <button class="btn btn-primary" @click="showRecord = true">记录保养 / 维修</button>
      </div>
    </section>

    <section class="card">
      <h3>档案信息</h3>
      <dl class="kv">
        <div><dt>购买日期</dt><dd>{{ item.purchaseDate || '—' }}</dd></div>
        <div><dt>保修截止</dt><dd>{{ item.warrantyEnd || '—' }} <span v-if="getWarrantyStatus(item) !== 'none'" class="tag" :class="getWarrantyStatus(item)">{{ WARRANTY_LABEL[getWarrantyStatus(item)] }}</span></dd></div>
        <div><dt>保养周期</dt><dd>每 {{ item.cycleValue }} {{ unitLabel }}</dd></div>
        <div><dt>上次保养</dt><dd>{{ item.lastMaintenanceDate || '—' }}</dd></div>
        <div><dt>备注</dt><dd>{{ item.notes || '—' }}</dd></div>
      </dl>
    </section>

    <section class="card">
      <h3>保养 / 维修记录（{{ records.length }}）</h3>
      <div class="record-list">
        <RecordCard
          v-for="r in records"
          :key="r.id"
          :record="r"
          :item-name="item.name"
          :technician-name="techName(r.technicianId)"
          @delete="onDeleteRecord"
        />
        <EmptyState v-if="!records.length" title="暂无记录" desc="还没有为这个物品记录任何保养或维修" />
      </div>
    </section>

    <BaseModal v-if="showEdit" title="编辑物品" @close="showEdit = false">
      <ItemForm :item="item" @save="onSaveItem" @cancel="showEdit = false" />
    </BaseModal>

    <BaseModal v-if="showRecord" title="记录保养 / 维修" @close="showRecord = false">
      <RecordForm
        :items="itemStore.items"
        :technicians="technicianStore.technicians"
        :preset-item-id="item.id"
        @save="onSaveRecord"
        @cancel="showRecord = false"
      />
    </BaseModal>
  </div>

  <EmptyState v-else title="物品不存在" desc="该物品可能已被删除">
    <router-link to="/items" class="btn btn-primary" style="margin-top: 12px">返回列表</router-link>
  </EmptyState>
</template>

<style scoped>
.spacer {
  flex: 1;
}
.detail-head {
  display: flex;
  gap: 16px;
}
.thumb {
  width: 96px;
  height: 96px;
  flex: none;
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: var(--text-muted);
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.head-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.name-row h2 {
  font-size: 20px;
}
.muted {
  color: var(--text-muted);
  font-size: 13px;
}
.status-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.status {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
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
.kv {
  margin: 0;
  display: flex;
  flex-direction: column;
}
.kv div {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid var(--bg-soft);
}
.kv div:last-child {
  border-bottom: none;
}
.kv dt {
  width: 100px;
  flex: none;
  color: var(--text-muted);
  font-weight: 400;
}
.kv dd {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}
.tag.expired,
.tag.expiringSoon {
  background: #fef2f2;
  color: #dc2626;
}
.tag.valid {
  background: #f0fdf4;
  color: #16a34a;
}
.record-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
@media (max-width: 480px) {
  .detail-head {
    flex-direction: column;
  }
}
</style>
