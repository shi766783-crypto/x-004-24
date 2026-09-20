import { defineStore } from 'pinia'
import { technicianRepo, reviewRepo } from '@/services/db'
import { uid } from '@/utils/id'
import { todayStr } from '@/utils/date'

// 汇总某个师傅的评价：数量、均分、好评率（4/5 星占比）
function summarizeRatings(reviews, id) {
  const revs = reviews.filter((r) => r.technicianId === id)
  const count = revs.length
  const avg = count ? revs.reduce((s, r) => s + Number(r.rating), 0) / count : 0
  const good = revs.filter((r) => Number(r.rating) >= 4).length
  return { count, avg, goodRate: count ? good / count : 0 }
}

// 信誉分公式：好评率 * 70 + 接单量(封顶 30)
function reputationScore(goodRate, orderCount) {
  return goodRate * 70 + Math.min(orderCount || 0, 30)
}

// 排序维度定义：value 与 sortTechnicians 中的分支对应
export const TECH_SORT_OPTIONS = [
  { value: 'composite', label: '综合推荐' },
  { value: 'goodRate', label: '好评率' },
  { value: 'orders', label: '接单量' },
  { value: 'rating', label: '评分' }
]

// 排序时认为评价样本足够的阈值，低于该值的好评率需要按样本量打折，
// 避免只有一两条五星评价的新师傅排在资深师傅前面
const ENOUGH_REVIEWS = 5

// 依据好评率与评价数估算贝叶斯式的稳健好评率：样本不足时向均值 0.8 收缩
function reliableGoodRate(goodRate, reviewCount) {
  const n = reviewCount || 0
  return (goodRate * n + 0.8 * ENOUGH_REVIEWS) / (n + ENOUGH_REVIEWS)
}

// 同理估算稳健评分：样本不足时向基准分 4.0 收缩
function reliableRating(avgRating, reviewCount) {
  const n = reviewCount || 0
  return (avgRating * n + 4.0 * ENOUGH_REVIEWS) / (n + ENOUGH_REVIEWS)
}

// 各维度的平局兜底顺序，保证排序结果稳定且始终综合考虑口碑与接单情况
function compareBy(primary) {
  return (a, b) => {
    for (const key of [primary, 'avgRating', 'reviewCount', 'orderCount']) {
      const diff = (b[key] || 0) - (a[key] || 0)
      if (diff !== 0) return diff
    }
    return 0
  }
}

export function sortTechnicians(list, sort) {
  const decorated = list.map((t) => ({
    ...t,
    reliableGoodRate: reliableGoodRate(t.goodRate || 0, t.reviewCount || 0),
    reliableRating: reliableRating(t.avgRating || 0, t.reviewCount || 0)
  }))
  switch (sort) {
    case 'goodRate':
      // 好评率优先：用样本量修正后的好评率，平局再看评分与接单
      decorated.sort(compareBy('reliableGoodRate'))
      break
    case 'orders':
      // 接单量优先：同单量时好评率高者靠前
      decorated.sort((a, b) => {
        const diff = (b.orderCount || 0) - (a.orderCount || 0)
        if (diff !== 0) return diff
        return compareBy('reliableGoodRate')(a, b)
      })
      break
    case 'rating':
      // 评分优先：用样本量修正后的评分，避免个别五星刷上榜，平局再看好评率
      decorated.sort((a, b) => {
        const diff = b.reliableRating - a.reliableRating
        if (Math.abs(diff) > 0.001) return diff
        return compareBy('reliableGoodRate')(a, b)
      })
      break
    case 'composite':
    default:
      // 综合推荐：信誉分本身即好评率 + 接单量的加权
      decorated.sort(compareBy('score'))
      break
  }
  return decorated
}

export const useTechnicianStore = defineStore('technicians', {
  state: () => ({
    technicians: technicianRepo.get(),
    reviews: reviewRepo.get()
  }),
  getters: {
    technicianById: (state) => (id) => state.technicians.find((t) => t.id === id),
    reviewsOf: (state) => (id) => state.reviews.filter((r) => r.technicianId === id),
    ratingSummary: (state) => (id) => summarizeRatings(state.reviews, id),
    reputation: (state) => (id) => {
      const tech = state.technicians.find((t) => t.id === id)
      const { goodRate } = summarizeRatings(state.reviews, id)
      return reputationScore(goodRate, tech?.orderCount || 0)
    },
    rankedTechnicians(state) {
      return [...state.technicians]
        .map((t) => {
          const s = summarizeRatings(state.reviews, t.id)
          return {
            ...t,
            reviewCount: s.count,
            avgRating: s.avg,
            goodRate: s.goodRate,
            score: reputationScore(s.goodRate, t.orderCount || 0)
          }
        })
        .sort((a, b) => b.score - a.score)
    },
    // 按指定维度排序的师傅列表，默认走综合信誉分
    sortedTechnicians: (state) => (sort = 'composite') =>
      sortTechnicians(
        state.technicians.map((t) => {
          const s = summarizeRatings(state.reviews, t.id)
          return {
            ...t,
            reviewCount: s.count,
            avgRating: s.avg,
            goodRate: s.goodRate,
            score: reputationScore(s.goodRate, t.orderCount || 0)
          }
        }),
        sort
      )
  },
  actions: {
    addTechnician(payload) {
      const tech = { id: uid('tech_'), createdAt: todayStr(), orderCount: 0, ...payload }
      this.technicians.unshift(tech)
      technicianRepo.set(this.technicians)
      return tech
    },
    updateTechnician(id, payload) {
      const idx = this.technicians.findIndex((t) => t.id === id)
      if (idx === -1) return
      this.technicians[idx] = { ...this.technicians[idx], ...payload, id }
      technicianRepo.set(this.technicians)
    },
    removeTechnician(id) {
      this.technicians = this.technicians.filter((t) => t.id !== id)
      technicianRepo.set(this.technicians)
    },
    incrementOrder(id) {
      const tech = this.technicians.find((t) => t.id === id)
      if (!tech) return
      tech.orderCount = (tech.orderCount || 0) + 1
      technicianRepo.set(this.technicians)
    },
    addReview(payload) {
      const review = { id: uid('rev_'), createdAt: todayStr(), ...payload }
      this.reviews.unshift(review)
      reviewRepo.set(this.reviews)
      return review
    }
  }
})
