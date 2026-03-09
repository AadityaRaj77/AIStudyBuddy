import { callLLM } from "./llmClient.js";

export async function extractConcepts(noteText) {

    const prompt = `
You are extracting a knowledge graph from study notes.

Rules:
- Extract only important academic concepts.
- Avoid generic words like "system", "process", "concept".
- Relationships must use ONLY these types:

["defines","derives","explains","causes","requires","part_of"]

Return strictly valid JSON:

{
  "concepts": [],
  "relationships": [
    {"from":"","to":"","type":""}
  ]
}

Guidelines:
- Keep concepts short (1–3 words)
- Concepts must appear in the notes
- Avoid duplicate concepts
- Relationships must connect existing concepts

Study notes:
${noteText}
`;

    const res = await callLLM(prompt);
    const clean = res.replace(/```json/g, "").replace(/```/g, "").trim();
    let parsed = JSON.parse(clean)
    const allowed = [
        "defines",
        "derives",
        "explains",
        "causes",
        "requires",
        "part_of"
    ];

    parsed.relationships = parsed.relationships.filter(
        r =>
            parsed.concepts.includes(r.from) &&
            parsed.concepts.includes(r.to) &&
            allowed.includes(r.type)
    );

    return parsed;
}