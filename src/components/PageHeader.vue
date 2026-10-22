<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <header class="head">
    <v-container class="head__inner">
      <h1 class="wsc-display head__title">{{ title }}</h1>
      <p v-if="subtitle" class="head__sub">{{ subtitle }}</p>
      <div v-if="$slots.actions" class="d-flex flex-wrap ga-3 mt-5">
        <slot name="actions" />
      </div>
    </v-container>
  </header>
</template>

<style scoped>
.head {
  position: relative;
  overflow: hidden;
  color: #fff;
  background: linear-gradient(
    115deg,
    rgb(var(--v-theme-secondary)) 0%,
    #0a3f36 50%,
    rgb(var(--v-theme-primary)) 100%
  );
}
/* Centre-circle ring with a gold arc, echoing the home page hero */
.head::after {
  content: '';
  position: absolute;
  right: -90px;
  top: 50%;
  width: 300px;
  height: 300px;
  transform: translateY(-50%);
  border-radius: 50%;
  border: 2px solid rgb(255 255 255 / 0.22);
  border-top-color: rgb(var(--v-theme-accent));
  pointer-events: none;
}
.head__inner {
  position: relative;
  padding-block: clamp(32px, 6vw, 64px);
}
.head__title {
  margin: 0;
  font-size: clamp(2.5rem, 7vw, 4rem);
}
.head__sub {
  max-width: 40rem;
  margin: 12px 0 0;
  font-size: 1.15rem;
  opacity: 0.9;
}
</style>