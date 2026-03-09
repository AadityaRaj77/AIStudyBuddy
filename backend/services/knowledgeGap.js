const prerequisiteMap = {
    "Electromagnetic Waves": ["Wave Equation"],
    "Wave Equation": ["Maxwell Equations"],
    "Maxwell Equations": ["Vector Calculus"]
}

export function detectKnowledgeGaps(concepts) {

    const conceptSet = new Set(concepts.map(c => c.name))
    const gaps = []

    for (const concept of concepts) {

        const prereqs = prerequisiteMap[concept.name] || []

        for (const p of prereqs) {
            if (!conceptSet.has(p)) {
                gaps.push({
                    missingConcept: p,
                    requiredFor: concept.name
                })
            }
        }

    }

    return gaps
}