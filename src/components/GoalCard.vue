<script setup>
// goal: { icon, title, text, proof }
defineProps({
  goal: { type: Object, required: true },
})
</script>

<template>
  <v-card class="goal h-100 pa-5">
    <v-avatar color="accent" size="48" class="mb-3">
      <v-icon :icon="goal.icon" color="secondary" size="26" />
    </v-avatar>
    <h3 class="wsc-display goal__title">{{ goal.title }}</h3>
    <p class="text-body-1 mt-2 mb-4">{{ goal.text }}</p>
    <p class="goal__proof mb-0">
      <v-icon icon="mdi-check-circle-outline" size="18" color="primary" />
      <span>{{ goal.proof }}</span>
    </p>
  </v-card>
</template>

<style scoped>
.goal {
  border-left: 4px solid rgb(var(--v-theme-accent));
}
.goal__title {
  margin: 0;
  font-size: 1.6rem;
}
.goal__proof {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}
</style>