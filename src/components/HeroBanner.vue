<script setup>
defineProps({
  edition: { type: String, default: '3rd edition' },
  title: { type: String, default: 'Wakili Sigei Cup' },
  tagline: { type: String, default: 'Where dreams meet opportunities' },
  note: { type: String, default: 'Team registration is free. Open to Bomet residents.' },
  registerTo: { type: [String, Object], default: '/register' },
  fixturesTo: { type: [String, Object], default: '/fixtures' },
})
</script>

<template>
  <section class="hero ma-6 rounded-lg">
    <!-- Pitch markings: centre circle, halfway line, both penalty areas, one gold arc -->
    <svg
      class="hero__pitch"
      viewBox="0 0 600 400"
      preserveAspectRatio="xMaxYMid slice"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="#fff" stroke-opacity=".28" stroke-width="2">
        <line x1="300" y1="0" x2="300" y2="400" />
        <circle cx="300" cy="200" r="90" />
        <path d="M0 110H110V290H0" />
        <path d="M110 160A60 60 0 0 1 110 240" />
        <path d="M600 110H490V290H600" />
        <path d="M490 160A60 60 0 0 0 490 240" />
      </g>
      <circle cx="300" cy="200" r="5" fill="#fff" fill-opacity=".5" />
      <path d="M160 200A140 140 0 0 1 440 200" stroke="#D4A017" stroke-width="3" />
    </svg>

    <v-container class="hero__inner">
      <v-chip color="accent" variant="flat" size="small" prepend-icon="mdi-trophy-variant" class="mb-4">
        {{ edition }}
      </v-chip>
      <h1 class="wsc-display hero__title">{{ title }}</h1>
      <p class="hero__tagline">{{ tagline }}</p>
      <p class="hero__note">{{ note }}</p>

      <div class="d-flex flex-wrap ga-3 mt-6">
        <slot name="actions">
          <v-btn color="accent" variant="flat" size="large" prepend-icon="mdi-clipboard-edit-outline" :to="registerTo">
            Register your team
          </v-btn>
          <v-btn
            variant="outlined"
            size="large"
            class="text-white"
            prepend-icon="mdi-calendar-clock-outline"
            :to="fixturesTo"
          >
            View fixtures
          </v-btn>
        </slot>
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
    #0a3f36 45%,
    rgb(var(--v-theme-primary)) 100%
  );
}
.hero__pitch {
  position: absolute;
  inset: 0 0 0 auto;
  width: min(75%, 860px);
  height: 100%;
  -webkit-mask-image: linear-gradient(to right, transparent, #000 35%);
  mask-image: linear-gradient(to right, transparent, #000 35%);
}
.hero__inner {
  position: relative;
  padding-block: clamp(56px, 10vw, 128px);
}
.hero__title {
  margin: 0;
  font-size: clamp(3rem, 9vw, 6rem);
  text-wrap: balance;
}
.hero__tagline {
  max-width: 36rem;
  margin: 16px 0 0;
  font-size: 1.35rem;
}
.hero__note {
  margin: 8px 0 0;
  opacity: 0.8;
}
</style>