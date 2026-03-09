import { callLLM } from "./llmClient.js";

export async function generateQuiz(concept) {

    const prompt = `
Create one multiple choice question about this concept.

Concept:
${concept}

Return JSON:

{
 "question": "",
 "options": ["","","",""],
 "answer": ""
}
`;

    const res = await callLLM(prompt);

    const clean = res.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(clean);
}