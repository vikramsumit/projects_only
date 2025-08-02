// Card for displaying a blog post preview.
import React from 'react';
import Link from 'next/link';
import { Post } from '@/types';
import { motion } from 'framer-motion';

interface BlogPostCardProps {
  post: Post;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  return (
    <motion.div
      className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <h3 className="text-xl font-semibold text-primary-light dark:text-primary-dark mb-2 hover:underline">
          {post.title}
        </h3>
      </Link>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
        {new Date(post.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
      <p className="text-text-light dark:text-text-dark text-base mb-4 flex-grow">
        {post.excerpt}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
      <Link href={`/blog/${post.slug}`} className="mt-auto inline-block text-primary-light dark:text-primary-dark hover:underline font-medium">
        Read More &rarr;
      </Link>
    </motion.div>
  );
};

export default BlogPostCard;