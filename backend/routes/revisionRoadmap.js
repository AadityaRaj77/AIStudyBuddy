import express from "express"
import { prisma } from "../db/prisma.js"

const router = express.Router()

router.get("/:noteId", async (req, res) => {

    const noteId = Number(req.params.noteId)

    const concepts = await prisma.concept.findMany({
        where: { noteId }
    })

    const weak = concepts.filter(c => c.strength < 0)
    const medium = concepts.filter(c => c.strength >= 0 && c.strength < 2)

    const roadmap = []

    weak.forEach(c => {
        roadmap.push({
            step: roadmap.length + 1,
            concept: c.name,
            action: "Re-read explanation and retry quiz"
        })
    })

    medium.forEach(c => {
        roadmap.push({
            step: roadmap.length + 1,
            concept: c.name,
            action: "Practice quiz again to reinforce memory"
        })
    })

    res.json({ roadmap })

})

export default router