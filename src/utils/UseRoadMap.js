import { computed } from 'vue'
import { LEVELS, useFixtures } from '../utils/UseFixtures'

/**
 * One stage per tournament level, with a status worked out from the fixtures:
 *   done    every fixture at that level is finished
 *   active  the level being played now (some matches finished or live)
 *   next    the level that follows, or the current level if it hasn't kicked off yet
 *   later   everything after that
 */
export function useRoadmap() {
  const { fixtures } = useFixtures()

  const stages = computed(() => {
    const base = LEVELS.map((level) => {
      const list = fixtures.value.filter((f) => f.level === level)
      const finished = list.filter((f) => f.status === 'full-time').length
      const live = list.filter((f) => f.status === 'live').length
      return {
        level,
        total: list.length,
        finished,
        live,
        started: finished + live > 0,
        done: list.length > 0 && finished === list.length,
        next: list.find((f) => f.status === 'scheduled') ?? null,
      }
    })

    // First level that isn't finished. -1 means the whole tournament is complete.
    const current = base.findIndex((s) => !s.done)

    return base.map((s, i) => {
      let status = 'later'
      if (current === -1 || i < current) status = 'done'
      else if (i === current) status = s.started ? 'active' : 'next'
      else if (i === current + 1 && base[current].started) status = 'next'
      return { ...s, status, isFinal: i === base.length - 1 }
    })
  })

  return { stages }
}