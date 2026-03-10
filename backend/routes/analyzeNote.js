import express from "express";
import multer from "multer";
import PDFParser from "pdf2json";
import { prisma } from "../db/prisma.js";
import { chunkText } from "../services/chunker.js";
import { extractConcepts } from "../services/conceptExtractor.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("note"), async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        let content = "";

        // PDF PARSING
        if (req.file.mimetype === "application/pdf") {

            const pdfParser = new PDFParser();

            content = await new Promise((resolve, reject) => {

                pdfParser.on("pdfParser_dataError", err => reject(err));

                pdfParser.on("pdfParser_dataReady", pdfData => {

                    const text = pdfData.Pages
                        .map(page =>
                            page.Texts
                                .map(t => {
                                    try {
                                        return decodeURIComponent(t.R[0].T)
                                    } catch {
                                        return t.R[0].T
                                    }
                                })
                                .join(" ")
                        )
                        .join("\n")

                    resolve(text);

                });

                pdfParser.parseBuffer(req.file.buffer);

            });

        } else {

            content = req.file.buffer.toString("utf8");

        }

        // CLEAN TEXT
        content = content
            .replace(/\0/g, "")
            .replace(/\s+/g, " ")
            .trim()
            .slice(0, 15000);

        if (!content) {
            return res.status(400).json({ error: "PDF contains no readable text" });
        }

        // Save notes
        const note = await prisma.note.create({
            data: { content }
        });

        // AI CONCEPT EXTRACTION
        const aiData = await extractConcepts(content);

        const topics = aiData?.concepts || [];
        const relations = aiData?.relationships || [];

        const conceptMap = {};

        for (const topic of topics) {

            const concept = await prisma.concept.create({
                data: {
                    name: topic,
                    noteId: note.id
                }
            });

            conceptMap[topic] = concept;

        }

        for (const r of relations) {

            if (!conceptMap[r.from] || !conceptMap[r.to]) continue;

            await prisma.relationship.create({
                data: {
                    type: r.type,
                    fromId: conceptMap[r.from].id,
                    toId: conceptMap[r.to].id
                }
            });

        }

        // BUILD GRAPH
        const nodes = topics.map((t, i) => ({
            id: t,
            data: { label: t },
            position: { x: i * 200, y: 100 }
        }));

        const edges = relations
            .filter(r => r.from && r.to)
            .map((r, i) => ({
                id: `e-${i}`,
                source: r.from,
                target: r.to,
                label: r.type
            }));

        // CHUNK NOTES
        const chunks = chunkText(content);

        await prisma.noteChunk.createMany({
            data: chunks.map(c => ({
                noteId: note.id,
                content: c,
                embedding: []
            }))
        });

        res.json({
            noteId: note.id,
            graph: {
                nodes,
                edges
            }
        });

    } catch (err) {

        console.error("Analyze error:", err);
        res.status(500).json({ error: "Analyze failed" });

    }
});

export default router;