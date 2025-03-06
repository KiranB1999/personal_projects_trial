'use client';

import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">About Me</h2>
          <p className="text-lg text-gray-300 mb-8">
            With over 8 years of experience as a Senior Business Analyst, I specialize in bridging the gap between business objectives and technological solutions. My expertise lies in transforming complex business requirements into actionable insights and implementable strategies.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gray-800 rounded-lg shadow-xl"
            >
              <h3 className="text-2xl font-bold text-blue-400 mb-2">8+</h3>
              <p className="text-gray-300">Years Experience</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gray-800 rounded-lg shadow-xl"
            >
              <h3 className="text-2xl font-bold text-purple-400 mb-2">50+</h3>
              <p className="text-gray-300">Projects Completed</p>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-gray-800 rounded-lg shadow-xl"
            >
              <h3 className="text-2xl font-bold text-indigo-400 mb-2">30+</h3>
              <p className="text-gray-300">Happy Clients</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;