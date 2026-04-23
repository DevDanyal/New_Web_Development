'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: '> SYSTEM ONLINE // NEXUS-AI initialized\n\nHey! I\'m Danyal\'s AI assistant, available 24/7.\n\nI can help you:\n• Learn about his work\n• Discuss your project\n• Book a consultation\n\nWhat brings you here today?',
        timestamp: new Date(),
      }]);
    }
  }, [isOpen, messages.length]);

  // Listen for open chatbot event
  useEffect(() => {
    const handleOpenChatbot = () => {
      setIsOpen(true);
    };

    window.addEventListener('openChatbot', handleOpenChatbot);
    return () => window.removeEventListener('openChatbot', handleOpenChatbot);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          sessionId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        }]);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again or email me directly at aidevdanyal@gmail.com',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (content: string) => {
    // Replace [EMAIL]...[/EMAIL] with clickable email link
    let rendered = content.replace(
      /\[EMAIL\](.*?)\[\/EMAIL\]/g,
      '<a href="https://mail.google.com/mail/?view=cm&fs=1&to=$1" target="_blank" rel="noopener noreferrer" class="text-neon-cyan hover:underline font-bold">📧 $1</a>'
    );

    // Replace [WHATSAPP]...[/WHATSAPP] with clickable WhatsApp link
    rendered = rendered.replace(
      /\[WHATSAPP\](.*?)\[\/WHATSAPP\]/g,
      '<a href="https://wa.me/923464141007" target="_blank" rel="noopener noreferrer" class="text-neon-cyan hover:underline font-bold">💬 $1</a>'
    );

    return rendered;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-neon-cyan to-neon-magenta rounded-full shadow-glow-cyan flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Open chat"
      >
        <span className="text-2xl">💬</span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] max-w-[calc(100vw-3rem)] bg-bg-secondary border border-neon-cyan/30 rounded-lg shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-neon-cyan/30 flex justify-between items-center bg-bg-primary/50 rounded-t-lg">
              <div>
                <h3 className="font-mono font-bold text-neon-cyan">NEXUS-AI</h3>
                <p className="text-xs text-text-muted flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Online
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-neon-cyan/20 scrollbar-track-transparent">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-neon-cyan/20 text-white border border-neon-cyan/30'
                      : 'bg-bg-tertiary text-text-primary border border-neon-cyan/10'
                  }`}>
                    <p
                      className="text-sm whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: renderMessageContent(msg.content) }}
                    />
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-bg-tertiary p-3 rounded-lg border border-neon-cyan/10">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-neon-cyan/30 bg-bg-primary/50 rounded-b-lg">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-bg-tertiary border border-neon-cyan/30 rounded text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-neon-cyan transition-colors"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2 bg-neon-cyan text-black font-mono font-bold rounded hover:bg-neon-cyan/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  aria-label="Send message"
                >
                  →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
