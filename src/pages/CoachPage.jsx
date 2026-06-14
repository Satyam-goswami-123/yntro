import { motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { getCoachResponse } from '../utils/ruleEngine';
import { getChatHistory, saveChatHistory } from '../utils/storage';
import { Bot } from 'lucide-react';

const SUGGESTIONS = [
  'What is carbon footprint?',
  'How can I reduce my emissions?',
  'Tell me about food impact',
  'Transport comparisons',
  'Give me a weekly plan',
  'Motivate me!',
];

export default function CoachPage() {
  const [messages, setMessages] = useState(() => {
    const saved = getChatHistory();
    return saved.length > 0 ? saved : [
      { role: 'coach', text: getCoachResponse('hello'), time: new Date().toISOString() }
    ];
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user', text: text.trim(), time: new Date().toISOString() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = getCoachResponse(text);
      const coachMsg = { role: 'coach', text: response, time: new Date().toISOString() };
      const withReply = [...updated, coachMsg];
      setMessages(withReply);
      saveChatHistory(withReply);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  // Simple markdown-like rendering
  const renderText = (text) => {
    return text.split('\n').map((line, i) => {
      let rendered = line
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\|(.*?)\|/g, '<code>$1</code>');
      return <p key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: rendered }} />;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] pt-12 lg:pt-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <h1 className="text-3xl font-display font-bold gradient-text">AI Sustainability Coach</h1>
        <p className="text-dark-400 mt-1">Your personal eco-mentor — ask anything about sustainability</p>
      </motion.div>

      {/* Chat area */}
      <div className="flex-1 glass rounded-2xl p-4 overflow-y-auto chat-scroll mb-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white'
                : 'glass-light'
            }`}>
              {msg.role === 'coach' && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-primary-400">
                    <Bot size={16} />
                  </div>
                  <span className="text-xs text-primary-400 font-semibold">Eco Coach</span>
                </div>
              )}
              <div className="text-sm leading-relaxed">
                {renderText(msg.text)}
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="glass-light rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="text-primary-400">
                  <Bot size={16} />
                </div>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion chips */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
        {SUGGESTIONS.map((sug) => (
          <button
            key={sug}
            onClick={() => sendMessage(sug)}
            className="glass-light rounded-full px-3 py-1.5 text-xs whitespace-nowrap hover:bg-primary-500/20 hover:text-primary-400 transition-all"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about sustainability..."
          className="flex-1 bg-dark-800/50 border border-dark-700 rounded-xl px-4 py-3 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all outline-none"
          aria-label="Chat message input"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl px-6 py-3 text-sm font-semibold disabled:opacity-40 hover:opacity-90 transition-opacity"
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </div>
  );
}
