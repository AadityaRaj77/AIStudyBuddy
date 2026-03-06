import express from "express";

const router = express.Router();

router.post("/", async (req, res) => {
    const { concept } = req.body;

    const data = {
        concept,
        explanation: `${concept} describes how electric and magnetic fields interact and propagate through space.`,
        quiz: [
            {
                question: `What does ${concept} mainly describe?`,
                options: [
                    "Interaction of electric and magnetic fields",
                    "Chemical reactions",
                    "Planetary motion",
                    "Fluid flow"
                ],
                answer: "Interaction of electric and magnetic fields"
            },
            {
                question: `Why is ${concept} important?`,
                options: [
                    "It explains electromagnetic waves",
                    "It predicts earthquakes",
                    "It models weather systems",
                    "It controls chemical bonding"
                ],
                answer: "It explains electromagnetic waves"
            }
        ]
    };

    res.json(data);
});

export default router;