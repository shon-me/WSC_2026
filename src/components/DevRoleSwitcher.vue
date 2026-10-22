<script setup>
// Development helper: switch roles to see how each page behaves. Render it only in dev:
//   <DevRoleSwitcher v-if="isDev" />   with   const isDev = import.meta.env.DEV
import { ROLES, usePermissions } from '../utils/UsePermissions'

const { role } = usePermissions()
</script>

<template>
  <v-sheet class="dev" rounded="lg" elevation="4">
    <v-select v-model="role" :items="ROLES" label="Test as role" density="compact" hide-details />
  </v-sheet>
</template>

<style scoped>
.dev {
  position: fixed;
  left: 12px;
  bottom: 12px;
  z-index: 2000;
  width: 200px;
  padding: 8px;
}
</style>