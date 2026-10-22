// Reads a poster frame (as a JPEG data URL) and the duration in seconds from a video URL.
// Resolves with { poster: null, duration: null } if the browser can't read the file.
export function capturePoster(src) {
  return new Promise((resolve) => {
    const v = document.createElement('video')
    v.muted = true
    v.playsInline = true
    v.preload = 'metadata'

    const fail = () =>
      resolve({ poster: null, duration: Number.isFinite(v.duration) ? Math.round(v.duration) : null })
    const timer = setTimeout(fail, 5000)

    v.onerror = fail
    v.onloadeddata = () => {
      v.currentTime = Math.min(0.5, (v.duration || 1) / 2)
    }
    v.onseeked = () => {
      try {
        const w = 640
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = Math.round((w * v.videoHeight) / v.videoWidth)
        canvas.getContext('2d').drawImage(v, 0, 0, canvas.width, canvas.height)
        clearTimeout(timer)
        resolve({ poster: canvas.toDataURL('image/jpeg', 0.7), duration: Math.round(v.duration) })
      } catch {
        fail()
      }
    }
    v.src = src
  })
}