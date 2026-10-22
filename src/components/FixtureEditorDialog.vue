<script setup>
// Needs Vue 3.4+ for defineModel.
import { computed, nextTick, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { LEVELS, STATUSES } from '../utils/UseFixtures'
import { dayKey, timeKey, toKickoff } from '../utils/KickOff'

const props = defineProps({
  // Pass a fixture to edit it, or null to add a new one.
  fixture: { type: Object, default: null },
})
const open = defineModel({ type: Boolean, default: false })
const emit = defineEmits(['save'])

const { xs } = useDisplay()

const blank = () => ({
  id: null,
  level: LEVELS[0],
  group: '',
  home: '',
  away: '',
  date: '',
  time: '',
  venue: '',
  status: 'scheduled',
  homeScore: null,
  awayScore: null,
  note: '',
})

const draft = ref(blank())
const formRef = ref(null)
const started = computed(() => ['live', 'full-time'].includes(draft.value.status))

watch(open, async (isOpen) => {
  if (!isOpen) return
  const f = props.fixture
  draft.value = f ? { ...f, date: dayKey(f.kickoff), time: timeKey(f.kickoff) } : blank()
  await nextTick()
  formRef.value?.resetValidation()
})

const required = (v) => !!String(v ?? '').trim() || 'This field is required'
const differentTeams = (v) =>
  String(v ?? '').trim().toLowerCase() !== draft.value.home.trim().toLowerCase() ||
  'Home and away teams must be different'
const score = (v) =>
  (v !== null && v !== '' && Number.isInteger(Number(v)) && Number(v) >= 0) || 'Enter a score of 0 or more'
const tieNeedsNote = () =>
  !(
    draft.value.status === 'full-time' &&
    !String(draft.value.group ?? '').trim() &&
    Number(draft.value.homeScore) === Number(draft.value.awayScore)
  ) ||
  !!String(draft.value.note ?? '').trim() ||
  'Knockout matches cannot end level. Add the penalty result here.'

async function save() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  const { date, time, ...rest } = draft.value
  emit('save', {
    ...rest,
    home: rest.home.trim(),
    group: String(rest.group ?? '').trim(),
    away: rest.away.trim(),
    venue: rest.venue.trim(),
    note: String(rest.note ?? '').trim(),
    homeScore: started.value ? Number(rest.homeScore) : null,
    awayScore: started.value ? Number(rest.awayScore) : null,
    kickoff: toKickoff(date, time),
  })
  open.value = false
}
</script>

<template>
  <v-dialog v-model="open" max-width="640" :fullscreen="xs" scrollable>
    <v-card :title="fixture ? 'Edit fixture' : 'Add fixture'">
      <v-card-text>
        <v-form ref="formRef" validate-on="blur" @submit.prevent="save">
          <v-row>
            <v-col cols="12" sm="6">
              <v-select v-model="draft.level" :items="LEVELS" label="Level" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                v-model="draft.status"
                :items="STATUSES"
                item-title="title"
                item-value="value"
                label="Status"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="draft.group"
                label="Group (optional)"
                hint="Leave empty for knockout matches. Group matches can end level and count towards the points table."
                persistent-hint
              />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field v-model="draft.home" label="Home team" :rules="[required]" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="draft.away" label="Away team" :rules="[required, differentTeams]" />
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field v-model="draft.date" type="date" label="Date" persistent-placeholder :rules="[required]" />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="draft.time"
                type="time"
                label="Kick-off time"
                hint="Kenyan time"
                persistent-placeholder
                :rules="[required]"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="draft.venue"
                label="Venue"
                prepend-inner-icon="mdi-map-marker-outline"
                :rules="[required]"
              />
            </v-col>

            <template v-if="started">
              <v-col cols="6">
                <v-text-field
                  v-model="draft.homeScore"
                  type="number"
                  min="0"
                  :label="`${draft.home || 'Home'} score`"
                  :rules="[score]"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="draft.awayScore"
                  type="number"
                  min="0"
                  :label="`${draft.away || 'Away'} score`"
                  :rules="[score]"
                />
              </v-col>
            </template>

            <v-col cols="12">
              <v-textarea
                v-model="draft.note"
                label="Note (optional)"
                variant="outlined"
                color="primary"
                rows="2"
                auto-grow
                hint="For example, a penalty result or why a match was postponed."
                :rules="[tieNeedsNote]"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-4">
        <v-spacer />
        <v-btn variant="text" @click="open = false">Cancel</v-btn>
        <v-btn color="primary" variant="flat" @click="save">Save fixture</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>