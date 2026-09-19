<script setup>
const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '上传照片' }
})
const emit = defineEmits(['update:modelValue'])

function onChange(e) {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => emit('update:modelValue', reader.result)
  reader.readAsDataURL(file)
  e.target.value = ''
}

function clear() {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="img-upload">
    <div v-if="modelValue" class="preview">
      <img :src="modelValue" alt="预览" />
      <button type="button" class="remove" aria-label="移除" @click="clear">&times;</button>
    </div>
    <label v-else class="uploader">
      <input type="file" accept="image/*" @change="onChange" />
      <span class="plus">+</span>
      <span>{{ placeholder }}</span>
    </label>
  </div>
</template>

<style scoped>
.img-upload {
  display: flex;
}
.preview {
  position: relative;
  width: 96px;
  height: 96px;
}
.preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--border);
}
.remove {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: #e53e3e;
  color: #fff;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;
}
.uploader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 96px;
  height: 96px;
  border: 1px dashed var(--border);
  border-radius: 8px;
  color: var(--text-muted);
  font-size: 12px;
  cursor: pointer;
}
.uploader input {
  display: none;
}
.plus {
  font-size: 24px;
  line-height: 1;
}
</style>
