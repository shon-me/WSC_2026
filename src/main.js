import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

//Custom css styling linking
import './styles/wsc.css'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import '@fontsource/barlow-condensed'
import '@fontsource/source-sans-3'

// Colours read off the Wakili Sigei Cup proposal and registration form.
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
  theme: {
    defaultTheme: 'wsc',
    themes: {
      wsc: {
        dark: false,
        colors: {
          background: '#F5F8FB',
          surface: '#FFFFFF',
          primary: '#0E6B3D', // tournament green
          secondary: '#0B1F33', // deep navy
          accent: '#D4A017', // trophy gold
          error: '#E4262F', // FKF red, also used for "live"
          warning: '#D4A017',
          success: '#0E6B3D',
          // Gold is too light for white text, so it gets navy text.
          'on-accent': '#0B1F33',
          'on-warning': '#0B1F33',
          'green-tint': '#E8F5EC',
          'on-green-tint': '#0A4D2C',
          'gold-tint': '#FFF3D6',
          'on-gold-tint': '#4D3800',
        },
      },
    },
  },
  defaults: {
    VBtn: { rounded: 'lg', class: 'text-none font-weight-bold' },
    VCard: { rounded: 'lg', elevation: 0, border: true },
    VTextField: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VSelect: { variant: 'outlined', density: 'comfortable', color: 'primary' },
    VCheckbox: { color: 'primary' },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(vuetify)
app.use(router)

app.mount('#app')
