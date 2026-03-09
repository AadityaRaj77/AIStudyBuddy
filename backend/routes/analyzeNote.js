import express from "express"
import { prisma } from "../db/prisma.js"
import { chunkText } from "../services/chunker.js"

const router = express.Router()

router.post("/", async (req, res) => {
    try {

        const { content } = req.body

        // save note
        const note = await prisma.note.create({
            data: {
                content
            }
        })

        // mock concept extraction (later AI will generate this)
        const topics = [
            "Maxwell Equations",
            "Wave Equation",
            "Electromagnetic Waves"
        ]

        const relations = [
            { from: "Maxwell Equations", to: "Wave Equation", type: "derives" },
            { from: "Wave Equation", to: "Electromagnetic Waves", type: "explains" }
        ]

        // store concepts
        const conceptMap = {}

        for (const topic of topics) {

            const concept = await prisma.concept.create({
                data: {
                    name: topic,
                    noteId: note.id
                }
            })

            conceptMap[topic] = concept
        }

        // store relationships
        for (const r of relations) {

            await prisma.relationship.create({
                data: {
                    type: r.type,
                    fromId: conceptMap[r.from].id,
                    toId: conceptMap[r.to].id
                }
            })

        }

        // return graph for frontend
        const nodes = topics.map((t, i) => ({
            id: t,
            data: { label: t },
            position: { x: i * 200, y: 100 }
        }))

        const edges = relations.map((r, i) => ({
            id: `e-${i}`,
            source: r.from,
            target: r.to,
            label: r.type
        }))
        /*const chunks = chunkText(content)

        for (const c of chunks) {
            await prisma.noteChunk.create({
                data: {
                    noteId: note.id,
                    content: c,
                    embedding: []  // placeholder until AI embeddings added
                }
            })
        }*/

        const chunks = chunkText(content)

        await prisma.noteChunk.createMany({
            data: chunks.map(c => ({
                noteId: note.id,
                content: c,
                embedding: []
            }))
        })

        res.json({
            noteId: note.id,
            graph: {
                nodes,
                edges
            }
        })

    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Analyze failed" })
    }
})

export default router