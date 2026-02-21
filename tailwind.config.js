/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'indigo-primary': '#4F46E5',
        'indigo-soft': '#6366F1',
        'cyan-glow': '#22D3EE',
        'neon-purple': '#A855F7',
        'deep-navy': '#0F172A',
        'dark-blue-gray': '#1E293B',
        'light-gray': '#F1F5F9',
      },
      borderRadius: {
        'custom': '20px',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glow-indigo': '0 0 20px rgba(79, 70, 229, 0.5)',
        'glow-cyan': '0 0 20px rgba(34, 211, 238, 0.5)',
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.5)',
      },
      backgroundImage: {
        'gradient-indigo-purple': 'linear-gradient(135deg, #4F46E5 0%, #A855F7 100%)',
        'gradient-indigo-cyan': 'linear-gradient(135deg, #4F46E5 0%, #22D3EE 100%)',
      },
    },
  },
  plugins: [],
}

