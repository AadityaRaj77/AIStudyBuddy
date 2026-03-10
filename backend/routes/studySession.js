import express from "express"
import { prisma } from "../db/prisma.js"

const router = express.Router()

// store study progress in memory (demo purpose)
const studyProgress = {}

router.get("/:noteId", async (req, res) => {

    const noteId = Number(req.params.noteId)

    const concepts = await prisma.concept.findMany({
        where: { noteId },
        orderBy: {
            strength: "asc"
        }
    })

    if (concepts.length === 0) {
        return res.json({ message: "No concepts found" })
    }

    // initialize session index
    if (!studyProgress[noteId]) {
        studyProgress[noteId] = 0
    }

    const index = studyProgress[noteId]

    // if finished all concepts
    if (index >= concepts.length) {
        studyProgress[noteId] = 0
        return res.json({ message: "Study session complete" })
    }

    const nextConcept = concepts[index]

    // move pointer forward
    studyProgress[noteId]++

    res.json({
        nextConcept: nextConcept.name,
        strength: nextConcept.strength
    })

})

export default router