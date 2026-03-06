import { useState } from "react";
import { analyzeNote } from "../api/api";

interface Props {
  setGraph: (graph: any) => void;
}

export default function UploadPage({ setGraph }: Props) {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const data = await analyzeNote(file);

    setGraph(data.graph);
  };

  return (
    <div
      className="
      rounded-xl
      border
      border-slate-700
      bg-slate-900
      p-6
      shadow-lg
    "
    >
      <h2 className="text-neon text-lg font-semibold mb-4">
        Upload Study Note
      </h2>

      <div className="flex gap-4 items-center">
        <input
          type="file"
          className="text-sm"
          onChange={(e) => {
            if (e.target.files) setFile(e.target.files[0]);
          }}
        />

        <button
          onClick={handleUpload}
          className="
            px-5
            py-2
            rounded-lg
            font-semibold
            bg-neon
            text-black
            hover:scale-105
            transition
            shadow-lg
          "
        >
          Analyze
        </button>
      </div>
    </div>
  );
}
