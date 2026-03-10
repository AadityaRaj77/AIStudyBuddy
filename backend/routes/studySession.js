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

    // prioritize weak concepts
    const ordered = concepts.sort((a, b) => a.strength - b.strength)

    if (!sessions[noteId]) {
        sessions[noteId] = {
            index: 0,
            total: ordered.length
        }
    }

    const session = sessions[noteId]

    if (session.index >= ordered.length) {

        sessions[noteId] = null

        return res.json({
            sessionComplete: true,
            totalConcepts: ordered.length
        })
    }

    const next = ordered[session.index]

    session.index++

    res.json({
        nextConcept: next.name,
        strength: next.strength,
        progress: session.index,
        total: session.total
    })

})

export default router