<script setup>
import { computed } from 'vue'
import { recordTypeOf } from '@/constants'
import { fmtMoney } from '@/utils/format'

const props = defineProps({
  record: { type: Object, required: true },
  itemName: { type: String, default: '' },
  technicianName: { type: String, default: '' }
})
const emit = defineEmits(['delete'])

const type = computed(() => recordTypeOf(props.record.type))
</script>

<template>
  <div class="record-card">
    <div class="head">
      <span class="type" :style="{ background: type.color + '22', color: type.color }">{{ type.label }}</span>
      <span class="date">{{ record.date }}</span>
      <button class="del" type="button" @click="emit('delete', record)">删除</button>
    </div>

    <div class="title">
      {{ itemName || '未知物品' }}
      <span v-if="record.onTime && record.type === 'maintenance'" class="ontime">按时</span>
    </div>

    <div v-if="record.problem" class="line"><b>问题：</b>{{ record.problem }}</div>
    <div v-if="record.solution" class="line"><b>处理：</b>{{ record.solution }}</div>

    <div class="meta">
      <span v-if="record.technicianName || technicianName" class="meta-item">
        师傅：{{ record.technicianName || technicianName }}
      </span>
      <span class="meta-item cost">花费：¥{{ fmtMoney(record.cost) }}</span>
    </div>

    <div v-if="record.beforePhoto || record.afterPhoto" class="photos">
      <img v-if="record.beforePhoto" :src="record.beforePhoto" alt="维修前" />
      <span v-if="record.beforePhoto && record.afterPhoto" class="arrow">→</span>
      <img v-if="record.afterPhoto" :src="record.afterPhoto" alt="维修后" />
    </div>
  </div>
</template>

<style scoped>
.record-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px;
}
.head {
  display: flex;
  align-items: center;
  gap: 8px;
}
.type {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
}
.date {
  font-size: 12px;
  color: var(--text-muted);
}
.del {
  margin-left: auto;
  border: none;
  background: none;
  color: #dc2626;
  font-size: 12px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s;
}
.record-card:hover .del {
  opacity: 1;
}
.title {
  font-weight: 600;
  margin: 8px 0 4px;
}
.ontime {
  font-size: 11px;
  color: #16a34a;
  background: #f0fdf4;
  padding: 1px 6px;
  border-radius: 4px;
  margin-left: 6px;
}
.line {
  font-size: 13px;
  color: var(--text);
  margin-top: 4px;
  line-height: 1.5;
}
.line b {
  color: var(--text-muted);
  font-weight: 500;
}
.meta {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  font-size: 12px;
  color: var(--text-muted);
}
.cost {
  color: #d97706;
  font-weight: 600;
}
.photos {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
}
.photos img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--border);
}
.arrow {
  color: var(--text-muted);
}
</style>
