import { useState } from "react";
import UploadPage from "./pages/UploadPage";
import ConceptGraph from "./components/ConceptGraph";
import ConceptPanel from "./components/ConceptPanel";
import type { ConceptGraph as GraphType } from "./types";
import RevisionPlan from "./components/RevisionPlan";

function App() {
  const [graph, setGraph] = useState<GraphType | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [weakConcepts, setWeakConcepts] = useState<string[]>([]);
  const [strongConcepts, setStrongConcepts] = useState<string[]>([]);
  const [currentStudyConcept, setCurrentStudyConcept] = useState<string | null>(
    null,
  );
  const [noteId, setNoteId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10">
      <h1
        className="
        text-5xl
        font-bold
        text-center
        mb-10
        bg-linear-to-r
        from-neon
        via-purple-500
        to-neonPink
        bg-clip-text
        text-transparent
      "
      >
        NeuroMap
      </h1>

      <div className="max-w-5xl mx-auto space-y-6">
        <UploadPage setGraph={setGraph} setNoteId={setNoteId} />
        <ConceptPanel
          concept={selectedConcept}
          setWeakConcepts={setWeakConcepts}
          setStrongConcepts={setStrongConcepts}
        />
        <button
          onClick={async () => {
            if (!noteId) return;

            const res = await fetch(
              `http://localhost:5000/api/study-session/${noteId}`,
            );

            const data = await res.json();
            setCurrentStudyConcept(data.nextConcept);
          }}
          className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700"
        >
          Start Study Session
        </button>
        <ConceptGraph
          graph={graph}
          setSelectedConcept={setSelectedConcept}
          weakConcepts={weakConcepts}
          strongConcepts={strongConcepts}
          currentStudyConcept={currentStudyConcept}
        />
        <RevisionPlan weakConcepts={weakConcepts} />
      </div>
    </div>
  );
}

export default App;
