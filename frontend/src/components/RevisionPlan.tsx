import { useState } from "react";
import axios from "axios";

interface Step {
  step: number;
  concept: string;
}

interface Props {
  weakConcepts: string[];
  noteId: number | null;
}

export default function RevisionPlan({ weakConcepts, noteId }: Props) {
  const [plan, setPlan] = useState<Step[]>([]);
  const [loading, setLoading] = useState(false);

  const generatePlan = async () => {
    if (!noteId) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/roadmap/${noteId}`,
      );

      setPlan(res.data.roadmap);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg mt-6">
      <h2 className="text-lg font-semibold text-blue-500 mb-4">
        Personalized Study Plan
      </h2>

      <button
        disabled={!noteId || weakConcepts.length === 0}
        onClick={generatePlan}
        className="
          bg-blue-500
          text-white
          px-4
          py-2
          rounded-xl
          font-semibold
          hover:bg-blue-600
          transition
          disabled:opacity-50
        "
      >
        Generate Revision Plan
      </button>

      {loading && (
        <p className="text-sm text-slate-400 mt-4">
          Generating personalized roadmap...
        </p>
      )}

      {plan.length > 0 && (
        <div className="mt-6 space-y-3">
          {plan.map((step) => (
            <div
              key={step.step}
              className="p-4 border border-blue-100 rounded-xl bg-blue-50"
            >
              <p className="font-semibold text-sm text-blue-600">
                Step {step.step}: {step.concept}
              </p>

              <p className="text-xs text-slate-500">
                Revisit explanation → explore related concepts → retry quiz to
                strengthen understanding.
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
