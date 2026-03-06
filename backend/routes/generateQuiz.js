import express from "express"

const router = express.Router()

router.post("/", async (req, res) => {

    const { topics } = req.body

    const quiz = {
        questions: [
            {
                question: `Which concept leads to the Wave Equation?`,
                options: [
                    "Maxwell Equations",
                    "Ohm Law",
                    "Newton Law",
                    "Gauss Law"
                ],
                correct_answer: "Maxwell Equations"
            },
            {
                question: `What does the wave equation describe?`,
                options: [
                    "Propagation of electromagnetic waves",
                    "Gravity",
                    "Thermodynamics",
                    "Fluid motion"
                ],
                correct_answer: "Propagation of electromagnetic waves"
            }
        ]
    }

    res.json({
        topics,
        quiz
    })

})

export default router