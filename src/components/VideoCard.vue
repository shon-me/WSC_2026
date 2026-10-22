<script setup>
import { computed } from 'vue'

// video: { title, text, poster, duration?, sample? }
const props = defineProps({
  video: { type: Object, required: true },
})
defineEmits(['play'])

const duration = computed(() => {
  const s = props.video.duration
  return s ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : ''
})
</script>

<template>
  <v-card class="vid h-100 d-flex flex-column overflow-hidden">
    <button class="vid__btn" type="button" :aria-label="`Play video: ${video.title}`" @click="$emit('play')">
      <img :src="video.poster" alt="" loading="lazy" />
      <span class="vid__play" aria-hidden="true"><v-icon icon="mdi-play" size="32" /></span>
      <span v-if="duration" class="vid__dur">{{ duration }}</span>
    </button>
    <v-chip v-if="video.sample" class="vid__sample" size="x-small" label color="warning" variant="flat">
      Sample
    </v-chip>

    <div class="pa-4">
      <h3 class="wsc-display vid__title">{{ video.title }}</h3>
      <p class="text-body-2 text-medium-emphasis mb-0 mt-1">{{ video.text }}</p>
    </div>
  </v-card>
</template>

<style scoped>
.vid {
  position: relative;
}
.vid__btn {
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  padding: 0;
  border: 0;
  cursor: pointer;
  overflow: hidden;
  background: rgb(var(--v-theme-secondary));
  color: #fff;
}
.vid__btn:focus-visible {
  outline: 3px solid rgb(var(--v-theme-accent));
  outline-offset: -3px;
}
.vid__btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}
.vid__btn:hover img {
  transform: scale(1.04);
}
.vid__play {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 64px;
  height: 64px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgb(0 0 0 / 0.55);
}
.vid__dur {
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgb(0 0 0 / 0.65);
  font-size: 0.8rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.vid__sample {
  position: absolute;
  top: 10px;
  left: 10px;
}
.vid__title {
  margin: 0;
  font-size: 1.4rem;
}
</style>