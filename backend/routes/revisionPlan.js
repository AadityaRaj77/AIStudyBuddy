import express from "express"

const router = express.Router()

router.post("/", async (req, res) => {

    const { weakConcepts } = req.body

    const plan = [
        "Day 1: Review Maxwell Equations and Faraday Law",
        "Day 2: Practice Wave Equation derivations",
        "Day 3: Revise Electromagnetic wave propagation"
    ]

    res.json({
        weakConcepts,
        revisionPlan: plan
    })

})

export default router