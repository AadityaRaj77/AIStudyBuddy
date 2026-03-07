import { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  concept: string | null;
  setWeakConcepts: React.Dispatch<React.SetStateAction<string[]>>;
  setStrongConcepts: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ConceptPanel({
  concept,
  setWeakConcepts,
  setStrongConcepts,
}: Props) {
  const [data, setData] = useState<any>(null);
  const [selected, setSelected] = useState<number | null>(null);

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
              <div key={i} className="text-sm mb-4">
                <p className="font-semibold mb-2">{q.question}</p>

                {q.options.map((o: string) => (
                  <button
                    key={o}
                    onClick={() => {
                      if (o === q.answer) {
                        setStrongConcepts((prev) => [...prev, concept!]);
                      } else {
                        setWeakConcepts((prev) => [...prev, concept!]);
                      }
                      setSelected(i);
                    }}
                    className="
                      block
                      w-full
                      text-left
                      p-2
                      mb-1
                      rounded
                      border
                      border-slate-700
                      hover:bg-slate-800
                    "
                  >
                    {o}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {selected !== null && (
            <div className="mt-4 text-sm text-neonGreen">
              Good attempt. Review this concept again if unsure.
            </div>
          )}
        </>
      )}
    </div>
  );
}
