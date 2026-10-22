<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
import AppFooter from '@/components/AppFooter.vue'
import DevRoleSwitcher from '@/components/DevRoleSwitcher.vue'
const isDev = import.meta.env.DEV
</script>

<template>
  <v-app>
    <AppNavbar />
    <v-main>
      <RouterView />
    </v-main>
    <AppFooter />
    <DevRoleSwitcher v-if="isDev" />
  </v-app>
</template>
