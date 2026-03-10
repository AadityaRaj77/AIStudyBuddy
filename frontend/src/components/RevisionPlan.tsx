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
    } catch (err) {
      console.error("Roadmap generation failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 mt-6">
      <h2 className="text-lg font-semibold text-purple-400 mb-4">
        Personalized Study Plan
      </h2>

      <button
        disabled={!noteId || weakConcepts.length === 0}
        onClick={generatePlan}
        className="
          bg-purple-600
          text-white
          px-4
          py-2
          rounded
          font-semibold
          hover:bg-purple-700
          disabled:opacity-50
          disabled:cursor-not-allowed
          transition
        "
      >
        Generate Revision Plan
      </button>

      {weakConcepts.length === 0 && (
        <p className="text-sm text-slate-400 mt-3">
          No weak concepts detected yet. Answer quizzes to generate a roadmap.
        </p>
      )}

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
              className="p-3 border border-slate-700 rounded bg-slate-800"
            >
              <p className="font-semibold text-sm">
                Step {step.step}: {step.concept}
              </p>

              <p className="text-xs text-slate-400">
                Review this concept and attempt the quiz again.
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
