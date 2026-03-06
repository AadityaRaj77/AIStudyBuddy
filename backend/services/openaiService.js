export async function analyzeNote(imageUrl) {

    return {
        topics: [
            "Maxwell Equations",
            "Wave Equation",
            "Electromagnetic Waves"
        ],
        subtopics: [
            "Faraday Law",
            "Ampere Law",
            "Gauss Law"
        ],
        relationships: [
            { from: "Maxwell Equations", to: "Wave Equation", type: "derives" },
            { from: "Wave Equation", to: "Electromagnetic Waves", type: "explains" }
        ]
    }

}