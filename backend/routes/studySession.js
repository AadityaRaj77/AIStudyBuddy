import express from "express"
import { prisma } from "../db/prisma.js"

const router = express.Router()

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

    const nextConcept = concepts[0]

    res.json({
        nextConcept: nextConcept.name,
        strength: nextConcept.strength
    })

})

export default router