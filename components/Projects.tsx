'use client';

import { motion } from 'framer-motion';
import Card from './ui/Card';
import Image from 'next/image';

interface CustomProject {
  title: string;
  description: string;
  image: string;
  tags: string[];
  demoUrl?: string;
  codeUrl?: string;
  color: 'cyan' | 'magenta' | 'purple';
}

export default function Projects() {

  // ⭐ ADD YOUR CUSTOM PROJECTS HERE ⭐
  const customProjects: CustomProject[] = [
    {
      title: 'FINANCIAL MANAGER',
      description: 'Complete financial management application for tracking expenses, income, and budgets with real-time analytics.',
      image: '/images/financial-manager.png', // ✅ Changed to .png
      tags: ['Next.js', 'TypeScript', 'Finance'],
      demoUrl: 'https://financial-manager-app-9xk1.vercel.app',
      codeUrl: 'https://github.com/yourusername/financial-manager',
      color: 'cyan',
    },
    {
      title: 'HOMEWORK MANAGER',
      description: 'Smart homework and assignment tracking system with deadline reminders and progress monitoring.',
      image: '/images/homework-manager.png', // ✅ Changed to .png
      tags: ['Next.js', 'React', 'Education'],
      demoUrl: 'https://homework-manager-app.vercel.app',
      codeUrl: 'https://github.com/yourusername/homework-manager',
      color: 'magenta',
    },
    // Add more projects here...
  ];

  return (
    <section id="projects" className="py-20 px-6 bg-bg-secondary">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-center mb-4 text-neon-cyan">
            &gt; FEATURED_PROJECTS
          </h2>
          <p className="text-center text-text-secondary mb-8">
            Live demos and open source projects
          </p>
        </motion.div>

        {/* Custom Featured Projects */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {customProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card glowColor={project.color} className="h-full">
                {/* Project Image */}
                <div className="aspect-video bg-gradient-to-br from-neon-cyan/20 to-transparent rounded mb-4 overflow-hidden relative">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-6xl">🚀</span>
                    </div>
                  )}
                </div>

                <h3 className={`text-2xl font-bold mb-2 ${
                  project.color === 'cyan' ? 'text-neon-cyan' :
                  project.color === 'magenta' ? 'text-neon-magenta' :
                  'text-neon-purple'
                }`}>
                  {project.title}
                </h3>

                <p className="text-text-secondary mb-4 text-sm">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className={`text-xs font-mono px-2 py-1 rounded ${
                        project.color === 'cyan' ? 'bg-neon-cyan/10 text-neon-cyan' :
                        project.color === 'magenta' ? 'bg-neon-magenta/10 text-neon-magenta' :
                        'bg-neon-purple/10 text-neon-purple'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm font-mono hover:underline ${
                        project.color === 'cyan' ? 'text-neon-cyan' :
                        project.color === 'magenta' ? 'text-neon-magenta' :
                        'text-neon-purple'
                      }`}
                    >
                      LIVE DEMO →
                    </a>
                  )}
                  {project.codeUrl && (
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-sm font-mono text-text-secondary ${
                        project.color === 'cyan' ? 'hover:text-neon-cyan' :
                        project.color === 'magenta' ? 'hover:text-neon-magenta' :
                        'hover:text-neon-purple'
                      }`}
                    >
                      VIEW CODE →
                    </a>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
