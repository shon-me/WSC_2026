<script setup>
import { computed, ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import FixtureRow from '../components/FixtureRow.vue'
import RoadmapFlow from '../components/RoadMapFlow.vue'
import StandingsTable from '../components/StandingsTable.vue'
import { LEVELS, useFixtures } from '../utils/UseFixtures'
import { useRoadmap } from '../utils/UseRoadMap'
import { ADVANCING, POINTS, useStandings } from '../utils/UseStandings'
import { dayKey, formatDay, formatShortDay, formatTime, relativeDay } from '../utils/KickOff'

const { fixtures } = useFixtures()
const { stages } = useRoadmap()
const { tables } = useStandings()

// Results
const level = ref(null)
const query = ref('')
const dayLimit = ref(3)

const results = computed(() => {
  const q = (query.value ?? '').trim().toLowerCase()
  return fixtures.value.filter(
    (f) =>
      f.status === 'full-time' &&
      (!level.value || f.level === level.value) &&
      (!q || [f.home, f.away, f.venue].some((s) => s.toLowerCase().includes(q))),
  )
})

// Newest day first, kick-off order inside each day
const dayGroups = computed(() => {
  const byDay = new Map()
  for (const f of [...results.value].reverse()) {
    const key = dayKey(f.kickoff)
    if (!byDay.has(key)) byDay.set(key, [])
    byDay.get(key).push(f)
  }
  return [...byDay].map(([key, items]) => ({
    key,
    items: items.sort((a, b) => a.kickoff.localeCompare(b.kickoff)),
  }))
})
const shownDays = computed(() => dayGroups.value.slice(0, dayLimit.value))
const hiddenDays = computed(() => Math.max(0, dayGroups.value.length - dayLimit.value))

const liveNow = computed(() => fixtures.value.filter((f) => f.status === 'live'))

// Roadmap
const nextMatch = computed(() => fixtures.value.find((f) => f.status === 'scheduled') ?? null)
const nextWhen = computed(() => {
  const f = nextMatch.value
  if (!f) return ''
  return `${relativeDay(dayKey(f.kickoff)) || formatShortDay(f.kickoff)}, ${formatTime(f.kickoff)}`
})

// Points table: one level at a time, starting with the level being played
const tableLevels = computed(() => LEVELS.filter((l) => tables.value.some((t) => t.level === l)))
const picked = ref(null)
const tableLevel = computed(() => {
  if (picked.value && tableLevels.value.includes(picked.value)) return picked.value
  const current = stages.value.find((s) => s.status === 'active' || s.status === 'next')?.level
  return tableLevels.value.includes(current) ? current : (tableLevels.value[0] ?? null)
})
const shownTables = computed(() => tables.value.filter((t) => t.level === tableLevel.value))
</script>

<template>
  <PageHeader
    title="Results"
    subtitle="Latest scores, the road to the finals and the points table."
  />

  <v-container class="py-6">
    <nav class="jump" aria-label="On this page">
      <v-btn href="#results" variant="tonal" color="primary" size="small">Results</v-btn>
      <v-btn href="#roadmap" variant="tonal" color="primary" size="small">Road to the finals</v-btn>
      <v-btn href="#table" variant="tonal" color="primary" size="small">Points table</v-btn>
    </nav>

    <!-- Results -->
    <section id="results" class="block">
      <h2 class="wsc-display text-h3 mb-4">Latest results</h2>

      <v-alert v-if="liveNow.length" color="gold-tint" variant="flat" icon="mdi-broadcast" class="mb-4">
        {{ liveNow.length }} {{ liveNow.length === 1 ? 'match is' : 'matches are' }} being played now.
        <router-link to="/fixtures">See live scores</router-link>
      </v-alert>

      <v-row>
        <v-col cols="12" sm="6" md="4">
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
        {{ results.length }} {{ results.length === 1 ? 'result' : 'results' }}
      </p>

      <v-sheet v-if="!results.length" border rounded="lg" class="pa-8 text-center mt-4">
        <v-icon icon="mdi-scoreboard-outline" size="40" color="primary" class="mb-2" />
        <p class="mb-0">No results yet for this selection.</p>
      </v-sheet>

      <section v-for="g in shownDays" :key="g.key" class="day">
        <h3 class="day__head">
          <span class="wsc-display day__name">{{ formatDay(g.key) }}</span>
          <v-chip v-if="relativeDay(g.key)" color="accent" variant="flat" size="small">
            {{ relativeDay(g.key) }}
          </v-chip>
        </h3>
        <v-card>
          <template v-for="(f, i) in g.items" :key="f.id">
            <v-divider v-if="i" />
            <FixtureRow :fixture="f" />
          </template>
        </v-card>
      </section>

      <div v-if="hiddenDays" class="text-center mt-6">
        <v-btn variant="outlined" color="primary" @click="dayLimit += 3">
          Show earlier results ({{ hiddenDays }} more {{ hiddenDays === 1 ? 'day' : 'days' }})
        </v-btn>
      </div>
    </section>

    <!-- Road to the finals -->
    <section id="roadmap" class="block">
      <h2 class="wsc-display text-h3 mb-2">Road to the finals</h2>
      <p class="text-body-1 text-medium-emphasis mb-1">
        The cup is played one level at a time. Two teams from each stage move on, until the County finals decide
        the champion.
      </p>
      <p v-if="nextMatch" class="font-weight-medium mb-6">
        Next match: {{ nextMatch.home }} vs {{ nextMatch.away }}, {{ nextWhen }}.
      </p>
      <RoadmapFlow :stages="stages" :advance="ADVANCING" />
    </section>

    <!-- Points table -->
    <section id="table" class="block">
      <h2 class="wsc-display text-h3 mb-2">Points table</h2>
      <p class="text-body-1 text-medium-emphasis mb-4">
        A win is worth {{ POINTS.win }} points and a draw {{ POINTS.draw }}. Teams are ranked by points, then goal
        difference, then goals scored.
      </p>

      <v-btn-toggle
        v-if="tableLevels.length > 1"
        :model-value="tableLevel"
        mandatory
        divided
        color="primary"
        variant="outlined"
        class="mb-4"
        @update:model-value="picked = $event"
      >
        <v-btn v-for="l in tableLevels" :key="l" :value="l">{{ l }}</v-btn>
      </v-btn-toggle>

      <v-sheet v-if="!shownTables.length" border rounded="lg" class="pa-8 text-center">
        <v-icon icon="mdi-table-large" size="40" color="primary" class="mb-2" />
        <p class="mb-0">Points tables appear once a level is played in groups.</p>
      </v-sheet>

      <v-row v-else>
        <v-col v-for="t in shownTables" :key="t.key" cols="12" lg="6">
          <StandingsTable :table="t" :advance="ADVANCING" />
        </v-col>
      </v-row>
    </section>
  </v-container>
</template>

<style scoped>
.jump {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.block {
  margin-top: 48px;
  scroll-margin-top: calc(var(--v-layout-top, 64px) + 8px);
}
.jump + .block {
  margin-top: 24px;
}

.day {
  margin-top: 24px;
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
  font-size: clamp(1.4rem, 4vw, 1.8rem);
}
</style>