import express from "express"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()

import analyzeRoute from "./routes/analyzeNote.js"
import quizRoute from "./routes/generateQuiz.js"
import planRoute from "./routes/revisionPlan.js"
import graphRoute from "./routes/conceptGraph.js"
import studyRoute from "./routes/studySession.js"
import explainConcept from "./routes/explainConcept.js";
import roadmapRoute from "./routes/revisionRoadmap.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/analyze", analyzeRoute)
app.use("/api/quiz", quizRoute)
app.use("/api/plan", planRoute)
app.use("/api/graph", graphRoute)
app.use("/api/study-session", studyRoute)
app.use("/api/explain", explainConcept);
app.use("/api/roadmap", roadmapRoute)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})