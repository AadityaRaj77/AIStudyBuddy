import express from "express"
import { prisma } from "../db/prisma.js"

const router = express.Router()

router.get("/:noteId", async (req, res) => {

    const noteId = Number(req.params.noteId)

    const total = await prisma.concept.count({ where: { noteId } })

    const weak = await prisma.concept.count({
        where: { noteId, strength: { lt: 0 } }
    })

    const strong = await prisma.concept.count({
        where: { noteId, strength: { gt: 2 } }
    })

    res.json({
        totalConcepts: total,
        weakConcepts: weak,
        masteredConcepts: strong
    })
})

export default router