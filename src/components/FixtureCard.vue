<script setup>
import { computed } from 'vue'

const props = defineProps({
  home: { type: String, required: true },
  away: { type: String, required: true },
  level: { type: String, default: '' },
  status: {
    type: String,
    default: 'scheduled',
    validator: (v) => ['scheduled', 'live', 'full-time'].includes(v),
  },
  kickoff: { type: [String, Date, Number], default: null },
  venue: { type: String, default: '' },
  homeScore: { type: Number, default: 0 },
  awayScore: { type: Number, default: 0 },
  // e.g. "Valley Boys won 4-3 on penalties"
  note: { type: String, default: '' },
})

const hasScore = computed(() => props.status !== 'scheduled')

const sides = computed(() => [
  { key: 'home', name: props.home, score: props.homeScore },
  { key: 'away', name: props.away, score: props.awayScore },
])

const winner = computed(() => {
  if (props.status !== 'full-time' || props.homeScore === props.awayScore) return null
  return props.homeScore > props.awayScore ? 'home' : 'away'
})

const when = computed(() =>
  props.kickoff
    ? new Intl.DateTimeFormat('en-KE', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(props.kickoff))
    : 'Time to be confirmed',
)

const initials = (name) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
</script>

<template>
  <v-card class="pa-4">
    <div class="d-flex align-center justify-space-between mb-3">
      <span class="text-body-2 text-medium-emphasis">{{ level }}</span>

      <v-chip v-if="status === 'live'" color="error" variant="flat" size="small">
        <span class="dot" />Live
      </v-chip>
      <v-chip v-else-if="status === 'full-time'" color="secondary" variant="flat" size="small">Full time</v-chip>
      <span v-else class="text-body-2 font-weight-medium">{{ when }}</span>
    </div>

    <div
      v-for="side in sides"
      :key="side.key"
      class="team"
      :class="{ 'team--lost': winner && winner !== side.key }"
    >
      <v-avatar :color="side.key === 'home' ? 'primary' : 'secondary'" size="36">
        <span class="text-caption font-weight-bold">{{ initials(side.name) }}</span>
      </v-avatar>
      <span class="team__name">{{ side.name }}</span>
      <span v-if="hasScore" class="wsc-display team__score">{{ side.score }}</span>
    </div>

    <div v-if="venue || note" class="mt-3 text-body-2 text-medium-emphasis">
      <div v-if="note" class="font-weight-medium text-secondary mb-1">{{ note }}</div>
      <div v-if="venue" class="d-flex align-center ga-1">
        <v-icon icon="mdi-map-marker-outline" size="16" />
        {{ venue }}
      </div>
    </div>
  </v-card>
</template>

<style scoped>
.team {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-block: 6px;
}
.team__name {
  flex: 1;
  font-weight: 600;
}
.team__score {
  font-size: 1.75rem;
  min-width: 1.5ch;
  text-align: right;
}
.team--lost {
  opacity: 0.6;
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
</style>