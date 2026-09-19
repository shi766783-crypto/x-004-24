import { defineStore } from 'pinia'
import { itemRepo } from '@/services/db'
import { uid } from '@/utils/id'
import { todayStr } from '@/utils/date'

export const useItemStore = defineStore('items', {
  state: () => ({
    items: itemRepo.get()
  }),
  getters: {
    itemById: (state) => (id) => state.items.find((i) => i.id === id)
  },
  actions: {
    addItem(payload) {
      const item = { id: uid('it_'), createdAt: todayStr(), ...payload }
      this.items.unshift(item)
      itemRepo.set(this.items)
      return item
    },
    updateItem(id, payload) {
      const idx = this.items.findIndex((i) => i.id === id)
      if (idx === -1) return
      this.items[idx] = { ...this.items[idx], ...payload, id }
      itemRepo.set(this.items)
    },
    removeItem(id) {
      this.items = this.items.filter((i) => i.id !== id)
      itemRepo.set(this.items)
    },
    // 维护/更换类记录完成后，刷新物品的"上次保养日期"
    applyMaintenance(id, date) {
      const item = this.items.find((i) => i.id === id)
      if (!item) return
      if (!item.lastMaintenanceDate || date > item.lastMaintenanceDate) {
        item.lastMaintenanceDate = date
      }
      itemRepo.set(this.items)
    }
  }
})
