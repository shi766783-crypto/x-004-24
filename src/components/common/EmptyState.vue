<script setup>
defineProps({
  title: { type: String, default: '暂无数据' },
  desc: { type: String, default: '' }
})
</script>

<template>
  <div class="empty">
    <div class="empty-icon"></div>
    <p class="empty-title">{{ title }}</p>
    <p v-if="desc" class="empty-desc">{{ desc }}</p>
    <slot />
  </div>
</template>

<style scoped>
.empty {
  text-align: center;
  padding: 48px 20px;
  color: var(--text-muted);
}
.empty-icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 14px;
  border-radius: 14px;
  background: var(--bg-soft);
  position: relative;
}
.empty-icon::before {
  content: '';
  position: absolute;
  inset: 12px;
  border: 3px solid #cbd5e1;
  border-radius: 50%;
  border-top-color: transparent;
}
.empty-title {
  margin: 0;
  font-size: 15px;
  color: var(--text);
  font-weight: 600;
}
.empty-desc {
  margin: 6px 0 0;
  font-size: 13px;
}
</style>
