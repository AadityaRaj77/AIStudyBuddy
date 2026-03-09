import express from "express"
import { prisma } from "../db/prisma.js"
import { getRelevantChunks } from "../services/retrieval.js"

const router = express.Router()

// Generate explanation + quiz
router.post("/", async (req, res) => {

    try {

        const { concept, noteId } = req.body

        const contextChunks = await getRelevantChunks(noteId, concept)

        const explanation = `
Concept: ${concept}

Relevant parts from your notes:
${contextChunks.join("\n\n")}

Explanation:
${concept} appears in your notes and connects to other concepts in the knowledge graph.
Understanding these relationships helps reinforce the topic.
`

        const quiz = [
            {
                question: `What concept is related to ${concept}?`,
                options: [
                    "Electromagnetic Waves",
                    "Gravity",
                    "Thermodynamics",
                    "Optics"
                ],
                answer: "Electromagnetic Waves"
            }
        ]

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