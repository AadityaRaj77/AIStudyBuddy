import express from "express"
import { prisma } from "../db/prisma.js"
import { detectKnowledgeGaps } from "../services/knowledgeGap.js"

const router = express.Router()

router.get("/:noteId", async (req, res) => {

    const noteId = Number(req.params.noteId)

    const concepts = await prisma.concept.findMany({
        where: { noteId }
    })

    const gaps = detectKnowledgeGaps(concepts)

    res.json({ gaps })

})

export default router