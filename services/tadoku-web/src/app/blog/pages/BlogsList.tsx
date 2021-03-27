import React from 'react'
import BlogApi from '../api'
import { PageTitle } from '@app/ui/components'
import { useCachedApiState } from '../../cache'
import { PostOrPage } from '../interfaces'
import BlogPost from '../components/BlogPost'
import { postOrPageCollectionSerializer } from '../transform'

const BlogsList = () => {
  const { data: posts } = useCachedApiState<PostOrPage[]>({
    cacheKey: `blog_list?i=2`,
    defaultValue: [],
    fetchData: BlogApi.posts.list,
    dependencies: [],
    serializer: postOrPageCollectionSerializer,
  })

  return (
    <>
      <PageTitle>Blog</PageTitle>
      {posts.map(p => (
        <BlogPost key={p.slug} post={p} />
      ))}
    </>
  )
}

export default BlogsList
