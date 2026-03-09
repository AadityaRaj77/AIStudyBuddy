import express from "express"
import { prisma } from "../db/prisma.js"

const router = express.Router()

router.get("/:noteId", async (req, res) => {

    const noteId = Number(req.params.noteId)

    const weakConcepts = await prisma.concept.findMany({
        where: {
            noteId,
            strength: { lt: 0 }
        }
    })

    const roadmap = weakConcepts.map((c, i) => ({
        step: i + 1,
        concept: c.name
    }))

    res.json({ roadmap })

})

export default router