'use client';

import { motion } from 'framer-motion';
import { ChartBarIcon, PresentationChartLineIcon, UserGroupIcon, DocumentChartBarIcon, CogIcon, ChartPieIcon } from '@heroicons/react/24/outline';

const Skills = () => {
  const skills = [
    {
      title: 'Data Analysis',
      description: 'Advanced Excel, SQL, Power BI, Tableau',
      icon: ChartBarIcon,
      color: 'text-blue-400'
    },
    {
      title: 'Process Optimization',
      description: 'BPMN, Six Sigma, Lean Methodology',
      icon: CogIcon,
      color: 'text-purple-400'
    },
    {
      title: 'Requirements Engineering',
      description: 'User Stories, Use Cases, Process Flows',
      icon: DocumentChartBarIcon,
      color: 'text-indigo-400'
    },
    {
      title: 'Project Management',
      description: 'Agile, Scrum, JIRA, MS Project',
      icon: PresentationChartLineIcon,
      color: 'text-green-400'
    },
    {
      title: 'Stakeholder Management',
      description: 'Communication, Negotiation, Leadership',
      icon: UserGroupIcon,
      color: 'text-red-400'
    },
    {
      title: 'Business Intelligence',
      description: 'KPI Development, Dashboards, Reporting',
      icon: ChartPieIcon,
      color: 'text-yellow-400'
    }
  ];

  return (
    <section id="skills" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Skills & Expertise</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            Leveraging a comprehensive skill set to deliver impactful business solutions
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gray-900 rounded-lg shadow-xl"
            >
              <div className="flex items-center mb-4">
                <skill.icon className={`w-8 h-8 ${skill.color} mr-3`} />
                <h3 className="text-xl font-semibold text-white">{skill.title}</h3>
              </div>
              <p className="text-gray-300">{skill.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;