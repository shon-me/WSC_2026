<script setup>
import { ref } from 'vue'

defineProps({
  title: { type: String, default: 'Wakili Sigei Cup' },
  logo: { type: String, default: '' },
  registerTo: { type: [String, Object], default: '/register' },
  links: {
    type: Array,
    default: () => [
      { title: 'Home', to: '/', icon: 'mdi-home-outline' },
      { title: 'Fixtures', to: '/fixtures', icon: 'mdi-calendar-clock-outline' },
      { title: 'Results', to: '/results', icon: 'mdi-scoreboard-outline' },
      { title: 'Gallery', to: '/gallery', icon: 'mdi-image-multiple-outline' },
      { title: 'Teams', to: '/teams', icon: 'mdi-shield-outline' },
      { title: 'Patron', to: '/patron', icon: 'mdi-account-star-outline' },
    ],
  },
})

const drawer = ref(false)
</script>

<template>
  <v-app-bar color="secondary" flat>
    <v-app-bar-nav-icon class="d-md-none" aria-label="Open menu" @click="drawer = !drawer" />

    <RouterLink to="/" class="brand">
      <v-img v-if="logo" :src="logo" :width="40" :height="40" alt="" />
      <v-icon v-else icon="mdi-trophy" color="accent" size="32" />
      <span class="wsc-display brand__name">{{ title }}</span>
    </RouterLink>

    <v-spacer />

    <nav class="d-none d-md-flex ga-1 mr-2" aria-label="Main">
      <v-btn
        v-for="l in links"
        :key="l.to"
        :to="l.to"
        :prepend-icon="l.icon"
        variant="text"
        class="link"
        exact
      >
        {{ l.title }}
      </v-btn>
    </nav>

    <v-btn
      class="d-sm-none mr-1"
      color="accent"
      variant="flat"
      icon="mdi-clipboard-edit-outline"
      aria-label="Register team"
      :to="registerTo"
    />
    <v-btn
      class="d-none d-sm-inline-flex mr-2"
      color="accent"
      variant="flat"
      prepend-icon="mdi-clipboard-edit-outline"
      :to="registerTo"
    >
      Register team
    </v-btn>
  </v-app-bar>

  <v-navigation-drawer v-model="drawer" temporary color="secondary">
    <v-list nav>
      <v-list-item
        v-for="l in links"
        :key="l.to"
        :to="l.to"
        :prepend-icon="l.icon"
        :title="l.title"
        exact
        @click="drawer = false"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-inline: 8px;
  color: #fff;
  text-decoration: none;
}
.brand__name {
  font-size: 1.6rem;
}
.link.v-btn--active {
  border-radius: 0;
  box-shadow: inset 0 -3px 0 rgb(var(--v-theme-accent));
}
</style>