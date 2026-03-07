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
        <UploadPage setGraph={setGraph} />
        <ConceptPanel
          concept={selectedConcept}
          setWeakConcepts={setWeakConcepts}
          setStrongConcepts={setStrongConcepts}
        />
        <ConceptGraph
          graph={graph}
          setSelectedConcept={setSelectedConcept}
          weakConcepts={weakConcepts}
          strongConcepts={strongConcepts}
        />
        <RevisionPlan weakConcepts={weakConcepts} />
      </div>
    </div>
  );
}

export default App;
