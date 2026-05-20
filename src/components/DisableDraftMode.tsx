'use client'

import Link from 'next/link'
import {useIsPresentationTool} from 'next-sanity/hooks'

export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool()
  if (isPresentationTool) return null
  return (
    <Link
      href="/api/draft-mode/disable"
      prefetch={false}
      className="fixed bottom-4 right-4 z-50 border border-broncos-orange/60 bg-broncos-navy px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-broncos-orange"
    >
      Exit preview
    </Link>
  )
}
