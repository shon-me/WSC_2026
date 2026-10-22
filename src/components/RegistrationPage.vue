<script setup>
import { ref } from 'vue'
import TeamRegistrationForm from '@/components/TeamRegistrationForm.vue'
import PlayerRosterTable from '@/components/PlayerRosterTable.vue'

const players = ref([])
const onClub = (club) => console.log(club) // post to your API
</script>

<template>
  <v-container>
    <TeamRegistrationForm entry-no="SEN036" @submit="onClub" />
    <PlayerRosterTable v-model="players" class="mt-10" />
  </v-container>
</template>