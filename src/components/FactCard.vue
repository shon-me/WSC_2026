<script setup>
defineProps({
  icon: { type: String, required: true },
  label: { type: String, required: true },
  value: { type: String, required: true },
})
</script>

<template>
  <v-card class="d-flex align-start ga-3 pa-4 h-100">
    <v-avatar color="green-tint" rounded="lg" size="44">
      <v-icon :icon="icon" color="primary" />
    </v-avatar>
    <div>
      <div class="text-body-2 text-medium-emphasis">{{ label }}</div>
      <div class="font-weight-bold">{{ value }}</div>
    </div>
  </v-card>
</template>