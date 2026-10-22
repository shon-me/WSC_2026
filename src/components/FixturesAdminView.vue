<script setup>
// Needs Vuetify 3.4+ (v-data-table) and Vue 3.4+.
// Route this with meta: { permission: 'fixtures:edit' } and guard it once roles exist.
import { computed, reactive, ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import FixtureEditorDialog from '../components/FixtureEditorDialog.vue'
import { LEVELS, STATUSES, statusOf, useFixtures } from '../utils/UseFixtures'
import { usePermissions } from '../utils/UsePermissions'
import { formatShortDay, formatTime } from '../utils/KickOff'

const { fixtures, save, remove } = useFixtures()
const { can } = usePermissions()

const query = ref('')
const level = ref(null)
const status = ref(null)

const items = computed(() => {
  const q = (query.value ?? '').trim().toLowerCase()
  return fixtures.value.filter(
    (f) =>
      (!level.value || f.level === level.value) &&
      (!status.value || f.status === status.value) &&
      (!q || [f.home, f.away, f.venue].some((s) => s.toLowerCase().includes(q))),
  )
})

const headers = [
  { title: 'Date and time', key: 'kickoff' },
  { title: 'Match', key: 'home' },
  { title: 'Level', key: 'level' },
  { title: 'Venue', key: 'venue' },
  { title: 'Status', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' },
]

// Editor dialog
const editorOpen = ref(false)
const editing = ref(null)
const add = () => {
  editing.value = null
  editorOpen.value = true
}
const edit = (fixture) => {
  editing.value = fixture
  editorOpen.value = true
}

// Delete confirmation
const toDelete = ref(null)
const deleteOpen = computed({
  get: () => !!toDelete.value,
  set: (v) => {
    if (!v) toDelete.value = null
  },
})

const toast = reactive({ show: false, text: '' })
const notify = (text) => {
  toast.text = text
  toast.show = true
}

const onSave = (fixture) => {
  save(fixture)
  notify('Fixture saved')
}
const confirmDelete = () => {
  remove(toDelete.value.id)
  toDelete.value = null
  notify('Fixture deleted')
}
</script>

<template>
  <PageHeader
    title="Manage fixtures"
    subtitle="Add, edit or remove matches. Changes show on the public fixtures page straight away."
  >
    <template #actions>
      <v-btn v-if="can('fixtures:create')" color="accent" variant="flat" prepend-icon="mdi-plus" @click="add">
        Add fixture
      </v-btn>
      <v-btn variant="outlined" class="text-white" prepend-icon="mdi-calendar-clock-outline" to="/fixtures">
        View public page
      </v-btn>
    </template>
  </PageHeader>

  <v-container class="py-6">
    <v-row>
      <v-col cols="12" md="5">
        <v-text-field
          v-model="query"
          label="Search team or venue"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
        />
      </v-col>
      <v-col cols="6" md="3">
        <v-select v-model="level" :items="LEVELS" label="Level" clearable hide-details />
      </v-col>
      <v-col cols="6" md="4">
        <v-select
          v-model="status"
          :items="STATUSES"
          item-title="title"
          item-value="value"
          label="Status"
          clearable
          hide-details
        />
      </v-col>
    </v-row>

    <v-card class="mt-4">
      <v-data-table
        :headers="headers"
        :items="items"
        item-value="id"
        :items-per-page="10"
        no-data-text="No fixtures match these filters."
      >
        <template #item.kickoff="{ item }">
          <div class="font-weight-bold">{{ formatShortDay(item.kickoff) }}</div>
          <div>{{ formatTime(item.kickoff) }}</div>
        </template>

        <template #item.home="{ item }">
          <div class="font-weight-bold">{{ item.home }}</div>
          <div class="font-weight-bold">{{ item.away }}</div>
          <div v-if="['live', 'full-time'].includes(item.status)" class="text-body-2 text-medium-emphasis">
            {{ item.homeScore }} - {{ item.awayScore }}
          </div>
        </template>

        <template #item.status="{ item }">
          <v-chip :color="statusOf(item.status).color" variant="flat" size="small" label>
            {{ statusOf(item.status).title }}
          </v-chip>
        </template>

        <template #item.actions="{ item }">
          <v-btn
            v-if="can('fixtures:edit')"
            icon="mdi-pencil-outline"
            variant="text"
            size="small"
            aria-label="Edit fixture"
            @click="edit(item)"
          />
          <v-btn
            v-if="can('fixtures:delete')"
            icon="mdi-delete-outline"
            variant="text"
            size="small"
            color="error"
            aria-label="Delete fixture"
            @click="toDelete = item"
          />
        </template>
      </v-data-table>
    </v-card>
  </v-container>

  <FixtureEditorDialog v-model="editorOpen" :fixture="editing" @save="onSave" />

  <v-dialog v-model="deleteOpen" max-width="420">
    <v-card title="Delete this fixture?">
      <v-card-text v-if="toDelete">
        {{ toDelete.home }} vs {{ toDelete.away }} on {{ formatShortDay(toDelete.kickoff) }},
        {{ formatTime(toDelete.kickoff) }}. This can't be undone.
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-spacer />
        <v-btn variant="text" @click="toDelete = null">Cancel</v-btn>
        <v-btn color="error" variant="flat" @click="confirmDelete">Delete fixture</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="toast.show" color="secondary" :timeout="3000">{{ toast.text }}</v-snackbar>
</template>