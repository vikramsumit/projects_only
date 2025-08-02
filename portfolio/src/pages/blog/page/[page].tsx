// Blog pagination route.
import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { getSortedPostsData } from '@/lib/posts';
import { Post } from '@/types';
import BlogPostCard from '@/components/BlogPostCard';
import Pagination from '@/components/Pagination';
import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

interface BlogPageProps {
  posts: Post[];
  currentPage: number;
  totalPages: number;
}

const POSTS_PER_PAGE = 6;

const BlogPage: React.FC<BlogPageProps> = ({ posts, currentPage, totalPages }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <SEO title={`Blog - Page ${currentPage} - Your Name`} description={`Page ${currentPage} of articles and insights on web development, technology, and more from Your Name's personal blog.`} />
      <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-20">
        <h1 className="text-4xl font-bold text-center mb-12 text-primary-light dark:text-primary-dark">
          My Blog
        </h1>
        {posts.length === 0 ? (
          <p className="text-center text-text-light dark:text-text-dark text-lg">No blog posts on this page.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="visible"
          >
            {posts.map((post) => (
              <motion.div key={post.slug} variants={itemVariants}>
                <BlogPostCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        )}
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/blog" />
        )}
      </AnimatedSection>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPosts = getSortedPostsData();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const paths = Array.from({ length: totalPages }, (_, i) => ({
    params: { page: (i + 1).toString() },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const page = parseInt(params?.page as string, 10);
  const allPosts = getSortedPostsData();

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE;
  const posts = allPosts.slice(startIndex, endIndex);

  return {
    props: {
      posts,
      currentPage: page,
      totalPages,
    },
    revalidate: 60, // ISR
  };
};

export default BlogPage;