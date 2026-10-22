<script setup>
import { computed, ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import FixtureRow from '../components/FixtureRow.vue'
import { LEVELS, useFixtures } from '../utils/UseFixtures.js'
import { usePermissions } from '../utils/UsePermissions.js'
import { dayKey, formatDay, relativeDay } from '../utils/KickOff.js'

const { fixtures } = useFixtures()
const { can } = usePermissions()

const view = ref('all') // all | live | upcoming | results
const level = ref(null)
const query = ref('')

const filtered = computed(() => {
  const q = (query.value ?? '').trim().toLowerCase()
  return fixtures.value.filter((f) => {
    if (level.value && f.level !== level.value) return false
    if (view.value === 'live' && f.status !== 'live') return false
    if (view.value === 'upcoming' && !['scheduled', 'postponed'].includes(f.status)) return false
    if (view.value === 'results' && f.status !== 'full-time') return false
    return !q || [f.home, f.away, f.venue].some((s) => s.toLowerCase().includes(q))
  })
})

const liveNow = computed(() => filtered.value.filter((f) => f.status === 'live'))

// One group per day. Live matches are shown separately at the top.
const groups = computed(() => {
  const byDay = new Map()
  for (const f of filtered.value) {
    if (f.status === 'live') continue
    const key = dayKey(f.kickoff)
    if (!byDay.has(key)) byDay.set(key, [])
    byDay.get(key).push(f)
  }
  const list = [...byDay].map(([key, items]) => ({ key, items }))
  return view.value === 'results' ? list.reverse() : list
})

const resetFilters = () => {
  view.value = 'all'
  level.value = null
  query.value = ''
}
</script>

<template>
  <PageHeader
    title="Fixtures"
    subtitle="Kick-off dates and times for every match. All times are Kenyan time."
  >
    <template v-if="can('fixtures:edit')" #actions>
      <v-btn color="accent" variant="flat" prepend-icon="mdi-pencil-outline" to="/admin/fixtures">
        Manage fixtures
      </v-btn>
    </template>
  </PageHeader>

  <v-container class="py-6">
    <v-row>
      <v-col cols="12" md="5">
        <v-btn-toggle v-model="view" mandatory divided color="primary" variant="outlined" class="w-100">
          <v-btn value="all" class="flex-grow-1">All</v-btn>
          <v-btn value="live" class="flex-grow-1">Live</v-btn>
          <v-btn value="upcoming" class="flex-grow-1">Upcoming</v-btn>
          <v-btn value="results" class="flex-grow-1">Results</v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select v-model="level" :items="LEVELS" label="Level" clearable hide-details />
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          v-model="query"
          label="Search team or venue"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
        />
      </v-col>
    </v-row>

    <p class="text-body-2 text-medium-emphasis mt-4 mb-0" aria-live="polite">
      {{ filtered.length }} {{ filtered.length === 1 ? 'match' : 'matches' }}
    </p>

    <v-sheet v-if="!filtered.length" border rounded="lg" class="pa-8 text-center mt-6">
      <v-icon icon="mdi-calendar-search-outline" size="40" color="primary" class="mb-2" />
      <p class="mb-4">No matches found. Try another level, or clear the search.</p>
      <v-btn color="primary" @click="resetFilters">Show all fixtures</v-btn>
    </v-sheet>

    <section v-if="liveNow.length" class="day">
      <h2 class="day__head">
        <span class="live-dot" />
        <span class="wsc-display day__name">Playing now</span>
      </h2>
      <v-card>
        <template v-for="(f, i) in liveNow" :key="f.id">
          <v-divider v-if="i" />
          <FixtureRow :fixture="f" />
        </template>
      </v-card>
    </section>

    <section v-for="g in groups" :key="g.key" class="day">
      <h2 class="day__head">
        <span class="wsc-display day__name">{{ formatDay(g.key) }}</span>
        <v-chip v-if="relativeDay(g.key)" color="accent" variant="flat" size="small">
          {{ relativeDay(g.key) }}
        </v-chip>
      </h2>
      <v-card>
        <template v-for="(f, i) in g.items" :key="f.id">
          <v-divider v-if="i" />
          <FixtureRow :fixture="f" />
        </template>
      </v-card>
    </section>
  </v-container>
</template>

<style scoped>
.day {
  margin-top: 28px;
}
.day__head {
  position: sticky;
  top: var(--v-layout-top, 64px);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 8px;
  padding-block: 10px;
  background: rgb(var(--v-theme-background));
}
.day__name {
  font-size: clamp(1.5rem, 4vw, 2rem);
}
.live-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgb(var(--v-theme-error));
  animation: pulse 1.4s ease-in-out infinite;
}
@keyframes pulse {
  50% {
    opacity: 0.25;
  }
}
</style>