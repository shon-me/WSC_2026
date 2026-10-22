<script setup>
import { computed } from 'vue'

const props = defineProps({
  item: { type: Object, required: true },
  // Optional small line above the caption, e.g. the match
  label: { type: String, default: '' },
})
defineEmits(['open'])

const alt = computed(() => {
  if (props.item.caption) return props.item.caption
  const kind = props.item.type === 'video' ? 'video' : 'photo'
  const f = props.item.fixture
  return f ? `Fan ${kind} from ${f.home} vs ${f.away}` : `Fan ${kind}`
})

const duration = computed(() => {
  const s = props.item.duration
  return s ? `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}` : ''
})
</script>

<template>
  <div class="tile">
    <button class="tile__btn" type="button" :aria-label="`Open: ${alt}`" @click="$emit('open')">
      <img :src="item.poster" :alt="alt" loading="lazy" />
      <span v-if="item.type === 'video'" class="tile__play" aria-hidden="true">
        <v-icon icon="mdi-play" size="28" />
      </span>
      <span v-if="duration" class="tile__dur">{{ duration }}</span>
      <span v-if="label || item.caption" class="tile__cap">
        <span v-if="label" class="tile__label">{{ label }}</span>
        <span v-if="item.caption">{{ item.caption }}</span>
      </span>
    </button>

    <div v-if="$slots.actions" class="tile__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<style scoped>
.tile {
  position: relative;
  min-width: 0;
}
.tile__btn {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  padding: 0;
  border: 0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  background: rgb(var(--v-theme-secondary));
  color: #fff;
  text-align: left;
}
.tile__btn:focus-visible {
  outline: 3px solid rgb(var(--v-theme-accent));
  outline-offset: 2px;
}
.tile__btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
}
.tile__btn:hover img {
  transform: scale(1.04);
}

.tile__play {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgb(0 0 0 / 0.55);
}
.tile__dur {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 8px;
  border-radius: 6px;
  background: rgb(0 0 0 / 0.65);
  font-size: 0.8rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.tile__cap {
  position: absolute;
  inset: auto 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 28px 12px 10px;
  background: linear-gradient(to top, rgb(0 0 0 / 0.75), transparent);
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.25;
}
.tile__label {
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.85;
}
.tile__actions {
  position: absolute;
  top: 6px;
  right: 6px;
}
</style>