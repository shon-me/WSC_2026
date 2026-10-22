import { computed, ref } from 'vue'
import { addDays, dayKey, toKickoff } from '../utils/KickOff'

export const LEVELS = ['Village', 'Sub-location', 'Location', 'Ward', 'Sub-county', 'County finals']

export const STATUSES = [
  { value: 'scheduled', title: 'Scheduled', color: 'green-tint' },
  { value: 'live', title: 'Live', color: 'error' },
  { value: 'full-time', title: 'Full time', color: 'secondary' },
  { value: 'postponed', title: 'Postponed', color: 'warning' },
]
export const statusOf = (value) => STATUSES.find((s) => s.value === value) ?? STATUSES[0]

// Test data. Dates are relative to today, so "Today" and "Tomorrow" always have matches.
const today = dayKey(new Date())
const at = (offsetDays, time) => toKickoff(addDays(today, offsetDays), time)

const seed = () => [
  {
    id: 1,
    level: 'Village',
    home: 'Sunrise FC',
    away: 'Eagle Rovers',
    kickoff: at(-1, '09:00'),
    venue: 'Hillside Grounds',
    status: 'full-time',
    homeScore: 2,
    awayScore: 1,
    note: '',
  },
  {
    id: 2,
    level: 'Village',
    home: 'Green Valley',
    away: 'Lakeside United',
    kickoff: at(-1, '11:00'),
    venue: 'Hillside Grounds',
    status: 'full-time',
    homeScore: 0,
    awayScore: 0,
    note: 'Green Valley won 5-4 on penalties',
  },
  {
    id: 3,
    level: 'Sub-location',
    home: 'Highland Stars',
    away: 'Border Athletic',
    kickoff: at(-1, '14:00'),
    venue: 'Riverside Pitch',
    status: 'full-time',
    homeScore: 3,
    awayScore: 1,
    note: '',
  },

  {
    id: 4,
    level: 'Location',
    group: 'Group A',
    home: 'Hillside FC',
    away: 'River United',
    kickoff: at(0, '10:00'),
    venue: 'Riverside Pitch',
    status: 'full-time',
    homeScore: 1,
    awayScore: 0,
    note: '',
  },
  {
    id: 5,
    level: 'Location',
    group: 'Group A',
    home: 'Village Stars',
    away: 'Ward Rangers',
    kickoff: at(0, '13:00'),
    venue: 'Central Pitch',
    status: 'live',
    homeScore: 1,
    awayScore: 0,
    note: '',
  },
  {
    id: 6,
    level: 'Location',
    group: 'Group B',
    home: 'Valley Boys',
    away: 'Town Select',
    kickoff: at(0, '16:00'),
    venue: 'Market Grounds',
    status: 'scheduled',
    homeScore: null,
    awayScore: null,
    note: '',
  },

  // The Location level is played as two groups of four. A match with a group can end level.
  {
    id: 15,
    level: 'Location',
    group: 'Group A',
    home: 'Hillside FC',
    away: 'Village Stars',
    kickoff: at(-3, '10:00'),
    venue: 'Riverside Pitch',
    status: 'full-time',
    homeScore: 2,
    awayScore: 2,
    note: '',
  },
  {
    id: 16,
    level: 'Location',
    group: 'Group A',
    home: 'River United',
    away: 'Ward Rangers',
    kickoff: at(-3, '13:00'),
    venue: 'Riverside Pitch',
    status: 'full-time',
    homeScore: 3,
    awayScore: 1,
    note: '',
  },
  {
    id: 17,
    level: 'Location',
    group: 'Group A',
    home: 'Hillside FC',
    away: 'Ward Rangers',
    kickoff: at(-2, '11:00'),
    venue: 'Central Pitch',
    status: 'full-time',
    homeScore: 1,
    awayScore: 1,
    note: '',
  },
  {
    id: 18,
    level: 'Location',
    group: 'Group A',
    home: 'River United',
    away: 'Village Stars',
    kickoff: at(2, '11:00'),
    venue: 'Central Pitch',
    status: 'scheduled',
    homeScore: null,
    awayScore: null,
    note: '',
  },
  {
    id: 19,
    level: 'Location',
    group: 'Group B',
    home: 'Valley Boys',
    away: 'Highland Stars',
    kickoff: at(-3, '15:00'),
    venue: 'Market Grounds',
    status: 'full-time',
    homeScore: 2,
    awayScore: 0,
    note: '',
  },
  {
    id: 20,
    level: 'Location',
    group: 'Group B',
    home: 'Town Select',
    away: 'Border Athletic',
    kickoff: at(-2, '14:00'),
    venue: 'Market Grounds',
    status: 'full-time',
    homeScore: 1,
    awayScore: 1,
    note: '',
  },
  {
    id: 21,
    level: 'Location',
    group: 'Group B',
    home: 'Highland Stars',
    away: 'Border Athletic',
    kickoff: at(-2, '16:00'),
    venue: 'Market Grounds',
    status: 'full-time',
    homeScore: 2,
    awayScore: 1,
    note: '',
  },
  {
    id: 22,
    level: 'Location',
    group: 'Group B',
    home: 'Valley Boys',
    away: 'Border Athletic',
    kickoff: at(2, '14:00'),
    venue: 'Market Grounds',
    status: 'scheduled',
    homeScore: null,
    awayScore: null,
    note: '',
  },
  {
    id: 23,
    level: 'Location',
    group: 'Group B',
    home: 'Town Select',
    away: 'Highland Stars',
    kickoff: at(2, '16:30'),
    venue: 'Market Grounds',
    status: 'scheduled',
    homeScore: null,
    awayScore: null,
    note: '',
  },

  {
    id: 7,
    level: 'Ward',
    home: 'Savannah FC',
    away: 'Kijiji Boys',
    kickoff: at(1, '10:00'),
    venue: 'Hillside Grounds',
    status: 'scheduled',
    homeScore: null,
    awayScore: null,
    note: '',
  },
  {
    id: 8,
    level: 'Ward',
    home: 'Sunrise FC',
    away: 'Highland Stars',
    kickoff: at(1, '12:30'),
    venue: 'Riverside Pitch',
    status: 'scheduled',
    homeScore: null,
    awayScore: null,
    note: '',
  },
  {
    id: 9,
    level: 'Ward',
    home: 'Eagle Rovers',
    away: 'Lakeside United',
    kickoff: at(1, '15:00'),
    venue: 'Central Pitch',
    status: 'scheduled',
    homeScore: null,
    awayScore: null,
    note: '',
  },

  {
    id: 10,
    level: 'Sub-county',
    home: 'Hillside FC',
    away: 'Valley Boys',
    kickoff: at(3, '11:00'),
    venue: 'Central Pitch',
    status: 'scheduled',
    homeScore: null,
    awayScore: null,
    note: '',
  },
  {
    id: 11,
    level: 'Sub-county',
    home: 'Green Valley',
    away: 'Border Athletic',
    kickoff: at(3, '14:00'),
    venue: 'Central Pitch',
    status: 'scheduled',
    homeScore: null,
    awayScore: null,
    note: '',
  },
  {
    id: 12,
    level: 'Sub-county',
    home: 'Village Stars',
    away: 'Savannah FC',
    kickoff: at(4, '10:00'),
    venue: 'Market Grounds',
    status: 'postponed',
    homeScore: null,
    awayScore: null,
    note: 'Pitch unfit. New date to be announced.',
  },
  {
    id: 13,
    level: 'Sub-county',
    home: 'Town Select',
    away: 'Kijiji Boys',
    kickoff: at(4, '13:00'),
    venue: 'Market Grounds',
    status: 'scheduled',
    homeScore: null,
    awayScore: null,
    note: '',
  },

  {
    id: 14,
    level: 'County finals',
    home: 'Winner of Sub-county 1',
    away: 'Winner of Sub-county 2',
    kickoff: at(10, '15:00'),
    venue: 'Venue to be confirmed',
    status: 'scheduled',
    homeScore: null,
    awayScore: null,
    note: '',
  },
]

// Module-level state, so the public page and the edit page share the same list.
// Replace the bodies of save() and remove() with API calls when the backend is ready.
const fixtures = ref(seed())

export function useFixtures() {
  const sorted = computed(() =>
    [...fixtures.value].sort((a, b) => a.kickoff.localeCompare(b.kickoff)),
  )

  const save = (fixture) => {
    const i = fixtures.value.findIndex((f) => f.id === fixture.id)
    if (i >= 0) {
      fixtures.value[i] = { ...fixture }
    } else {
      const id = Math.max(0, ...fixtures.value.map((f) => f.id)) + 1
      fixtures.value.push({ ...fixture, id })
    }
  }

  const remove = (id) => {
    fixtures.value = fixtures.value.filter((f) => f.id !== id)
  }

  return { fixtures: sorted, save, remove }
}
