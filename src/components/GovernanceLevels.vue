<script setup>
const props = defineProps({
  levels: {
    type: Array,
    default: () => ['Village', 'Sub-location', 'Location', 'Ward', 'Sub-county', 'County finals'],
  },
  // Name of the level currently being played. Leave empty for a static overview.
  active: { type: String, default: '' },
})

const isFinal = (i) => i === props.levels.length - 1

const state = (i) => {
  const a = props.levels.indexOf(props.active)
  if (a < 0) return 'static'
  return i < a ? 'done' : i === a ? 'active' : 'upcoming'
}

const color = (i) => {
  switch (state(i)) {
    case 'static':
      return isFinal(i) ? 'accent' : 'primary'
    case 'done':
      return 'green-tint'
    case 'active':
      return 'primary'
    default:
      return isFinal(i) ? 'gold-tint' : 'surface'
  }
}

const icon = (i) => {
  if (isFinal(i)) return 'mdi-trophy'
  const s = state(i)
  if (s === 'done') return 'mdi-check-circle'
  if (s === 'active') return 'mdi-soccer'
  return 'mdi-flag-outline'
}
</script>

<template>
  <ol class="levels">
    <li v-for="(name, i) in levels" :key="name" :aria-current="state(i) === 'active' ? 'step' : undefined">
      <v-sheet :color="color(i)" :border="state(i) === 'upcoming'" rounded="lg" class="level">
        <v-icon :icon="icon(i)" size="20" />
        <span class="wsc-display level__name">{{ name }}</span>
      </v-sheet>
    </li>
  </ol>
</template>

<style scoped>
.levels {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.level {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 56px;
  padding: 12px 16px;
}
.level__name {
  font-size: 1.2rem;
}
@media (min-width: 960px) {
  .levels {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>