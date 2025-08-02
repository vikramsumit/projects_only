import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Head from 'next/head';
import Link from 'next/link';

type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
};

const Blog = ({ posts }: { posts: Post[] }) => {
  return (
    <>
      <Head>
        <title>Blog - Raju Raj</title>
        <meta name="description" content="Blog posts by Raju Raj." />
      </Head>
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-8 text-center">Blog</h2>
          <div className="space-y-8">
            {posts.map((post) => (
              <div key={post.slug} className="border-b pb-4">
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-2xl font-semibold">{post.title}</h3>
                </Link>
                <p className="text-sm text-gray-600 dark:text-gray-400">{post.date}</p>
                <p className="mt-2">{post.excerpt}</p>
                <div className="mt-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="inline-block bg-gray-200 dark:bg-gray-700 px-2 py-1 text-xs text-gray-800 dark:text-gray-200 rounded mr-2">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;

export async function getStaticProps() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);
  const posts = filenames.map((name) => {
    const filePath = path.join(postsDirectory, name);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    return {
      slug: name.replace('.md', ''),
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      tags: data.tags || [],
    };
  });
  // Sort by date
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return { props: { posts } };
}
