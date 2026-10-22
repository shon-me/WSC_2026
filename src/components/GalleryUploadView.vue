<script setup>
// Needs Vuetify 3.4+ (subheaders inside v-select items).
// Route this with meta: { permission: 'gallery:upload' } and guard it once login exists.
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import { useGallery } from '../utils/UseGallery'
import { usePermissions } from '../utils/UsePermissions'
import { capturePoster } from '../utils/VideoPoster'
import { dayKey, formatDay, formatShortDay, formatTime } from '../utils/KickOff'

const { playedFixtures, checkAlignment, submit } = useGallery()
const { can } = usePermissions()

const ACCEPT = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
const MAX_FILES = 10
const MAX_IMAGE_MB = 10
const MAX_VIDEO_MB = 100

const today = dayKey(new Date())

// Which match
const mode = ref('match') // 'match' | 'date'
const fixtureId = ref(null)
const date = ref('')

// Details
const credit = ref('')
const caption = ref('')
const agreed = ref(false)

// Files: { id, file, type, src, name, size, capturedOn }
const files = ref([])
const fileErrors = ref([])
const dragging = ref(false)
const picker = ref(null)

const formRef = ref(null)
const submitting = ref(false)
const submitError = ref('')
const done = ref(null) // { count, match } once submitted

// Matches that have started, newest first, grouped under their day
const matchItems = computed(() => {
  const list = []
  let lastDay = ''
  for (const f of [...playedFixtures.value].reverse()) {
    const d = dayKey(f.kickoff)
    if (d !== lastDay) {
      list.push({ type: 'subheader', title: formatDay(d) })
      lastDay = d
    }
    list.push({
      title: `${formatTime(f.kickoff)}: ${f.home} vs ${f.away}`,
      value: f.id,
      props: { subtitle: `${f.level}, ${f.venue}` },
    })
  }
  return list
})

const dayMatches = computed(() =>
  date.value ? playedFixtures.value.filter((f) => dayKey(f.kickoff) === date.value) : [],
)

watch(mode, () => {
  fixtureId.value = null
  date.value = ''
})
// One match on that day: pick it for them
watch(date, () => {
  fixtureId.value = dayMatches.value.length === 1 ? dayMatches.value[0].id : null
})

const fixture = computed(() => playedFixtures.value.find((f) => f.id === fixtureId.value) ?? null)
const matchDay = computed(() => (fixture.value ? dayKey(fixture.value.kickoff) : date.value))

const chosen = (v) => !!v || 'Choose the match your files are from.'
const dateRule = (v) =>
  !v ? 'Choose the date you took them.' : v > today ? 'Pick a date that has already happened.' : true
const creditRule = (v) => !!String(v ?? '').trim() || 'Enter the name to credit.'
const agreedRule = (v) => v || 'Please confirm before submitting.'

// Files
function addFiles(list) {
  const errors = []
  for (const file of Array.from(list)) {
    const type = file.type.startsWith('video/') ? 'video' : file.type.startsWith('image/') ? 'image' : null
    const maxMb = type === 'video' ? MAX_VIDEO_MB : MAX_IMAGE_MB
    if (!ACCEPT.includes(file.type)) {
      errors.push(`${file.name}: use a JPG, PNG or WebP photo, or an MP4, WebM or MOV video.`)
    } else if (file.size > maxMb * 1024 * 1024) {
      errors.push(`${file.name}: too large. Photos can be up to ${MAX_IMAGE_MB} MB and videos up to ${MAX_VIDEO_MB} MB.`)
    } else if (files.value.length >= MAX_FILES) {
      errors.push(`${file.name}: you can add up to ${MAX_FILES} files at a time.`)
    } else {
      files.value.push({
        id: crypto.randomUUID(),
        file,
        type,
        src: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        capturedOn: dayKey(file.lastModified),
      })
    }
  }
  fileErrors.value = errors
}
const onPick = (e) => {
  addFiles(e.target.files)
  e.target.value = ''
}
const onDrop = (e) => {
  dragging.value = false
  addFiles(e.dataTransfer.files)
}
const removeFile = (id) => {
  const i = files.value.findIndex((f) => f.id === id)
  if (i >= 0) {
    URL.revokeObjectURL(files.value[i].src)
    files.value.splice(i, 1)
  }
}

