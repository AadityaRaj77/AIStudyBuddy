export function buildConceptGraph(analysis) {

    const nodes = []
    const edges = []

    const topics = analysis.topics || []
    const relationships = analysis.relationships || []

    topics.forEach((topic, index) => {
        nodes.push({
            id: topic,
            data: { label: topic },
            position: { x: index * 200, y: 100 }
        })
    })

    relationships.forEach((rel, index) => {
        edges.push({
            id: `e-${index}`,
            source: rel.from,
            target: rel.to,
            label: rel.type || "relates"
        })
    })

    return { nodes, edges }

}