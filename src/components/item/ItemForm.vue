<script setup>
import { reactive } from 'vue'
import { CATEGORIES, CYCLE_UNITS } from '@/constants'
import BaseImageUpload from '@/components/common/BaseImageUpload.vue'

const props = defineProps({
  item: { type: Object, default: null }
})
const emit = defineEmits(['save', 'cancel'])

const form = reactive({
  name: props.item?.name || '',
  category: props.item?.category || 'appliance',
  brandModel: props.item?.brandModel || '',
  purchaseDate: props.item?.purchaseDate || '',
  warrantyEnd: props.item?.warrantyEnd || '',
  cycleValue: props.item?.cycleValue ?? 3,
  cycleUnit: props.item?.cycleUnit || 'month',
  lastMaintenanceDate: props.item?.lastMaintenanceDate || '',
  notes: props.item?.notes || '',
  photo: props.item?.photo || ''
})

function submit() {
  if (!form.name.trim()) {
    alert('请填写物品名称')
    return
  }
  emit('save', { ...form, cycleValue: Number(form.cycleValue) || 1 })
}
</script>

<template>
  <form class="item-form" @submit.prevent="submit">
    <div class="field">
      <label class="label">物品名称 <em>*</em></label>
      <input v-model="form.name" class="input" placeholder="例如：客厅空调" />
    </div>

    <div class="field">
      <label class="label">类别</label>
      <select v-model="form.category" class="input">
        <option v-for="c in CATEGORIES" :key="c.value" :value="c.value">{{ c.label }}</option>
      </select>
    </div>

    <div class="field">
      <label class="label">品牌型号</label>
      <input v-model="form.brandModel" class="input" placeholder="例如：格力 KFR-35GW" />
    </div>

    <div class="row">
      <div class="field">
        <label class="label">购买日期</label>
        <input v-model="form.purchaseDate" type="date" class="input" />
      </div>
      <div class="field">
        <label class="label">保修截止日期</label>
        <input v-model="form.warrantyEnd" type="date" class="input" />
      </div>
    </div>

    <div class="row">
      <div class="field">
        <label class="label">保养周期</label>
        <div class="cycle">
          <input v-model.number="form.cycleValue" type="number" min="1" class="input cycle-value" />
          <select v-model="form.cycleUnit" class="input">
            <option v-for="u in CYCLE_UNITS" :key="u.value" :value="u.value">{{ u.label }}</option>
          </select>
        </div>
      </div>
      <div class="field">
        <label class="label">上次保养日期</label>
        <input v-model="form.lastMaintenanceDate" type="date" class="input" />
      </div>
    </div>

    <div class="field">
      <label class="label">备注</label>
      <textarea v-model="form.notes" class="input" rows="2" placeholder="其他说明"></textarea>
    </div>

    <div class="field">
      <label class="label">物品照片</label>
      <BaseImageUpload v-model="form.photo" placeholder="上传照片" />
    </div>

    <div class="actions">
      <button type="button" class="btn" @click="emit('cancel')">取消</button>
      <button type="submit" class="btn btn-primary">保存</button>
    </div>
  </form>
</template>

<style scoped>
.item-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.cycle {
  display: flex;
  gap: 8px;
}
.cycle-value {
  width: 90px;
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
