import express from "express"

const router = express.Router()

router.post("/", async (req, res) => {

    const quiz = {
        questions: [
            {
                question: "Which equation predicts electromagnetic waves?",
                options: [
                    "Maxwell Equations",
                    "Ohm Law",
                    "Newton Law",
                    "Gauss Law"
                ],
                correct_answer: "Maxwell Equations"
            },
            {
                question: "What does Faraday's law describe?",
                options: [
                    "Magnetic field induced by electric current",
                    "Electric field induced by changing magnetic field",
                    "Gravity",
                    "Thermodynamics"
                ],
                correct_answer: "Electric field induced by changing magnetic field"
            }
        ]
    }

    res.json(quiz)

})

export default router