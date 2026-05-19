export function isSanityConfigured() {
  const id = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim()
  return Boolean(id && id !== 'missing-project-id' && id !== 'placeholder')
}
