<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { drawBarChart } from '@/utils/charts'

const props = defineProps({
  data: { type: Array, required: true },
  color: { type: String, default: '' }
})

const canvas = ref(null)
let observer = null

function redraw() {
  if (!canvas.value) return
  drawBarChart(canvas.value, props.data, { color: props.color })
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
  <canvas ref="canvas"></canvas>
</template>

<style scoped>
canvas {
  width: 100%;
  height: 220px;
}
</style>
