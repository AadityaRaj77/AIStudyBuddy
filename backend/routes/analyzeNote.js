import express from "express"
import multer from "multer"

import { uploadImage } from "../services/blobService.js"
import { analyzeNote } from "../services/openaiService.js"
import { buildConceptGraph } from "../utils/graphBuilder.js"

const router = express.Router()
const upload = multer()

router.post("/", upload.single("note"), async (req, res) => {

    try {

        const file = req.file

        const imageUrl = await uploadImage(
            file.buffer,
            Date.now() + "_" + file.originalname
        )

        const aiResult = await analyzeNote(imageUrl)

        res.json({
            imageUrl,
            analysis: aiResult
        })

        const graph = buildConceptGraph(aiResult)

        res.json({
            imageUrl,
            analysis: aiResult,
            graph
        })

    } catch (error) {

        console.error(error)
        res.status(500).json({ error: "analysis failed" })

    }
})

export default router