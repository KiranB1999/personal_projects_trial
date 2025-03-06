'use client';

import { motion } from 'framer-motion';

const Projects = () => {
  const projects = [
    {
      title: 'Enterprise Process Optimization',
      description: 'Led a company-wide process optimization initiative resulting in 30% efficiency improvement and $2M annual cost savings.',
      duration: '8 months',
      impact: ['30% efficiency increase', '$2M cost savings', 'Improved employee satisfaction'],
      tools: 'Lean Six Sigma, BPMN, Power BI'
    },
    {
      title: 'Digital Transformation Strategy',
      description: 'Spearheaded digital transformation project for legacy systems, improving data accuracy and processing time.',
      duration: '12 months',
      impact: ['50% reduced processing time', '99.9% data accuracy', 'Enhanced user experience'],
      tools: 'JIRA, SQL, Tableau'
    },
    {
      title: 'Customer Experience Enhancement',
      description: 'Analyzed customer journey and implemented improvements leading to significant increase in satisfaction scores.',
      duration: '6 months',
      impact: ['25% higher CSAT score', '40% reduced complaints', 'Increased retention'],
      tools: 'Journey Mapping, Power BI, Surveys'
    }
  ];

  return (
    <section id="projects" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Key Projects</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Delivering measurable business value through strategic analysis and implementation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-xl"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3">{project.title}</h3>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="mb-4">
                  <span className="text-sm font-semibold text-blue-400">Duration: </span>
                  <span className="text-gray-300">{project.duration}</span>
                </div>
                <div className="mb-4">
                  <span className="text-sm font-semibold text-blue-400 block mb-2">Impact:</span>
                  <ul className="list-disc list-inside text-gray-300">
                    {project.impact.map((item, i) => (
                      <li key={i} className="mb-1">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-sm font-semibold text-blue-400 block mb-2">Tools Used:</span>
                  <p className="text-gray-300">{project.tools}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;