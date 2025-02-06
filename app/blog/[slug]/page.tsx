import getPosts from "../posts/getPosts"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug
  const { default: Post } = await import(`@/app/blog/posts/${slug}.mdx`)

  return <Post />
}

export function generateStaticParams() {
  return getPosts().map(({ slug }) => ({ slug }))
}

export const dynamicParams = false