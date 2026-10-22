<script setup>
import { computed, reactive, ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import MediaTile from '../components/MediaTile.vue'
import MediaLightbox from '../components/MediaLightBox.vue'
import { useGallery } from '../utils/UseGallery'
import { usePermissions } from '../utils/UsePermissions'
import { formatDay, formatTime } from '../utils/KickOff'

const { approved, pending } = useGallery()
const { can } = usePermissions()

const groupBy = ref('match') // match | team
const order = ref('newest') // newest | oldest (by the date the match was played)
const team = ref(null)
const type = ref('all') // all | image | video

const teams = computed(() => {
  const set = new Set()
  for (const m of approved.value) {
    set.add(m.fixture.home)
    set.add(m.fixture.away)
  }
  return [...set].sort((a, b) => a.localeCompare(b))
})

const filtered = computed(() =>
  approved.value.filter((m) => {
    if (type.value !== 'all' && m.type !== type.value) return false
    if (team.value && m.fixture.home !== team.value && m.fixture.away !== team.value) return false
    return true
  }),
)

// Videos first inside a match, then the newest uploads
const videosFirst = (a, b) =>
  a.type === b.type ? b.uploadedAt.localeCompare(a.uploadedAt) : a.type === 'video' ? -1 : 1

// groups -> matches -> entries. `flat` is every tile in display order, for the viewer.
const built = computed(() => {
  const dir = order.value === 'newest' ? -1 : 1

  const byMatch = new Map()
  for (const m of filtered.value) {
    if (!byMatch.has(m.fixtureId)) byMatch.set(m.fixtureId, { fixture: m.fixture, items: [] })
    byMatch.get(m.fixtureId).items.push(m)
  }
  const matches = [...byMatch.values()].sort((a, b) => dir * a.fixture.kickoff.localeCompare(b.fixture.kickoff))
  for (const mt of matches) mt.items.sort(videosFirst)

  let groups
  if (groupBy.value === 'team') {
    const names = team.value ? [team.value] : teams.value
    groups = names
      .map((name) => ({
        key: name,
        team: name,
        matches: matches
          .filter((mt) => mt.fixture.home === name || mt.fixture.away === name)
          .map((mt) => ({ ...mt })),
      }))
      .filter((g) => g.matches.length)
  } else {
    groups = [{ key: 'all', team: null, matches: matches.map((mt) => ({ ...mt })) }]
  }

  const flat = []
  for (const g of groups) {
    for (const mt of g.matches) {
      mt.entries = mt.items.map((item) => {
        flat.push(item)
        return { item, i: flat.length - 1 }
      })
    }
  }
  return { groups, flat }
})

const describe = (items) => {
  const v = items.filter((i) => i.type === 'video').length
  const p = items.length - v
  return [p && `${p} ${p === 1 ? 'photo' : 'photos'}`, v && `${v} ${v === 1 ? 'video' : 'videos'}`]
    .filter(Boolean)
    .join(', ')
}

const hasScore = (f) => ['live', 'full-time'].includes(f.status)

const lightbox = ref(null)
const toast = reactive({ show: false, text: '' })
const onDeleted = (kind) => {
  toast.text = kind === 'video' ? 'Video deleted' : 'Photo deleted'
  toast.show = true
}

const resetFilters = () => {
  type.value = 'all'
  team.value = null
}
</script>

<template>
  <PageHeader
    title="Fans gallery"
    subtitle="Photos and video highlights from the matches, shared by supporters."
  >
    <template #actions>
      <v-btn
        v-if="can('gallery:upload')"
        color="accent"
        variant="flat"
        prepend-icon="mdi-upload"
        to="/gallery/upload"
      >
        Upload photos and videos
      </v-btn>
      <v-btn v-else variant="outlined" class="text-white" prepend-icon="mdi-login" to="/login">
        Log in to upload
      </v-btn>
      <v-btn
        v-if="can('gallery:review')"
        variant="outlined"
        class="text-white"
        prepend-icon="mdi-shield-check-outline"
        to="/admin/gallery"
      >
        Review uploads ({{ pending.length }})
      </v-btn>
    </template>
  </PageHeader>

  <v-container class="py-6">
    <v-row>
      <v-col cols="12" md="3">
        <v-btn-toggle v-model="groupBy" mandatory divided color="primary" variant="outlined" class="w-100">
          <v-btn value="match" class="flex-grow-1">By match</v-btn>
          <v-btn value="team" class="flex-grow-1">By team</v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="12" md="3">
        <v-btn-toggle v-model="type" mandatory divided color="primary" variant="outlined" class="w-100">
          <v-btn value="all" class="flex-grow-1">All</v-btn>
          <v-btn value="image" class="flex-grow-1">Photos</v-btn>
          <v-btn value="video" class="flex-grow-1">Videos</v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select v-model="team" :items="teams" label="Team" clearable hide-details />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <v-select
          v-model="order"
          :items="[
            { title: 'Newest matches first', value: 'newest' },
            { title: 'Oldest matches first', value: 'oldest' },
          ]"
          label="Order by match date"
          hide-details
        />
      </v-col>
    </v-row>

    <p class="text-body-2 text-medium-emphasis mt-4 mb-0" aria-live="polite">
      {{ built.flat.length }} {{ built.flat.length === 1 ? 'item' : 'items' }}
    </p>

    <v-sheet v-if="!built.flat.length" border rounded="lg" class="pa-8 text-center mt-6">
      <v-icon icon="mdi-image-off-outline" size="40" color="primary" class="mb-2" />
      <p class="mb-4">
        {{ approved.length ? 'Nothing matches these filters.' : 'No photos or videos have been posted yet.' }}
      </p>
      <v-btn v-if="approved.length" color="primary" @click="resetFilters">Clear filters</v-btn>
    </v-sheet>

    <template v-for="g in built.groups" :key="g.key">
      <h2 v-if="g.team" class="team-head">
        <span class="wsc-display team-head__name">{{ g.team }}</span>
        <v-chip size="small" variant="flat" color="primary">
          {{ g.matches.length }} {{ g.matches.length === 1 ? 'match' : 'matches' }}
        </v-chip>
      </h2>

      <section v-for="mt in g.matches" :key="`${g.key}-${mt.fixture.id}`" class="match">
        <header class="match__head">
          <div class="match__when">
            <span class="wsc-display match__day">{{ formatDay(mt.fixture.kickoff) }}</span>
            <span class="match__time">{{ formatTime(mt.fixture.kickoff) }}</span>
            <v-chip v-if="mt.fixture.status === 'live'" color="error" variant="flat" size="small">Live</v-chip>
          </div>
          <h3 class="match__teams">
            {{ mt.fixture.home }}
            <span v-if="hasScore(mt.fixture)" class="wsc-display match__score">
              {{ mt.fixture.homeScore }} - {{ mt.fixture.awayScore }}
            </span>
            <span v-else class="match__vs">vs</span>
            {{ mt.fixture.away }}
          </h3>
          <div class="match__meta">
            <v-chip size="x-small" label variant="tonal" color="primary">{{ mt.fixture.level }}</v-chip>
            <span class="d-inline-flex align-center ga-1">
              <v-icon icon="mdi-map-marker-outline" size="16" />
              {{ mt.fixture.venue }}
            </span>
            <span>{{ describe(mt.items) }}</span>
          </div>
        </header>

        <div class="media-grid">
          <MediaTile
            v-for="(e, n) in mt.entries"
            :key="e.item.id"
            :item="e.item"
            :class="{ 'media-grid__feature': mt.entries.length >= 3 && n === 0 }"
            @open="lightbox = e.i"
          />
        </div>
      </section>
    </template>
  </v-container>

  <MediaLightbox v-model="lightbox" :items="built.flat" @deleted="onDeleted" />
  <v-snackbar v-model="toast.show" color="secondary" :timeout="3000">{{ toast.text }}</v-snackbar>
</template>

<style scoped>
.team-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 40px 0 0;
  padding-bottom: 8px;
  border-bottom: 3px solid rgb(var(--v-theme-accent));
}
.team-head__name {
  font-size: clamp(2rem, 5vw, 2.75rem);
}

.match {
  margin-top: 32px;
}
.match__head {
  margin-bottom: 12px;
}
.match__when {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
}
.match__day {
  font-size: clamp(1.5rem, 4vw, 2rem);
}
.match__time {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-primary));
}
.match__teams {
  margin: 2px 0 0;
  font-size: 1.25rem;
  font-weight: 700;
}
.match__score {
  margin-inline: 8px;
  font-size: 1.5rem;
}
.match__vs {
  margin-inline: 6px;
  font-weight: 500;
  opacity: 0.6;
}
.match__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 16px;
  margin-top: 6px;
  font-size: 0.95rem;
  color: rgb(var(--v-theme-on-surface), 0.7);
}
</style>