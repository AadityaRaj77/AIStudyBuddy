import express from "express"
import { prisma } from "../db/prisma.js"
import { getRelevantChunks } from "../services/retrieval.js"

const router = express.Router()

//Generate explanation + quiz for a concept
router.post("/", async (req, res) => {

    try {

        const { concept, noteId } = req.body

        // retrieve relevant note chunks
        const contextChunks = await getRelevantChunks(noteId, concept)

        const explanation = `
Concept: ${concept}

Relevant parts from your notes:
${contextChunks.join("\n\n")}

Explanation:
This concept appears in your notes. Study how it connects to other nodes in the concept graph to understand the relationships.
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

/*
Save quiz result
*/
router.post("/result", async (req, res) => {

    try {

        const { conceptId, correct } = req.body

        await prisma.quizResult.create({
            data: {
                conceptId,
                correct
            }
        })

        await prisma.concept.update({
            where: { id: conceptId },
            data: {
                strength: correct ? { increment: 1 } : { decrement: 1 }
            }
        })

        res.json({ success: true })

    } catch (err) {

        console.error(err)
        res.status(500).json({ error: "Saving result failed" })

    }

})

export default router