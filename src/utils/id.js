// 生成唯一 ID（前缀 + 时间戳 + 随机串），无外部依赖。
export function uid(prefix = 'id_') {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`
}
