import express from "express"

const router = express.Router()

router.post("/", async (req, res) => {

    const { weakConcepts } = req.body

    const plan = [
        "Review Maxwell Equations",
        "Practice problems on Wave Equation",
        "Revise Electromagnetic wave propagation"
    ]

    res.json({
        weakConcepts,
        revisionPlan: plan
    })

})

export default router