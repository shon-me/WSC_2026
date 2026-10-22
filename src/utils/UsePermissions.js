import { computed, ref } from 'vue'

// Placeholder until login and roles are wired in. The role names below are examples.
// Later: set `role` from your auth store after login ('guest' when signed out)
// and edit this map to match your real roles. The server must enforce the same rules.
export const ROLE_PERMISSIONS = {
  admin: [
    'fixtures:create',
    'fixtures:edit',
    'fixtures:delete',
    'gallery:upload',
    'gallery:review',
    'gallery:delete',
  ],
  fixture_manager: ['fixtures:create', 'fixtures:edit', 'gallery:upload'],
  fan: ['gallery:upload'], // any logged-in user
  guest: [], // not logged in: can only view
}

export const ROLES = Object.keys(ROLE_PERMISSIONS)

const role = ref('admin') // TODO: replace with the signed-in user's role

export function usePermissions() {
  const can = (permission) => (ROLE_PERMISSIONS[role.value] ?? []).includes(permission)
  const isLoggedIn = computed(() => role.value !== 'guest')
  return { role, can, isLoggedIn }
}