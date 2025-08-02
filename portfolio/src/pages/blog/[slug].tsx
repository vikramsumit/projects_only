// Individual blog post page.
import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getAllPostSlugs, getPostData } from '@/lib/posts';
import { Post } from '@/types';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/cjs/styles/hljs'; // Choose a style

interface PostProps {
  post: Post;
}

const BlogPost: React.FC<PostProps> = ({ post }) => {
  if (!post) {
    return <div>Loading or Post not found...</div>; // Or a custom error component
  }

  return (
    <>
      <SEO title={post.title} description={post.excerpt} />
      <motion.article
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-20 max-w-3xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold text-primary-light dark:text-primary-dark mb-4">
          {post.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <div
          className="prose dark:prose-invert max-w-none" // Tailwind Typography classes
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </motion.article>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostSlugs();
  return {
    paths,
    fallback: false, // Set to 'blocking' or true if you want to support new posts without rebuilding
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = await getPostData(params?.slug as string);
  return {
    props: {
      post,
    },
    revalidate: 60, // ISR: Revalidate every 60 seconds
  };
};

export default BlogPost;