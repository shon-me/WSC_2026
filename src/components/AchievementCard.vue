<script setup>
// item: { year, category, title, text, image, imageAlt?, sample? }
defineProps({
  item: { type: Object, required: true },
  featured: { type: Boolean, default: false },
})
</script>

<template>
  <v-card class="ach h-100 d-flex flex-column" :class="{ 'ach--featured': featured }">
    <div class="ach__img">
      <img :src="item.image" :alt="item.imageAlt || ''" loading="lazy" />
      <v-chip class="ach__year" size="small" color="accent" variant="flat">{{ item.year }}</v-chip>
      <v-chip v-if="item.sample" class="ach__sample" size="x-small" label color="warning" variant="flat">
        Sample
      </v-chip>
    </div>

    <div class="d-flex flex-column ga-2 pa-4 flex-grow-1">
      <v-chip size="x-small" label variant="tonal" color="primary" class="align-self-start">
        {{ item.category }}
      </v-chip>
      <h3 class="wsc-display ach__title">{{ item.title }}</h3>
      <p class="text-body-2 text-medium-emphasis mb-0">{{ item.text }}</p>
    </div>
  </v-card>
</template>

<style scoped>
.ach__img {
  position: relative;
  aspect-ratio: 16 / 9;
  background: rgb(var(--v-theme-secondary));
}
.ach--featured .ach__img {
  aspect-ratio: 21 / 9;
}
.ach__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.ach__year {
  position: absolute;
  top: 12px;
  left: 12px;
  font-weight: 700;
}
.ach__sample {
  position: absolute;
  top: 12px;
  right: 12px;
}
.ach__title {
  margin: 0;
  font-size: 1.5rem;
}
.ach--featured .ach__title {
  font-size: 1.9rem;
}
</style>