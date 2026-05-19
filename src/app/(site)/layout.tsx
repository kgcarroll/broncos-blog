import {SiteHeader} from '@/components/SiteHeader'
import {sanityFetch} from '@/sanity/lib/live'
import {SITE_SETTINGS} from '@/sanity/lib/queries'

export const revalidate = 60

export default async function SiteLayout({children}: {children: React.ReactNode}) {
  const {data} = await sanityFetch({query: SITE_SETTINGS, stega: false})
  const siteTitle = data?.title?.trim() || 'Broncos News'

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader siteTitle={siteTitle} logo={data?.logo ?? null} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6">{children}</main>
      <footer className="border-t border-white/10 py-8 text-center text-xs text-white/50">
        <p>Unofficial fan site - not affiliated with the NFL or Denver Broncos.</p>
        <p className="mt-2">&copy; {new Date().getFullYear()} {siteTitle}</p>
      </footer>
    </div>
  )
}
