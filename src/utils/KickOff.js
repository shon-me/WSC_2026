// All fixture times are stored as ISO strings with a +03:00 offset (Kenya has no daylight saving)
// and always displayed in Kenyan time, whatever the viewer's device clock says.
const TZ = 'Africa/Nairobi'

// Accepts an ISO string, a Date, a timestamp, or a 'YYYY-MM-DD' day key.
const toDate = (d) =>
  typeof d === 'string' && d.length === 10 ? new Date(`${d}T12:00:00+03:00`) : new Date(d)

const dayKeyFmt = new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit' })
const timeKeyFmt = new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
const timeFmt = new Intl.DateTimeFormat('en-KE', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true })
const dayFmt = new Intl.DateTimeFormat('en-KE', { timeZone: TZ, weekday: 'long', day: 'numeric', month: 'long' })
const shortDayFmt = new Intl.DateTimeFormat('en-KE', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short' })

/** '2026-10-24' */
export const dayKey = (d) => dayKeyFmt.format(toDate(d))
/** '15:00' (for time inputs) */
export const timeKey = (d) => timeKeyFmt.format(toDate(d))
/** '3:00 pm' */
export const formatTime = (d) => timeFmt.format(toDate(d)).replace(/[\u202f\u00a0]/g, ' ').toLowerCase()
/** 'Saturday 24 October' */
export const formatDay = (d) => dayFmt.format(toDate(d))
/** 'Sat 24 Oct' */
export const formatShortDay = (d) => shortDayFmt.format(toDate(d))

/** Combine a date input ('2026-10-24') and a time input ('15:00') into a stored kickoff. */
export const toKickoff = (date, time) => `${date}T${time}:00+03:00`

export const addDays = (key, n) => dayKey(toDate(key).getTime() + n * 86400000)

/** 'Yesterday' | 'Today' | 'Tomorrow' | '' */
export const relativeDay = (key) => {
  const diff = Math.round((toDate(key) - toDate(dayKey(new Date()))) / 86400000)
  return { '-1': 'Yesterday', 0: 'Today', 1: 'Tomorrow' }[diff] ?? ''
}