import axios from "axios";
import type { ConceptGraph } from "../types";

export interface AnalyzeResponse {
  noteId: number;
  graph: ConceptGraph;
}

export const analyzeNote = async (
  file: File
): Promise<AnalyzeResponse> => {

  const formData = new FormData();
  formData.append("note", file);

  const response = await axios.post<AnalyzeResponse>(
    "http://localhost:5000/api/analyze",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return response.data;
};