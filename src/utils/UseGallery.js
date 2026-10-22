import { computed, ref } from 'vue'
import { useFixtures } from '../utils/UseFixtures'
import { usePermissions } from '../utils/UsePermissions'
import { addDays, dayKey, formatShortDay } from '../utils/KickOff'
import { placeholderImage } from '../utils/PlaceHolder'

// A media item never stores its own date. It points at a fixture (fixtureId), and the date and
// time shown anywhere come from that fixture, so media can never drift from the match record.
//
// status: 'pending' (waiting for an admin) | 'approved' (public) | 'rejected'

// Test video (CC0, from MDN). Replace with your own hosted clips.
const SAMPLE_VIDEO = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'
const STARTED = ['live', 'full-time']

const today = dayKey(new Date())
const hoursAgo = (h) => new Date(Date.now() - h * 3600000).toISOString()

const base = (id, fixtureId, type, caption, uploader, extra) => ({
  id,
  fixtureId,
  type,
  caption,
  uploader,
  status: 'approved',
  src: type === 'video' ? SAMPLE_VIDEO : placeholderImage(id),
  poster: placeholderImage(id),
  duration: null,
  uploadedAt: hoursAgo(id * 2),
  capturedOn: null, // day the file was saved, used as a soft check against the match date
  rejectReason: '',
  ...extra,
})
const photo = (id, fixtureId, caption, uploader, extra = {}) =>
  base(id, fixtureId, 'image', caption, uploader, extra)
const video = (id, fixtureId, caption, uploader, duration, extra = {}) =>
  base(id, fixtureId, 'video', caption, uploader, { duration, ...extra })

// Test data. fixtureId values match the fixtures in useFixtures.js (1 to 5 have been played).
const seed = () => [
  video(1, 1, 'Opening goal', 'Wanjiru K.', 24),
  photo(2, 1, 'Sunrise FC fans on the touchline', 'Brian M.'),
  photo(3, 1, 'Kick-off', 'Brian M.'),
  photo(4, 1, "Eagle Rovers' captain", 'Faith C.'),

  video(5, 2, 'The penalty shoot-out', 'Kevin R.', 41),
  photo(6, 2, 'The winning kick', 'Kevin R.'),
  photo(7, 2, '', 'Faith C.'),

  photo(8, 3, 'Highland Stars celebrate', 'Joyce T.'),
  photo(9, 3, 'Half-time team talk', 'Joyce T.'),

  video(10, 4, 'A late save', 'Brian M.', 18),
  photo(11, 4, 'Hillside FC bench', 'Wanjiru K.'),
  photo(12, 4, '', 'Mercy A.'),

  photo(13, 5, 'Live from Central Pitch', 'Faith C.'),

  // Waiting for review
  photo(15, 4, 'Final whistle', 'Dennis O.', { status: 'pending', capturedOn: today }),
  video(16, 3, 'Third goal', 'Joyce T.', 32, { status: 'pending', capturedOn: addDays(today, -1) }),
  photo(17, 1, 'Crowd at the touchline', 'Mercy A.', { status: 'pending', capturedOn: addDays(today, -6) }),
  photo(18, 5, 'Second half under way', 'Faith C.', { status: 'pending', capturedOn: today }),

  // Rejected
  photo(19, 2, '', 'Peter N.', { status: 'rejected', rejectReason: 'Does not show this match.' }),
]

// Module-level state, shared by every gallery page. Replace the write functions below
// with API calls when the backend exists, and enforce the same permissions on the server.
const media = ref(seed())

const deny = (what) => ({ ok: false, error: `You don't have permission to ${what}.` })
const nextId = () => Math.max(0, ...media.value.map((m) => m.id)) + 1

