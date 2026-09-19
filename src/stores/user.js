import { defineStore } from 'pinia'
import { itemRepo, recordRepo, reviewRepo, userRepo } from '@/services/db'
import { BADGES, computeStats, evaluateBadges } from '@/utils/badges'

export const useUserStore = defineStore('user', {
  state: () => ({
    unlocked: userRepo.get()
  }),
  getters: {
    unlockedCount: (s) => s.unlocked.length,
    allBadges: (s) => BADGES.map((b) => ({ ...b, unlocked: s.unlocked.includes(b.id) }))
  },
  actions: {
    // 汇总数据后统一判定成就，只追加新解锁项并持久化
    refreshAchievements() {
      const stats = computeStats(itemRepo.get(), recordRepo.get(), reviewRepo.get())
      const earned = evaluateBadges(stats)
      const newly = earned.filter((id) => !this.unlocked.includes(id))
      if (newly.length) {
        this.unlocked = [...this.unlocked, ...newly]
        userRepo.set(this.unlocked)
      }
    }
  }
})
