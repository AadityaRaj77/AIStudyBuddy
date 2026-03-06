import { useState } from "react";
import UploadPage from "./pages/UploadPage";
import ConceptGraph from "./components/ConceptGraph";
import type { ConceptGraph as GraphType } from "./types";

function App() {
  const [graph, setGraph] = useState<GraphType | null>(null);

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

        <ConceptGraph graph={graph} />
      </div>
    </div>
  );
}

export default App;
