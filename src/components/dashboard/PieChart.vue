<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { drawPieChart } from '@/utils/charts'

const props = defineProps({
  data: { type: Array, required: true },
  centerText: { type: String, default: '' },
  centerSub: { type: String, default: '' }
})

const canvas = ref(null)
let observer = null

function redraw() {
  if (!canvas.value) return
  drawPieChart(canvas.value, props.data, {
    centerText: props.centerText,
    centerSub: props.centerSub
  })
}

onMounted(() => {
  redraw()
  if (window.ResizeObserver) {
    observer = new ResizeObserver(redraw)
    observer.observe(canvas.value.parentElement)
  }
})
onBeforeUnmount(() => observer && observer.disconnect())
watch(() => props.data, redraw, { deep: true })
</script>

<template>
  <div class="pie-chart">
    <canvas ref="canvas"></canvas>
    <ul class="legend">
      <li v-for="d in data" :key="d.label">
        <span class="dot" :style="{ background: d.color }"></span>
        <span class="label">{{ d.label }}</span>
        <span class="value">{{ d.value }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.pie-chart {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
canvas {
  width: 100%;
  height: 180px;
}
.legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.legend li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex: none;
}
.label {
  flex: 1;
  color: var(--text-muted);
}
.value {
  font-weight: 600;
}
</style>
