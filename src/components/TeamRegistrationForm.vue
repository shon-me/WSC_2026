<script setup>
import { reactive, ref } from 'vue'

defineProps({ entryNo: { type: String, default: '' } })
const emit = defineEmits(['submit'])

const roles = [
  { key: 'coach', label: 'Coach' },
  { key: 'manager', label: 'Team manager' },
  { key: 'captain', label: 'Team captain' },
  { key: 'secretary', label: 'Secretary' },
  { key: 'chairperson', label: 'Chairperson' },
]

const terms = [
  'All players must read and understand the tournament rules and sign the registration form. Violations may lead to disqualification.',
  'Participation is limited to Bomet residents only.',
  'Maximum of 24 players and 3 officials shall be submitted during registration.',
  'No player is allowed to play for more than one team during the tournament. Any player or team found in breach shall be disqualified.',
  'Players must present valid identification documents including National ID, School ID (for under-18 players) or other approved documents.',
  'School ID holders aged above 18 years may be required to provide additional supporting documents such as a Birth Certificate or National ID Waiting Card.',
  'All registered players must be registered with SHA. Organizers shall not be liable for injuries, losses or damages sustained during the tournament.',
  'Teams authorize the organizers to use team names, photographs and player images for promotion, publicity and advertising.',
  'Organizers reserve the right to disqualify teams involved in violence, hooliganism, unsportsmanlike conduct or misconduct.',
  'Players must be medically fit and in good health during registration, participation and on match days.',
]

const form = reactive({
  club: '',
  subCounty: '',
  ward: '',
  address: '',
  town: '',
  uniform: '',
  officials: Object.fromEntries(roles.map((r) => [r.key, { name: '', mobile: '' }])),
  accepted: false,
})

const formRef = ref(null)

const required = (v) => !!String(v ?? '').trim() || 'This field is required'
const mobile = (v) =>
  /^(?:\+254|0)[17]\d{8}$/.test(String(v ?? '').replace(/\s/g, '')) ||
  'Enter a Kenyan mobile number, for example 0712 345 678'
const accepted = (v) => v || 'Accept the terms to continue'

async function submit() {
  const { valid } = await formRef.value.validate()
  if (valid) emit('submit', JSON.parse(JSON.stringify(form)))
}
</script>

<template>
  <v-form ref="formRef" validate-on="blur" @submit.prevent="submit">
    <div class="d-flex flex-wrap align-center ga-2 mb-6">
      <h2 class="wsc-display text-h4 mr-2">Team registration</h2>
      <v-chip v-if="entryNo" color="secondary" variant="flat" size="small">Entry {{ entryNo }}</v-chip>
      <v-chip color="primary" variant="flat" size="small" prepend-icon="mdi-check-circle-outline">
        Free to register
      </v-chip>
    </div>

    <h3 class="wsc-display text-h5 mb-3">Club details</h3>
    <v-row>
      <v-col cols="12">
        <v-text-field v-model="form.club" label="Name of club" :rules="[required]" />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="form.subCounty" label="Sub-county" :rules="[required]" />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="form.ward" label="Ward" :rules="[required]" />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="form.address" label="Address of club" :rules="[required]" />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field v-model="form.town" label="Town or centre" :rules="[required]" />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="form.uniform"
          label="Colour of uniform"
          prepend-inner-icon="mdi-tshirt-crew-outline"
          :rules="[required]"
        />
      </v-col>
    </v-row>

    <h3 class="wsc-display text-h5 mt-6 mb-3">Club officials</h3>
    <v-row v-for="r in roles" :key="r.key">
      <v-col cols="12" md="7">
        <v-text-field
          v-model="form.officials[r.key].name"
          :label="`${r.label}'s full name`"
          :rules="[required]"
        />
      </v-col>
      <v-col cols="12" md="5">
        <v-text-field
          v-model="form.officials[r.key].mobile"
          :label="`${r.label}'s mobile`"
          type="tel"
          inputmode="tel"
          prepend-inner-icon="mdi-phone-outline"
          :rules="[required, mobile]"
        />
      </v-col>
    </v-row>

    <h3 class="wsc-display text-h5 mt-6 mb-3">Terms and conditions</h3>
    <v-expansion-panels class="mb-3" variant="accordion">
      <v-expansion-panel title="Read the terms of participation">
        <v-expansion-panel-text>
          <ol class="terms">
            <li v-for="t in terms" :key="t">{{ t }}</li>
          </ol>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-checkbox
      v-model="form.accepted"
      :rules="[accepted]"
      label="We confirm that the above are our bona fide club officials and that we have read and accepted all terms and conditions."
    />

    <v-btn type="submit" color="primary" size="large" block class="mt-2">Continue to players</v-btn>
  </v-form>
</template>

<style scoped>
.terms {
  padding-left: 1.25rem;
}
.terms li {
  margin-bottom: 8px;
}
</style>