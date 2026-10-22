<script setup>
defineProps({
  features: {
    type: Array,
    default: () => [
      {
        icon: 'mdi-view-dashboard-outline',
        title: 'Central administration',
        text: 'One dashboard for registrations, fixtures, match results and approvals.',
      },
      {
        icon: 'mdi-account-check-outline',
        title: 'Team and player control',
        text: 'Managers register their players. Every ID or passport is verified before a player can play.',
      },
      {
        icon: 'mdi-tournament',
        title: 'Competition progression',
        text: 'Winners move up the knockout levels automatically, so there are fewer disputes and manual errors.',
      },
      {
        icon: 'mdi-timer-sand',
        title: 'Deadline governance',
        text: 'Registration and transfer countdowns stop late or unauthorised changes.',
      },
    ],
  },
})
</script>

<template>
  <v-row>
    <v-col v-for="f in features" :key="f.title" cols="12" md="6">
      <v-card class="d-flex ga-4 pa-5 h-100">
        <v-avatar color="green-tint" rounded="lg" size="52">
          <v-icon :icon="f.icon" color="primary" size="28" />
        </v-avatar>
        <div>
          <h3 class="wsc-display text-h5 mb-1">{{ f.title }}</h3>
          <p class="text-body-1 text-medium-emphasis mb-0">{{ f.text }}</p>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>