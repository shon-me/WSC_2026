<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <header class="sh">
    <h2 class="wsc-display sh__title">{{ title }}</h2>
    <p v-if="subtitle" class="sh__sub">{{ subtitle }}</p>
  </header>
</template>

<style scoped>
.sh {
  margin-bottom: 20px;
}
.sh__title {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3rem);
}
.sh__sub {
  max-width: 44rem;
  margin: 6px 0 0;
  font-size: 1.05rem;
  color: rgb(var(--v-theme-on-surface), 0.7);
}
</style>