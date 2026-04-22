'use client';

import { motion } from 'framer-motion';
import Button from './ui/Button';

export default function Contact() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="contact" className="py-20 px-6">
      <div className="container mx-auto text-center max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-6 text-neon-cyan">
            &gt; ESTABLISH_CONNECTION
          </h2>
          <p className="text-xl sm:text-2xl text-text-secondary mb-4 font-bold">
            READY TO BUILD SOMETHING AMAZING?
          </p>
          <p className="text-text-secondary mb-8">
            Whether you need an AI-powered e-commerce store, a SaaS platform, or workflow automation, let's talk about your project.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button variant="primary" onClick={scrollToTop}>
              TALK TO MY AI ASSISTANT
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.open('https://cal.com/aidevdanyal/30min', '_blank')}
            >
              BOOK A 30-MIN CALL
            </Button>
          </div>

          <div className="mt-8 space-y-2">
            <p className="text-text-muted font-mono text-sm">
              📧 contact@aidevdanyal.com
            </p>
            <p className="text-sm text-text-secondary">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Available for projects
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
