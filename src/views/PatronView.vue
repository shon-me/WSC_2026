<script setup>
import { computed, ref } from 'vue'
import PatronHero from '../components/PatronHero.vue'
import SectionHeading from '../components/SectionHeading.vue'
import FactCard from '../components/FactCard.vue'
import TimelineList from '../components/TimeLineList.vue'
import AchievementCard from '../components/AchievementCard.vue'
import GoalCard from '../components/GoalCard.vue'
import VideoCard from '../components/VideoCard.vue'
import MediaTile from '../components/MediaTile.vue'
import PatronMediaDialog from '../components/PatronMediaDialog.vue'
import { patron } from '../utils/Patron'

// Achievements, filtered by category
const categories = ['All', ...new Set(patron.achievements.map((a) => a.category))]
const category = ref('All')
const achievements = computed(() =>
  category.value === 'All' ? patron.achievements : patron.achievements.filter((a) => a.category === category.value),
)

// Videos and photos open in one dialog
const viewing = ref(null)
const playVideo = (v) => {
  viewing.value = { kind: 'video', title: v.title, caption: v.text, src: v.src, poster: v.poster, youtubeId: v.youtubeId }
}
const openPhoto = (p) => {
  viewing.value = { kind: 'image', title: p.caption, caption: p.caption, src: p.src }
}
</script>

<template>
  <PatronHero
    :honorific="patron.honorific"
    :name="patron.name"
    :title="patron.title"
    :role="patron.role"
    :tagline="patron.tagline"
    :portrait="patron.portrait"
  >
    <template #actions>
      <v-btn color="accent" variant="flat" size="large" prepend-icon="mdi-play-circle-outline" href="#videos">
        Watch videos
      </v-btn>
      <v-btn variant="outlined" size="large" class="text-white" prepend-icon="mdi-trophy-outline" href="#achievements">
        Achievements
      </v-btn>
    </template>
  </PatronHero>

  <v-container class="py-10">
    <!-- At a glance -->
    <v-row>
      <v-col v-for="f in patron.facts" :key="f.label" cols="12" sm="6" lg="3">
        <FactCard v-bind="f" />
      </v-col>
    </v-row>

    <!-- His story -->
    <section id="story" class="block">
      <SectionHeading title="His story" subtitle="A lawyer by profession and a public servant by calling." />
      <v-row>
        <v-col cols="12" md="6">
          <p v-for="(p, i) in patron.bio" :key="i" class="text-body-1 mb-4">{{ p }}</p>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-5 h-100">
            <h3 class="wsc-display text-h5 mb-4">Career</h3>
            <TimelineList :items="patron.career" />
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-5 h-100">
            <h3 class="wsc-display text-h5 mb-4">Education</h3>
            <TimelineList :items="patron.education" />
          </v-card>
        </v-col>
      </v-row>
    </section>

    <!-- Achievements -->
    <section id="achievements" class="block">
      <SectionHeading title="Achievements" subtitle="Milestones in law, public service and the community." />

      <v-chip-group v-model="category" mandatory selected-class="bg-primary" class="mb-4">
        <v-chip v-for="c in categories" :key="c" :value="c" filter variant="outlined">{{ c }}</v-chip>
      </v-chip-group>

      <div class="ach-grid">
        <AchievementCard
          v-for="(a, i) in achievements"
          :key="a.id"
          :item="a"
          :featured="achievements.length >= 3 && i === 0"
          :class="{ 'is-featured': achievements.length >= 3 && i === 0 }"
        />
      </div>
    </section>

    <!-- Life goals -->
    <section id="goals" class="block">
      <SectionHeading title="Life goals" subtitle="The priorities he has spoken and worked for in public life." />
      <v-row>
        <v-col v-for="g in patron.goals" :key="g.title" cols="12" md="6">
          <GoalCard :goal="g" />
        </v-col>
      </v-row>
    </section>

    <!-- Videos -->
    <section id="videos" class="block">
      <SectionHeading title="Videos" subtitle="Highlights and messages from the cup." />
      <v-row>
        <v-col v-for="v in patron.videos" :key="v.id" cols="12" sm="6" lg="4">
          <VideoCard :video="v" @play="playVideo(v)" />
        </v-col>
      </v-row>
    </section>

    <!-- Photos -->
    <section id="photos" class="block">
      <SectionHeading title="In pictures" subtitle="The patron with the teams, the players and the fans." />
      <div class="media-grid">
        <MediaTile
          v-for="(p, i) in patron.photos"
          :key="p.id"
          :item="p"
          :class="{ 'media-grid__feature': patron.photos.length >= 3 && i === 0 }"
          @open="openPhoto(p)"
        />
      </div>
    </section>

    <!-- Join the cup -->
    <v-sheet color="secondary" rounded="lg" class="join pa-8 mt-12">
      <h2 class="wsc-display join__title">Play in the Wakili Sigei Cup</h2>
      <p class="join__text">Where dreams meet opportunities. Register your team, follow the fixtures and share your photos.</p>
      <div class="d-flex flex-wrap ga-3 mt-5">
        <v-btn color="accent" variant="flat" size="large" to="/register">Register your team</v-btn>
        <v-btn variant="outlined" size="large" class="text-white" to="/fixtures">See fixtures</v-btn>
        <v-btn variant="outlined" size="large" class="text-white" to="/gallery">Fans gallery</v-btn>
      </div>
    </v-sheet>
  </v-container>

  <PatronMediaDialog v-model="viewing" />
</template>

<style scoped>
.block {
  margin-top: 64px;
  scroll-margin-top: calc(var(--v-layout-top, 64px) + 8px);
}

.ach-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-auto-flow: dense;
  gap: 16px;
}
@media (min-width: 640px) {
  .ach-grid > .is-featured {
    grid-column: span 2;
  }
}

.join__title {
  margin: 0;
  font-size: clamp(2rem, 5vw, 3rem);
}
.join__text {
  max-width: 36rem;
  margin: 8px 0 0;
  font-size: 1.1rem;
  opacity: 0.9;
}
</style>