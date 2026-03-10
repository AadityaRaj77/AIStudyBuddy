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
    } catch (err) {
      console.error(err);
      setError("Failed to analyze notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
      <h2 className="text-purple-400 text-lg font-semibold mb-4">
        Upload Study Notes
      </h2>

      <div className="flex gap-4 items-center">
        <input
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          className="text-sm text-slate-300"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="
            px-5
            py-2
            rounded-lg
            font-semibold
            bg-purple-600
            text-white
            hover:bg-purple-700
            disabled:opacity-50
            disabled:cursor-not-allowed
            transition
          "
        >
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {file && (
        <p className="text-xs text-slate-400 mt-3">
          Selected file: {file.name}
        </p>
      )}

      {error && <p className="text-sm text-red-400 mt-3">{error}</p>}

      {loading && (
        <p className="text-sm text-slate-400 mt-3">
          Building concept graph using AI...
        </p>
      )}
    </div>
  );
}
