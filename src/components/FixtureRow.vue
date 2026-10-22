<script setup>
import { computed } from 'vue'
import { formatTime } from '../utils/KickOff'

const props = defineProps({
  fixture: { type: Object, required: true },
})

const f = computed(() => props.fixture)
const started = computed(() => ['live', 'full-time'].includes(f.value.status))

const winner = computed(() => {
  if (f.value.status !== 'full-time' || f.value.homeScore === f.value.awayScore) return null
  return f.value.homeScore > f.value.awayScore ? 'home' : 'away'
})

const sides = computed(() => [
  { key: 'home', name: f.value.home, score: f.value.homeScore },
  { key: 'away', name: f.value.away, score: f.value.awayScore },
])
</script>

<template>
  <article
    class="row"
    :class="{ 'row--live': f.status === 'live', 'row--postponed': f.status === 'postponed' }"
    :aria-label="`${f.home} versus ${f.away}, ${formatTime(f.kickoff)}, ${f.venue}`"
  >
    <div class="row__when">
      <span class="wsc-display row__time">{{ formatTime(f.kickoff) }}</span>

      <v-chip v-if="f.status === 'live'" color="error" variant="flat" size="small">
        <span class="dot" />Live
      </v-chip>
      <v-chip v-else-if="f.status === 'full-time'" color="secondary" variant="flat" size="small">Full time</v-chip>
      <v-chip v-else-if="f.status === 'postponed'" color="warning" variant="flat" size="small">Postponed</v-chip>
    </div>

    <div class="row__body">
      <div
        v-for="side in sides"
        :key="side.key"
        class="team"
        :class="{ 'team--lost': winner && winner !== side.key }"
      >
        <span class="team__name">{{ side.name }}</span>
        <span v-if="started" class="wsc-display team__score">{{ side.score }}</span>
      </div>

      <div class="row__meta">
        <v-chip size="x-small" label variant="tonal" color="primary">{{ f.level }}</v-chip>
        <span class="d-inline-flex align-center ga-1">
          <v-icon icon="mdi-map-marker-outline" size="16" />
          {{ f.venue }}
        </span>
      </div>

      <p v-if="f.note" class="row__note">{{ f.note }}</p>
    </div>

    <div v-if="$slots.actions" class="row__actions">
      <slot name="actions" />
    </div>
  </article>
</template>

<style scoped>
.row {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 8px 20px;
  align-items: start;
  padding: 16px 20px;
  border-left: 4px solid transparent;
}
.row--live {
  border-left-color: rgb(var(--v-theme-error));
}
.row--postponed {
  border-left-color: rgb(var(--v-theme-accent));
}
.row--postponed .row__time {
  text-decoration: line-through;
  opacity: 0.6;
}

.row__when {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
}
.row__time {
  font-size: 2rem;
  white-space: nowrap;
}

.team {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding-block: 2px;
}
.team__name {
  font-size: 1.25rem;
  font-weight: 700;
}
.team__score {
  font-size: 1.6rem;
  min-width: 1.5ch;
  text-align: right;
}
.team--lost {
  opacity: 0.6;
}

.row__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
  margin-top: 8px;
  font-size: 0.95rem;
  color: rgb(var(--v-theme-on-surface), 0.7);
}
.row__note {
  margin: 8px 0 0;
  font-weight: 600;
  color: rgb(var(--v-theme-secondary));
}

.dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  margin-right: 6px;
  border-radius: 50%;
  background: #fff;
  animation: pulse 1.4s ease-in-out infinite;
}
@keyframes pulse {
  50% {
    opacity: 0.25;
  }
}

@media (max-width: 599px) {
  .row {
    grid-template-columns: 1fr;
    padding: 14px 16px;
  }
  .row__when {
    flex-direction: row;
    align-items: center;
    gap: 12px;
  }
  .row__time {
    font-size: 1.75rem;
  }
}
</style>