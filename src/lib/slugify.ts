export function slugifyTeam(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function buildMatchupSlug(awayTeam: string, homeTeam: string) {
  const away = slugifyTeam(awayTeam)
  const home = slugifyTeam(homeTeam)
  if (!away || !home) return ''
  return `${away}-vs-${home}`
}

export function gamePath(seasonYear: number, matchupSlug: string) {
  return `/games/${seasonYear}/${matchupSlug}`
}
