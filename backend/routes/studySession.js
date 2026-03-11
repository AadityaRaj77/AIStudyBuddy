import express from "express"
import { prisma } from "../db/prisma.js"

const router = express.Router()

const sessions = {}

router.get("/:noteId", async (req, res) => {

    const noteId = Number(req.params.noteId)

    const concepts = await prisma.concept.findMany({
        where: { noteId }
    })

    if (concepts.length === 0) {
        return res.json({ message: "No concepts found" })
    }

    const weak = concepts.filter(c => c.strength < 0)
    const medium = concepts.filter(c => c.strength >= 0 && c.strength < 2)
    const strong = concepts.filter(c => c.strength >= 2)

    const ordered = [...weak, ...medium, ...strong]

    if (!sessions[noteId]) {
        sessions[noteId] = { index: 0 }
    }

    const session = sessions[noteId]

    if (session.index >= ordered.length) {

        sessions[noteId] = null

        return res.json({
            sessionComplete: true,
            total: ordered.length
        })
    }

    const concept = ordered[session.index]

    session.index++

    res.json({
        nextConcept: concept.name,
        strength: concept.strength,
        progress: session.index,
        total: ordered.length
    })

})

export default router