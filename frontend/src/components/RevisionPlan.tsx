import { useState } from "react";
import axios from "axios";

interface Props {
  weakConcepts: string[];
}

export default function RevisionPlan({ weakConcepts }: Props) {
  const [plan, setPlan] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    if (weakConcepts.length === 0) return;

    setLoading(true);

    const res = await axios.post("http://localhost:5000/api/roadmap", {
      weakConcepts,
    });

    setPlan(res.data.roadmap);
    setLoading(false);
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 mt-6">
      <h2 className="text-lg font-semibold text-neon mb-4">
        Personalized Study Plan
      </h2>

      <button
        onClick={generatePlan}
        className="
          bg-neon
          text-black
          px-4
          py-2
          rounded
          font-semibold
          hover:scale-105
          transition
        "
      >
        Generate Revision Plan
      </button>

      {loading && (
        <p className="text-sm text-slate-400 mt-4">Generating roadmap...</p>
      )}

      {plan.length > 0 && (
        <div className="mt-6 space-y-3">
          {plan.map((step, i) => (
            <div key={i} className="p-3 border border-slate-700 rounded">
              <p className="font-semibold text-sm">
                Step {step.step}: {step.concept}
              </p>

              <p className="text-xs text-slate-400">{step.action}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
