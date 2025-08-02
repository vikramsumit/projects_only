---
title: 'Understanding Next.js Static Generation'
date: '2023-11-15'
tags: ['nextjs', 'static-site-generation', 'performance', 'seo']
excerpt: 'A deep dive into Next.js static generation (SSG) and Incremental Static Regeneration (ISR) for optimal performance and SEO.'
---

## The Power of Static Generation in Next.js

Next.js offers powerful data fetching strategies, and among them, Static Site Generation (SSG) stands out for its performance benefits. When you use SSG, your pages are pre-rendered at build time, resulting in incredibly fast load times as the content is served directly from a CDN.

### `getStaticProps`

The `getStaticProps` function is used for fetching data at build time. It runs only on the server-side and its result is passed as props to the page component.

```typescript
// pages/posts/[id].tsx
import { GetStaticProps, GetStaticPaths } from 'next';
import { getPostData, getAllPostIds } from '../../lib/posts';

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params.id as string);
  return {
    props: {
      postData,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false, // Can be 'blocking' or true
  };
};
```

### Incremental Static Regeneration (ISR)

ISR allows you to update static pages *after* you've built your site. You can specify a `revalidate` time (in seconds) in `getStaticProps`. When a request comes in after this time, Next.js will serve the stale (cached) page, and in the background, regenerate the page. Once regenerated, the new page will be served for subsequent requests.

```typescript
// pages/products/[id].tsx
export const getStaticProps: GetStaticProps = async (context) => {
  const productId = context.params.id;
  const product = await fetchProduct(productId); // Your data fetching logic
  return {
    props: {
      product,
    },
    revalidate: 10, // In seconds
  };
};
```

This hybrid approach gives you the best of both worlds: the performance of static sites and the flexibility of server-side rendering for dynamic content.