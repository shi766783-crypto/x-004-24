<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTechnicianStore } from '@/stores/technicians'
import { categoryOf } from '@/constants'
import StarRating from '@/components/common/StarRating.vue'
import ReviewList from '@/components/technician/ReviewList.vue'
import TechnicianForm from '@/components/technician/TechnicianForm.vue'
import BaseModal from '@/components/common/BaseModal.vue'
import EmptyState from '@/components/common/EmptyState.vue'

const route = useRoute()
const router = useRouter()
const technicianStore = useTechnicianStore()

const showEdit = ref(false)
const rating = ref(0)
const comment = ref('')

const tech = computed(() => technicianStore.technicianById(route.params.id))
const summary = computed(() => (tech.value ? technicianStore.ratingSummary(tech.value.id) : null))
const reviews = computed(() => (tech.value ? technicianStore.reviewsOf(tech.value.id) : []))
const cats = computed(() => (tech.value?.categories || []).map((v) => categoryOf(v).label))
const score = computed(() => (tech.value ? Math.round(technicianStore.reputation(tech.value.id)) : 0))

function submitReview() {
  if (rating.value < 1) {
    alert('请先打分')
    return
  }
  technicianStore.addReview({
    technicianId: tech.value.id,
    rating: rating.value,
    comment: comment.value.trim()
  })
  rating.value = 0
  comment.value = ''
}
function onSave(payload) {
  technicianStore.updateTechnician(tech.value.id, payload)
  showEdit.value = false
}
function onDelete() {
  if (!confirm('确定删除该师傅吗？')) return
  technicianStore.removeTechnician(tech.value.id)
  router.push('/technicians')
}
</script>

<template>
  <div v-if="tech" class="page">
    <div class="page-head">
      <button class="btn btn-sm" @click="router.back()">← 返回</button>
      <div class="spacer"></div>
      <button class="btn btn-sm" @click="showEdit = true">编辑</button>
      <button class="btn btn-sm btn-danger" @click="onDelete">删除</button>
    </div>

    <section class="card detail-head">
      <div class="avatar">{{ tech.name.charAt(0) }}</div>
      <div class="head-info">
        <div class="name-row">
          <h2>{{ tech.name }}</h2>
          <span class="score">信誉分 {{ score }}</span>
        </div>
        <div class="cats">{{ cats.join('、') || '未设置类别' }}</div>
        <div class="rating-row">
          <StarRating :model-value="summary.avg" readonly show-value />
          <span class="muted">{{ summary.count }} 条评价 · 好评率 {{ Math.round(summary.goodRate * 100) }}%</span>
        </div>
        <div class="meta-row">
          <span v-if="tech.serviceArea" class="meta">区域：{{ tech.serviceArea }}</span>
          <span v-if="tech.priceRef" class="meta">收费：{{ tech.priceRef }}</span>
          <span class="meta">接单：{{ tech.orderCount || 0 }} 单</span>
        </div>
        <a v-if="tech.phone" class="btn btn-primary" :href="'tel:' + tech.phone">拨打电话 {{ tech.phone }}</a>
      </div>
    </section>

    <section v-if="tech.intro || tech.certPhoto" class="card">
      <h3>简介与资质</h3>
      <p v-if="tech.intro" class="intro">{{ tech.intro }}</p>
      <img v-if="tech.certPhoto" :src="tech.certPhoto" class="cert" alt="资质照片" />
    </section>

    <section class="card">
      <h3>评价（{{ summary.count }}）</h3>
      <ReviewList :reviews="reviews" />
    </section>

    <section class="card">
      <h3>评价师傅</h3>
      <div class="rate-form">
        <StarRating v-model="rating" />
        <textarea v-model="comment" class="input" rows="2" placeholder="写下你的评价（可选）"></textarea>
        <button class="btn btn-primary" @click="submitReview">提交评价</button>
      </div>
    </section>

    <BaseModal v-if="showEdit" title="编辑师傅" @close="showEdit = false">
      <TechnicianForm :technician="tech" @save="onSave" @cancel="showEdit = false" />
    </BaseModal>
  </div>

  <EmptyState v-else title="师傅不存在" desc="该师傅可能已被删除">
    <router-link to="/technicians" class="btn btn-primary" style="margin-top: 12px">返回列表</router-link>
  </EmptyState>
</template>

<style scoped>
.spacer {
  flex: 1;
}
.detail-head {
  display: flex;
  gap: 16px;
}
.avatar {
  width: 72px;
  height: 72px;
  flex: none;
  border-radius: 50%;
  background: var(--primary-soft);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 700;
}
.head-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.name-row h2 {
  font-size: 20px;
}
.score {
  font-size: 12px;
  background: var(--primary-soft);
  color: var(--primary);
  padding: 3px 10px;
  border-radius: 999px;
  font-weight: 600;
}
.cats {
  font-size: 13px;
  color: var(--text-muted);
}
.rating-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.muted {
  font-size: 12px;
  color: var(--text-muted);
}
.meta-row {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}
.meta {
  font-size: 12px;
  color: var(--text-muted);
  background: var(--bg-soft);
  padding: 3px 10px;
  border-radius: 6px;
}
.intro {
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 12px;
}
.cert {
  max-width: 220px;
  border-radius: 10px;
  border: 1px solid var(--border);
}
.rate-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.rate-form .btn {
  align-self: flex-start;
}
@media (max-width: 480px) {
  .detail-head {
    flex-direction: column;
  }
}
</style>
