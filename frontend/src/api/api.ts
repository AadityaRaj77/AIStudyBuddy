import axios from "axios"
import type { ConceptGraph } from "../types"

interface AnalyzeResponse {
  imageUrl: string
  graph: ConceptGraph
}

export const analyzeNote = async (
  file: File
): Promise<AnalyzeResponse> => {

  const formData = new FormData()
  formData.append("note", file)

  const response = await axios.post(
    "http://localhost:5000/api/analyze",
    formData
  )

  return response.data
}