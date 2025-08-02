// SEO component for managing meta tags.
import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "My Portfolio - Full-Stack Developer",
  description = "A passionate full-stack developer showcasing projects, skills, and experience.",
  image = "https://yourdomain.com/social-share.jpg", // Replace with your actual social share image
  url = "https://yourdomain.com", // Replace with your actual domain
  keywords = "full-stack developer, web developer, software engineer, portfolio, React, Next.js, TypeScript, Tailwind CSS"
}) => {
  const router = useRouter();
  const currentUrl = `${url}${router.asPath}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default SEO;
