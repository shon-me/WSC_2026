<script setup>
// Needs Vue 3.4+ for defineModel.
import { computed } from 'vue'
import VerificationBadge from '../components/Verificationbadge.vue'

const props = defineProps({
  max: { type: Number, default: 24 },
  readonly: { type: Boolean, default: false },
})

const players = defineModel({ type: Array, default: () => [] })

const blank = () => ({
  id: crypto.randomUUID(),
  name: '',
  dob: '',
  idNumber: '',
  phone: '',
  status: 'pending',
})

const full = computed(() => players.value.length >= props.max)

const add = () => {
  if (!full.value) players.value = [...players.value, blank()]
}
const remove = (id) => {
  players.value = players.value.filter((p) => p.id !== id)
}

// Under-18 players must register with a school ID.
const isMinor = (dob) => {
  if (!dob) return false
  const cutoff = new Date()
  cutoff.setFullYear(cutoff.getFullYear() - 18)
  return new Date(dob) > cutoff
}
</script>

<template>
  <section>
    <div class="d-flex flex-wrap align-center ga-3 mb-4">
      <h2 class="wsc-display text-h4">Registered players</h2>
      <v-chip :color="full ? 'accent' : 'primary'" variant="flat" size="small">
        {{ players.length }} of {{ max }}
      </v-chip>
      <v-spacer />
      <v-btn
        v-if="!readonly && players.length"
        color="primary"
        prepend-icon="mdi-account-plus-outline"
        :disabled="full"
        @click="add"
      >
        Add player
      </v-btn>
    </div>

    <v-sheet v-if="!players.length" border rounded="lg" class="pa-8 text-center">
      <v-icon icon="mdi-account-group-outline" size="40" color="primary" class="mb-2" />
      <p class="mb-4">No players yet. Add up to {{ max }}, each with an ID or school ID.</p>
      <v-btn v-if="!readonly" color="primary" prepend-icon="mdi-account-plus-outline" @click="add">
        Add first player
      </v-btn>
    </v-sheet>

    <v-card v-else>
      <v-table class="roster">
        <thead>
          <tr>
            <th>No.</th>
            <th>Player name</th>
            <th>Date of birth</th>
            <th>ID or school ID</th>
            <th>Phone</th>
            <th>Status</th>
            <th v-if="!readonly"><span class="sr-only">Remove</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(p, i) in players" :key="p.id">
            <td>{{ i + 1 }}</td>
            <td style="min-width: 200px">
              <v-text-field v-model="p.name" aria-label="Player name" density="compact" hide-details :readonly="readonly" />
            </td>
            <td style="min-width: 160px">
              <v-text-field v-model="p.dob" type="date" aria-label="Date of birth" density="compact" hide-details :readonly="readonly" />
            </td>
            <td style="min-width: 160px">
              <v-text-field v-model="p.idNumber" aria-label="ID or school ID" density="compact" hide-details :readonly="readonly" />
            </td>
            <td style="min-width: 150px">
              <v-text-field v-model="p.phone" type="tel" aria-label="Phone" density="compact" hide-details :readonly="readonly" />
            </td>
            <td>
              <div class="d-flex flex-column ga-1 align-start">
                <VerificationBadge :status="p.status" />
                <v-chip v-if="isMinor(p.dob)" size="x-small" label variant="outlined">Under 18: school ID</v-chip>
              </div>
            </td>
            <td v-if="!readonly">
              <v-btn
                icon="mdi-delete-outline"
                variant="text"
                size="small"
                aria-label="Remove player"
                @click="remove(p.id)"
              />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </section>
</template>

<style scoped>
.roster :deep(table) {
  min-width: 920px;
}
.roster :deep(td) {
  padding-block: 6px;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
</style>