// Soft check: the day the file was saved should match the match day. Admins make the final call.
const mismatch = (f) => !!matchDay.value && f.capturedOn !== matchDay.value
const anyMismatch = computed(() => files.value.some(mismatch))

async function onSubmit() {
  submitError.value = ''
  const { valid } = await formRef.value.validate()
  if (!valid) return
  if (!files.value.length) {
    fileErrors.value = ['Add at least one photo or video.']
    return
  }

  const check = checkAlignment({ fixtureId: fixtureId.value, date: mode.value === 'date' ? date.value : '' })
  if (!check.ok) {
    submitError.value = check.error
    return
  }

  submitting.value = true
  const extras = await Promise.all(files.value.map((f) => (f.type === 'video' ? capturePoster(f.src) : null)))
  const res = submit({
    fixtureId: fixtureId.value,
    date: mode.value === 'date' ? date.value : '',
    credit: credit.value,
    caption: caption.value,
    files: files.value.map((f, i) => ({
      type: f.type,
      src: f.src,
      capturedOn: f.capturedOn,
      poster: extras[i]?.poster ?? null,
      duration: extras[i]?.duration ?? null,
    })),
  })
  submitting.value = false

  if (!res.ok) {
    submitError.value = res.error
    return
  }
  done.value = { count: files.value.length, match: `${fixture.value.home} vs ${fixture.value.away}` }
  files.value = [] // keep the object URLs alive: the pending uploads still use them
}

const again = () => {
  done.value = null
  fixtureId.value = null
  date.value = ''
  caption.value = ''
  agreed.value = false
}

