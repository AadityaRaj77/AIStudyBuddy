import express from "express"
import { analyzeNote } from "../services/openaiService.js"
import { buildConceptGraph } from "../utils/graphBuilder.js"

const router = express.Router()

router.post("/", async (req, res) => {

    const mockAnalysis = await analyzeNote()

    const graph = buildConceptGraph(mockAnalysis)

    const quiz = {
        questions: [
            {
                question: "Which equations produce the wave equation?",
                options: [
                    "Maxwell Equations",
                    "Newton Laws",
                    "Ohm Law",
                    "Gauss Law"
                ],
                correct_answer: "Maxwell Equations"
            }
        ]
    }

    const revisionPlan = [
        "Revise Maxwell Equations",
        "Practice wave equation derivations",
        "Review EM wave propagation"
    ]

    res.json({
        analysis: mockAnalysis,
        graph,
        quiz,
        revisionPlan
    })

})

export default router