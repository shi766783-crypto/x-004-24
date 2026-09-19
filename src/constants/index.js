// 全局业务常量：类别、记录类型、保养周期单位、图表配色
// 集中定义，供各层复用，避免魔法字符串散落各处。

export const CATEGORIES = [
  { value: 'appliance', label: '家电', color: '#3182ce' },
  { value: 'furniture', label: '家具', color: '#d69e2e' },
  { value: 'vehicle', label: '交通工具', color: '#805ad5' },
  { value: 'plumbing', label: '水电设施', color: '#00a3c4' },
  { value: 'other', label: '其他', color: '#718096' }
]

export const RECORD_TYPES = [
  { value: 'maintenance', label: '保养', color: '#2f855a' },
  { value: 'repair', label: '维修', color: '#dd6b20' },
  { value: 'replacement', label: '更换', color: '#e53e3e' }
]

export const CYCLE_UNITS = [
  { value: 'day', label: '天' },
  { value: 'month', label: '个月' },
  { value: 'year', label: '年' }
]

// 图表与徽章通用配色
export const PALETTE = [
  '#2f855a',
  '#3182ce',
  '#d69e2e',
  '#e53e3e',
  '#805ad5',
  '#00a3c4',
  '#dd6b20',
  '#38a169',
  '#718096',
  '#c53030'
]

// 即将到期提醒的阈值（天数）
export const DUE_SOON_DAYS = 7
// 保修即将到期的提醒阈值（天数）
export const WARRANTY_SOON_DAYS = 30

export function categoryOf(value) {
  return CATEGORIES.find((c) => c.value === value) || CATEGORIES[CATEGORIES.length - 1]
}

export function recordTypeOf(value) {
  return RECORD_TYPES.find((t) => t.value === value) || RECORD_TYPES[0]
}
