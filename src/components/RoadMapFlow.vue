<script setup>
import { formatShortDay, formatTime } from '../utils/KickOff'

// stages come from useRoadmap(): { level, status, total, finished, live, next, isFinal }
defineProps({
  stages: { type: Array, required: true },
  advance: { type: Number, default: 2 },
})

const STATUS = {
  done: { label: 'Completed', icon: 'mdi-check-circle' },
  active: { label: 'In progress', icon: 'mdi-soccer' },
  next: { label: 'Up next', icon: 'mdi-flag-outline' },
  later: { label: 'Later', icon: 'mdi-clock-outline' },
}

const cardColor = (s) => {
  if (s.status === 'done') return s.isFinal ? 'accent' : 'green-tint'
  if (s.status === 'active') return 'primary'
  return s.isFinal ? 'gold-tint' : 'surface'
}
const chip = (s) =>
  ({
    done: { color: 'primary', variant: 'flat' },
    active: { color: 'accent', variant: 'flat' },
    next: { color: 'secondary', variant: 'flat' },
    later: { variant: 'outlined' },
  })[s.status]

const icon = (s) => (s.isFinal ? 'mdi-trophy' : STATUS[s.status].icon)
const pct = (s) => (s.total ? Math.round((s.finished / s.total) * 100) : 0)
</script>

<template>
  <ol class="flow">
    <li v-for="(s, i) in stages" :key="s.level" class="node" :aria-current="s.status === 'active' ? 'step' : undefined">
      <span v-if="s.status === 'active'" class="node__here">You are here</span>

      <v-sheet
        :color="cardColor(s)"
        :border="s.status === 'next' || s.status === 'later'"
        rounded="lg"
        class="stage"
        :class="{ 'stage--active': s.status === 'active', 'stage--later': s.status === 'later' && !s.isFinal }"
      >
        <div class="d-flex align-center ga-2">
          <v-icon :icon="icon(s)" size="22" />
          <span class="wsc-display stage__name">{{ s.level }}</span>
        </div>

        <v-chip v-bind="chip(s)" size="x-small" label class="mt-2">{{ STATUS[s.status].label }}</v-chip>

        <div v-if="s.total" class="mt-3">
          <v-progress-linear
            :model-value="pct(s)"
            :color="s.status === 'active' ? 'accent' : 'primary'"
            :bg-color="s.status === 'active' ? 'white' : 'primary'"
            bg-opacity="0.25"
            height="6"
            rounded
            :aria-label="`${s.level}: ${s.finished} of ${s.total} matches played`"
          />
          <p class="stage__small mb-0 mt-1">
            {{ s.finished }} of {{ s.total }} played<span v-if="s.live">, {{ s.live }} live</span>
          </p>
        </div>

        <p v-if="s.next" class="stage__next">
          <span class="stage__small d-block">Next match</span>
          {{ formatShortDay(s.next.kickoff) }}, {{ formatTime(s.next.kickoff) }}
          <br />
          {{ s.next.home }} vs {{ s.next.away }}
        </p>
        <p v-else-if="s.status !== 'done'" class="stage__next stage__small">Fixtures to be announced</p>

        <p class="stage__rule stage__small">
          {{ s.isFinal ? 'The champion is crowned here' : `Top ${advance} move on` }}
        </p>
      </v-sheet>

      <v-icon v-if="i < stages.length - 1" class="node__arrow" icon="mdi-arrow-right" aria-hidden="true" />
    </li>
  </ol>
</template>

<style scoped>
/* Phones and tablets: a vertical flow, arrows pointing down */
.flow {
  display: flex;
  flex-direction: column;
  gap: 44px;
  max-width: 560px;
  margin: 0 auto;
  padding: 12px 0 0;
  list-style: none;
}
.node {
  position: relative;
}
.node__arrow {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%) rotate(90deg);
  color: rgb(var(--v-theme-primary));
}
.node__here {
  position: absolute;
  top: -12px;
  left: 16px;
  z-index: 1;
  padding: 2px 10px;
  border-radius: 999px;
  background: rgb(var(--v-theme-accent));
  color: rgb(var(--v-theme-secondary));
  font-size: 0.75rem;
  font-weight: 700;
}

.stage {
  height: 100%;
  padding: 16px;
}
.stage--active {
  box-shadow: 0 0 0 3px rgb(var(--v-theme-accent));
}
.stage--later {
  border-style: dashed;
}
.stage__name {
  font-size: 1.4rem;
}
.stage__small {
  font-size: 0.85rem;
  opacity: 0.8;
}
.stage__next {
  margin: 12px 0 0;
  font-weight: 600;
  line-height: 1.35;
}
.stage__rule {
  margin: 12px 0 0;
}

/* Wide screens: one horizontal flow, arrows pointing right */
@media (min-width: 1280px) {
  .flow {
    display: grid;
    grid-template-columns: repeat(6, minmax(0, 1fr));
    gap: 44px;
    max-width: none;
  }
  .node__arrow {
    top: 50%;
    left: calc(100% + 10px);
    transform: translateY(-50%);
  }
}
</style>