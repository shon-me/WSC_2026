<script setup>
// table comes from useStandings(): { level, group, rows, total, finished, live }
defineProps({
  table: { type: Object, required: true },
  // Teams in the top places are highlighted as moving on
  advance: { type: Number, default: 2 },
})

const gd = (n) => (n > 0 ? `+${n}` : String(n))
const formLabel = { W: 'Win', D: 'Draw', L: 'Loss' }
</script>

<template>
  <v-card class="overflow-hidden">
    <div class="st__head">
      <h3 class="wsc-display text-h5">{{ table.group }}</h3>
      <v-chip size="x-small" label variant="tonal" color="primary">{{ table.level }}</v-chip>
      <v-spacer />
      <span class="text-body-2 text-medium-emphasis">{{ table.finished }} of {{ table.total }} matches played</span>
    </div>

    <v-table class="st">
      <thead>
        <tr>
          <th class="st__pos"><abbr title="Position">#</abbr></th>
          <th class="st__team">Team</th>
          <th><abbr title="Played">P</abbr></th>
          <th><abbr title="Won">W</abbr></th>
          <th><abbr title="Drawn">D</abbr></th>
          <th><abbr title="Lost">L</abbr></th>
          <th class="st__opt"><abbr title="Goals for">GF</abbr></th>
          <th class="st__opt"><abbr title="Goals against">GA</abbr></th>
          <th><abbr title="Goal difference">GD</abbr></th>
          <th><abbr title="Points">Pts</abbr></th>
          <th class="st__opt">Form</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in table.rows" :key="r.team" :class="{ 'st__in': r.pos <= advance }">
          <td class="st__pos">{{ r.pos }}</td>
          <td class="st__team">{{ r.team }}</td>
          <td>{{ r.p }}</td>
          <td>{{ r.w }}</td>
          <td>{{ r.d }}</td>
          <td>{{ r.l }}</td>
          <td class="st__opt">{{ r.gf }}</td>
          <td class="st__opt">{{ r.ga }}</td>
          <td>{{ gd(r.gd) }}</td>
          <td class="st__pts">{{ r.pts }}</td>
          <td class="st__opt">
            <span v-if="!r.form.length" class="text-medium-emphasis">-</span>
            <span
              v-else
              class="st__form"
              :aria-label="`Last results, oldest first: ${r.form.map((x) => formLabel[x]).join(', ')}`"
            >
              <span v-for="(x, i) in r.form" :key="i" :class="['st__dot', `st__dot--${x}`]" aria-hidden="true">
                {{ x }}
              </span>
            </span>
          </td>
        </tr>
      </tbody>
    </v-table>

    <div class="st__foot">
      <span class="st__swatch" />
      Top {{ advance }} move on to the next level
      <template v-if="table.live"> | Includes a match in progress</template>
    </div>
  </v-card>
</template>

<style scoped>
.st__head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px 6px;
}
.st th,
.st td {
  padding-inline: 6px !important;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.st abbr {
  text-decoration: none;
  cursor: help;
}
.st__pos {
  width: 36px;
}
.st .st__team {
  text-align: left;
  font-weight: 600;
  white-space: nowrap;
}
.st__pts {
  font-weight: 800;
  font-size: 1.05rem;
}
.st__in {
  background: rgb(var(--v-theme-green-tint));
  color: rgb(var(--v-theme-on-green-tint));
}
.st__in td:first-child {
  box-shadow: inset 4px 0 0 rgb(var(--v-theme-primary));
}

.st__form {
  display: inline-flex;
  gap: 3px;
}
.st__dot {
  display: inline-grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
}
.st__dot--W {
  background: rgb(var(--v-theme-primary));
}
.st__dot--D {
  background: #5b6776;
}
.st__dot--L {
  background: rgb(var(--v-theme-error));
}

.st__foot {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px 14px;
  font-size: 0.85rem;
  color: rgb(var(--v-theme-on-surface), 0.7);
}
.st__swatch {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background: rgb(var(--v-theme-green-tint));
  box-shadow: inset 3px 0 0 rgb(var(--v-theme-primary));
}

/* Small phones: drop goals for, goals against and form so the rest fits */
@media (max-width: 599px) {
  .st__opt {
    display: none;
  }
}
</style>