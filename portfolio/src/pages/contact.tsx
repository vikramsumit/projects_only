// Contact page.
import React from 'react';
import ContactForm from '../components/ContactForm';
import SocialLinks from '../components/SocialLinks';
import AnimatedSection from '../components/AnimatedSection';
import SEO from '../components/SEO';

const ContactPage: React.FC = () => {
  return (
    <>
      <SEO title="Contact Me - Your Name" description="Get in touch with Your Name for collaborations, job opportunities, or inquiries. Find contact form and social media links." />
      <AnimatedSection id="contact" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary-light dark:text-primary-dark">
          Get In Touch
        </h2>
        <ContactForm />
        <SocialLinks />
      </AnimatedSection>
    </>
  );
};

export default ContactPage;