export function useGallery() {
  const { fixtures } = useFixtures()
  const { can } = usePermissions()

  const byId = computed(() => new Map(fixtures.value.map((f) => [f.id, f])))
  const all = computed(() => media.value.map((m) => ({ ...m, fixture: byId.value.get(m.fixtureId) ?? null })))

  /** Public gallery: approved media whose match still exists. */
  const approved = computed(() => all.value.filter((m) => m.status === 'approved' && m.fixture))
  /** Everything approved, including media whose match record was removed (for admins). */
  const posted = computed(() => all.value.filter((m) => m.status === 'approved'))
  const pending = computed(() =>
    all.value.filter((m) => m.status === 'pending').sort((a, b) => a.uploadedAt.localeCompare(b.uploadedAt)),
  )
  const rejected = computed(() => all.value.filter((m) => m.status === 'rejected'))

  /** Matches that can have media: they have started. */
  const playedFixtures = computed(() => fixtures.value.filter((f) => STARTED.includes(f.status)))

  /** The match must exist, have started, and (if a date was given) have been played on that date. */
  const checkAlignment = ({ fixtureId, date = '' }) => {
    const f = byId.value.get(fixtureId)
    if (!f) return { ok: false, error: 'That match is not in the fixture records.' }
    if (!STARTED.includes(f.status)) return { ok: false, error: `${f.home} vs ${f.away} has not been played yet.` }
    if (date && date !== dayKey(f.kickoff)) {
      return {
        ok: false,
        error: `${f.home} vs ${f.away} was played on ${formatShortDay(f.kickoff)}, not ${formatShortDay(date)}.`,
      }
    }
    return { ok: true }
  }

  /** Checks shown to the admin next to each pending upload. level: 'ok' | 'warn' | 'fail' */
  const checksFor = (item) => {
    const f = item.fixture
    const checks = []
    if (!f) checks.push({ level: 'fail', text: 'The match is not in the fixture records.' })
    else if (!STARTED.includes(f.status)) {
      checks.push({ level: 'fail', text: `${f.home} vs ${f.away} has not been played yet.` })
    } else checks.push({ level: 'ok', text: 'Linked to a match that has been played.' })

    if (f && item.capturedOn) {
      const matchDay = dayKey(f.kickoff)
      checks.push(
        item.capturedOn === matchDay
          ? { level: 'ok', text: 'File date matches the match date.' }
          : {
              level: 'warn',
              text: `File was saved on ${formatShortDay(item.capturedOn)}, but the match was on ${formatShortDay(matchDay)}.`,
            },
      )
    } else if (f) {
      checks.push({ level: 'warn', text: 'No file date to compare with the match date.' })
    }
    return checks
  }

  /** files: [{ type, src, poster?, duration?, capturedOn? }]. New uploads always start as pending. */
  const submit = ({ fixtureId, date = '', files, credit, caption }) => {
    if (!can('gallery:upload')) return deny('upload')
    const check = checkAlignment({ fixtureId, date })
    if (!check.ok) return check

    const uploadedAt = new Date().toISOString()
    for (const f of files) {
      const id = nextId()
      media.value.push({
        id,
        fixtureId,
        type: f.type,
        src: f.src,
        poster: f.poster ?? (f.type === 'image' ? f.src : placeholderImage(id)),
        duration: f.duration ?? null,
        caption: caption.trim(),
        uploader: credit.trim(),
        status: 'pending',
        uploadedAt,
        capturedOn: f.capturedOn ?? null,
        rejectReason: '',
      })
    }
    return { ok: true }
  }

  /** Re-checks the match record at the moment of approval. */
  const approve = (id) => {
    if (!can('gallery:review')) return deny('review uploads')
    const item = media.value.find((m) => m.id === id && m.status === 'pending')
    if (!item) return { ok: false, error: 'That upload is no longer waiting for review.' }
    const check = checkAlignment({ fixtureId: item.fixtureId })
    if (!check.ok) return check
    item.status = 'approved'
    return { ok: true }
  }

  const reject = (id, reason) => {
    if (!can('gallery:review')) return deny('review uploads')
    const item = media.value.find((m) => m.id === id && m.status === 'pending')
    if (!item) return { ok: false, error: 'That upload is no longer waiting for review.' }
    item.status = 'rejected'
    item.rejectReason = reason.trim()
    return { ok: true }
  }

  /** Admins only. */
  const remove = (id) => {
    if (!can('gallery:delete')) return deny('delete media')
    media.value = media.value.filter((m) => m.id !== id)
    return { ok: true }
  }

  return {
    approved,
    posted,
    pending,
    rejected,
    playedFixtures,
    checkAlignment,
    checksFor,
    submit,
    approve,
    reject,
    remove,
  }
}