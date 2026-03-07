import express from "express"

const router = express.Router()

router.post("/", async (req, res) => {

    const { weakConcepts } = req.body

    const roadmap = weakConcepts.map((c, i) => ({
        step: i + 1,
        concept: c,
        action: "Review explanation and practice problems"
    }))

    res.json({ roadmap })

})

export default router