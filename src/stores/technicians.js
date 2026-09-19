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
    }
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
