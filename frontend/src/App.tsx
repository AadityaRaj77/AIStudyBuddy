import { useState } from "react";
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

  const startStudySession = async () => {
    if (!noteId) return;

    try {
      setLoadingStudy(true);

      const res = await fetch(
        `http://localhost:5000/api/study-session/${noteId}`,
      );

      const data = await res.json();

      setCurrentStudyConcept(data.nextConcept);

      // automatically open panel
      setSelectedConcept(data.nextConcept);
    } catch (err) {
      console.error("Study session failed", err);
    } finally {
      setLoadingStudy(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      {/* Title */}
      <h1
        className="
        text-5xl
        font-bold
        text-center
        mb-10
        bg-linear-to-r
        from-purple-400
        via-pink-400
        to-purple-400
        bg-clip-text
        text-transparent
      "
      >
        NeuroMap
      </h1>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Upload */}
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

        {/* Study Session */}
        {graph && (
          <div className="flex justify-center">
            <button
              onClick={startStudySession}
              disabled={!noteId || loadingStudy}
              className="
                px-6
                py-2
                rounded-lg
                font-semibold
                bg-purple-600
                hover:bg-purple-700
                disabled:opacity-50
                transition
              "
            >
              {loadingStudy ? "Starting..." : "Start Study Session"}
            </button>
          </div>
        )}

        {/* Graph */}
        {graph && (
          <ConceptGraph
            graph={graph}
            setSelectedConcept={setSelectedConcept}
            weakConcepts={weakConcepts}
            strongConcepts={strongConcepts}
            currentStudyConcept={currentStudyConcept}
          />
        )}

        {/* Revision Plan */}
        {graph && <RevisionPlan weakConcepts={weakConcepts} noteId={noteId} />}
      </div>

      {/* Concept Panel */}
      {selectedConcept && (
        <ConceptPanel
          concept={selectedConcept}
          setWeakConcepts={setWeakConcepts}
          setStrongConcepts={setStrongConcepts}
        />
      )}
    </div>
  );
}

export default App;
