import type { MarkdownParsedContent } from '@nuxt/content/dist/runtime/types'

export interface Post extends MarkdownParsedContent {
  image: {
    src: string
    alt: string
    width: number
    height: number
  }
  datePublished: string
  dateModified?: string
}
