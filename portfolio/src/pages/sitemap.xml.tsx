import { GetServerSideProps } from 'next';
import { generateSitemap } from '../lib/sitemap';

const Sitemap = () => {
  // This component is not rendered, it's just for TypeScript
  return null;
};

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = generateSitemap();

  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default Sitemap; 