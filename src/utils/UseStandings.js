import { computed } from 'vue'
import { LEVELS, useFixtures } from '../utils/UseFixtures'

// Points for a win, draw and loss. Change these if your rules differ.
export const POINTS = { win: 3, draw: 1, loss: 0 }

// How many teams in each group move on. Taken from the registration form
// ("only two teams from each knockout stage will advance"). Change if your format differs.
export const ADVANCING = 2

const STARTED = ['live', 'full-time']

function record(row, scored, conceded, status) {
  row.p++
  row.gf += scored
  row.ga += conceded
  if (scored > conceded) {
    row.w++
    row.pts += POINTS.win
  } else if (scored === conceded) {
    row.d++
    row.pts += POINTS.draw
  } else {
    row.l++
    row.pts += POINTS.loss
  }
  // Form only counts finished matches
  if (status === 'full-time') row.results.push(scored > conceded ? 'W' : scored === conceded ? 'D' : 'L')
}

// Ranked by points, then goal difference, then goals scored, then name.
const rank = (a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf || a.team.localeCompare(b.team)

/**
 * One table per level and group, built from fixtures that have a `group`.
 * Matches in progress count towards the table as they happen.
 */
export function useStandings() {
  const { fixtures } = useFixtures()

  const tables = computed(() => {
    const groups = new Map()

    for (const f of fixtures.value) {
      if (!f.group) continue
      const key = `${f.level}|${f.group}`
      if (!groups.has(key)) groups.set(key, { key, level: f.level, group: f.group, fixtures: [], teams: new Map() })
      const g = groups.get(key)
      g.fixtures.push(f)
      for (const team of [f.home, f.away]) {
        if (!g.teams.has(team)) {
          g.teams.set(team, { team, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, results: [] })
        }
      }
    }

    return [...groups.values()]
      .map((g) => {
        // fixtures arrive sorted by kick-off, so form ends up oldest to newest
        for (const f of g.fixtures) {
          if (!STARTED.includes(f.status)) continue
          const home = Number(f.homeScore ?? 0)
          const away = Number(f.awayScore ?? 0)
          record(g.teams.get(f.home), home, away, f.status)
          record(g.teams.get(f.away), away, home, f.status)
        }

        const rows = [...g.teams.values()]
          .map((r) => ({ ...r, gd: r.gf - r.ga }))
          .sort(rank)
          .map((r, i) => ({ ...r, pos: i + 1, form: r.results.slice(-5) }))

        return {
          key: g.key,
          level: g.level,
          group: g.group,
          rows,
          total: g.fixtures.length,
          finished: g.fixtures.filter((f) => f.status === 'full-time').length,
          live: g.fixtures.some((f) => f.status === 'live'),
        }
      })
      .sort((a, b) => LEVELS.indexOf(a.level) - LEVELS.indexOf(b.level) || a.group.localeCompare(b.group))
  })

  return { tables }
}