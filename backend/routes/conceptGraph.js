import express from "express"
import { buildConceptGraph } from "../utils/graphBuilder.js"

const router = express.Router()

router.post("/", async (req, res) => {

    const { analysis } = req.body

    const graph = buildConceptGraph(analysis)

    res.json(graph)

})

export default router