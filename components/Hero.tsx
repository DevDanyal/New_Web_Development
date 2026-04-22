'use client';

import { motion } from 'framer-motion';
import Button from './ui/Button';
import GlitchText from './ui/GlitchText';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const openChatbot = () => {
    // Trigger chatbot open by dispatching a custom event
    window.dispatchEvent(new CustomEvent('openChatbot'));
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center cyber-grid pt-20">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/50 to-bg-primary pointer-events-none" />

      {/* Scanlines effect */}
      <div className="scanlines absolute inset-0 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-neon-cyan font-mono text-sm mb-2"
          >
            &gt; SYSTEM ONLINE
          </motion.p>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-display font-bold text-white mb-4">
            <GlitchText text="AI//DEV//DANYAL" className="neon-glow-cyan" />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-text-secondary font-mono"
          >
            BUILDING INTELLIGENT E-COMMERCE & SAAS SOLUTIONS
          </motion.p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-8"
        >
          Full-stack developer specializing in AI-powered applications.
          <br />
          From concept to deployment in weeks, not months.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button variant="primary" onClick={openChatbot}>
            TALK TO MY AI
          </Button>
          <Button variant="secondary" onClick={() => scrollToSection('projects')}>
            VIEW PROJECTS
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-text-muted font-mono text-xs sm:text-sm"
        >
          <p>⚡ Fast delivery • 🎯 Quality focused • 💬 Clear communication</p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer"
        onClick={() => scrollToSection('about')}
      >
        <div className="w-6 h-10 border-2 border-neon-cyan rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-neon-cyan rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
