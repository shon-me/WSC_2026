<script setup>
defineProps({
  heading: { type: String, default: 'Supported by' },
  // Add `logo: '/path/to/logo.png'` to show an image instead of the name.
  sponsors: {
    type: Array,
    default: () => [
      { name: 'Senate Office, Bomet County' },
      { name: 'Football Kenya Federation' },
      { name: 'Hillary Sigei Foundation' },
    ],
  },
})
</script>

<template>
  <v-sheet border rounded="lg" class="pa-5">
    <p class="text-body-2 text-medium-emphasis mb-3">{{ heading }}</p>
    <div class="sponsors">
      <template v-for="s in sponsors" :key="s.name">
        <v-img v-if="s.logo" :src="s.logo" :alt="s.name" :width="120" :height="48" contain />
        <span v-else class="wsc-display text-h6 text-secondary">{{ s.name }}</span>
      </template>
    </div>
  </v-sheet>
</template>

<style scoped>
.sponsors {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 40px;
}
</style>