import express from "express"
import { prisma } from "../db/prisma.js"

const router = express.Router()

router.get("/:noteId", async (req, res) => {

    const noteId = Number(req.params.noteId)

    const concepts = await prisma.concept.findMany({
        where: { noteId }
    })

    const relations = await prisma.relationship.findMany()

    const nodes = concepts.map((c, i) => ({
        id: c.name,
        data: {
            label: c.name,
            strength: c.strength
        },
        position: { x: i * 200, y: 100 }
    }))

    const edges = relations.map((r, i) => ({
        id: `e-${i}`,
        source: concepts.find(c => c.id === r.fromId)?.name,
        target: concepts.find(c => c.id === r.toId)?.name,
        label: r.type
    }))

    res.json({
        nodes,
        edges
    })

})

export default router