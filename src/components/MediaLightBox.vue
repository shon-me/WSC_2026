<script setup>
// Needs Vue 3.4+ for defineModel. v-model is the index of the open item, or null when closed.
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useGallery } from '../utils/UseGallery'
import { usePermissions } from '../utils/UsePermissions'
import { formatDay, formatTime } from '../utils/KickOff'

const props = defineProps({
  items: { type: Array, default: () => [] },
})
const index = defineModel({ type: Number, default: null })
const emit = defineEmits(['deleted'])

const { remove } = useGallery()
const { can } = usePermissions()

const open = computed({
  get: () => index.value !== null && props.items.length > 0,
  set: (v) => {
    if (!v) index.value = null
  },
})
const item = computed(() => props.items[index.value] ?? null)
const fx = computed(() => item.value?.fixture ?? null)
const alt = computed(() => {
  if (!item.value) return ''
  if (item.value.caption) return item.value.caption
  return fx.value ? `Fan photo from ${fx.value.home} vs ${fx.value.away}` : 'Fan photo'
})

const videoFailed = ref(false)
watch(item, () => {
  videoFailed.value = false
})

const prev = () => {
  if (props.items.length > 1) index.value = (index.value - 1 + props.items.length) % props.items.length
}
const next = () => {
  if (props.items.length > 1) index.value = (index.value + 1) % props.items.length
}

// If items disappear (for example after a delete), keep the index in range.
watch(
  () => props.items.length,
  (len) => {
    if (index.value !== null && index.value >= len) index.value = len ? len - 1 : null
  },
)

// Delete (admins only)
const confirmOpen = ref(false)
const confirmDelete = () => {
  const type = item.value.type
  const res = remove(item.value.id)
  confirmOpen.value = false
  if (res.ok) emit('deleted', type)
}

const onKey = (e) => {
  if (confirmOpen.value) return
  if (e.key === 'ArrowLeft') prev()
  else if (e.key === 'ArrowRight') next()
}
watch(open, (isOpen) => {
  if (isOpen) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <v-dialog v-model="open" fullscreen transition="fade-transition">
    <v-sheet v-if="item" color="secondary" class="viewer">
      <div class="viewer__top">
        <span class="text-body-2">{{ index + 1 }} of {{ items.length }}</span>
        <v-spacer />
        <v-btn
          v-if="can('gallery:delete')"
          variant="text"
          color="error"
          prepend-icon="mdi-delete-outline"
          @click="confirmOpen = true"
        >
          Delete
        </v-btn>
        <v-btn icon="mdi-close" variant="text" aria-label="Close viewer" @click="open = false" />
      </div>

      <div class="viewer__stage">
        <v-btn
          v-if="items.length > 1"
          icon="mdi-chevron-left"
          variant="text"
          size="large"
          aria-label="Previous"
          @click="prev"
        />
        <div class="viewer__media">
          <video
            v-if="item.type === 'video' && !videoFailed"
            :key="item.id"
            :src="item.src"
            :poster="item.poster"
            controls
            playsinline
            @error="videoFailed = true"
          />
          <div v-else-if="item.type === 'video'" class="viewer__error">
            <v-icon icon="mdi-video-off-outline" size="40" class="mb-2" />
            <p>This video can't be played right now.</p>
          </div>
          <img v-else :src="item.src" :alt="alt" />
        </div>
        <v-btn
          v-if="items.length > 1"
          icon="mdi-chevron-right"
          variant="text"
          size="large"
          aria-label="Next"
          @click="next"
        />
      </div>

      <div class="viewer__info">
        <p v-if="item.caption" class="viewer__caption">{{ item.caption }}</p>
        <template v-if="fx">
          <p class="wsc-display viewer__match">{{ fx.home }} vs {{ fx.away }}</p>
          <div class="viewer__meta">
            <span class="d-inline-flex align-center ga-1">
              <v-icon icon="mdi-calendar-outline" size="18" />
              {{ formatDay(fx.kickoff) }}, {{ formatTime(fx.kickoff) }}
            </span>
            <span class="d-inline-flex align-center ga-1">
              <v-icon icon="mdi-map-marker-outline" size="18" />
              {{ fx.venue }}
            </span>
            <v-chip size="x-small" label color="accent" variant="flat">{{ fx.level }}</v-chip>
          </div>
        </template>
        <p class="viewer__credit">{{ item.type === 'video' ? 'Video' : 'Photo' }} by {{ item.uploader }}</p>
      </div>
    </v-sheet>
  </v-dialog>

  <v-dialog v-model="confirmOpen" max-width="420">
    <v-card :title="`Delete this ${item?.type === 'video' ? 'video' : 'photo'}?`">
      <v-card-text>It will be removed from the gallery for good. This can't be undone.</v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-spacer />
        <v-btn variant="text" @click="confirmOpen = false">Cancel</v-btn>
        <v-btn color="error" variant="flat" @click="confirmDelete">
          Delete {{ item?.type === 'video' ? 'video' : 'photo' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.viewer {
  display: flex;
  flex-direction: column;
  height: 100%;
  color: #fff;
}
.viewer__top {
  display: flex;
  align-items: center;
  padding: 8px 12px 8px 20px;
}
.viewer__stage {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding-inline: 4px;
}
.viewer__media {
  flex: 1;
  min-width: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.viewer__media img,
.viewer__media video {
  max-width: 100%;
  max-height: 100%;
  border-radius: 8px;
  object-fit: contain;
}
.viewer__error {
  text-align: center;
}
.viewer__info {
  padding: 16px 24px 24px;
  max-width: 900px;
  width: 100%;
  margin-inline: auto;
}
.viewer__caption {
  margin: 0 0 8px;
  font-size: 1.15rem;
  font-weight: 600;
}
.viewer__match {
  margin: 0;
  font-size: 1.6rem;
}
.viewer__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 20px;
  margin-top: 6px;
  opacity: 0.9;
}
.viewer__credit {
  margin: 10px 0 0;
  font-size: 0.9rem;
  opacity: 0.75;
}
</style>