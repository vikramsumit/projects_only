import Head from 'next/head';
import Image from 'next/image';

const About = () => {
  const skills = [
    { name: 'Python', level: 90 },
    { name: 'Machine Learning', level: 80 },
    { name: 'Data Analysis', level: 85 },
  ];

  const timeline = [
    { year: '2020 - Present', title: 'Senior Data Scientist at XYZ Corp', description: 'Working on predictive modeling and data visualization.' },
    { year: '2018 - 2020', title: 'Data Analyst at ABC Inc', description: 'Analyzed large datasets to extract insights.' },
    { year: '2014 - 2018', title: 'M.S. in Data Science, University of Example', description: 'Graduated with honors.' },
  ];

  return (
    <>
      <Head>
        <title>About - Raju Raj</title>
        <meta name="description" content="About Raju Raj - experience, education, and skills." />
      </Head>
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-1/3">
              <Image src="/profile.jpg" alt="Raju Raj" width={300} height={300} className="rounded-full" />
            </div>
            <div className="md:ml-8 mt-6 md:mt-0">
              <h2 className="text-4xl font-bold mb-4">About Me</h2>
              <p className="mb-4">I am a Data Scientist with 5+ years of experience ... (bio here).</p>
              <h3 className="text-2xl font-semibold mb-2">Skills</h3>
              <ul>
                {skills.map((skill) => (
                  <li key={skill.name} className="mb-2">
                    <span className="font-medium">{skill.name}:</span>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full">
                      <div
                        className="bg-blue-500 text-xs leading-none py-1 text-center text-white rounded-full"
                        style={{ width: `${skill.level}%` }}
                      >
                        {skill.level}%
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12">
            <h3 className="text-3xl font-semibold mb-6">Experience & Education</h3>
            <div className="border-l-4 border-blue-500 pl-4">
              {timeline.map((item, idx) => (
                <div key={idx} className="mb-6">
                  <span className="text-blue-500">{item.year}</span>
                  <h4 className="text-xl font-bold">{item.title}</h4>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