onBeforeUnmount(() => {
  if (!done.value) files.value.forEach((f) => URL.revokeObjectURL(f.src))
})

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`
</script>

<template>
  <PageHeader
    title="Upload to the fans gallery"
    subtitle="Share photos and videos from matches. An admin checks every upload before it appears."
  />

  <v-container class="py-6 upload">
    <v-sheet v-if="!can('gallery:upload')" border rounded="lg" class="pa-8 text-center">
      <v-icon icon="mdi-account-lock-outline" size="40" color="primary" class="mb-2" />
      <p class="mb-4">Log in to upload photos and videos.</p>
      <v-btn color="primary" to="/login">Log in</v-btn>
    </v-sheet>

    <v-sheet v-else-if="done" border rounded="lg" class="pa-8 text-center">
      <v-icon icon="mdi-check-circle-outline" size="48" color="primary" class="mb-2" />
      <h2 class="wsc-display text-h4 mb-2">Thanks, your upload is with our admins</h2>
      <p class="mb-6">
        {{ done.count }} {{ done.count === 1 ? 'file' : 'files' }} from {{ done.match }}. They will appear in the
        gallery once an admin has checked them against the match record.
      </p>
      <div class="d-flex flex-wrap justify-center ga-3">
        <v-btn color="primary" @click="again">Upload more</v-btn>
        <v-btn variant="outlined" to="/gallery">Back to the gallery</v-btn>
      </div>
    </v-sheet>

    <v-form v-else ref="formRef" validate-on="blur" @submit.prevent="onSubmit">
      <h2 class="wsc-display text-h4 mb-3">Which match?</h2>
      <v-btn-toggle v-model="mode" mandatory divided color="primary" variant="outlined" class="mb-4">
        <v-btn value="match">I know the match</v-btn>
        <v-btn value="date">I only know the date</v-btn>
      </v-btn-toggle>

      <v-select
        v-if="mode === 'match'"
        v-model="fixtureId"
        :items="matchItems"
        label="Match"
        hint="Only matches that have started are listed."
        persistent-hint
        :rules="[chosen]"
      />

      <template v-else>
        <v-text-field
          v-model="date"
          type="date"
          label="Date you took them"
          :max="today"
          persistent-placeholder
          :rules="[dateRule]"
        />
        <v-alert v-if="date && date <= today && !dayMatches.length" type="info" variant="tonal" class="mb-4">
          No matches were played on {{ formatDay(date) }}. Pick a date that has fixtures, or check the
          <router-link to="/fixtures">fixtures page</router-link>.
        </v-alert>
        <v-radio-group v-else-if="dayMatches.length" v-model="fixtureId" color="primary" :rules="[chosen]">
          <template #label>
            <span class="font-weight-bold">
              {{ dayMatches.length === 1 ? 'Your match' : 'Which of these matches?' }}
            </span>
          </template>
          <v-radio v-for="f in dayMatches" :key="f.id" :value="f.id">
            <template #label>
              <div>
                <span class="font-weight-bold">{{ formatTime(f.kickoff) }}</span>
                {{ f.home }} vs {{ f.away }}
                <div class="text-body-2 text-medium-emphasis">{{ f.level }}, {{ f.venue }}</div>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </template>

      <h2 class="wsc-display text-h4 mt-8 mb-3">Your photos and videos</h2>
      <div
        class="drop"
        :class="{ 'drop--over': dragging }"
        @dragover.prevent="dragging = true"
        @dragleave="dragging = false"
        @drop.prevent="onDrop"
      >
        <v-icon icon="mdi-cloud-upload-outline" size="40" color="primary" />
        <p class="mb-3">Drag photos or videos here, or</p>
        <v-btn color="primary" variant="outlined" @click="picker.click()">Choose files</v-btn>
        <input ref="picker" type="file" multiple hidden :accept="ACCEPT.join(',')" @change="onPick" />
        <p class="text-body-2 text-medium-emphasis mt-3 mb-0">
          JPG, PNG or WebP photos up to {{ MAX_IMAGE_MB }} MB. MP4, WebM or MOV videos up to {{ MAX_VIDEO_MB }} MB.
          Up to {{ MAX_FILES }} files at a time.
        </p>
      </div>

      <v-alert v-if="fileErrors.length" type="error" variant="tonal" class="mt-3">
        <div v-for="e in fileErrors" :key="e">{{ e }}</div>
      </v-alert>
      <v-alert v-if="anyMismatch" color="gold-tint" variant="flat" icon="mdi-alert-outline" class="mt-3">
        Some files look like they were saved on a different day from the match. You can still submit them. An
        admin will check them against the fixture.
      </v-alert>

      <div v-if="files.length" class="previews mt-4">
        <figure v-for="f in files" :key="f.id" class="preview">
          <img v-if="f.type === 'image'" :src="f.src" :alt="f.name" />
          <video v-else :src="f.src" muted playsinline preload="metadata" />
          <v-btn
            icon="mdi-close"
            size="x-small"
            color="secondary"
            class="preview__x"
            aria-label="Remove file"
            @click="removeFile(f.id)"
          />
          <figcaption>
            <span class="preview__name">{{ f.name }}</span>
            <span class="text-medium-emphasis">{{ mb(f.size) }}</span>
            <v-chip v-if="mismatch(f)" size="x-small" label color="warning" variant="flat">
              Saved {{ formatShortDay(f.capturedOn) }}
            </v-chip>
          </figcaption>
        </figure>
      </div>

      <h2 class="wsc-display text-h4 mt-8 mb-3">Details</h2>
      <v-text-field
        v-model="credit"
        label="Name to credit"
        hint="Shown next to your photos and videos."
        :rules="[creditRule]"
      />
      <v-text-field v-model="caption" label="Caption (optional)" counter="140" maxlength="140" />
      <v-checkbox
        v-model="agreed"
        :rules="[agreedRule]"
        label="I took these photos and videos, or I have permission to share them, and I agree they can be shown on the Wakili Sigei Cup site."
      />

      <v-alert v-if="submitError" type="error" variant="tonal" class="mb-4">{{ submitError }}</v-alert>

      <v-btn type="submit" color="primary" size="large" block :loading="submitting">Submit for review</v-btn>
    </v-form>
  </v-container>
</template>

<style scoped>
.upload {
  max-width: 820px;
}
.drop {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 20px;
  text-align: center;
  border: 2px dashed rgb(var(--v-theme-primary));
  border-radius: 12px;
  background: rgb(var(--v-theme-surface));
  transition: background 0.2s ease;
}
.drop--over {
  background: rgb(var(--v-theme-green-tint));
}

.previews {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}
.preview {
  position: relative;
  margin: 0;
  min-width: 0;
}
.preview img,
.preview video {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 10px;
  background: rgb(var(--v-theme-secondary));
}
.preview__x {
  position: absolute;
  top: 6px;
  right: 6px;
}
.preview figcaption {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  margin-top: 6px;
  font-size: 0.85rem;
}
.preview__name {
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
}
</style>