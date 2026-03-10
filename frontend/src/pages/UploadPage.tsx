import { useState } from "react";
import { analyzeNote } from "../api/api";
import type { ConceptGraph } from "../types";

interface Props {
  setGraph: (graph: ConceptGraph) => void;
  setNoteId: (id: number) => void;
}

export default function UploadPage({ setGraph, setNoteId }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);

      const data = await analyzeNote(file);

      setGraph(data.graph);
      setNoteId(Number(data.noteId));
    } catch {
      setError("Failed to analyze notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg">
      <h2 className="text-blue-500 text-lg font-semibold mb-4">
        Upload Study Notes
      </h2>

      <div className="flex gap-4 items-center">
        <input
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          className="text-sm"
          onChange={(e) => {
            if (e.target.files) setFile(e.target.files[0]);
          }}
        />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="
            px-5
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
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {file && (
        <p className="text-xs text-slate-500 mt-3">
          Selected file: {file.name}
        </p>
      )}

      {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
    </div>
  );
}
