<script setup>
// Needs Vue 3.4+ for defineModel.
// v-model is the item to show, or null when closed:
//   { kind: 'video' | 'image', title, caption?, src?, poster?, youtubeId? }
import { computed, ref, watch } from 'vue'

const item = defineModel({ type: Object, default: null })

const open = computed({
  get: () => !!item.value,
  set: (v) => {
    if (!v) item.value = null
  },
})

const failed = ref(false)
watch(item, () => {
  failed.value = false
})

const embedUrl = computed(() =>
  item.value?.youtubeId ? `https://www.youtube-nocookie.com/embed/${item.value.youtubeId}?rel=0` : '',
)
</script>

<template>
  <v-dialog v-model="open" max-width="1000">
    <v-card v-if="item" color="secondary">
      <div class="bar">
        <h3 class="wsc-display bar__title">{{ item.title }}</h3>
        <v-btn icon="mdi-close" variant="text" aria-label="Close" @click="open = false" />
      </div>

      <div class="stage">
        <iframe
          v-if="item.kind === 'video' && embedUrl"
          :src="embedUrl"
          :title="item.title"
          allow="accelerometer; encrypted-media; picture-in-picture"
          allowfullscreen
        />
        <video
          v-else-if="item.kind === 'video' && !failed"
          :key="item.src"
          :src="item.src"
          :poster="item.poster"
          controls
          playsinline
          @error="failed = true"
        />
        <div v-else-if="item.kind === 'video'" class="stage__error">
          <v-icon icon="mdi-video-off-outline" size="40" class="mb-2" />
          <p>This video can't be played right now.</p>
        </div>
        <img v-else :src="item.src" :alt="item.caption || item.title" />
      </div>

      <p v-if="item.caption && item.caption !== item.title" class="caption">{{ item.caption }}</p>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 8px 8px 20px;
}
.bar__title {
  margin: 0;
  font-size: 1.5rem;
}
.stage {
  display: grid;
  place-items: center;
  background: #000;
  aspect-ratio: 16 / 9;
  max-height: 70vh;
}
.stage video,
.stage iframe,
.stage img {
  width: 100%;
  height: 100%;
  border: 0;
  object-fit: contain;
}
.stage__error {
  text-align: center;
  color: #fff;
}
.caption {
  margin: 0;
  padding: 14px 20px 18px;
}
</style>