import {Inter} from 'next/font/google'
import type {Metadata} from 'next'
import {Suspense} from 'react'
import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {DisableDraftMode} from '@/components/DisableDraftMode'
import {SanityLive, sanityFetch} from '@/sanity/lib/live'
import {SITE_SETTINGS} from '@/sanity/lib/queries'
import './globals.css'

const inter = Inter({subsets: ['latin'], variable: '--font-sans'})

const defaultTitle = 'Broncos News'
const defaultDescription = 'Unofficial Denver Broncos news and updates.'

export async function generateMetadata(): Promise<Metadata> {
  const {data} = await sanityFetch({query: SITE_SETTINGS, stega: false})
  const title = data?.title?.trim() || defaultTitle
  const description = data?.description?.trim() || defaultDescription

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
  }
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const draft = await draftMode()

  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Suspense fallback={null}>
          <SanityLive />
        </Suspense>
        {children}
        {draft.isEnabled ? (
          <>
            <VisualEditing />
            <DisableDraftMode />
          </>
        ) : null}
      </body>
    </html>
  )
}
