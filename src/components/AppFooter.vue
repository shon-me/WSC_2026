<script setup>
defineProps({
  title: { type: String, default: 'Wakili Sigei Cup' },
  tagline: { type: String, default: 'Where dreams meet opportunities' },
  coordinator: { type: String, default: 'Jim Hussein' },
  phone: { type: String, default: '0716210423' },
})
</script>

<template>
  <v-footer color="secondary" class="footer flex-column align-start ga-2 pa-6">
    <div class="wsc-display text-h5">{{ title }}</div>
    <div class="text-body-2 footer__muted">{{ tagline }}</div>

    <div class="d-flex flex-wrap align-center ga-2 mt-2">
      <v-icon icon="mdi-phone-outline" size="18" />
      <span>Tournament coordinator {{ coordinator }}:</span>
      <a :href="`tel:${phone}`" class="footer__link">{{ phone }}</a>
    </div>

    <div class="text-caption footer__muted mt-2">
      Terms and conditions apply. The referee's decision is final.
    </div>
  </v-footer>
</template>

<style scoped>
.footer {
  border-top: 4px solid rgb(var(--v-theme-accent));
}
.footer__muted {
  opacity: 0.75;
}
.footer__link {
  color: rgb(var(--v-theme-accent));
  font-weight: 600;
}
</style>