// 纯 Canvas 图表绘制工具。与组件解耦，只负责在 canvas 上绘图。
// 输入统一为 { label, value, color } 数组。

function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1
  const w = canvas.clientWidth || 200
  const h = canvas.clientHeight || 180
  canvas.width = w * dpr
  canvas.height = h * dpr
  const ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)
  return { ctx, w, h }
}

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

// 环形图（甜甜圈），opts.centerText / opts.centerSub 为中心文字
export function drawPieChart(canvas, data, opts = {}) {
  const { ctx, w, h } = setupCanvas(canvas)
  const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0)
  const cx = w / 2
  const cy = h / 2
  const r = Math.min(w, h) / 2 - 8
  const innerR = r * 0.62

  if (total <= 0) {
    ctx.beginPath()
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2)
    ctx.fillStyle = '#e2e8f0'
    ctx.fill()
    ctx.fillStyle = '#94a3b8'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('暂无数据', cx, cy + 4)
    return
  }

  let start = -Math.PI / 2
  for (const d of data) {
    const val = Number(d.value) || 0
    if (val <= 0) continue
    const angle = (val / total) * Math.PI * 2
    ctx.beginPath()
    ctx.arc(cx, cy, r, start, start + angle)
    ctx.arc(cx, cy, innerR, start + angle, start, true)
    ctx.closePath()
    ctx.fillStyle = d.color
    ctx.fill()
    start += angle
  }

  if (opts.centerText != null) {
    ctx.fillStyle = '#1e293b'
    ctx.font = 'bold 15px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(opts.centerText, cx, cy - 2)
    if (opts.centerSub) {
      ctx.fillStyle = '#94a3b8'
      ctx.font = '11px sans-serif'
      ctx.fillText(opts.centerSub, cx, cy + 14)
    }
  }
}

// 柱状图，opts.color 统一柱色
export function drawBarChart(canvas, data, opts = {}) {
  const { ctx, w, h } = setupCanvas(canvas)
  const pad = { top: 12, right: 8, bottom: 28, left: 38 }
  const max = Math.max(1, ...data.map((d) => Number(d.value) || 0))
  const chartW = w - pad.left - pad.right
  const chartH = h - pad.top - pad.bottom
  const n = Math.max(data.length, 1)
  const slot = chartW / n
  const barW = Math.min(slot * 0.6, 40)
  const color = opts.color || '#2f855a'

  ctx.font = '10px sans-serif'
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + chartH - (chartH * i) / 4
    ctx.strokeStyle = '#e2e8f0'
    ctx.beginPath()
    ctx.moveTo(pad.left, y)
    ctx.lineTo(w - pad.right, y)
    ctx.stroke()
    ctx.fillStyle = '#94a3b8'
    ctx.textAlign = 'right'
    ctx.fillText(String(Math.round((max * i) / 4)), pad.left - 6, y + 3)
  }

  data.forEach((d, i) => {
    const val = Number(d.value) || 0
    const x = pad.left + slot * i + (slot - barW) / 2
    const bh = (val / max) * chartH
    const y = pad.top + chartH - bh
    ctx.fillStyle = color
    roundRect(ctx, x, y, barW, Math.max(bh, val > 0 ? 2 : 0), 3)
    ctx.fill()
    ctx.fillStyle = '#475569'
    ctx.textAlign = 'center'
    ctx.fillText(d.label, pad.left + slot * i + slot / 2, h - 8)
  })
}
