// 日期工具：解析、格式化、保养周期推算、紧急程度判定。
// 所有日期在系统内统一使用 YYYY-MM-DD 字符串，跨边界用 Date 对象计算。

import { DUE_SOON_DAYS, WARRANTY_SOON_DAYS } from '@/constants'

export function todayStr() {
  return toDateStr(new Date())
}

export function toDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseDate(str) {
  if (!str) return null
  const [y, m, d] = str.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d)
}

// 在给定日期上叠加一个周期（value + unit）
export function addCycle(dateStr, value, unit) {
  const d = parseDate(dateStr)
  if (!d) return null
  const n = Number(value) || 0
  switch (unit) {
    case 'day':
      d.setDate(d.getDate() + n)
      break
    case 'week':
      d.setDate(d.getDate() + n * 7)
      break
    case 'month':
      d.setMonth(d.getMonth() + n)
      break
    case 'year':
      d.setFullYear(d.getFullYear() + n)
      break
    default:
      d.setMonth(d.getMonth() + n)
  }
  return toDateStr(d)
}

// from 到 to 的天数（to - from，可为负）
export function diffDays(fromStr, toStr) {
  const a = parseDate(fromStr)
  const b = parseDate(toStr)
  if (!a || !b) return 0
  return Math.round((b - a) / (1000 * 60 * 60 * 24))
}

// 计算物品的下次保养到期日：以上次保养日期为基准，否则以购买日期为基准。
export function nextDueDate(item) {
  const base = item.lastMaintenanceDate || item.purchaseDate
  if (!base) return null
  return addCycle(base, item.cycleValue, item.cycleUnit)
}

// 相对今天的剩余天数（负数 = 已过期）
export function daysUntilDue(item, today = todayStr()) {
  const due = nextDueDate(item)
  if (!due) return null
  return diffDays(today, due)
}

export const URGENCY_ORDER = { overdue: 0, dueSoon: 1, normal: 2, none: 3 }

export const URGENCY_LABEL = {
  overdue: '已过期',
  dueSoon: '即将到期',
  normal: '正常',
  none: '未设置周期'
}

// 紧急程度判定：已过期 > 即将到期 > 正常
export function getUrgency(item, today = todayStr(), threshold = DUE_SOON_DAYS) {
  const due = nextDueDate(item)
  if (!due) return 'none'
  const days = diffDays(today, due)
  if (days < 0) return 'overdue'
  if (days <= threshold) return 'dueSoon'
  return 'normal'
}

// 保修状态：expired / expiringSoon / valid / none
export function getWarrantyStatus(item, today = todayStr(), threshold = WARRANTY_SOON_DAYS) {
  if (!item.warrantyEnd) return 'none'
  const days = diffDays(today, item.warrantyEnd)
  if (days < 0) return 'expired'
  if (days <= threshold) return 'expiringSoon'
  return 'valid'
}

export const WARRANTY_LABEL = {
  expired: '保修已过期',
  expiringSoon: '保修即将到期',
  valid: '保修期内',
  none: ''
}
