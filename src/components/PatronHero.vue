<script setup>
defineProps({
  honorific: { type: String, default: '' },
  name: { type: String, required: true },
  title: { type: String, default: '' },
  role: { type: String, default: '' },
  tagline: { type: String, default: '' },
  // { src, alt, sample }
  portrait: { type: Object, required: true },
})
</script>

<template>
  <section class="hero">
    <v-container class="hero__inner">
      <div class="hero__text">
        <v-chip v-if="role" color="accent" variant="flat" size="small" prepend-icon="mdi-star-outline" class="mb-4">
          {{ role }}
        </v-chip>
        <h1 class="wsc-display hero__name">
          <span v-if="honorific" class="hero__honorific">{{ honorific }}</span>
          {{ name }}
        </h1>
        <p v-if="title" class="hero__title">{{ title }}</p>
        <p v-if="tagline" class="hero__tagline">{{ tagline }}</p>
        <div class="d-flex flex-wrap ga-3 mt-6">
          <slot name="actions" />
        </div>
      </div>

      <div class="hero__portrait">
        <div class="ring">
          <img :src="portrait.src" :alt="portrait.alt" />
        </div>
        <v-chip v-if="portrait.sample" size="x-small" label color="warning" variant="flat" class="hero__sample">
          Sample photo
        </v-chip>
      </div>
    </v-container>
  </section>
</template>

<style scoped>
.hero {
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
.hero__inner {
  display: grid;
  gap: 40px;
  align-items: center;
  padding-block: clamp(40px, 8vw, 96px);
}
.hero__portrait {
  position: relative;
  order: -1; /* portrait first on phones */
}
.ring {
  position: relative;
  width: min(70vw, 340px);
  aspect-ratio: 1;
  margin-inline: auto;
  border-radius: 50%;
}
.ring img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block;
}
/* Centre-circle ring with a gold arc, like the pitch markings on the home page */
.ring::before {
  content: '';
  position: absolute;
  inset: -16px;
  border-radius: 50%;
  border: 2px solid rgb(255 255 255 / 0.25);
  border-top-color: rgb(var(--v-theme-accent));
  border-right-color: rgb(var(--v-theme-accent));
}
.hero__sample {
  position: absolute;
  bottom: -14px;
  left: 50%;
  transform: translateX(-50%);
}

.hero__name {
  margin: 0;
  font-size: clamp(2.75rem, 8vw, 5.5rem);
  text-wrap: balance;
}
.hero__honorific {
  color: rgb(var(--v-theme-accent));
}
.hero__title {
  margin: 12px 0 0;
  font-size: 1.35rem;
  font-weight: 600;
}
.hero__tagline {
  margin: 6px 0 0;
  font-size: 1.15rem;
  opacity: 0.85;
}

@media (min-width: 960px) {
  .hero__inner {
    grid-template-columns: 1.3fr 1fr;
  }
  .hero__portrait {
    order: 0;
  }
  .ring {
    width: min(100%, 380px);
  }
}
</style>