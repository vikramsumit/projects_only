import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';

const HomePage: React.FC = () => {
  return (
    <>
      <section id="home"><Hero /></section>
      <section id="about"><About /></section>
    </>
  );
};

export default HomePage;

