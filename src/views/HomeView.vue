<script setup>
import HeroBanner from '../components/HeroBanner.vue'
import GovernanceLevels from '../components/GovernanceLevels.vue'
import FeatureGrid from '../components/FeatureGrid.vue'
import CountdownTimer from '../components/CountdownTimer.vue'
import FixtureCard from '../components/FixtureCard.vue'
import SponsorStrip from '../components/Sponsorstrip.vue'

// Sample data: replace with your API data and the real registration deadline.
const deadline = '2026-11-30T23:59:59+03:00'

const fixtures = [
  { id: 1, level: 'Ward', home: 'Village Stars', away: 'Ward Rangers', status: 'live', homeScore: 1, awayScore: 0, venue: 'Ward grounds' },
  { id: 2, level: 'Ward', home: 'Hillside FC', away: 'River United', status: 'scheduled', kickoff: '2026-10-24T15:00:00+03:00', venue: 'Ward grounds' },
  { id: 3, level: 'Location', home: 'Valley Boys', away: 'Town Select', status: 'full-time', homeScore: 2, awayScore: 2, note: 'Valley Boys won 4-3 on penalties' },
]
</script>

<template>
  <HeroBanner />

  <v-container class="py-10">
    <h2 class="wsc-display text-h3 mb-2">From village to county finals</h2>
    <p class="text-body-1 text-medium-emphasis mb-6">
      Teams play knockout football at every level. Two teams from each stage advance to the next.
    </p>
    <GovernanceLevels active="Ward" />

    <v-row class="mt-10">
      <v-col cols="12" md="8">
        <h2 class="wsc-display text-h3 mb-4">How the cup is run</h2>
        <FeatureGrid />
      </v-col>
      <v-col cols="12" md="4">
        <h2 class="wsc-display text-h3 mb-4">Deadline</h2>
        <CountdownTimer :target="deadline" />
      </v-col>
    </v-row>

    <h2 class="wsc-display text-h3 mt-10 mb-4">Latest fixtures</h2>
    <v-row>
      <v-col v-for="f in fixtures" :key="f.id" cols="12" sm="6" lg="4">
        <FixtureCard v-bind="f" />
      </v-col>
    </v-row>

    <div class="mt-10">
      <SponsorStrip />
    </div>
  </v-container>
</template>