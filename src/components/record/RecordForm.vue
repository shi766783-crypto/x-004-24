<script setup>
import { reactive, computed, ref } from 'vue'
import { RECORD_TYPES } from '@/constants'
import { todayStr } from '@/utils/date'
import BaseImageUpload from '@/components/common/BaseImageUpload.vue'

const props = defineProps({
  items: { type: Array, required: true },
  technicians: { type: Array, required: true },
  presetItemId: { type: String, default: '' }
})
const emit = defineEmits(['save', 'cancel'])

const useLibrary = ref(true)

const form = reactive({
  itemId: props.presetItemId || '',
  date: todayStr(),
  type: 'maintenance',
  problem: '',
  solution: '',
  cost: '',
  technicianId: '',
  technicianName: '',
  beforePhoto: '',
  afterPhoto: ''
})

const itemsWithDue = computed(() =>
  props.items.map((i) => ({
    ...i,
    label: i.name + (i.brandModel ? `（${i.brandModel}）` : '')
  }))
)

function submit() {
  if (!form.itemId) {
    alert('请选择物品')
    return
  }
  if (!form.date) {
    alert('请选择日期')
    return
  }
  const payload = {
    ...form,
    cost: Number(form.cost) || 0,
    technicianId: useLibrary.value ? form.technicianId : '',
    technicianName: useLibrary.value ? '' : form.technicianName.trim()
  }
  emit('save', payload)
}
</script>

<template>
  <form class="record-form" @submit.prevent="submit">
    <div class="field">
      <label class="label">物品 <em>*</em></label>
      <select v-model="form.itemId" class="input">
        <option value="" disabled>请选择物品</option>
        <option v-for="i in itemsWithDue" :key="i.id" :value="i.id">{{ i.label }}</option>
      </select>
    </div>

    <div class="row">
      <div class="field">
        <label class="label">日期 <em>*</em></label>
        <input v-model="form.date" type="date" class="input" />
      </div>
      <div class="field">
        <label class="label">类型</label>
        <select v-model="form.type" class="input">
          <option v-for="t in RECORD_TYPES" :key="t.value" :value="t.value">{{ t.label }}</option>
        </select>
      </div>
    </div>

    <div class="field">
      <label class="label">问题描述</label>
      <textarea v-model="form.problem" class="input" rows="2" placeholder="出现了什么问题"></textarea>
    </div>

    <div class="field">
      <label class="label">处理方式</label>
      <textarea v-model="form.solution" class="input" rows="2" placeholder="如何处理的"></textarea>
    </div>

    <div class="field">
      <label class="label">花费金额（元）</label>
      <input v-model="form.cost" type="number" min="0" step="0.01" class="input" placeholder="0" />
    </div>

    <div class="field">
      <label class="label">维修师傅</label>
      <div class="tech-switch">
        <label class="radio"><input type="radio" :value="true" v-model="useLibrary" /> 从师傅库选择</label>
        <label class="radio"><input type="radio" :value="false" v-model="useLibrary" /> 手动输入</label>
      </div>
      <select v-if="useLibrary" v-model="form.technicianId" class="input">
        <option value="">（未选择师傅）</option>
        <option v-for="t in technicians" :key="t.id" :value="t.id">{{ t.name }}</option>
      </select>
      <input v-else v-model="form.technicianName" class="input" placeholder="师傅姓名" />
    </div>

    <div class="row">
      <div class="field">
        <label class="label">维修前照片</label>
        <BaseImageUpload v-model="form.beforePhoto" placeholder="维修前" />
      </div>
      <div class="field">
        <label class="label">维修后照片</label>
        <BaseImageUpload v-model="form.afterPhoto" placeholder="维修后" />
      </div>
    </div>

    <div class="actions">
      <button type="button" class="btn" @click="emit('cancel')">取消</button>
      <button type="submit" class="btn btn-primary">保存记录</button>
    </div>
  </form>
</template>

<style scoped>
.record-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.tech-switch {
  display: flex;
  gap: 16px;
  margin-bottom: 8px;
}
.radio {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text);
  cursor: pointer;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
em {
  color: #e53e3e;
  font-style: normal;
}
@media (max-width: 480px) {
  .row {
    grid-template-columns: 1fr;
  }
}
</style>
