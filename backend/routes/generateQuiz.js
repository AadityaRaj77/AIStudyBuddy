import express from "express";
import { prisma } from "../db/prisma.js";
import { getRelevantChunks } from "../services/retrieval.js";
import { callLLM } from "../services/llmClient.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {

        const { concept, noteId } = req.body;

        if (!concept) {
            return res.status(400).json({ error: "Concept missing" });
        }

        let contextChunks = [];

        try {
            if (noteId) {
                contextChunks = await getRelevantChunks(noteId, concept);
            }
        } catch (err) {
            console.log("Retrieval failed, continuing without context");
        }

        const context = contextChunks.join("\n\n");

        const prompt = `
Explain the concept "${concept}" in simple terms.

Context from study notes:
${context}

Then create ONE quiz question.

Return STRICT JSON format:

{
  "explanation": "",
  "quiz":[
    {
      "question":"",
      "options":["","","",""],
      "answer":""
    }
  ]
}
`;

        let parsed;

        try {

            const llmResponse = await callLLM(prompt);

            const clean = llmResponse
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            parsed = JSON.parse(clean);

        } catch (err) {

            console.log("LLM parsing failed, using fallback");

            parsed = {
                explanation: `${concept} is an important concept in your notes. Review how it connects to other ideas in the graph.`,
                quiz: [
                    {
                        question: `What does ${concept} relate to in your study material?`,
                        options: [
                            "Core topic",
                            "Supporting idea",
                            "Unrelated concept",
                            "Example case"
                        ],
                        answer: "Core topic"
                    }
                ]
            };
        }

        res.json(parsed);

    } catch (err) {

        console.error("Quiz route crashed:", err);

        res.json({
            explanation: "Explanation currently unavailable.",
            quiz: [
                {
                    question: "Review this concept again.",
                    options: ["Continue studying", "Skip", "Revise later", "Mark done"],
                    answer: "Continue studying"
                }
            ]
        });
    }
});

export default router;