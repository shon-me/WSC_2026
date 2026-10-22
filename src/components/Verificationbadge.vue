<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: 'pending',
    validator: (v) => ['pending', 'verified', 'rejected', 'incomplete'].includes(v),
  },
})

const map = {
  pending: { color: 'warning', icon: 'mdi-clock-outline', text: 'Awaiting verification' },
  verified: { color: 'success', icon: 'mdi-check-decagram', text: 'ID verified' },
  rejected: { color: 'error', icon: 'mdi-close-octagon-outline', text: 'ID rejected' },
  incomplete: { color: 'secondary', icon: 'mdi-file-alert-outline', text: 'ID missing' },
}

const s = computed(() => map[props.status])
</script>

<template>
  <v-chip :color="s.color" :prepend-icon="s.icon" variant="flat" size="small" label>
    {{ s.text }}
  </v-chip>
</template>