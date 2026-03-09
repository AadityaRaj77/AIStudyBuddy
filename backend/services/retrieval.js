import { prisma } from "../db/prisma.js"

export async function getRelevantChunks(noteId, concept) {

    const words = concept.split(" ")

    const chunks = await prisma.noteChunk.findMany({
        where: {
            noteId
        }
    })

    const scored = chunks.map(c => {

        let score = 0

        for (const w of words) {
            if (c.content.toLowerCase().includes(w.toLowerCase())) {
                score++
            }
        }

        return { ...c, score }

    })

    const sorted = scored
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)

    return sorted.map(c => c.content)
}
