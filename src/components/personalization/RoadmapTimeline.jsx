import RoadmapStepCard from './RoadmapStepCard';

const RoadmapTimeline = ({ roadmap, onOpenModule }) => {
  if (!roadmap) return null;

  return (
    <div className="glass rounded-custom p-6 border border-white/20 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">Your AI Learning Roadmap</h3>
          <p className="text-gray-400 mt-1">{roadmap.aiSummary}</p>
        </div>
        <div className="text-sm text-gray-300">
          <div>Start: <span className="text-cyan-glow">{roadmap.startLanguage} ({roadmap.startLevel})</span></div>
          <div>Estimate: <span className="text-cyan-glow">{roadmap.estimatedCompletionTime}</span></div>
        </div>
      </div>

      <div className="mb-5 p-4 rounded-lg bg-dark-blue-gray border border-white/10">
        <div className="text-sm text-gray-400 mb-1">Daily Study Plan</div>
        <div className="text-gray-200">{roadmap.dailyStudyPlan}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(roadmap.steps || []).map((step, index) => (
          <RoadmapStepCard
            key={`${step.title}-${index}`}
            step={step}
            index={index}
            onOpenModule={onOpenModule}
          />
        ))}
      </div>
    </div>
  );
};

export default RoadmapTimeline;
