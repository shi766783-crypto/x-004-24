<script setup>
import { reactive } from 'vue'
import { CATEGORIES } from '@/constants'
import BaseImageUpload from '@/components/common/BaseImageUpload.vue'

const props = defineProps({
  technician: { type: Object, default: null }
})
const emit = defineEmits(['save', 'cancel'])

const form = reactive({
  name: props.technician?.name || '',
  categories: props.technician?.categories ? [...props.technician.categories] : [],
  serviceArea: props.technician?.serviceArea || '',
  priceRef: props.technician?.priceRef || '',
  phone: props.technician?.phone || '',
  intro: props.technician?.intro || '',
  certPhoto: props.technician?.certPhoto || ''
})

function toggleCategory(value) {
  const idx = form.categories.indexOf(value)
  if (idx === -1) form.categories.push(value)
  else form.categories.splice(idx, 1)
}

function submit() {
  if (!form.name.trim()) {
    alert('请填写师傅姓名')
    return
  }
  emit('save', { ...form })
}
</script>

<template>
  <form class="tech-form" @submit.prevent="submit">
    <div class="field">
      <label class="label">姓名 <em>*</em></label>
      <input v-model="form.name" class="input" placeholder="师傅姓名" />
    </div>

    <div class="field">
      <label class="label">可维修类别</label>
      <div class="cats">
        <label v-for="c in CATEGORIES" :key="c.value" class="cat" :class="{ on: form.categories.includes(c.value) }">
          <input type="checkbox" :value="c.value" @change="toggleCategory(c.value)" />
          {{ c.label }}
        </label>
      </div>
    </div>

    <div class="row">
      <div class="field">
        <label class="label">服务区域</label>
        <input v-model="form.serviceArea" class="input" placeholder="例如：朝阳区" />
      </div>
      <div class="field">
        <label class="label">联系电话</label>
        <input v-model="form.phone" class="input" placeholder="手机号" />
      </div>
    </div>

    <div class="field">
      <label class="label">收费标准参考</label>
      <input v-model="form.priceRef" class="input" placeholder="例如：上门费 50 元起" />
    </div>

    <div class="field">
      <label class="label">个人简介</label>
      <textarea v-model="form.intro" class="input" rows="3" placeholder="从业经验、擅长领域等"></textarea>
    </div>

    <div class="field">
      <label class="label">资质照片</label>
      <BaseImageUpload v-model="form.certPhoto" placeholder="上传资质" />
    </div>

    <div class="actions">
      <button type="button" class="btn" @click="emit('cancel')">取消</button>
      <button type="submit" class="btn btn-primary">保存</button>
    </div>
  </form>
</template>

<style scoped>
.tech-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.cats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.cat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: 999px;
  cursor: pointer;
  color: var(--text-muted);
}
.cat.on {
  border-color: var(--primary);
  color: var(--primary);
  background: var(--primary-soft);
}
.cat input {
  display: none;
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
