'use client';

import { motion } from 'framer-motion';
import Card from './ui/Card';

export default function About() {
  const capabilities = [
    {
      icon: '🛍️',
      title: 'INTELLIGENT E-COMMERCE',
      description: 'AI-powered stores with smart recommendations, automated inventory, and seamless checkout.',
      tags: ['Next.js', 'Stripe', 'AI APIs'],
      color: 'cyan' as const,
    },
    {
      icon: '⚡',
      title: 'SCALABLE SAAS PLATFORMS',
      description: 'Full-stack applications with real-time features, analytics, and intuitive UX.',
      tags: ['React', 'Node.js', 'PostgreSQL'],
      color: 'magenta' as const,
    },
    {
      icon: '🤖',
      title: 'WORKFLOW AUTOMATION',
      description: 'Custom AI agents and chatbots that handle support, qualify leads, and automate processes.',
      tags: ['Gemini', 'LangChain', 'Python'],
      color: 'purple' as const,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="about" className="py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-center mb-4 text-neon-cyan">
            &gt; CAPABILITIES_LOADED
          </h2>
          <p className="text-center text-text-secondary mb-12 max-w-2xl mx-auto">
            Specialized expertise in building intelligent applications that solve real business problems
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        >
          {capabilities.map((capability, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card glowColor={capability.color} className="h-full relative">
                <div className="text-4xl mb-4">{capability.icon}</div>
                <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${
                  capability.color === 'cyan' ? 'text-neon-cyan' :
                  capability.color === 'magenta' ? 'text-neon-magenta' :
                  'text-neon-purple'
                }`}>
                  {capability.title}
                </h3>
                <p className="text-text-secondary mb-4 text-sm sm:text-base">
                  {capability.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {capability.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className={`text-xs font-mono px-2 py-1 rounded ${
                        capability.color === 'cyan' ? 'bg-neon-cyan/10 text-neon-cyan' :
                        capability.color === 'magenta' ? 'bg-neon-magenta/10 text-neon-magenta' :
                        'bg-neon-purple/10 text-neon-purple'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
