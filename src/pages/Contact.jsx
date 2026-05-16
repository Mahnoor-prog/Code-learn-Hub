import { motion } from 'framer-motion';
import { useState } from 'react';
import { faqs } from '../utils/dummyData';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen pt-20 bg-white dark:bg-deep-navy transition-colors duration-300">
      {/* Header */}
      <section className="container mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent">
              Contact & Support
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have questions or need assistance? Our support team is here to help you accelerate your learning journey.
          </p>
        </motion.div>
      </section>

      {/* Contact Form and Info */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-20">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-custom p-6 md:p-8 border border-black/5 dark:border-white/10 shadow-lg"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe"
                    className="w-full bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-primary outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                    className="w-full bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-primary outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                  className="w-full bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-primary outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  placeholder="Tell us more about your inquiry..."
                  className="w-full bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-primary outline-none transition-all resize-none"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-indigo-primary to-neon-purple text-white rounded-xl font-bold text-lg shadow-glow-indigo hover:shadow-glow-cyan transition-all"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Support Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="glass rounded-custom p-6 md:p-8 border border-black/5 dark:border-white/10 shadow-lg">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-white">Support Channels</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl p-3 bg-indigo-primary/10 rounded-xl">📧</div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Email Support</h3>
                    <p className="text-gray-600 dark:text-gray-400">support@codelearnhub.com</p>
                    <p className="text-xs text-indigo-primary dark:text-cyan-glow mt-1">Response within 24h</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-3xl p-3 bg-indigo-primary/10 rounded-xl">💬</div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Live Chat</h3>
                    <p className="text-gray-600 dark:text-gray-400">Available via Dashboard</p>
                    <p className="text-xs text-indigo-primary dark:text-cyan-glow mt-1">24/7 AI Assistance</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="text-3xl p-3 bg-indigo-primary/10 rounded-xl">📚</div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">Documentation</h3>
                    <p className="text-gray-600 dark:text-gray-400">Comprehensive guides & API docs</p>
                    <p className="text-xs text-indigo-primary dark:text-cyan-glow mt-1">Self-serve help center</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass rounded-custom p-6 md:p-8 border border-black/5 dark:border-white/10 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Office Hours</h3>
              <div className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                  <span>Monday - Friday</span>
                  <span className="font-semibold text-indigo-primary dark:text-white">9 AM - 6 PM EST</span>
                </div>
                <div className="flex justify-between border-b border-black/5 dark:border-white/5 pb-2">
                  <span>Saturday</span>
                  <span className="font-semibold text-indigo-primary dark:text-white">10 AM - 4 PM EST</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span className="font-bold text-red-500">Closed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
            <span className="bg-gradient-to-r from-indigo-primary to-cyan-glow bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass rounded-xl border border-black/5 dark:border-white/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full text-left p-5 md:p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  <span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: expandedFaq === faq.id ? 180 : 0 }}
                    className="text-indigo-primary dark:text-cyan-glow text-lg"
                  >
                    ▼
                  </motion.span>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: expandedFaq === faq.id ? 'auto' : 0,
                    opacity: expandedFaq === faq.id ? 1 : 0
                  }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-black/5 dark:border-white/5 pt-4">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Contact;
