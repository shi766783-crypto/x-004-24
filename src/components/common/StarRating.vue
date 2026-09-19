<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  readonly: { type: Boolean, default: false },
  showValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

const hover = ref(0)
const display = computed(() => hover.value || props.modelValue || 0)

function set(n) {
  if (props.readonly) return
  emit('update:modelValue', n)
}
</script>

<template>
  <div class="stars" :class="{ readonly }">
    <button
      v-for="n in 5"
      :key="n"
      type="button"
      class="star"
      :class="{ on: n <= display }"
      :disabled="readonly"
      @click="set(n)"
      @mouseenter="!readonly && (hover = n)"
      @mouseleave="hover = 0"
    >
      <svg viewBox="0 0 24 24">
        <path d="M12 2l2.9 6.26 6.6.6-5 4.4 1.5 6.5L12 16.9 6 19.76l1.5-6.5-5-4.4 6.6-.6z" />
      </svg>
    </button>
    <span v-if="showValue" class="val">{{ (modelValue || 0).toFixed(1) }}</span>
  </div>
</template>

<style scoped>
.stars {
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
.star {
  border: none;
  background: none;
  padding: 2px;
  cursor: pointer;
  line-height: 0;
}
.star:disabled {
  cursor: default;
}
.star svg {
  width: 20px;
  height: 20px;
  fill: #e2e8f0;
  transition: fill 0.12s, transform 0.12s;
}
.star:not(:disabled):hover svg {
  transform: scale(1.1);
}
.star.on svg {
  fill: #f6ad55;
}
.val {
  margin-left: 6px;
  font-size: 13px;
  color: var(--text-muted);
}
</style>
