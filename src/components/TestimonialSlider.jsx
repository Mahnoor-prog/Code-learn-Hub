import { motion } from 'framer-motion';
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
    <div className="relative">
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="glass rounded-custom p-8 max-w-2xl mx-auto"
      >
        <div className="text-6xl mb-4">{testimonials[currentIndex].avatar}</div>
        <p className="text-lg text-gray-300 mb-6 italic">
          "{testimonials[currentIndex].content}"
        </p>
        <div>
          <p className="font-semibold text-white">{testimonials[currentIndex].name}</p>
          <p className="text-cyan-glow text-sm">{testimonials[currentIndex].role}</p>
        </div>
      </motion.div>

      <div className="flex justify-center items-center mt-6 space-x-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={prevTestimonial}
          className="p-2 glass rounded-full hover:border-cyan-glow border border-white/20"
        >
          ←
        </motion.button>
        <div className="flex space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-cyan-glow w-8' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextTestimonial}
          className="p-2 glass rounded-full hover:border-cyan-glow border border-white/20"
        >
          →
        </motion.button>
      </div>
    </div>
  );
};

export default TestimonialSlider;

