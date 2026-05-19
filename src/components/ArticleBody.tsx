import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {TypedObject} from '@portabletext/types'
import {SanityImage} from '@/components/SanityImage'

const components: PortableTextComponents = {
  block: {
    h2: ({children}) => (
      <h2 className="mt-10 scroll-m-20 text-2xl font-bold tracking-tight text-white">{children}</h2>
    ),
    h3: ({children}) => (
      <h3 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight text-white">{children}</h3>
    ),
    blockquote: ({children}) => (
      <blockquote className="my-6 border-l-4 border-broncos-orange pl-4 italic text-white/80">
        {children}
      </blockquote>
    ),
    normal: ({children}) => <p className="my-4 leading-7 text-white/90">{children}</p>,
  },
  list: {
    bullet: ({children}) => <ul className="my-4 ml-6 list-disc space-y-2 text-white/90">{children}</ul>,
    number: ({children}) => <ol className="my-4 ml-6 list-decimal space-y-2 text-white/90">{children}</ol>,
  },
  marks: {
    strong: ({children}) => <strong className="font-semibold text-white">{children}</strong>,
    em: ({children}) => <em>{children}</em>,
    link: ({children, value}) => {
      const href = typeof value?.href === 'string' ? value.href : '#'
      return (
        <a
          href={href}
          className="text-broncos-orange underline-offset-4 hover:underline"
          rel="noopener noreferrer"
          target="_blank"
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({value}) => (
      <figure className="my-8">
        <SanityImage
          value={value}
          sizes="(max-width: 768px) 100vw, 42rem"
          className="w-full rounded-lg"
        />
        {value?.caption ? (
          <figcaption className="mt-2 text-center text-sm text-white/60">{value.caption}</figcaption>
        ) : null}
      </figure>
    ),
  },
}

export function ArticleBody({value}: {value: TypedObject[] | null | undefined}) {
  if (!value?.length) return null
  return (
    <div className="max-w-none">
      <PortableText value={value} components={components} />
    </div>
  )
}
