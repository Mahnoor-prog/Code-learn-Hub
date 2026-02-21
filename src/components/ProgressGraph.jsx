import { motion } from 'framer-motion';

const ProgressGraph = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="glass rounded-custom p-6">
      <h3 className="text-xl font-bold mb-6 text-white">Learning Progress</h3>
      <div className="flex items-end justify-between h-64 space-x-2">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ height: 0 }}
            whileInView={{ height: `${(item.value / maxValue) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            className="flex-1 flex flex-col items-center"
          >
            <motion.div
              className="w-full bg-gradient-to-t from-indigo-primary to-cyan-glow rounded-t-lg relative group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-dark-blue-gray px-2 py-1 rounded text-xs text-cyan-glow whitespace-nowrap">
                {item.value}%
              </div>
            </motion.div>
            <span className="mt-2 text-xs text-gray-400">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProgressGraph;

