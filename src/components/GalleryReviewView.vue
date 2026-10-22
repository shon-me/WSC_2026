<script setup>
// Route this with meta: { permission: 'gallery:review' } and guard it once roles exist.
import { computed, reactive, ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import MediaTile from '../components/MediaTile.vue'
import MediaLightbox from '../components/MediaLightBox.vue'
import { useGallery } from '../utils/UseGallery'
import { usePermissions } from '../utils/UsePermissions'
import { formatDay, formatShortDay, formatTime } from '../utils/KickOff'

const { pending, posted, rejected, approve, reject, remove, checksFor } = useGallery()
const { can } = usePermissions()

const tab = ref('pending')

const kind = (item) => (item.type === 'video' ? 'Video' : 'Photo')
const labelOf = (item) =>
  item.fixture
    ? `${item.fixture.home} vs ${item.fixture.away}, ${formatShortDay(item.fixture.kickoff)}`
    : 'Match record removed'
const canApprove = (item) => !checksFor(item).some((c) => c.level === 'fail')
const checkIcon = { ok: 'mdi-check-circle', warn: 'mdi-alert-outline', fail: 'mdi-close-circle' }
const checkColor = { ok: 'primary', warn: 'warning', fail: 'error' }

const toast = reactive({ show: false, text: '' })
const notify = (text) => {
  toast.text = text
  toast.show = true
}

// Approve
const onApprove = (item) => {
  const res = approve(item.id)
  notify(res.ok ? `${kind(item)} approved and posted` : res.error)
}

// Reject (a reason is required)
const rejecting = ref(null)
const reason = ref('')
const reasonForm = ref(null)
const rejectOpen = computed({
  get: () => !!rejecting.value,
  set: (v) => {
    if (!v) rejecting.value = null
  },
})
const startReject = (item) => {
  rejecting.value = item
  reason.value = ''
}
async function confirmReject() {
  const { valid } = await reasonForm.value.validate()
  if (!valid) return
  const res = reject(rejecting.value.id, reason.value)
  rejecting.value = null
  notify(res.ok ? 'Upload rejected' : res.error)
}

// Delete (admins only)
const toDelete = ref(null)
const deleteOpen = computed({
  get: () => !!toDelete.value,
  set: (v) => {
    if (!v) toDelete.value = null
  },
})
const confirmDelete = () => {
  const item = toDelete.value
  const res = remove(item.id)
  toDelete.value = null
  notify(res.ok ? `${kind(item)} deleted` : res.error)
}

const lightbox = ref(null)
const onDeleted = (type) => notify(type === 'video' ? 'Video deleted' : 'Photo deleted')
</script>

<template>
  <PageHeader
    title="Review gallery uploads"
    subtitle="Approve photos and videos once they match the fixture records. Only admins can delete posted media."
  >
    <template #actions>
      <v-btn variant="outlined" class="text-white" prepend-icon="mdi-image-multiple-outline" to="/gallery">
        View public gallery
      </v-btn>
    </template>
  </PageHeader>

  <v-container class="py-6">
    <v-tabs v-model="tab" color="primary" class="mb-4">
      <v-tab value="pending">Waiting for review ({{ pending.length }})</v-tab>
      <v-tab value="posted">Posted ({{ posted.length }})</v-tab>
      <v-tab value="rejected">Rejected ({{ rejected.length }})</v-tab>
    </v-tabs>

    <!-- Waiting for review -->
    <template v-if="tab === 'pending'">
      <v-sheet v-if="!pending.length" border rounded="lg" class="pa-8 text-center">
        <v-icon icon="mdi-check-all" size="40" color="primary" class="mb-2" />
        <p class="mb-0">Nothing is waiting for review.</p>
      </v-sheet>

      <v-card v-for="item in pending" :key="item.id" class="mb-4 overflow-hidden">
        <v-row no-gutters>
          <v-col cols="12" md="5">
            <video
              v-if="item.type === 'video'"
              :src="item.src"
              :poster="item.poster"
              controls
              playsinline
              class="review__media"
            />
            <img v-else :src="item.src" :alt="item.caption || 'Uploaded photo'" class="review__media" />
          </v-col>

          <v-col cols="12" md="7" class="pa-5">
            <template v-if="item.fixture">
              <h2 class="wsc-display text-h5 mb-1">{{ item.fixture.home }} vs {{ item.fixture.away }}</h2>
              <p class="mb-1">{{ formatDay(item.fixture.kickoff) }}, {{ formatTime(item.fixture.kickoff) }}</p>
              <div class="d-flex flex-wrap align-center ga-2 text-body-2 text-medium-emphasis">
                <v-chip size="x-small" label variant="tonal" color="primary">{{ item.fixture.level }}</v-chip>
                {{ item.fixture.venue }}
              </div>
            </template>
            <h2 v-else class="wsc-display text-h5 mb-1">Match record removed</h2>

            <p v-if="item.caption" class="font-weight-medium mt-3 mb-0">{{ item.caption }}</p>
            <p class="text-body-2 text-medium-emphasis mt-2 mb-0">
              {{ kind(item) }} by {{ item.uploader }}, uploaded {{ formatShortDay(item.uploadedAt) }},
              {{ formatTime(item.uploadedAt) }}
            </p>

            <ul class="checks mt-4">
              <li v-for="c in checksFor(item)" :key="c.text">
                <v-icon :icon="checkIcon[c.level]" :color="checkColor[c.level]" size="20" />
                <span>{{ c.text }}</span>
              </li>
            </ul>

            <div class="d-flex flex-wrap ga-3 mt-5">
              <v-btn
                v-if="can('gallery:review')"
                color="primary"
                prepend-icon="mdi-check"
                :disabled="!canApprove(item)"
                @click="onApprove(item)"
              >
                Approve and post
              </v-btn>
              <v-btn
                v-if="can('gallery:review')"
                color="error"
                variant="outlined"
                prepend-icon="mdi-close"
                @click="startReject(item)"
              >
                Reject
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </template>

    <!-- Posted -->
    <template v-else-if="tab === 'posted'">
      <v-sheet v-if="!posted.length" border rounded="lg" class="pa-8 text-center">
        <p class="mb-0">Nothing has been posted yet.</p>
      </v-sheet>

      <div v-else class="media-grid">
        <MediaTile
          v-for="(item, i) in posted"
          :key="item.id"
          :item="item"
          :label="labelOf(item)"
          @open="lightbox = i"
        >
          <template v-if="can('gallery:delete')" #actions>
            <v-btn
              icon="mdi-delete-outline"
              size="small"
              color="error"
              variant="flat"
              :aria-label="`Delete ${kind(item).toLowerCase()}`"
              @click="toDelete = item"
            />
          </template>
        </MediaTile>
      </div>
    </template>

    <!-- Rejected -->
    <template v-else>
      <v-sheet v-if="!rejected.length" border rounded="lg" class="pa-8 text-center">
        <p class="mb-0">No rejected uploads.</p>
      </v-sheet>

      <v-card v-else>
        <v-list lines="two">
          <v-list-item v-for="item in rejected" :key="item.id" :title="labelOf(item)">
            <template #prepend>
              <v-avatar rounded="lg" size="56" class="mr-3"><v-img :src="item.poster" cover /></v-avatar>
            </template>
            <template #subtitle>
              <span class="text-wrap">{{ item.rejectReason || 'No reason given.' }}</span>
            </template>
            <template v-if="can('gallery:delete')" #append>
              <v-btn
                icon="mdi-delete-outline"
                variant="text"
                color="error"
                :aria-label="`Delete ${kind(item).toLowerCase()}`"
                @click="toDelete = item"
              />
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </template>
  </v-container>

  <MediaLightbox v-model="lightbox" :items="posted" @deleted="onDeleted" />

  <v-dialog v-model="rejectOpen" max-width="480">
    <v-card title="Reject this upload?">
      <v-card-text>
        <v-form ref="reasonForm" @submit.prevent="confirmReject">
          <v-textarea
            v-model="reason"
            label="Reason"
            variant="outlined"
            color="primary"
            rows="3"
            auto-grow
            hint="For example: does not show this match, or the photo is unclear."
            :rules="[(v) => !!String(v ?? '').trim() || 'Give a reason so the decision is on record.']"
          />
        </v-form>
      </v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-spacer />
        <v-btn variant="text" @click="rejecting = null">Cancel</v-btn>
        <v-btn color="error" variant="flat" @click="confirmReject">Reject upload</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="deleteOpen" max-width="420">
    <v-card :title="`Delete this ${toDelete?.type === 'video' ? 'video' : 'photo'}?`">
      <v-card-text>It will be removed from the platform for good. This can't be undone.</v-card-text>
      <v-card-actions class="px-6 pb-4">
        <v-spacer />
        <v-btn variant="text" @click="toDelete = null">Cancel</v-btn>
        <v-btn color="error" variant="flat" @click="confirmDelete">
          Delete {{ toDelete?.type === 'video' ? 'video' : 'photo' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="toast.show" color="secondary" :timeout="3500">{{ toast.text }}</v-snackbar>
</template>

<style scoped>
.review__media {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 220px;
  max-height: 360px;
  object-fit: cover;
  background: rgb(var(--v-theme-secondary));
}
.checks {
  margin: 0;
  padding: 0;
  list-style: none;
}
.checks li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding-block: 3px;
}
</style>