import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  concept: string | null;
}

export default function ConceptPanel({ concept }: Props) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!concept) return;

    const fetchExplanation = async () => {
      const res = await axios.post("http://localhost:5000/api/explain", {
        concept,
      });
      setData(res.data);
    };

    fetchExplanation();
  }, [concept]);

  if (!concept) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-slate-900 border-l border-slate-700 p-6">
      <h2 className="text-xl font-bold text-neon mb-4">{concept}</h2>

      {!data && <p className="text-sm text-slate-400">Loading…</p>}

      {data && (
        <>
          <p className="text-sm text-slate-300 mb-4">{data.explanation}</p>

          <div className="space-y-3">
            {data.quiz.map((q: any, i: number) => (
              <div key={i} className="text-sm">
                <p className="font-semibold">{q.question}</p>
                <ul className="list-disc ml-4 text-slate-400">
                  {q.options.map((o: string) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
