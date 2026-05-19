import Image from 'next/image'
import {urlForImage} from '@/sanity/lib/image'

type SanityImageValue = {
  alt?: string | null
  asset?: {
    _id?: string
    url?: string | null
    metadata?: {
      lqip?: string | null
      dimensions?: {width?: number; height?: number}
    } | null
  } | null
}

export function SanityImage({
  value,
  sizes,
  className,
  priority,
}: {
  value: SanityImageValue | null | undefined
  sizes: string
  className?: string
  priority?: boolean
}) {
  if (!value?.asset?._id) return null

  const dims = value.asset.metadata?.dimensions
  const w = Math.min(dims?.width || 1200, 1600)
  const h = Math.min(dims?.height || 900, 1200)
  const src = urlForImage(value as never).width(w).height(h).fit('max').url()
  const lqip = value.asset.metadata?.lqip

  return (
    <Image
      src={src}
      alt={value.alt || ''}
      width={w}
      height={h}
      sizes={sizes}
      className={className}
      priority={priority}
      placeholder={lqip ? 'blur' : 'empty'}
      blurDataURL={lqip || undefined}
    />
  )
}
