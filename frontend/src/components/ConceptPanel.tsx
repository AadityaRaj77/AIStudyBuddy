import { useEffect, useState } from "react";
import axios from "axios";

interface Quiz {
  question: string;
  options: string[];
  answer: string;
}

interface ResponseData {
  explanation: string;
  quiz: Quiz[];
}

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
  const [data, setData] = useState<ResponseData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    if (!concept) return;

    setData(null);
    setSelectedOption(null);

    const fetchExplanation = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/quiz`,
          {
            concept,
          },
        );

        setData(res.data);
      } catch (err) {
        console.error("Quiz fetch failed", err);
      }
    };

    fetchExplanation();
  }, [concept]);

  if (!concept) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-slate-900 border-l border-slate-700 p-6 overflow-y-auto">
      <h2 className="text-xl font-bold text-purple-400 mb-4">{concept}</h2>

      {!data && (
        <p className="text-sm text-slate-400">Generating explanation…</p>
      )}

      {data && (
        <>
          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            {data.explanation}
          </p>

          {data.quiz.map((q, i) => (
            <div key={i} className="mb-6">
              <p className="font-semibold mb-3">{q.question}</p>

              {q.options.map((o) => {
                const isSelected = selectedOption === o;
                const isCorrect = o === q.answer;

                return (
                  <button
                    key={o}
                    disabled={selectedOption !== null}
                    onClick={() => {
                      setSelectedOption(o);

                      if (isCorrect) {
                        setStrongConcepts((prev) =>
                          prev.includes(concept) ? prev : [...prev, concept],
                        );
                      } else {
                        setWeakConcepts((prev) =>
                          prev.includes(concept) ? prev : [...prev, concept],
                        );
                      }
                    }}
                    className={`
                      block
                      w-full
                      text-left
                      p-3
                      mb-2
                      rounded
                      border
                      transition
                      ${
                        selectedOption
                          ? isCorrect
                            ? "border-green-500 bg-green-500/10"
                            : isSelected
                              ? "border-red-500 bg-red-500/10"
                              : "border-slate-700"
                          : "border-slate-700 hover:bg-slate-800"
                      }
                    `}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          ))}

          {selectedOption && (
            <div className="text-sm text-purple-300">
              Answer recorded. Continue exploring concepts.
            </div>
          )}
        </>
      )}
    </div>
  );
}
