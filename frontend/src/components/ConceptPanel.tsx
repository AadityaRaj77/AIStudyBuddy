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
  setSelectedConcept: (concept: string | null) => void;
  noteId: number | null;
}

export default function ConceptPanel({
  concept,
  setWeakConcepts,
  setStrongConcepts,
  setSelectedConcept,
  noteId,
}: Props) {
  const [data, setData] = useState<ResponseData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  useEffect(() => {
    if (!concept) return;

    setData(null);
    setSelectedOption(null);

    const fetchExplanation = async () => {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/quiz`, {
        concept,
      });

      setData(res.data);
    };

    fetchExplanation();
  }, [concept]);

  if (!concept) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-105 bg-white border-l border-blue-100 p-8 overflow-y-auto shadow-xl">
      <h2 className="text-2xl font-bold text-blue-500 mb-6">{concept}</h2>

      {!data && (
        <p className="text-sm text-slate-400 animate-pulse">
          Generating explanation…
        </p>
      )}

      {data && (
        <>
          <p className="text-sm text-slate-600 mb-8 leading-relaxed">
            {data.explanation}
          </p>

          {data.quiz.map((q, i) => (
            <div key={i} className="mb-8">
              <p className="font-semibold mb-4">{q.question}</p>

              {q.options.map((o) => {
                const isSelected = selectedOption === o;
                const isCorrect = o === q.answer;

                return (
                  <button
                    key={o}
                    disabled={selectedOption !== null}
                    onClick={async () => {
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

                      // move to next concept automatically
                      setTimeout(async () => {
                        if (!noteId) return;

                        const res = await fetch(
                          `${import.meta.env.VITE_API_URL}/api/study-session/${noteId}`,
                        );

                        const data = await res.json();

                        if (data.nextConcept) {
                          setSelectedConcept(data.nextConcept);
                        } else {
                          setSelectedConcept(null);
                        }
                      }, 1200);
                    }}
                    className={`
                      block
                      w-full
                      text-left
                      p-3
                      mb-3
                      rounded-xl
                      border
                      transition
                      hover:scale-[1.02]
                      ${
                        selectedOption
                          ? isCorrect
                            ? "border-green-400 bg-green-50"
                            : isSelected
                              ? "border-red-400 bg-red-50"
                              : "border-slate-200"
                          : "border-slate-200 hover:bg-blue-50"
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
            <div className="text-sm text-blue-500 font-medium">
              Answer recorded. Continue exploring concepts.
            </div>
          )}
        </>
      )}
    </div>
  );
}
