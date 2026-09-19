// 成就徽章定义与判定。纯函数，仅依赖统计快照 stats，与业务层解耦。
// stats 由 computeStats 从 items / records / reviews 汇总得到。

export const BADGES = [
  { id: 'first_record', name: '首次记录', glyph: '首', color: '#3182ce', desc: '记录第一条保养或维修', check: (s) => s.recordCount >= 1 },
  { id: 'first_item', name: '物品建档', glyph: '档', color: '#2f855a', desc: '添加第一个物品档案', check: (s) => s.itemCount >= 1 },
  { id: 'on_time', name: '保养准时', glyph: '准', color: '#d69e2e', desc: '在到期日前完成一次保养', check: (s) => s.hasOnTime },
  { id: 'repair_master', name: '维修达人', glyph: '修', color: '#dd6b20', desc: '累计完成 10 次维修或更换', check: (s) => s.repairCount >= 10 },
  { id: 'maintenance_master', name: '保养达人', glyph: '养', color: '#38a169', desc: '累计完成 10 次保养', check: (s) => s.maintenanceCount >= 10 },
  { id: 'money_saver', name: '省钱能手', glyph: '省', color: '#00a3c4', desc: '完成一次花费不超过 100 元的维修', check: (s) => s.minCost > 0 && s.minCost <= 100 },
  { id: 'first_tech', name: '首次师傅', glyph: '师', color: '#805ad5', desc: '首次选择维修师傅上门', check: (s) => s.hasUsedTechnician },
  { id: 'rating_giver', name: '好评如潮', glyph: '评', color: '#e53e3e', desc: '累计给出 5 条评价', check: (s) => s.reviewCount >= 5 },
  { id: 'collector', name: '物品收藏家', glyph: '藏', color: '#c53030', desc: '累计添加 10 个物品', check: (s) => s.itemCount >= 10 },
  { id: 'meticulous', name: '细致入微', glyph: '细', color: '#b7791f', desc: '上传维修前后对比照片', check: (s) => s.hasPhotos },
  { id: 'year_keeper', name: '年度守护', glyph: '年', color: '#4a5568', desc: '本年度完成 12 次保养', check: (s) => s.yearlyMaintenance >= 12 },
  { id: 'five_star', name: '五星好评', glyph: '星', color: '#d69e2e', desc: '给出一次 5 星评价', check: (s) => s.hasFiveStar }
]

// 从原始数据汇总出判定所需的统计快照
export function computeStats(items, records, reviews) {
  const year = new Date().getFullYear()
  const stats = {
    itemCount: items.length,
    recordCount: records.length,
    repairCount: 0,
    maintenanceCount: 0,
    hasOnTime: false,
    minCost: Infinity,
    hasUsedTechnician: false,
    reviewCount: reviews.length,
    hasPhotos: false,
    yearlyMaintenance: 0,
    hasFiveStar: false
  }

  for (const r of records) {
    if (r.type === 'maintenance') {
      stats.maintenanceCount += 1
      if (r.date && Number(r.date.slice(0, 4)) === year) stats.yearlyMaintenance += 1
      if (r.onTime) stats.hasOnTime = true
    } else {
      stats.repairCount += 1
      const cost = Number(r.cost) || 0
      if (cost > 0) stats.minCost = Math.min(stats.minCost, cost)
    }
    if (r.technicianId) stats.hasUsedTechnician = true
    if (r.beforePhoto || r.afterPhoto) stats.hasPhotos = true
  }

  for (const rv of reviews) {
    if (Number(rv.rating) >= 5) stats.hasFiveStar = true
  }

  return stats
}

// 返回所有已达成条件的徽章 id
export function evaluateBadges(stats) {
  return BADGES.filter((b) => b.check(stats)).map((b) => b.id)
}

export function badgeById(id) {
  return BADGES.find((b) => b.id === id)
}
