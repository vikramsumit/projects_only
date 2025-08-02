// Blog listing page with pagination.
import React from 'react';
import { GetStaticProps } from 'next';
import { getSortedPostsData } from '@/lib/posts';
import { Post } from '@/types';
import BlogPostCard from '@/components/BlogPostCard';
import Pagination from '@/components/Pagination';
import AnimatedSection from '@/components/AnimatedSection';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';

interface BlogProps {
  posts: Post[];
  currentPage: number;
  totalPages: number;
}

const POSTS_PER_PAGE = 6; // Define how many posts per page

const Blog: React.FC<BlogProps> = ({ posts, currentPage, totalPages }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <SEO title="Blog - Your Name" description="Read articles and insights on web development, technology, and more from Your Name's personal blog." />
      <AnimatedSection className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-20"> {/* Added padding to account for fixed navbar */}
        <h1 className="text-4xl font-bold text-center mb-12 text-primary-light dark:text-primary-dark">
          My Blog
        </h1>
        {posts.length === 0 ? (
          <p className="text-center text-text-light dark:text-text-dark text-lg">No blog posts yet. Check back soon!</p>
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

export const getStaticProps: GetStaticProps = async () => {
  const allPosts = getSortedPostsData();
  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);
  const posts = allPosts.slice(0, POSTS_PER_PAGE); // Get posts for the first page

  return {
    props: {
      posts,
      currentPage: 1,
      totalPages,
    },
    revalidate: 60, // ISR: Revalidate every 60 seconds
  };
};

export default Blog;