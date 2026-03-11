import { useState, useEffect } from "react";
import UploadPage from "./pages/UploadPage";
import ConceptGraph from "./components/ConceptGraph";
import ConceptPanel from "./components/ConceptPanel";
import RevisionPlan from "./components/RevisionPlan";
import type { ConceptGraph as GraphType } from "./types";

function App() {
  const [graph, setGraph] = useState<GraphType | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [weakConcepts, setWeakConcepts] = useState<string[]>([]);
  const [strongConcepts, setStrongConcepts] = useState<string[]>([]);
  const [currentStudyConcept, setCurrentStudyConcept] = useState<string | null>(
    null,
  );
  const [noteId, setNoteId] = useState<number | null>(null);
  const [loadingStudy, setLoadingStudy] = useState(false);

  /* Load saved learning state */
  useEffect(() => {
    const weak = localStorage.getItem("weakConcepts");
    const strong = localStorage.getItem("strongConcepts");

    if (weak) setWeakConcepts(JSON.parse(weak));
    if (strong) setStrongConcepts(JSON.parse(strong));
  }, []);

  useEffect(() => {
    localStorage.setItem("weakConcepts", JSON.stringify(weakConcepts));
  }, [weakConcepts]);

  useEffect(() => {
    localStorage.setItem("strongConcepts", JSON.stringify(strongConcepts));
  }, [strongConcepts]);

  /* Learning progress */
  const mastery =
    strongConcepts.length / (strongConcepts.length + weakConcepts.length || 1);

  const startStudySession = async () => {
    if (!noteId) return;

    setLoadingStudy(true);

    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/study-session/${noteId}`,
    );

    const data = await res.json();

    setCurrentStudyConcept(data.nextConcept);
    setSelectedConcept(data.nextConcept);

    setLoadingStudy(false);
  };

  return (
    <div className="min-h-screen bg-blue-50 text-slate-800 p-10">
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <img src="/mind-map.png" className="w-16 h-16" />
        <h1 className="text-4xl font-bold text-blue-500">NeuroMap</h1>
      </div>

      {/* Learning progress */}
      <div className="flex justify-center mb-6">
        <div className="bg-white px-6 py-3 rounded-xl shadow text-sm">
          Learning Progress: {(mastery * 100).toFixed(0)}%
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-6">
        <UploadPage
          setGraph={(g) => {
            setGraph(g);
            setSelectedConcept(null);
            setWeakConcepts([]);
            setStrongConcepts([]);
            setCurrentStudyConcept(null);
          }}
          setNoteId={setNoteId}
        />

        {graph && (
          <div className="flex justify-center">
            <button
              onClick={startStudySession}
              disabled={!noteId || loadingStudy}
              className="
                px-6
                py-2
                rounded-xl
                font-semibold
                bg-blue-500
                text-white
                hover:bg-blue-600
                transition
                disabled:opacity-50
              "
            >
              {loadingStudy ? "Starting..." : "Start Study Session"}
            </button>
          </div>
        )}

        {graph && (
          <ConceptGraph
            graph={graph}
            setSelectedConcept={setSelectedConcept}
            weakConcepts={weakConcepts}
            strongConcepts={strongConcepts}
            currentStudyConcept={currentStudyConcept}
          />
        )}

        {graph && <RevisionPlan weakConcepts={weakConcepts} noteId={noteId} />}
      </div>

      {selectedConcept && (
        <ConceptPanel
          concept={selectedConcept}
          setWeakConcepts={setWeakConcepts}
          setStrongConcepts={setStrongConcepts}
          setSelectedConcept={setSelectedConcept}
          noteId={noteId}
        />
      )}
    </div>
  );
}

export default App;
