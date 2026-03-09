import express from "express"
import { prisma } from "../db/prisma.js"
import { getRelevantChunks } from "../services/retrieval.js"
import { callLLM } from "../services/llmClient.js";
import { generateExplanation } from "../services/explanationGenerator.js";
import { generateQuiz } from "../services/quizGenerator.js";

const router = express.Router()

// Generate explanation + quiz
router.post("/", async (req, res) => {

    try {

        const { concept, noteId } = req.body

        const contextChunks = await getRelevantChunks(noteId, concept)

        const explanation = await generateExplanation(concept, contextChunks);

        const quiz = [await generateQuiz(concept)];

        res.json({
            explanation,
            quiz
        })

    } catch (err) {

        console.error(err)
        res.status(500).json({ error: "Quiz generation failed" })

    }

})


// Save quiz result + update learning schedule
router.post("/result", async (req, res) => {

    try {

        const { conceptId, correct } = req.body

        await prisma.quizResult.create({
            data: {
                conceptId,
                correct
            }
        })

        const concept = await prisma.concept.findUnique({
            where: { id: conceptId }
        })

        let interval = correct ? (concept.interval || 1) * 2 : 1

        await prisma.concept.update({
            where: { id: conceptId },
            data: {
                strength: correct ? { increment: 1 } : { decrement: 1 },
                interval,
                lastReviewed: new Date(),
                nextReview: new Date(Date.now() + interval * 86400000)
            }
        })

        res.json({ success: true })

    } catch (err) {

        console.error(err)
        res.status(500).json({ error: "Saving result failed" })

    }

})

export default router