import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import Head from 'next/head';

type PostData = {
  title: string;
  date: string;
  contentHtml: string;
  tags: string[];
};

const PostPage = ({ postData }: { postData: PostData }) => {
  return (
    <>
      <Head>
        <title>{postData.title} - Raju Raj Blog</title>
        <meta name="description" content={postData.title} />
      </Head>
      <article className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{postData.title}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{postData.date}</p>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        <div className="mt-4">
          {postData.tags.map((tag) => (
            <span key={tag} className="inline-block bg-gray-200 dark:bg-gray-700 px-2 py-1 text-xs text-gray-800 dark:text-gray-200 rounded mr-2">
              {tag}
            </span>
          ))}
        </div>
      </article>
    </>
  );
};

export default PostPage;

export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filenames = fs.readdirSync(postsDirectory);
  const paths = filenames.map((name) => ({
    params: { slug: name.replace('.md', '') },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const postsDirectory = path.join(process.cwd(), 'posts');
  const filePath = path.join(postsDirectory, `${params.slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();
  return {
    props: {
      postData: {
        title: data.title,
        date: data.date,
        tags: data.tags || [],
        contentHtml,
      },
    },
  };
}
