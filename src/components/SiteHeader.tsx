import Image from 'next/image'
import Link from 'next/link'
import {urlForImage} from '@/sanity/lib/image'

type SiteHeaderProps = {
  siteTitle: string
  logo?: {
    alt?: string | null
    asset?: {_id?: string} | null
  } | null
}

const nav = [
  {href: '/', label: 'Home'},
  {href: '/news', label: 'News'},
  {href: '/games', label: 'Games'},
  {href: '/schedule', label: 'Schedule'},
]

export function SiteHeader({siteTitle, logo}: SiteHeaderProps) {
  const logoSrc =
    logo?.asset?._id ? urlForImage(logo as never).height(48).fit('max').url() : null

  return (
    <header className="border-b border-white/10 bg-broncos-navy">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 outline-none focus-visible:ring-2 focus-visible:ring-broncos-orange">
          {logoSrc ? (
            <Image src={logoSrc} alt={logo?.alt || siteTitle} width={160} height={48} className="h-10 w-auto" />
          ) : (
            <span className="text-lg font-bold tracking-tight text-white">
              <span className="text-broncos-orange">Broncos</span> News
            </span>
          )}
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-broncos-orange"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
