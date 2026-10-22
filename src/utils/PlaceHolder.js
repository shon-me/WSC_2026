// Abstract pitch-style placeholders, so the gallery has something to show before real uploads exist.
const PALETTES = [
  ['#0B1F33', '#0E6B3D', '#D4A017'],
  ['#0E6B3D', '#0B1F33', '#FFFFFF'],
  ['#0A3F36', '#0E6B3D', '#D4A017'],
  ['#0B1F33', '#0A3F36', '#FFFFFF'],
]

export function placeholderImage(seed = 0, w = 800, h = 600) {
  const [a, b, c] = PALETTES[seed % PALETTES.length]
  const cx = 160 + ((seed * 137) % 480)
  const cy = 120 + ((seed * 89) % 360)
  const r = 70 + ((seed * 53) % 90)
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>` +
    `<rect width="${w}" height="${h}" fill="url(#g)"/>` +
    `<g fill="none" stroke="${c}" stroke-opacity=".35" stroke-width="3"><circle cx="${cx}" cy="${cy}" r="${r}"/><line x1="${cx}" y1="0" x2="${cx}" y2="${h}"/></g>` +
    `<circle cx="${cx}" cy="${cy}" r="8" fill="${c}" fill-opacity=".6"/></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

// Neutral head-and-shoulders silhouette in the brand colours. Replace with an official portrait.
export function placeholderPortrait() {
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0B1F33"/><stop offset="1" stop-color="#0E6B3D"/></linearGradient></defs>' +
    '<rect width="600" height="600" fill="url(#g)"/>' +
    '<circle cx="300" cy="235" r="95" fill="#fff" fill-opacity=".8"/>' +
    '<path d="M110 600C110 450 200 385 300 385s190 65 190 215z" fill="#fff" fill-opacity=".8"/></svg>'
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}