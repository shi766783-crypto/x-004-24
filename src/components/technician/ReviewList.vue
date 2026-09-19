<script setup>
import StarRating from '@/components/common/StarRating.vue'

defineProps({
  reviews: { type: Array, required: true }
})
</script>

<template>
  <div class="review-list">
    <div v-if="!reviews.length" class="hint">暂无评价</div>
    <div v-for="r in reviews" :key="r.id" class="review">
      <div class="head">
        <StarRating :model-value="r.rating" readonly />
        <span class="date">{{ r.createdAt }}</span>
      </div>
      <p v-if="r.comment" class="comment">{{ r.comment }}</p>
    </div>
  </div>
</template>

<style scoped>
.review-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.hint {
  color: var(--text-muted);
  font-size: 13px;
}
.review {
  padding: 12px;
  background: var(--bg-soft);
  border-radius: 10px;
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.date {
  font-size: 12px;
  color: var(--text-muted);
}
.comment {
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.5;
}
</style>
