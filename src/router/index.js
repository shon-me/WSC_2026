import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import RegistrationPage from '@/components/RegistrationPage.vue'
import FixturesView from '@/views/FixturesView.vue'
import FixturesAdminView from '@/components/FixturesAdminView.vue'
import { usePermissions } from '@/utils/UsePermissions'
import GalleryView from '@/views/GalleryView.vue'
import GalleryUploadView from '@/components/GalleryUploadView.vue'
import GalleryReviewView from '@/components/GalleryReviewView.vue'
import ResultsView from '@/views/ResultsView.vue'
import PatronView from '@/views/PatronView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
    },

    {
      path: '/register',
      component: RegistrationPage,
    },

    {
      path: '/fixtures',
      component: FixturesView,
    },

    {
      path: '/admin/fixtures',
      component: FixturesAdminView,
      meta: {
        permission: 'fixtures:edit',
      },
    },

    { 
      path: '/gallery', 
      component: GalleryView 
    },

    {
      path: '/gallery/upload',
      component: GalleryUploadView,
      meta: { permission: 'gallery:upload' },
    },

    {
      path: '/admin/gallery',
      component: GalleryReviewView,
      meta: { permission: 'gallery:review' },
    },

    {
      path: '/results',
      component: ResultsView
    },

    {
      path: '/patron',
      component: PatronView
    },
  ],
})

router.beforeEach((to) => {
  const { can } = usePermissions()
  if (to.meta.permission && !can(to.meta.permission)) return '/'
})

export default router
