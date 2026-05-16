import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const TestimonialSlider = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4">
      <div className="overflow-hidden min-h-[350px] sm:min-h-[300px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-custom p-6 md:p-10 text-center md:text-left flex flex-col md:flex-row items-center md:items-start gap-6 w-full border border-black/5 dark:border-white/10"
          >
            <div className="text-6xl md:text-7xl shrink-0">{testimonials[currentIndex].avatar}</div>
            <div className="flex flex-col">
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                "{testimonials[currentIndex].content}"
              </p>
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{testimonials[currentIndex].name}</p>
                <p className="text-indigo-primary dark:text-cyan-glow text-sm font-medium">{testimonials[currentIndex].role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center items-center mt-8 space-x-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevTestimonial}
          className="p-3 glass rounded-full hover:border-cyan-glow border border-black/10 dark:border-white/20 text-indigo-primary dark:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </motion.button>
        <div className="flex space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-indigo-primary dark:bg-cyan-glow w-8' : 'bg-gray-300 dark:bg-gray-700 w-2'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextTestimonial}
          className="p-3 glass rounded-full hover:border-cyan-glow border border-black/10 dark:border-white/20 text-indigo-primary dark:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </motion.button>
      </div>
    </div>
  );
};

export default TestimonialSlider;
