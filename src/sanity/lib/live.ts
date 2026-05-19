import {createElement, type ComponentProps} from 'react'
import {defineLive} from 'next-sanity/live'
import {isSanityConfigured} from '@/lib/sanityConfigured'
import {client} from './client'

const {sanityFetch: liveSanityFetch, SanityLive: LiveSanityLive} = defineLive({
  client,
  serverToken: process.env.SANITY_API_READ_TOKEN,
  browserToken: process.env.SANITY_API_READ_TOKEN,
})

type LiveFetchArgs = Parameters<typeof liveSanityFetch>[0]

export async function sanityFetch(args: LiveFetchArgs) {
  if (!isSanityConfigured()) {
    return {data: null, sourceMap: null, tags: [] as string[]}
  }
  return liveSanityFetch(args)
}

export function SanityLive(props: ComponentProps<typeof LiveSanityLive>) {
  if (!isSanityConfigured()) return null
  return createElement(LiveSanityLive, props)
}
