import { callLLM } from "./llmClient.js";

export async function generateExplanation(concept, chunks) {

    const prompt = `
Explain this concept clearly for a student.

Concept:
${concept}

Relevant notes:
${chunks.join("\n\n")}

Keep explanation short and simple.
`;

    return await callLLM(prompt);
}