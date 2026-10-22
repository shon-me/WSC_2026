<script setup>
// items: [{ when, title, place }]
defineProps({
  items: { type: Array, required: true },
})
</script>

<template>
  <ol class="tl">
    <li v-for="it in items" :key="`${it.when}-${it.title}`" class="tl__item">
      <span class="tl__when">{{ it.when }}</span>
      <span class="tl__title">{{ it.title }}</span>
      <span class="tl__place">{{ it.place }}</span>
    </li>
  </ol>
</template>

<style scoped>
.tl {
  margin: 0;
  padding: 0 0 0 20px;
  list-style: none;
  border-left: 2px solid rgb(var(--v-theme-primary));
}
.tl__item {
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 18px;
}
.tl__item:last-child {
  padding-bottom: 0;
}
.tl__item::before {
  content: '';
  position: absolute;
  left: -27px;
  top: 5px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgb(var(--v-theme-accent));
  border: 2px solid rgb(var(--v-theme-surface));
}
.tl__when {
  font-size: 0.85rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
}
.tl__title {
  font-weight: 700;
}
.tl__place {
  font-size: 0.95rem;
  color: rgb(var(--v-theme-on-surface), 0.7);
}
</style>