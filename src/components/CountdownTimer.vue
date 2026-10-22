<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps({
  target: { type: [String, Date, Number], required: true },
  label: { type: String, default: 'Registration closes in' },
  closedLabel: { type: String, default: 'Registration is closed' },
})
const emit = defineEmits(['expired'])

const now = ref(Date.now())
let timer

const remaining = computed(() => Math.max(0, new Date(props.target).getTime() - now.value))
const expired = computed(() => remaining.value === 0)

const parts = computed(() => {
  const s = Math.floor(remaining.value / 1000)
  return [
    { label: 'days', value: Math.floor(s / 86400) },
    { label: 'hours', value: Math.floor((s % 86400) / 3600) },
    { label: 'minutes', value: Math.floor((s % 3600) / 60) },
    { label: 'seconds', value: s % 60 },
  ]
})

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now()
    if (expired.value) {
      clearInterval(timer)
      emit('expired')
    }
  }, 1000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <v-sheet color="gold-tint" rounded="lg" class="pa-4" role="timer">
    <div class="d-flex align-center ga-2 font-weight-bold" :class="{ 'mb-3': !expired }">
      <v-icon :icon="expired ? 'mdi-lock-outline' : 'mdi-timer-sand'" color="secondary" />
      {{ expired ? closedLabel : label }}
    </div>

    <div v-if="!expired" class="units">
      <div v-for="p in parts" :key="p.label" class="unit">
        <span class="wsc-display unit__value">{{ String(p.value).padStart(2, '0') }}</span>
        <span class="unit__label">{{ p.label }}</span>
      </div>
    </div>
  </v-sheet>
</template>

<style scoped>
.units {
  display: flex;
  gap: 12px;
}
.unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 64px;
  padding: 10px 8px;
  border-radius: 8px;
  background: #fff;
  color: rgb(var(--v-theme-secondary));
}
.unit__value {
  font-size: 2.25rem;
  font-variant-numeric: tabular-nums;
}
.unit__label {
  font-size: 0.75rem;
  opacity: 0.7;
}
</style>