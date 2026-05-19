export function formatDate(iso: string | null | undefined) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
