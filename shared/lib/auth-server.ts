import { cookies } from 'next/headers'
import { COOKIE_NAMES } from './constants'

export function getUserRoleFromCookies() {
  const cookieStore = cookies()
  return cookieStore.get(COOKIE_NAMES.role)?.value ?? null
}
