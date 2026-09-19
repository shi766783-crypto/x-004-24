// 纯格式化工具：金额展示。
export function fmtMoney(value) {
  const n = Number(value) || 0
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}
