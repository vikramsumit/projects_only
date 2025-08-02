import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4">{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
