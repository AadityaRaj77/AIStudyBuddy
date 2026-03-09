import express from "express"
import { prisma } from "../db/prisma.js"

const router = express.Router()

router.get("/:noteId", async (req, res) => {

    const noteId = Number(req.params.noteId)

    const concepts = await prisma.concept.findMany({
        where: { noteId }
    })

    const relations = await prisma.relationship.findMany()

    const roadmap = concepts.map(c => {

        const connections =
            relations.filter(
                r => r.fromId === c.id || r.toId === c.id
            ).length

        const priority = connections - (c.strength || 0)

        return {
            concept: c.name,
            strength: c.strength,
            connections,
            priority
        }

    })

    roadmap.sort((a, b) => b.priority - a.priority)

    const steps = roadmap.map((r, i) => ({
        step: i + 1,
        concept: r.concept
    }))

    res.json({ roadmap: steps })

})

export default router