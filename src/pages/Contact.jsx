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
    // Form submission logic would go here
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
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-primary to-neon-purple bg-clip-text text-transparent">
              Contact & Support
            </span>
          </h1>
          <p className="text-xl text-gray-300">
            We're here to help! Get in touch with our team
          </p>
        </motion.div>
      </section>

      {/* Contact Form and Info */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass rounded-custom p-8 border border-white/20"
          >
            <h2 className="text-3xl font-bold mb-6 text-white">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark-blue-gray border border-white/20 rounded-custom px-4 py-3 text-white focus:outline-none focus:border-cyan-glow transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark-blue-gray border border-white/20 rounded-custom px-4 py-3 text-white focus:outline-none focus:border-cyan-glow transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-dark-blue-gray border border-white/20 rounded-custom px-4 py-3 text-white focus:outline-none focus:border-cyan-glow transition-all"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full bg-dark-blue-gray border border-white/20 rounded-custom px-4 py-3 text-white focus:outline-none focus:border-cyan-glow transition-all resize-none"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-4 bg-gradient-to-r from-indigo-primary to-neon-purple rounded-custom font-semibold text-lg shadow-glow-purple hover:shadow-glow-cyan transition-all"
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
            <div className="glass rounded-custom p-8 border border-white/20">
              <h2 className="text-3xl font-bold mb-6 text-white">Support Information</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">📧</span>
                    <h3 className="font-semibold text-white">Email</h3>
                  </div>
                  <p className="text-gray-400 ml-10">support@codelearnhub.com</p>
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">💬</span>
                    <h3 className="font-semibold text-white">Live Chat</h3>
                  </div>
                  <p className="text-gray-400 ml-10">Available 24/7 in the app</p>
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">⏱️</span>
                    <h3 className="font-semibold text-white">Response Time</h3>
                  </div>
                  <p className="text-gray-400 ml-10">Usually within 24 hours</p>
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">📚</span>
                    <h3 className="font-semibold text-white">Documentation</h3>
                  </div>
                  <p className="text-gray-400 ml-10">Check our help center</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-custom p-8 border border-white/20">
              <h3 className="text-xl font-bold mb-4 text-white">Office Hours</h3>
              <div className="space-y-2 text-gray-400">
                <p>Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                <p>Saturday: 10:00 AM - 4:00 PM EST</p>
                <p>Sunday: Closed</p>
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
          <h2 className="text-4xl font-bold mb-8 text-center">
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
                className="glass rounded-custom border border-white/20 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-white/5 transition-all"
                >
                  <span className="font-semibold text-white pr-4">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: expandedFaq === faq.id ? 180 : 0 }}
                    className="text-cyan-glow text-xl"
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
                  <div className="px-6 pb-6 text-gray-300">{faq.answer}</div>
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

